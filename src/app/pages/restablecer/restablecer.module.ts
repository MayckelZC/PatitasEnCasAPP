// src/app/pages/restablecer/restablecer.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RestablecerPageRoutingModule } from './restablecer-routing.module';
import { RestablecerPage } from './restablecer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Importa ReactiveFormsModule para formularios reactivos
    IonicModule,
    RestablecerPageRoutingModule
  ],
  declarations: [RestablecerPage]
})
export class RestablecerPageModule {}
