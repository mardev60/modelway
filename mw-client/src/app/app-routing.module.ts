import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { authRoutes } from './features/auth/auth.routes';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth', 'login']); 

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: authRoutes
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    children: dashboardRoutes,
    canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  { path: '**', redirectTo: 'auth/login' } // Redirection globale
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}