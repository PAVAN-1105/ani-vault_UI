import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; // Ensure the filename matches (auth.guard.ts)

export const routes: Routes = [
  // 1. Default route: If they land on the base URL, send them to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Auth: Login page
  { 
    path: 'login', 
    loadComponent: () => import('./modules/auth/components/login/login').then(c => c.LoginComponent) 
  },
  
  // 3. Protected Routes (using the AuthGuard)
  { 
    path: 'dashboard', 
    loadComponent: () => import('./modules/anime/components/dashboard/dashboard').then(c => c.Dashboard), 
    canActivate: [authGuard]
  },
  
  { 
    path: 'detail/:id', 
    loadComponent: () => import('./modules/anime/components/anime-detail/anime-detail').then(c => c.AnimeDetail), 
    canActivate: [authGuard]
  },

  // 4. Wildcard: If they type a random URL, send them to login
  { path: '**', redirectTo: 'login' }
];