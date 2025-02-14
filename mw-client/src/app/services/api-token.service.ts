import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiToken } from '../utils/types/api-token.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiTokenService {
  constructor(private apiService: ApiService) {}

  getTokens(): Observable<ApiToken[]> {
    return this.apiService.get<ApiToken[]>('/api-tokens');
  }

  createToken(name: string): Observable<ApiToken> {
    return this.apiService.post<ApiToken>('/api-tokens', { name });
  }

  deactivateToken(tokenId: string): Observable<void> {
    return this.apiService.delete<void>(`/api-tokens/${tokenId}`);
  }
} 