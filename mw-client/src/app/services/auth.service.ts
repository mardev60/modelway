import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat/app';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {}

  async signUp(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (userCredential.user) {
        // Get the Firebase token
        const token = await userCredential.user.getIdToken();
        
        if (token) {
          // Set the token in the API service
          this.apiService.setAuthToken(token);
          
          // This will trigger user creation in our backend
          await this.apiService.getUserInfo().toPromise();
          
          // Send email verification
          await userCredential.user.sendEmailVerification();
        }
      }
      this.toastr.success('Account created successfully');
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const token = await userCredential.user?.getIdToken();
      
      if (token) {
        this.apiService.setAuthToken(token);
        this.toastr.success('Login successful');
        this.router.navigate(['/app/dashboard']);
      }
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await this.afAuth.signInWithPopup(provider);
      this.toastr.success('Google login successful');
      this.router.navigate(['/app/dashboard']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async signOut() {
    try {
      await this.afAuth.signOut();
      this.apiService.removeAuthToken();
      this.toastr.success('Logout successful');
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async sendPasswordResetEmail(email: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      this.toastr.success('Password reset email sent');
      return true;
    } catch (error: any) {
      this.handleAuthError(error);
      return false;
    }
  }

  async verifyOtpAndResetPassword(email: string, otp: string, newPassword: string) {
    try {
      // Implement your OTP verification logic here
      // This is just a placeholder
      this.toastr.success('Password reset successful');
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async verifyPasswordResetCode(code: string): Promise<string> {
    try {
      return await this.afAuth.verifyPasswordResetCode(code);
    } catch (error: any) {
      this.handleAuthError(error);
      return '';
    }
  }

  async confirmPasswordReset(code: string, newPassword: string) {
    try {
      await this.afAuth.confirmPasswordReset(code, newPassword);
      this.toastr.success('Password reset successful');
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  private handleAuthError(error: any) {
    let errorMessage = 'An error occurred';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already in use';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Operation not allowed';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts, please try again later';
        break;
    }

    this.toastr.error(errorMessage);
  }
}