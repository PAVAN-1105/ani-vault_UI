import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AnimeDetail } from './anime-detail/anime-detail';

export const routes: Routes = [
    // When the app loads (empty path), automatically redirect to the dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  // When the URL is /dashboard, show the DashboardComponent
  { path: 'dashboard', component: Dashboard },
  
  // When the URL is /detail/1 (or any ID), show the AnimeDetailComponent
  { path: 'detail/:id', component: AnimeDetail }
];
