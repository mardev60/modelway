import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { authRoutes } from './features/auth/auth.routes';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Inject, inject } from '@angular/core';
import { Router } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: authRoutes,
    canActivate: [() => new AuthGuard(inject(AngularFireAuth), inject(Router)).canActivateAuth()]
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    children: dashboardRoutes,
    canActivate: [() => new AuthGuard(inject(AngularFireAuth), inject(Router)).canActivate()]
  },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}