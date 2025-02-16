import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { Model } from '../../../../utils/types/models.interface';
import { Provider } from '../../../../utils/types/providers.interface';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { formatDistanceToNow } from 'date-fns';

interface ModelWithProvider extends Model {
  providerName: string;
  formattedLastPing?: Date;
}

@Component({
  selector: 'app-model-profile',
  templateUrl: './model-profile.component.html',
  standalone: false
})
export class ModelProfileComponent implements OnInit, OnDestroy {
  modelName: string | null = null;
  models: ModelWithProvider[] = [];
  isLoading = false;
  activeTab: 'overview' | 'api' = 'overview';
  providers: { [key: string]: Provider } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        this.modelName = params['name'];
        this.isLoading = true;
        return this.apiService.get<Provider[]>('/providers');
      }),
      switchMap(providers => {
        this.providers = providers.reduce((acc, provider) => {
          acc[provider.id!] = provider;
          return acc;
        }, {} as { [key: string]: Provider });
        
        return this.apiService.post<Model[]>('/models/search', { name: this.modelName });
      })
    ).subscribe({
      next: (models) => {
        this.models = models
          .map(model => ({
            ...model,
            providerName: this.providers[model.provider_id]?.name || 'Unknown Provider',
            formattedLastPing: this.formatFirebaseTimestamp(model.last_ping)
          }))
          .sort((a, b) => (a.classment || 999) - (b.classment || 999));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    });
  }

  private formatFirebaseTimestamp(timestamp: any): Date {
    if (!timestamp) return new Date(0);
    
    // Handle Firestore Timestamp with _seconds and _nanoseconds
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
    }
    
    // Handle Firestore Timestamp object
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    
    // Handle string date
    if (typeof timestamp === 'string') {
      return new Date(timestamp);
    }
    
    // Handle regular seconds timestamp
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    
    return new Date(0);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isOld(date: Date | undefined): boolean {
    if (!date) return true;
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    return diffInMinutes > 5;
  }

  switchTab(tab: 'overview' | 'api') {
    this.activeTab = tab;
  }

  getStatusColor(latency: number | null): { text: string; bg: string } {
    if (latency === null) {
      return { text: 'text-white', bg: 'bg-red-800' };
    }
    if (latency < 200) {
      return { text: 'text-green-800', bg: 'bg-green-100' };
    } else if (latency < 500) {
      return { text: 'text-lime-800', bg: 'bg-lime-100' };
    } else if (latency < 1000) {
      return { text: 'text-yellow-800', bg: 'bg-yellow-100' };
    } else if (latency < 1500) {
      return { text: 'text-orange-800', bg: 'bg-orange-100' };
    } else {
      return { text: 'text-red-800', bg: 'bg-red-100' };
    }
  }

  getStatus(latency: number | null): string {
    if (latency === null) {
      return 'Provider Down';
    }
    if (latency < 200) {
      return 'Excellent';
    } else if (latency < 500) {
      return 'Very Good';
    } else if (latency < 1000) {
      return 'Good';
    } else if (latency < 1500) {
      return 'Fair';
    } else {
      return 'Degraded';
    }
  }

  formatTimeAgo(date: Date | undefined): string {
    if (!date || date.getTime() === 0) {
      return 'Never';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  }
} 