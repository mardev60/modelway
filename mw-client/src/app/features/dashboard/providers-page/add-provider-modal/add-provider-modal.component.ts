import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-add-provider-modal',
  templateUrl: './add-provider-modal.component.html',
  standalone: false
})
export class AddProviderModalComponent {
  providerForm: FormGroup;
  isLoading = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.providerForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  onSubmit() {
    if (this.providerForm.valid) {
      this.isLoading = true;
      this.apiService.post('/providers', this.providerForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.close.emit();
        },
        error: (error) => {
          console.error('Error creating provider:', error);
          this.isLoading = false;
        }
      });
    }
  }
} 