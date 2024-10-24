import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage {
  email: string;

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  async onSubmit() {
    if (this.email) {
      try {
        await this.authService.resetPassword(this.email); // Llama al método de restablecimiento
        const toast = await this.toastController.create({
          message: 'Se ha enviado un correo de restablecimiento.',
          duration: 3000,
          position: 'top',
        });
        toast.present();
      } catch (error) {
        const toast = await this.toastController.create({
          message: 'Error al enviar el correo de restablecimiento. Asegúrate de que el correo sea correcto.',
          duration: 3000,
          position: 'top',
        });
        toast.present();
      }
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor, ingresa tu correo electrónico.',
        duration: 3000,
        position: 'top',
      });
      toast.present();
    }
  }
}
