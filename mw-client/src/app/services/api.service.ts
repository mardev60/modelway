import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Model } from '../utils/types/models.interface';
import { Provider } from '../utils/types/providers.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic GET request
  get<T>(endpoint: string, options = {}): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, {
      ...options,
      withCredentials: true, // This is important for cookies
    });
  }

  // Generic POST request
  post<T>(endpoint: string, data: any, options = {}): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, {
      ...options,
      withCredentials: true,
    });
  }

  // Generic PUT request
  put<T>(endpoint: string, data: any, options = {}): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data, {
      ...options,
      withCredentials: true,
    });
  }

  // Generic DELETE request
  delete<T>(endpoint: string, options = {}): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, {
      ...options,
      withCredentials: true,
    });
  }

  // Set auth token in cookie
  setAuthToken(token: string): void {
    document.cookie = `auth_token=${token}; path=/; Secure; SameSite=Strict`;
  }

  // Get auth token from cookie
  getAuthToken(): string | null {
    const match = document.cookie.match(/(^|;)\s*auth_token\s*=\s*([^;]+)/);
    return match ? match[2] : null;
  }

  // Remove auth token from cookie
  removeAuthToken(): void {
    document.cookie =
      'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  getUserInfo(): Observable<any> {
    return this.get<any>('/users/me');
  }

  getProvider(providerName: string): Observable<Provider> {
    return this.get<Provider>(`/providers/${providerName}`);
  }

  getProviderModels(providerId: string): Observable<Model[]> {
    return this.get<Model[]>(`/providers/${providerId}/models`);
  }
}
