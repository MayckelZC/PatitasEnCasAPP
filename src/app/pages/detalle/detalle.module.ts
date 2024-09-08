import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode'; // Importa QRCodeModule aquí

import { DetallePageRoutingModule } from './detalle-routing.module';
import { DetallePage } from './detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule, // Asegúrate de que QRCodeModule esté aquí
    DetallePageRoutingModule
  ],
  declarations: [DetallePage]
})
export class DetallePageModule {}
