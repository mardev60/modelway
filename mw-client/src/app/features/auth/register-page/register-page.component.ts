import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faGithub, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-page',
  standalone: false,
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  registerForm: FormGroup;
  faUser = faUser;
  faLock = faLock;
  faGoogle = faGoogle;
  faGithub = faGithub;
  faFacebook = faFacebook;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  async onRegister() {
    if (this.registerForm.valid) {
      if (this.registerForm.hasError('mismatch')) {
        this.toastr.error('Les mots de passe ne correspondent pas');
        return;
      }
      const { email, password } = this.registerForm.value;
      await this.authService.signUp(email, password);
    } else {
      this.toastr.error('Veuillez remplir tous les champs correctement');
    }
  }

  async registerWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  }

  async registerWithGithub() {
    try {
      //await this.authService.signInWithGithub();
    } catch (error) {
      console.error(error);
    }
  }

  async registerWithFacebook() {
    try {
      //await this.authService.signInWithFacebook();
    } catch (error) {
      console.error(error);
    }
  }
}
