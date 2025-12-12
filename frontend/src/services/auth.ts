import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginPayload, LoginResponse } from '../interfaces/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = '/api';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/doctor/login`, payload);
  }

  setToken(token: string) {
    localStorage.setItem('gpms_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('gpms_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('gpms_token');
  }
}
