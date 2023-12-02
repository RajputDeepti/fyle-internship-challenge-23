// src/app/github-repos/github-repos.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-github-repos',
  templateUrl: './github-repos.component.html',
  styleUrls: ['./github-repos.component.scss']
})
export class GithubReposComponent implements OnInit {
  username: string = '';
  profilePhotoUrl: string = '';
  repositories: any[] = [];
  loading: boolean = false;
  searchTerms = new Subject<string>();

  // Pagination variables
  page: number = 1;
  perPage: number = 10;
  totalPages: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Load repositories and calculate total pages on component initialization
    this.searchTerms.pipe(debounceTime(3000), distinctUntilChanged()).subscribe((username) => {

      if(!username) {
        this.loading = false;
        return;
      }

      this.username = username;
      this.repositories = [];
      this.loading = true;
      this.loadRepositories(username);
    })
}

  loadRepositories(username: string): void {
    this.loading = true;
    this.apiService.getUserRepos(username, this.page, this.perPage).subscribe((response) => {
      console.log(response)
      this.repositories = [...response.body];

      if (response.totalPages) {
        this.totalPages = response.totalPages;
      }

      this.loading = false;
    });
  }

  setPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.loadRepositories(this.username);
    }
  }

  openRepoInNewTab(html_url: string): void {
    window.open(html_url, '_blank');
  }

  // Getter for page numbers
  // getPageNumbers(): number[] {
  //   return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  // }

  prevPage(): void {
    if (this.page > 1) {
      this.setPage(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.setPage(this.page + 1);
    }
  }

  getPageNumbers(): (number | string)[] {
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);
    const numbers = [];

    if (start > 1) {
      numbers.push(1, '...');
    }

    for (let i = start; i <= end; i++) {
      numbers.push(i);
    }

    if (end < this.totalPages) {
      numbers.push('...', this.totalPages);
    }

    return numbers;
  }
}
