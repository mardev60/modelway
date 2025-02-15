import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../utils/types/users.interface';

@Component({
  selector: 'app-billing-page',
  standalone: false,
  templateUrl: './billing-page.component.html'
})
export class BillingPageComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoading = false;
    });
  }

  addCredits() {
    // TODO: ajouter stripe
    console.log('Adding credits...');
  }
} 