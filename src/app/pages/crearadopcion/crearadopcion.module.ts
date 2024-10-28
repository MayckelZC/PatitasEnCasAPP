import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { IonicModule } from '@ionic/angular';

import { CrearadopcionPageRoutingModule } from './crearadopcion-routing.module';

import { CrearadopcionPage } from './crearadopcion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    CrearadopcionPageRoutingModule
  ],
  declarations: [CrearadopcionPage]
})
export class CrearadopcionPageModule {}
