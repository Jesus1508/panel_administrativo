import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      { path: '', loadComponent: () => import('./pages/public/home/home').then((m) => m.Home) },
      {
        path: 'pagina/:slug',
        loadComponent: () => import('./pages/public/pagina-detalle/pagina-detalle').then((m) => m.PaginaDetalle),
      },
      {
        path: 'noticias',
        loadComponent: () => import('./pages/public/noticias-lista/noticias-lista').then((m) => m.NoticiasLista),
      },
      {
        path: 'noticias/:slug',
        loadComponent: () => import('./pages/public/noticia-detalle/noticia-detalle').then((m) => m.NoticiaDetalle),
      },
      { path: 'recursos', loadComponent: () => import('./pages/public/recursos/recursos').then((m) => m.Recursos) },
      { path: 'contacto', loadComponent: () => import('./pages/public/contacto/contacto').then((m) => m.Contacto) },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'paginas', pathMatch: 'full' },
      {
        path: 'paginas',
        loadComponent: () => import('./pages/admin/paginas-admin/paginas-admin').then((m) => m.PaginasAdmin),
      },
      {
        path: 'noticias',
        loadComponent: () => import('./pages/admin/noticias-admin/noticias-admin').then((m) => m.NoticiasAdmin),
      },
      {
        path: 'recursos',
        loadComponent: () => import('./pages/admin/recursos-admin/recursos-admin').then((m) => m.RecursosAdmin),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/admin/usuarios-admin/usuarios-admin').then((m) => m.UsuariosAdmin),
      },
    ],
  },
];
