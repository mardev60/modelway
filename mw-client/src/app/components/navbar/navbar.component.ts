import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  menuOpen = false;
  userProfileImg =
    'https://i1.sndcdn.com/artworks-fbm27AXQOyXmgZuu-nET5Zw-t500x500.jpg';

  navLinks = [
    { path: '/app/dashboard', label: 'Dashboard' },
    { path: '/app/models', label: 'Models' },
    { path: '/app/providers', label: 'Providers' },
    { path: '/app/chat', label: 'Chat' },
    { path: '/app/docs', label: 'Docs' },
  ];

  userMenuItems = [
    { label: '⚙️ Settings', path: '/profile', action: () => this.closeMenu() },
    { label: '💳 Billing', path: '/billing', action: () => this.closeMenu() },
    { label: '📜 History', path: '/history', action: () => this.closeMenu() },
    { label: '🚪 Logout', path: '', action: () => this.logout() },
  ];  

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

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
