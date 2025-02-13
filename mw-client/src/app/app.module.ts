import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatPageComponent } from './features/dashboard/chat-page/chat-page.component';
import { DocsPageComponent } from './features/dashboard/documentation-page/docs-page.component';
import { LoginPageComponent } from './features/auth/login-page/login-page.component';
import { ModelsPageComponent } from './features/dashboard/models-page/models-page.component';
import { ProvidersPageComponent } from './features/dashboard/providers-page/providers-page.component';
import { RegisterPageComponent } from './features/auth/register-page/register-page.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { VerifyOtpComponent } from './features/auth/verify-otp/verify-otp.component';
import { ConfirmationPageComponent } from './features/auth/confirmation-page/confirmation-page.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterPageComponent,
    LoginPageComponent,
    ModelsPageComponent,
    ProvidersPageComponent,
    DocsPageComponent,
    ChatPageComponent,
    NavbarComponent,
    DashboardPageComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    ForgotPasswordComponent,
    VerifyOtpComponent,
    ConfirmationPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
