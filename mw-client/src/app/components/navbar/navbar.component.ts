import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../utils/types/users.interface';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  userProfileImg =
    'https://img.myloview.fr/images/funny-cartoon-monster-face-vector-monster-square-avatar-700-196215185.jpg';
  currentUser: User | null = null;

  navLinks = [
    { path: '/app/dashboard', label: 'Dashboard' },
    { path: '/app/models', label: 'Models' },
    { path: '/app/providers', label: 'Providers' },
    { path: '/app/chat', label: 'Chat' },
    { path: '/app/docs', label: 'Docs' },
  ];

  userMenuItems = [
    { label: '⚙️ Settings', path: '/app/settings', action: () => this.closeMenu() },
    { label: '💳 Billing', path: '/app/billing', action: () => this.closeMenu() },
    { label: '📜 History', path: '/app/history', action: () => this.closeMenu() },
    { label: '🚪 Logout', path: '', action: () => this.logout() },
  ];  

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.photoURL) {
        this.userProfileImg = user.photoURL;
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  async logout() {
    await this.authService.signOut();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu') && this.menuOpen) {
      this.menuOpen = false;
    }
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
