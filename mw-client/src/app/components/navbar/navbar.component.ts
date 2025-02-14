import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

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
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/models', label: 'Models' },
    { path: '/providers', label: 'Providers' },
    { path: '/chat', label: 'Chat' },
    { path: '/docs', label: 'Docs' },
  ];

  userMenuItems = [
    { label: '⚙️ Settings', path: '/profile', action: () => this.closeMenu() },
    { label: '💳 Billing', path: '/billing', action: () => this.closeMenu() },
    { label: '📜 History', path: '/history', action: () => this.closeMenu() },
    { label: '🚪 Logout', path: '', action: () => this.logout() },
  ];  

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    console.log('Logout user');
    this.menuOpen = false;
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
