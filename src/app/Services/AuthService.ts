import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = '/api/Auth';
  private tokenKey = 'jwtToken';
  private isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  // Check if token exists
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Get current login status
  isLoggedIn$ = this.isLoggedIn.asObservable();

  // Login method
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post<any>(`${this.apiURL}/login`, loginData).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.isLoggedIn.next(true);
        }
      })
    );
  }

  // Register method
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/register`, userData).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.isLoggedIn.next(true);
        }
      })
    );
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.next(false);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  // Get auth headers for API requests
  getAuthHeaders() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }
}
