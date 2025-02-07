import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ModelesPageComponent } from './pages/modeles-page/modeles-page.component';
import { ProvidersPageComponent } from './pages/providers-page/providers-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

const routes: Routes = [
  {
    path: 'inscription',
    component: RegisterPageComponent,
  },
  {
    path: 'connexion',
    component: LoginPageComponent,
  },
  {
    path: 'modeles',
    component: ModelesPageComponent,
  },
  {
    path: 'fournisseurs',
    component: ProvidersPageComponent,
  },
  {
    path: 'inscription',
    component: RegisterPageComponent,
  },
  {
    path: 'chat',
    component: ChatPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
