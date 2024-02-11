import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { CookieService } from 'ngx-cookie-service'; // Import CookieService

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient, private cookieService: CookieService) { } // Inject CookieService

  private baseUrl = 'http://localhost:4000/accounts';

  // Function to retrieve JWT token from cookie
  private getToken(): string {
    return this.cookieService.get('jwt_token');
  }


  // Function to create HTTP headers with Authorization header
  private createHeaders(): HttpHeaders {
    const jwtToken = this.getToken();
    console.log(jwtToken);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });
  }

  getUserProfile(id: number): Observable<User> {
    const headers = this.createHeaders();
    return this.http.get<User>(`${this.baseUrl}/${id}`, { headers });
  }

  getAll(): Observable<User[]> {
    const headers = this.createHeaders();
    return this.http.get<User[]>(`${this.baseUrl}/`, { headers });
  }

  getById(id: number): Observable<User> {
    const headers = this.createHeaders();
    return this.http.get<User>(`${this.baseUrl}/${id}`, { headers });
  }

  create(user: User): Observable<User> {
    const headers = this.createHeaders();
    return this.http.post<User>(`${this.baseUrl}/`, user, { headers });
  }

  update(id: number, user: User): Observable<User> {
    const headers = this.createHeaders();
    return this.http.put<User>(`${this.baseUrl}/${id}`, user, { headers });
  }

  delete(id: number): Observable<any> {
    const headers = this.createHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }
}
