import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <!-- Overlay para móvil -->
      <div 
        class="sidebar-overlay" 
        [class.sidebar-overlay--visible]="sidebarOpen()"
        (click)="closeSidebar()"
      ></div>

      <!-- Sidebar -->
      <aside class="sidebar" [class.sidebar--open]="sidebarOpen()">
        <div class="sidebar__header">
          <h1 class="sidebar__brand">
            Velvet <span>&</span> Vine
          </h1>
          <p class="sidebar__subtitle">Panel de Administración</p>
          <a routerLink="/" (click)="closeSidebar()" class="sidebar__link" style="margin-top: 0.75rem; padding: 0.5rem 0.75rem; background: #FFFFFF; border-radius: 0.5rem; font-size: 0.75rem; border: 1px solid #EEDDD9; color: #D63447; font-weight: 600;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Ver Tienda Principal
          </a>
        </div>

        <nav class="sidebar__nav">
          <a routerLink="/admin/dashboard" routerLinkActive="sidebar__link--active" class="sidebar__link" (click)="closeSidebar()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Panel de Control
          </a>

          <a routerLink="/admin/inventory" routerLinkActive="sidebar__link--active" [routerLinkActiveOptions]="{exact: false}" class="sidebar__link" (click)="closeSidebar()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 7h-9M14 17H5M20 17h-3M5 7h2"></path>
              <circle cx="10" cy="7" r="2"></circle>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
            Inventario
          </a>

          <a routerLink="/admin/orders" routerLinkActive="sidebar__link--active" class="sidebar__link" (click)="closeSidebar()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Pedidos
          </a>

          <a routerLink="/admin/customers" routerLinkActive="sidebar__link--active" class="sidebar__link" (click)="closeSidebar()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Clientes
          </a>

          <a routerLink="/admin/analytics" routerLinkActive="sidebar__link--active" class="sidebar__link" (click)="closeSidebar()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            Analíticas
          </a>
        </nav>

        <div class="sidebar__footer">
          <a routerLink="/admin/settings" routerLinkActive="sidebar__link--active" class="sidebar__link" (click)="closeSidebar()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Configuración
          </a>

          <button (click)="onLogout()" class="sidebar__link" style="width: 100%; border: none; background: transparent; cursor: pointer; text-align: left; color: #D63447;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </button>

          <div class="sidebar__user">
            <div class="sidebar__user-avatar">{{ userInitials }}</div>
            <div class="sidebar__user-info">
              <span class="sidebar__user-name">{{ userName }}</span>
              <span class="sidebar__user-role">{{ userRole }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content con Router Outlet -->
      <main class="main-content">
        <!-- Botón hamburger para móvil -->
        <button class="mobile-menu-btn" (click)="toggleSidebar()" aria-label="Menú">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Aquí se cargan las páginas hijas (inventory, product-form, etc.) -->
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly sidebarOpen = signal<boolean>(false);
  readonly currentUser = this.authService.currentUser;

  get userName(): string {
    const user = this.currentUser();
    if (!user) return 'Administrador';
    return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
  }

  get userInitials(): string {
    const name = this.userName;
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase() || 'AD';
  }

  get userRole(): string {
    return this.currentUser()?.role || 'ADMIN';
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(value => !value);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
