import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({ projectId: "model-way", appId: "1:795314424670:web:2892dcafd218d0f28bddcf", storageBucket: "model-way.firebasestorage.app", apiKey: "AIzaSyCdRhVWFaQaQhp7z-bjAaiccGUKbJDdZ9s", authDomain: "model-way.firebaseapp.com", messagingSenderId: "795314424670", measurementId: "G-STTT46RK26" })),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
