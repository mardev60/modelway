import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  async signUp(email: string, password: string) {
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      this.toastr.success('Compte créé avec succès');
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async signIn(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.toastr.success('Connexion réussie');
      this.router.navigate(['/app/dashboard']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await this.afAuth.signInWithPopup(provider);
      this.toastr.success('Connexion avec Google réussie');
      this.router.navigate(['/app/dashboard']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async signOut() {
    try {
      await this.afAuth.signOut();
      this.toastr.success('Déconnexion réussie');
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async sendPasswordResetEmail(email: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      this.toastr.success('Email de réinitialisation envoyé');
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
      this.toastr.success('Mot de passe réinitialisé avec succès');
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
      this.toastr.success('Mot de passe réinitialisé avec succès');
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  private handleAuthError(error: any) {
    let errorMessage = 'Une erreur est survenue';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Cet email est déjà utilisé';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email invalide';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Opération non autorisée';
        break;
      case 'auth/weak-password':
        errorMessage = 'Le mot de passe est trop faible';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Ce compte a été désactivé';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Aucun compte trouvé avec cet email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Mot de passe incorrect';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Trop de tentatives, veuillez réessayer plus tard';
        break;
    }

    this.toastr.error(errorMessage);
  }
}