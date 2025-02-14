import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  faUser = faUser;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      const success = await this.authService.sendPasswordResetEmail(email);
      if (success) {
        this.router.navigate(['/auth/confirmation'], { 
          queryParams: { email: email }
        });
      }
    } else {
      this.toastr.error('Veuillez entrer une adresse email valide');
    }
  }
} 