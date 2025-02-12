import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { DocsPageComponent } from './pages/documentation-page/docs-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ModelsPageComponent } from './pages/models-page/models-page.component';
import { ProvidersPageComponent } from './pages/providers-page/providers-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
  {
    path: 'models',
    component: ModelsPageComponent,
  },
  {
    path: 'providers',
    component: ProvidersPageComponent,
  },
  {
    path: 'chat',
    component: ChatPageComponent,
  },
  {
    path: 'docs',
    component: DocsPageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },

  {
    path: 'register',
    component: RegisterPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
