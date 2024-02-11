import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:4000/accounts';

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  // Check if JWT token is expired
  hasToken(): boolean {
    const token = this.cookieService.get('jwt_token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(tokenPayload.exp * 1000);
      if (expirationDate > new Date()) {
        this.logout();
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  // Login user
  login(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/authenticate`, { email, password }).pipe(
      tap((response: any) => {
        console.log(response);
        if (response && response.refreshToken) {
          this.cookieService.set('refreshToken', response.refreshToken, new Date(response.expiresAt));
        }
        if (response && response.accessToken) {
          this.cookieService.set('jwt_token', response.accessToken, new Date(response.expiresAt));
          localStorage.setItem('user_profile', JSON.stringify(response));
        }
      })
    );
  }

  logout() {
    this.cookieService.delete('jwt_token');
    localStorage.removeItem('user_profile');
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.cookieService.get('refresh_token');
    return this.http.post(`${this.baseUrl}/refresh-token`, { refreshToken }).pipe(
      tap((response: any) => {
        if (response && response.accessToken) {
          this.cookieService.set('jwt_token', response.accessToken);
        }
      })
    );
  }
}
