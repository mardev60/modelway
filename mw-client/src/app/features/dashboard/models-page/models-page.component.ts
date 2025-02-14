import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Model } from '../../../utils/types/models.interface';

@Component({
  selector: 'app-models-page',
  standalone: false,
  templateUrl: './models-page.component.html',
})
export class ModelsPageComponent implements OnInit {
  models: Model[] = [];
  filteredModels: Model[] = [];
  totalModels: number = 0;
  isAdmin: boolean = false;
  isLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadModels();
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.role === 'admin';
    });
  }

  loadModels() {
    this.isLoading = true;
    this.apiService.get<{ [key: string]: Model[] }>('/models').subscribe({
      next: (response) => {
        // Get all models
        const allModels = Object.values(response).flat();
        
        // Group by name and get best latency version
        const modelsByName = allModels.reduce((acc, model) => {
          if (!acc[model.name] || acc[model.name].latency > model.latency) {
            acc[model.name] = model;
          }
          return acc;
        }, {} as { [key: string]: Model });

        // Convert back to array
        this.models = Object.values(modelsByName);
        this.filteredModels = [...this.models];
        this.totalModels = this.models.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading models:', error);
        this.isLoading = false;
      }
    });
  }

  filterModels(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredModels = this.models.filter(model => 
      model.name.toLowerCase().includes(searchTerm)
    );
  }

  sortModels(event: Event) {
    const sortBy = (event.target as HTMLSelectElement).value;
    
    this.filteredModels.sort((a, b) => {
      switch (sortBy) {
        case 'Name A-Z':
          return a.name.localeCompare(b.name);
        case 'Name Z-A':
          return b.name.localeCompare(a.name);
        case 'Latency':
          return a.latency - b.latency;
        default:
          return 0;
      }
    });
  }
}
