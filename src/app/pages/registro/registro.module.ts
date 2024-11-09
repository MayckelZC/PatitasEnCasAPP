import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';
import { RegistroPage } from './registro.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RegistroPageRoutingModule,
    ReactiveFormsModule // Usamos solo ReactiveFormsModule
  ],
  declarations: [RegistroPage]
})
export class RegistroPageModule {}
