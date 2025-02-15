import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiTokenService } from '../../../services/api-token.service';
import { ApiToken } from '../../../utils/types/api-token.interface';
import { ToastrService } from 'ngx-toastr';

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  standalone: false,
})
export class SettingsPageComponent implements OnInit {
  tokens: ApiToken[] = [];
  tokenForm: FormGroup;
  showNewToken: boolean = false;
  newlyCreatedToken: string | null = null;

  constructor(
    private apiTokenService: ApiTokenService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.tokenForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    this.loadTokens();
  }

  loadTokens() {
    this.apiTokenService.getTokens().subscribe({
      next: (tokens) => {
        this.tokens = tokens.map(token => ({
          ...token,
          createdAt: this.convertTimestampToDate(token.createdAt),
          lastUsedAt: token.lastUsedAt ? this.convertTimestampToDate(token.lastUsedAt) : null
        }));
      },
      error: (error) => {
        this.toastr.error('Failed to load API tokens');
        console.error('Error loading tokens:', error);
      }
    });
  }

  private convertTimestampToDate(timestamp: FirestoreTimestamp | Date): Date {
    if (timestamp instanceof Date) return timestamp;
    if (!timestamp?._seconds) return new Date();
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  }

  async createToken() {
    if (this.tokenForm.valid) {
      const { name } = this.tokenForm.value;
      this.apiTokenService.createToken(name).subscribe({
        next: (token) => {
          this.tokens.push(token);
          this.newlyCreatedToken = token.token;
          this.tokenForm.reset();
          this.toastr.success('API token created successfully');
        },
        error: (error) => {
          this.toastr.error('Failed to create API token');
          console.error('Error creating token:', error);
        }
      });
    }
  }

  deactivateToken(tokenId: string) {
    if (confirm('Are you sure you want to deactivate this token?')) {
      this.apiTokenService.deactivateToken(tokenId).subscribe({
        next: () => {
          this.tokens = this.tokens.filter(t => t.id !== tokenId);
          this.toastr.success('Token deactivated successfully');
        },
        error: (error) => {
          this.toastr.error('Failed to deactivate token');
          console.error('Error deactivating token:', error);
        }
      });
    }
  }

  copyToken(token: string) {
    navigator.clipboard.writeText(token);
    this.toastr.success('Token copied to clipboard');
  }
} 