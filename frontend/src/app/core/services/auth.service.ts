import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

export interface User {
  _id: string;
  fullname: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: string;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromStorage());
  public token$ = this.tokenSubject.asObservable();

  constructor() {}

  /**
   * Get current user value
   */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current token value
   */
  get currentTokenValue(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getTokenFromStorage();
  }

  /**
   * Register new user
   */
  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap((response) => {
        if (response.success) {
          this.setAuthData(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Login user
   */
  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap((response) => {
        if (response.success) {
          this.setAuthData(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get user profile
   */
  getProfile(): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/auth/profile`).pipe(
      tap((response) => {
        if (response.success) {
          this.currentUserSubject.next(response.data);
          this.saveUserToStorage(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Set authentication data
   */
  private setAuthData(data: { user: User; accessToken: string; refreshToken: string }): void {
    // Save tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    this.tokenSubject.next(data.accessToken);

    // Save user
    this.saveUserToStorage(data.user);
    this.currentUserSubject.next(data.user);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  /**
   * Get token from localStorage
   */
  private getTokenFromStorage(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Save user to localStorage
   */
  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = 'Network error. Please check your connection and try again.';
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors) {
        // Handle validation errors
        const errors = error.error.errors;
        const errorMessages = Object.values(errors).filter(Boolean);
        errorMessage = errorMessages.join('. ');
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        // Generic error with status code
        switch (error.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please login again.';
            break;
          case 403:
            errorMessage = 'Access denied. You do not have permission.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 409:
            errorMessage = 'This email is already registered.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Error: ${error.statusText || 'Unknown error'}`;
        }
      }
    }

    console.error('HTTP Error:', {
      status: error.status,
      message: errorMessage,
      error: error.error,
    });

    return throwError(() => new Error(errorMessage));
  }
}
