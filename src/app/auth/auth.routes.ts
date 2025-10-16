import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./signin.page').then((m) => m.SignInPage),
      },
      {
        path: 'signup',
        loadComponent: () => import('./signup.page').then((m) => m.SignUpPage),
      },
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
      },
    ],
  },
];
