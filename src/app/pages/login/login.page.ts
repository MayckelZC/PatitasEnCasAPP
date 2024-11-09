import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  identifier: string = ''; // Almacena el correo electrónico o nombre de usuario
  password: string = ''; // Almacena la contraseña
  keepSession: boolean = false; // Variable para mantener la sesión iniciada

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async login() {
    if (!this.identifier || !this.password) {
      await this.showToast('Debes introducir un correo electrónico/usuario y una contraseña.');
      return;
    }

    try {
      // Llama al método de login del AuthService
      const userCredential = await this.authService.login(this.identifier, this.password, this.keepSession);

      // Guardar la sesión
      this.sessionService.saveSession(userCredential.user?.uid, this.keepSession);

      // Mostrar mensaje de bienvenida
      await this.showToast(`¡Bienvenido, ${this.identifier}!`);

      // Redirigir al usuario a la página principal
      this.router.navigate(['/home']);
    } catch (error) {
      await this.handleLoginError(error);
    }
  }

  // Método para mostrar mensajes Toast (cambiado a public)
  public async showToast(message: string, duration: number = 2000, position: 'top' | 'middle' | 'bottom' = 'top') {
    const toast = await this.toastController.create({ message, duration, position });
    await toast.present();
  }

  // Manejo centralizado de errores
  private async handleLoginError(error: any) {
    const errorMessage = this.getErrorMessage(error);
    await this.showToast(errorMessage);
  }

  // Método para obtener mensajes de error más descriptivos
  private getErrorMessage(error: any): string {
    const errorMap: { [key: string]: string } = {
      'auth/wrong-password': 'Contraseña incorrecta. Por favor, intenta de nuevo.',
      'auth/user-not-found': 'Usuario no encontrado. Verifica tus credenciales.',
      'auth/invalid-email': 'Correo electrónico no válido.',
    };
    return errorMap[error.code] || 'Error al iniciar sesión. Verifica tus credenciales.';
  }

  // Navegar a la página de restablecimiento de contraseña
  navigateToResetPassword() {
    this.router.navigate(['/restablecer']);
  }

  // Navegar a la página de registro
  register() {
    this.router.navigate(['/registro']);
  }
}
