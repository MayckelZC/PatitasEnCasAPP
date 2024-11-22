import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async login(identifier: string, password: string, keepSession: boolean): Promise<void> {
    if (!identifier) {
      await this.showToast('Debes introducir un correo electrónico o un nombre de usuario.');
      return;
    }

    if (!password) {
      await this.showToast('Debes introducir una contraseña.');
      return;
    }

    try {
      await this.authService.login(identifier, password, keepSession);
      await this.showToast(`Bienvenido, ${identifier}!`);
      this.router.navigate(['/home']);
    } catch (error) {
      const errorMessage =
        error.code === 'auth/wrong-password'
          ? 'Contraseña incorrecta. Por favor, intenta de nuevo.'
          : 'Error al iniciar sesión. Verifica tus credenciales.';
      await this.showToast(errorMessage);
    }
  }

  navigateToResetPassword() {
    this.router.navigate(['/restablecer']);
  }

  navigateToRegister() {
    this.router.navigate(['/registro']);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
