import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisAdopcionesPage } from './misadopciones.page';

const routes: Routes = [
  {
    path: '',
    component: MisAdopcionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisAdopcionesPageRoutingModule {}
