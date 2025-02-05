import { Routes } from '@angular/router';
import { BackofficeComponent } from './pages/backoffice/backoffice.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {
    path: 'tableau-de-bord',
    component: DashboardComponent,
  },
  {
    path: 'administration',
    component: BackofficeComponent,
  },
  {
    path: 'documentation',
    component: DocumentationComponent,
  },
  {
    path: 'connexion',
    component: LoginComponent,
  },
  {
    path: 'inscription',
    component: RegisterComponent,
  },
];
