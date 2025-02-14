import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

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
  recentModels: Model[] = [{id: '1', name: 'DeepSeek Chat', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing', provider: 'deepseek', lastUsed: new Date(), iconLetter: 'D', iconColor: 'bg-blue-100 text-blue-600'}];
  
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCredits();
    this.loadRecentModels();
  }

  private loadCredits() {
    this.apiService.get<{ balance: number }>('/credits/balance').subscribe({
      next: (response) => {
        this.credits = response.balance;
      },
      error: (error) => {
        console.error('Error loading credits:', error);
      }
    });
  }

  private loadRecentModels() {
    this.apiService.getUserInfo().subscribe({
      next: (user) => {
        console.log(user);
      },
      error: (error) => {
        console.error('Error loading user info:', error);
      }
    });

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
