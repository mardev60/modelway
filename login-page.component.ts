import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        await this.authService.signIn(email, password);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  }

  async loginWithGithub() {
    try {
      await this.authService.signInWithGithub();
    } catch (error) {
      console.error(error);
    }
  }

  async loginWithFacebook() {
    try {
      await this.authService.signInWithFacebook();
    } catch (error) {
      console.error(error);
    }
  }
} 