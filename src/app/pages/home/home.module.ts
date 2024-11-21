import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { CardModule } from '../../components/card/card.module'; // Importar el módulo que contiene CardComponent

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    CardModule // Importar el módulo que exporta CardComponent
  ],
  declarations: [
    HomePage // Declarar solo HomePage
  ]
})
export class HomePageModule {}
