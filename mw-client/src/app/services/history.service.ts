import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

interface RecentModel {
  model: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  constructor(private apiService: ApiService) {}

  getRecentlyUsedModels(): Observable<RecentModel[]> {
    return this.apiService.get<RecentModel[]>('/history/recent-models');
  }
} 