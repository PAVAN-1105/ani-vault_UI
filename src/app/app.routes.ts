import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
// ❌ REMOVE the static imports for Dashboard, AnimeDetail, and LoginComponent!

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // ✅ NEW CONCEPT: Lazy Loading
  // Angular will only download this file when the user actually navigates to /dashboard
  { 
    path: 'dashboard', 
    loadComponent: () => import('./modules/anime/components/dashboard/dashboard').then(c => c.Dashboard), 
    canActivate:[authGuard]
  },
  
  { 
    path: 'detail/:id', 
    loadComponent: () => import('./modules/anime/components/anime-detail/anime-detail').then(c => c.AnimeDetail), 
    canActivate:[authGuard]

  },
  
  { 
    path: 'login', 
    loadComponent: () => import('./modules/auth/components/login/login').then(c => c.LoginComponent) 
  }
];