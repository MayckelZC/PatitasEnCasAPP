import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReadQrRoutingModule } from './readqr-routing.module';
import { ReadQrPage } from './readqr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadQrRoutingModule
  ],
  declarations: [ReadQrPage]
})
export class ReadQrModule {}
