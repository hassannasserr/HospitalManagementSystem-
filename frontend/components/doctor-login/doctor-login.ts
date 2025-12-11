import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = '/api';

  constructor(private http: HttpClient) {}

  login(payload: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.api}/doctor/login`, payload);
  }

  setToken(token: string) {
    localStorage.setItem('gpms_token', token);
  }

  getToken() {
    return localStorage.getItem('gpms_token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
