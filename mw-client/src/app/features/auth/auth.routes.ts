import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ConfirmationPageComponent } from './confirmation-page/confirmation-page.component';

export const authRoutes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'confirmation', component: ConfirmationPageComponent },
  { path: '**', redirectTo: 'login' }
];