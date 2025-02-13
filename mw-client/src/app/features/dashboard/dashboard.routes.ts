import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { DocsPageComponent } from './documentation-page/docs-page.component';
import { ModelsPageComponent } from './models-page/models-page.component';
import { ProvidersPageComponent } from './providers-page/providers-page.component';

export const dashboardRoutes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'models', component: ModelsPageComponent },
  { path: 'providers', component: ProvidersPageComponent },
  { path: 'chat', component: ChatPageComponent },
  { path: 'docs', component: DocsPageComponent },
  { path: '**', redirectTo: 'dashboard' } // Redirection par défaut
];