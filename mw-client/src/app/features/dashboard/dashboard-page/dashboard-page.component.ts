import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

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
  recentModels: Model[] = [];
  
  constructor(
    private apiService: ApiService,
    private authService: AuthService
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
    this.apiService.get<Model[]>('/models/recent').subscribe({
      next: (models) => {
        this.recentModels = models.slice(0, 3).map(model => ({
          ...model,
          iconLetter: model.name.charAt(0),
          iconColor: this.getRandomColor(model.name)
        }));
      },
      error: (error) => {
        console.error('Error loading recent models:', error);
      }
    });
  }

  private getRandomColor(seed: string): string {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-600' },
      { bg: 'bg-green-100', text: 'text-green-600' },
      { bg: 'bg-purple-100', text: 'text-purple-600' },
      { bg: 'bg-red-100', text: 'text-red-600' },
      { bg: 'bg-yellow-100', text: 'text-yellow-600' }
    ];
    const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index].bg + ' ' + colors[index].text;
  }
}
