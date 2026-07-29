import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'inventory',
        loadComponent: () => import('./features/admin/pages/inventory/inventory.component').then(m => m.InventoryComponent)
      },
      {
        path: 'product/new',
        loadComponent: () => import('./features/admin/pages/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'product/edit/:id',
        loadComponent: () => import('./features/admin/pages/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full'
      }
    ]
  }
];
