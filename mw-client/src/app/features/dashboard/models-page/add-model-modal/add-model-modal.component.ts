import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { Provider } from '../../../../utils/types/providers.interface';

@Component({
  selector: 'app-add-model-modal',
  templateUrl: './add-model-modal.component.html',
  standalone: false
})
export class AddModelModalComponent implements OnInit {
  modelForm: FormGroup;
  providers: Provider[] = [];
  isLoading = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.modelForm = this.fb.group({
      provider_id: ['', Validators.required],
      name: ['', Validators.required],
      src_model: ['', Validators.required],
      baseURL: ['', [Validators.required, Validators.pattern('https?://.+')]],
      input_price: ['', [Validators.required, Validators.min(0)]],
      output_price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadProviders();
  }

  loadProviders() {
    this.apiService.get<Provider[]>('/providers').subscribe({
      next: (providers) => {
        this.providers = providers;
      },
      error: (error) => console.error('Error loading providers:', error)
    });
  }

  onSubmit() {
    if (this.modelForm.valid) {
      this.isLoading = true;
      this.apiService.post('/models', this.modelForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.close.emit();
        },
        error: (error) => {
          console.error('Error creating model:', error);
          this.isLoading = false;
        }
      });
    }
  }
} 