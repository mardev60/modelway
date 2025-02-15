import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { DocsPageComponent } from './documentation-page/docs-page.component';
import { ModelsPageComponent } from './models-page/models-page.component';
import { ProvidersPageComponent } from './providers-page/providers-page.component';
import { SettingsPageComponent } from '../settings/settings-page/settings-page.component';
import { ModelProfileComponent } from './models-page/model-profile/model-profile.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { BillingPageComponent } from './billing-page/billing-page.component';

export const dashboardRoutes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'models', component: ModelsPageComponent },
  { path: 'models/:name', component: ModelProfileComponent },
  { path: 'providers', component: ProvidersPageComponent },
  { path: 'chat', component: ChatPageComponent },
  { path: 'docs', component: DocsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'history', component: HistoryPageComponent },
  { path: 'billing', component: BillingPageComponent },
  { path: '**', redirectTo: 'dashboard' } // Redirection par défaut
];