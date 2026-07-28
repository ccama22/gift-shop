import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  isAuthRoute = false;
  isAdminRoute = false;
  menuItems = ['Inicio', 'Tienda', 'Registro de Regalos', 'Ocasiones', 'Corporativo'];

  // Auth signals
  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isAdmin = this.authService.isAdmin;

  constructor() {
    // Detectar rutas para ocultar header
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAuthRoute = event.url.startsWith('/auth');
        this.isAdminRoute = event.url.startsWith('/admin');
      });
  }

  get userName(): string {
    const user = this.currentUser();
    if (!user) return 'Usuario';
    return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
  }

  get userInitials(): string {
    const name = this.userName;
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase() || 'US';
  }

  onLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
