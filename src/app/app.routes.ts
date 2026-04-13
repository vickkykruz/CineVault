import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
 
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'discover',
    loadComponent: () =>
      import('./features/discover/discover').then((m) => m.Discover),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movie-detail/movie-detail').then((m) => m.MovieDetail),
  },
  {
    path: 'watchlist',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/watchlist/watchlist').then((m) => m.Watchlist),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'verdict',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/verdict/verdict').then((m) => m.Verdict),
  },
  {
    path: 'time-capsule',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/time-capsule/time-capsule').then((m) => m.TimeCapsule),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
 