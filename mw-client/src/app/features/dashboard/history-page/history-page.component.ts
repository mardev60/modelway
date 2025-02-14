import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { History } from '../../../utils/types/history.interface';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  standalone: false,
})
export class HistoryPageComponent implements OnInit {
  history: History[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadHistory();
  }

  private loadHistory() {
    this.apiService.get<History[]>('/history').subscribe({
      next: (data) => {
        this.history = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading history:', error);
        this.isLoading = false;
      }
    });
  }
} 