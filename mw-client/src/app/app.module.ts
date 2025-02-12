import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { DocsPageComponent } from './pages/documentation-page/docs-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ModelsPageComponent } from './pages/models-page/models-page.component';
import { ProvidersPageComponent } from './pages/providers-page/providers-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

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
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
