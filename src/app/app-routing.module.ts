import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard], // Proteger ruta
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule),
  },
  {
    path: 'restablecer',
    loadChildren: () => import('./pages/restablecer/restablecer.module').then(m => m.RestablecerPageModule),
  },
  {
    path: 'crearadopcion',
    loadChildren: () => import('./pages/crearadopcion/crearadopcion.module').then(m => m.CrearadopcionPageModule),
    canActivate: [AuthGuard], // Proteger ruta
  },
  {
    path: 'detalle',
    loadChildren: () => import('./pages/detalle/detalle.module').then(m => m.DetallePageModule),
    canActivate: [AuthGuard], // Proteger ruta
  },
  {
    path: 'misadopciones',
    loadChildren: () => import('./pages/misadopciones/misadopciones.module').then(m => m.MisAdopcionesPageModule),
    canActivate: [AuthGuard], // Proteger ruta si es necesario
  },
  {
    path: 'modificar',
    loadChildren: () => import('./pages/modificar/modificar.module').then(m => m.ModificarPageModule),
    canActivate: [AuthGuard], // Proteger ruta
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'readqr',
    loadChildren: () => import('./pages/readqr/readqr.module').then(m => m.ReadQrModule)

  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
