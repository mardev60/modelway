import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-otp',
  standalone: false,
  templateUrl: './verify-otp.component.html',
})
export class VerifyOtpComponent implements OnInit {
  verifyForm: FormGroup;
  email: string = '';
  urlOtp: string = '';
  faLock = faLock;
  isValidCode: boolean = false;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.verifyForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.urlOtp = params['oobCode'];
      
      if (!this.urlOtp) {
        this.toastr.error('Lien invalide');
        this.router.navigate(['/auth/login']);
        return;
      }

      try {
        // Verify the oobCode with Firebase
        const isValid = await this.authService.verifyPasswordResetCode(this.urlOtp);
        if (isValid) {
          this.isValidCode = true;
          this.email = isValid; // Firebase returns the email associated with the code
        } else {
          throw new Error('Code invalide');
        }
      } catch (error) {
        this.toastr.error('Le lien de réinitialisation est invalide ou a expiré');
        this.router.navigate(['/auth/login']);
      } finally {
        this.isLoading = false;
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  async onSubmit() {
    if (this.verifyForm.valid) {
      const { newPassword } = this.verifyForm.value;
      await this.authService.confirmPasswordReset(this.urlOtp, newPassword);
    } else {
      if (this.verifyForm.hasError('mismatch')) {
        this.toastr.error('Les mots de passe ne correspondent pas');
      } else {
        this.toastr.error('Veuillez remplir tous les champs correctement');
      }
    }
  }
} 