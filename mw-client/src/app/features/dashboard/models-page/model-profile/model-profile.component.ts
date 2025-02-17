import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { StatusService } from '../../../../services/status.service';
import { Model } from '../../../../utils/types/models.interface';
import { Provider } from '../../../../utils/types/providers.interface';

interface ModelWithProvider extends Model {
  providerName: string;
  formattedLastPing?: Date;
}

@Component({
  selector: 'app-model-profile',
  templateUrl: './model-profile.component.html',
  standalone: false,
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
    private apiService: ApiService,
    private location: Location,
    private statusService: StatusService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          this.modelName = params['name'];
          this.isLoading = true;
          return this.apiService.get<Provider[]>('/providers');
        }),
        switchMap((providers) => {
          this.providers = providers.reduce((acc, provider) => {
            acc[provider.id!] = provider;
            return acc;
          }, {} as { [key: string]: Provider });

          return this.apiService.post<Model[]>('/models/search', {
            name: this.modelName,
          });
        })
      )
      .subscribe({
        next: (models) => {
          this.models = models
            .map((model) => ({
              ...model,
              providerName:
                this.providers[model.provider_id]?.name || 'Unknown Provider',
              formattedLastPing: this.formatFirebaseTimestamp(model.last_ping),
            }))
            .sort((a, b) => (a.classment || 999) - (b.classment || 999));
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.location.back();
  }

  switchTab(tab: 'overview' | 'api') {
    this.activeTab = tab;
  }

  formatFirebaseTimestamp(timestamp: any): Date {
    return this.statusService.formatFirebaseTimestamp(timestamp);
  }

  isOld(date: Date | undefined): boolean {
    return this.statusService.isOld(date);
  }

  getStatusColor(latency: number | null): { text: string; bg: string } {
    return this.statusService.getStatusColor(latency);
  }

  getStatus(latency: number | null): string {
    return this.statusService.getStatus(latency);
  }

  formatTimeAgo(date: Date | undefined): string {
    return this.statusService.formatTimeAgo(date);
  }
}
