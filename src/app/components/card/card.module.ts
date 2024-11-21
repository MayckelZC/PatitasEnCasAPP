import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CardComponent } from './card.component';

@NgModule({
  declarations: [CardComponent], // Declarar el componente aquí
  imports: [
    CommonModule, // Importar módulos necesarios
    IonicModule
  ],
  exports: [CardComponent] // Exportar el componente para que otros módulos puedan usarlo
})
export class CardModule {}
