import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Provider } from '../../../utils/types/providers.interface';

@Component({
  selector: 'app-providers-page',
  standalone: false,
  templateUrl: './providers-page.component.html'
})
export class ProvidersPageComponent implements OnInit {
  providers: Provider[] = [];
  filteredProviders: Provider[] = [];
  totalProviders: number = 0;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  showAddModal = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProviders();
    this.checkAdminStatus();
  }

  private checkAdminStatus() {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.role === 'admin';
    });
  }

  loadProviders() {
    this.isLoading = true;
    this.apiService.get<Provider[]>('/providers').subscribe({
      next: (providers) => {
        this.providers = providers;
        this.filteredProviders = providers;
        this.totalProviders = providers.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading providers:', error);
        this.isLoading = false;
      }
    });
  }

  filterProviders(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredProviders = this.providers.filter(provider =>
      provider.name.toLowerCase().includes(searchTerm) ||
      provider.url.toLowerCase().includes(searchTerm)
    );
  }

  sortProviders(event: any) {
    const sortBy = event.target.value;
    this.filteredProviders = [...this.filteredProviders].sort((a, b) => {
      switch (sortBy) {
        case 'Name A-Z':
          return a.name.localeCompare(b.name);
        case 'Name Z-A':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.loadProviders();
  }

  deleteProvider(providerId: string | undefined) {
    if (!providerId) return;
    
    if (confirm('Are you sure you want to delete this provider?')) {
      this.apiService.delete(`/providers/${providerId}`).subscribe({
        next: () => {
          this.loadProviders();
        },
        error: (error) => {
          console.error('Error deleting provider:', error);
        }
      });
    }
  }
}
