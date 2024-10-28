import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MisAdopcionesPageRoutingModule } from './misadopciones-routing.module';
import { MisAdopcionesPage } from './misadopciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisAdopcionesPageRoutingModule
  ],
  declarations: [MisAdopcionesPage]
})
export class MisAdopcionesPageModule {}
