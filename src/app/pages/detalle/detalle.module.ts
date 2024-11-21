import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode'; 

import { DetallePageRoutingModule } from './detalle-routing.module';
import { DetallePage } from './detalle.page';
import { CardModule } from 'src/app/components/card/card.module'; // Importa el módulo del CardComponent

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule, 
    DetallePageRoutingModule,
    CardModule // Agrégalo aquí
  ],
  declarations: [DetallePage]
})
export class DetallePageModule {}
