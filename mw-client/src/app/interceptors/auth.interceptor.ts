import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.apiService.getAuthToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.apiService.removeAuthToken();
          this.afAuth.signOut();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
} 