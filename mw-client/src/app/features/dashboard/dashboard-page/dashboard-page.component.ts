import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { HistoryService } from '../../../services/history.service';

interface Model {
  id: string;
  name: string;
  description: string;
  provider: string;
  lastUsed: Date;
  iconLetter?: string;
  iconColor?: string;
}

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {
  credits: number = 0;
  recentModels: { model: string; count: number }[] = [];
  isLoading = true;
  
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private historyService: HistoryService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.credits = user.credits || 0;
      }
    });
    this.loadRecentModels();
  }

  private loadRecentModels() {
    this.historyService.getRecentlyUsedModels().subscribe({
      next: (models) => {
        this.recentModels = models;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recent models:', error);
        this.isLoading = false;
      }
    });
  }

  getTotalUses(): number {
    return this.recentModels.reduce((sum, model) => sum + model.count, 0);
  }

  getRandomColor(seed: string): string {
    const colors = [
      { bg: 'bg-blue-50', text: 'text-blue-600' },
      { bg: 'bg-green-50', text: 'text-green-600' },
      { bg: 'bg-purple-50', text: 'text-purple-600' },
      { bg: 'bg-rose-50', text: 'text-rose-600' },
      { bg: 'bg-amber-50', text: 'text-amber-600' },
      { bg: 'bg-cyan-50', text: 'text-cyan-600' },
      { bg: 'bg-indigo-50', text: 'text-indigo-600' }
    ];
    const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return `${colors[index].bg} ${colors[index].text}`;
  }
}
