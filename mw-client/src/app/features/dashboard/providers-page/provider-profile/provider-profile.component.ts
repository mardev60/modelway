import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

export interface Model {
  base_url: string;
  classment: number;
  id: string;
  input_price: number;
  latency: number;
  name: string;
  output_price: number;
  provider_id: string;
  src_model: string;
}

@Component({
  selector: 'app-provider-profile',
  standalone: false,
  templateUrl: './provider-profile.component.html',
})
export class ProviderProfileComponent {
  isLoading = false;
  provider: any = null; // Will store provider data
  models: Model[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.loadProviderData();
  }

  private loadProviderData(): void {
    this.isLoading = true;
    this.route.params.subscribe((params) => {
      const providerName = params['name'];
      if (providerName) {
        this.apiService.getProvider(providerName).subscribe({
          next: (data) => {
            this.provider = data;
            if (this.provider && this.provider.id) {
              this.apiService.getProviderModels(this.provider.id).subscribe({
                next: (models) => {
                  console.log('Models:', models);
                  this.models = models;
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
}
