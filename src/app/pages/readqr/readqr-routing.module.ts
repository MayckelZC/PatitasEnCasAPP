import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReadQrPage } from './readqr.page';  // Asegúrate de que este nombre coincida

const routes: Routes = [
  {
    path: '',
    component: ReadQrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReadQrRoutingModule {}
