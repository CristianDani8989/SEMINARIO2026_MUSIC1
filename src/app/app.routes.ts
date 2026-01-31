import { Routes } from '@angular/router';
import { IntroGuard } from './guards/intro-guard';
import { LoginGuard } from './guards/login-guard';
// [TAREA] agregar el guard de login [LISTA]
export const routes: Routes = [
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu.page').then((m) => m.MenuPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
        canActivate: [LoginGuard, IntroGuard],
      },
      {
        path: 'intro',
        loadComponent: () => import('./intro/intro.page').then((m) => m.IntroPage),
        canActivate: [LoginGuard],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'menu/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'songs-modal',
    loadComponent: () => import('./songs-modal/songs-modal.page').then( m => m.SongsModalPage)
  },
];