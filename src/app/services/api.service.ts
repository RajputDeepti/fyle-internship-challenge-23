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

  getUserRepos(username: string, page: number, perPage: number): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http
      .get<any[]>(`${this.apiUrl}/users/${username}/repos`, { params, observe: 'response' })
      .pipe(map((response: HttpResponse<any[]>) => response.body || []));
  }

  getUserProfilePhoto(username: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/users/${username}`).pipe(map((user: any) => user.avatar_url));
  }

  getTotalReposCount(username: string): Observable<number> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users/${username}/repos`, { params: new HttpParams(), observe: 'response' })
      .pipe(map((response: HttpResponse<any[]>) => Number(response.headers.get('X-Total-Count')) || 0));
  }
}
