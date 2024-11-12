import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage {
  email: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async onSubmit() {
    // Validar si el correo es válido utilizando el patrón HTML5
    if (!this.email || !this.isValidEmail(this.email)) {
      await this.showToast('Por favor, introduce un correo válido.');
      return;
    }

    let loading;
    try {
      // Mostrar el indicador de carga
      this.loading = true;
      loading = await this.presentLoading('Enviando...');
      
      await this.authService.resetPassword(this.email);
      await this.showToast('Se ha enviado un correo de restablecimiento.');
      this.email = ''; // Limpiar el campo después de enviar
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      await this.showToast(errorMessage);
    } finally {
      this.loading = false;
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  private async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }

  // Método para validar el correo (puede ser reemplazado por `pattern` en el HTML)
  public isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email);
  }

  // Centralizar mensajes de error
  private getErrorMessage(error: any): string {
    const errorMessages = {
      'auth/user-not-found': 'No se encontró un usuario con ese correo.',
      'auth/invalid-email': 'Correo electrónico no válido.',
    };
    return errorMessages[error.code] || 'Hubo un error al enviar el correo. Inténtalo de nuevo.';
  }
}