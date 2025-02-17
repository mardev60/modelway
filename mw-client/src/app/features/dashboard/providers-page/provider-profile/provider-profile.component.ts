import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { StatusService } from '../../../../services/status.service';
import { Model } from '../../../../utils/types/models.interface';

interface ModelWithLastPingFormatted extends Model {
  formattedLastPing?: Date;
}

@Component({
  selector: 'app-provider-profile',
  standalone: false,
  templateUrl: './provider-profile.component.html',
})
export class ProviderProfileComponent implements OnInit, OnDestroy {
  isLoading = false;
  provider: any = null;
  models: ModelWithLastPingFormatted[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
    private statusService: StatusService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const providerName = params['name'];
      this.isLoading = true;

      if (providerName) {
        this.apiService.getProviderByName(providerName).subscribe({
          next: (data) => {
            this.provider = data;
            if (this.provider && this.provider.id) {
              this.apiService
                .getProviderModelsById(this.provider.id)
                .subscribe({
                  next: (models) => {
                    this.models = models.map((model) => ({
                      ...model,
                      formattedLastPing: this.formatFirebaseTimestamp(
                        model.last_ping
                      ),
                    }));
                    this.isLoading = false;
                  },
                  error: (error) => {
                    console.error('Error loading models:', error);
                    this.isLoading = false;
                  },
                });
            } else {
              console.error('Provider ID not found');
              this.isLoading = false;
            }
          },
          error: (error) => {
            console.error('Error loading provider:', error);
            this.isLoading = false;
          },
        });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.location.back();
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
