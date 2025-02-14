import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/auth/login']);
      })
    );
  }

  canActivateAuth(): Observable<boolean | UrlTree> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        const isAuth = !!user;
        if (!isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/app/dashboard']);
      })
    );
  }
} 