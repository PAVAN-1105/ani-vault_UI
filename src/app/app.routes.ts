import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
// ❌ REMOVE the static imports for Dashboard, AnimeDetail, and LoginComponent!

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // ✅ NEW CONCEPT: Lazy Loading
  // Angular will only download this file when the user actually navigates to /dashboard
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard), 
    canActivate:[authGuard]
  },
  
  { 
    path: 'detail/:id', 
    loadComponent: () => import('./anime-detail/anime-detail').then(c => c.AnimeDetail), 
    canActivate:[authGuard]

  },
  
  { 
    path: 'login', 
    loadComponent: () => import('./login/login').then(c => c.LoginComponent) 
  }
];