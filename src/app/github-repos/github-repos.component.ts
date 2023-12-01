// src/app/github-repos/github-repos.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

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

  // Pagination variables
  page: number = 1;
  perPage: number = 10;
  totalPages: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Load repositories and calculate total pages on component initialization
    this.loadRepositories();
  }

  loadRepositories(): void {
    this.loading = true;
    this.apiService.getUserRepos(this.username, this.page, this.perPage).subscribe((repos) => {
      this.repositories = [...this.repositories, ...repos];
      this.loading = false;

      // Calculate total pages after loading repositories
      this.calculateTotalPages();
    });
  }

  calculateTotalPages(): void {
    this.apiService.getTotalReposCount(this.username).subscribe((totalCount) => {
      this.totalPages = Math.ceil(totalCount / this.perPage);
    });
  }

  setPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.loadRepositories();
    }
  }

  openRepoInNewTab(html_url: string): void {
    window.open(html_url, '_blank');
  }

  // Getter for page numbers
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
}
