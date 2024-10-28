import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearadopcionPage } from './crearadopcion.page';

const routes: Routes = [
  {
    path: '',
    component: CrearadopcionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearadopcionPageRoutingModule { }
