import { HttpClient,HttpParams, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = 'https://api.github.com';

  // getUserRepos(username: string, page: number, perPage: number): Observable<any[]> {
  //   const params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('per_page', perPage.toString());

  //   return this.http
  //     .get<any[]>(`${this.apiUrl}/users/${username}/repos`, { params, observe: 'response' })
  //     .pipe(map((response: HttpResponse<any[]>) => response.body || []));
  // }

  getUserRepos(username: string, page: number, perPage: number): Observable<{ body: any[], totalPages: number | null }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http
      .get<any[]>(`${this.apiUrl}/users/${username}/repos`, { params, observe: 'response' })
      .pipe(map((response: HttpResponse<any[]>) => {
        const linkHeader = response.headers.get('Link');
        const totalPages = this.parseLinkHeaderForTotalPages(linkHeader);
        return { body: response.body || [], totalPages };
      }));
  }

  parseLinkHeaderForTotalPages(linkHeader: string | null): number | null {
    console.log(linkHeader)

    if (!linkHeader) {
      return 0;
    }


    const links = linkHeader.split(',').map(link => {
      const [url, rel] = link.split(';');
      const pageMatch = url.match(/page=(\d+)/);
      const page = pageMatch ? Number(pageMatch[1]) : null;
      return { rel: rel.trim(), page };
    });

    const lastLink = links.find(link => link.rel === 'rel="last"');
    return lastLink ? lastLink.page : 0;
  }

  getUserProfilePhoto(username: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/users/${username}`).pipe(map((user: any) => user.avatar_url));
  }
}
