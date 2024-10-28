import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-read-qr',
  templateUrl: './readqr.page.html',
  styleUrls: ['./readqr.page.scss'],
})
export class ReadQrPage {

  constructor(private router: Router, private toastController: ToastController) { }

  async startScan() {
    try {
      const result: any = await BarcodeScanner.startScan(); // Definimos 'result' como 'any' para evitar errores de tipo

      if (result && result.hasContent) { // Verifica que tenga contenido
        const qrData = result.content; // El contenido del código QR

        // Navegar a la página de detalles con el ID del QR
        this.router.navigate(['/detalle'], {
          queryParams: { id: qrData }
        });
      } else {
        this.showToast('No se pudo escanear el código QR.');
      }
    } catch (error) {
      this.showToast('Error al iniciar el escaneo.');
      console.error('Error de escaneo:', error);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
