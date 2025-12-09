import { Routes } from '@angular/router';

export const routes: Routes = [

  // --- LOGIN Y REGISTRO SIN MENÚ ---
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then(m => m.LoginPage)
  },

  {
    path: 'registro',
    loadComponent: () =>
      import('./registro/registro.page').then(m => m.RegistroPage)
  },

  // --- PÁGINAS INTERNAS QUE SÍ LLEVAN MENÚ ---
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.page').then(m => m.LayoutPage),

    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./perfil/perfil.page').then(m => m.PerfilPage)
      },
      {
        path: 'now-playing',
        loadComponent: () =>
          import('./now-playing/now-playing.page').then(m => m.NowPlayingPage)
      }
    ]
  }
];
