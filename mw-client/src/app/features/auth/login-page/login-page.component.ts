import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Component } from '@angular/core';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faGithub, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  loginForm: FormGroup;
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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      await this.authService.signIn(email, password);
    } else {
      this.toastr.error('Veuillez remplir tous les champs correctement');
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
      //await this.authService.signInWithGithub();
    } catch (error) {
      console.error(error);
    }
  }

  async loginWithFacebook() {
    try {
      //await this.authService.signInWithFacebook();
    } catch (error) {
      console.error(error);
    }
  }
}
