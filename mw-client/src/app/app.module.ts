import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { DocumentationPageComponent } from './pages/documentation-page/documentation-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ModelesPageComponent } from './pages/modeles-page/modeles-page.component';
import { ProvidersPageComponent } from './pages/providers-page/providers-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterPageComponent,
    LoginPageComponent,
    ModelesPageComponent,
    ProvidersPageComponent,
    DocumentationPageComponent,
    ChatPageComponent,
    NavbarComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
