import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  identifier: string = ''; // Cambia 'email' a 'identifier'
  password: string = '';

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async login() {
    // Verificar si el identificador y la contraseña están ingresados
    if (!this.identifier) {
      const toast = await this.toastController.create({
        message: 'Debes introducir un correo electrónico o un nombre de usuario.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
      return; // Salir si el identificador no está ingresado
    }

    if (!this.password) {
      const toast = await this.toastController.create({
        message: 'Debes introducir una contraseña.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
      return; // Salir si la contraseña no está ingresada
    }

    try {
      await this.authService.login(this.identifier, this.password);
      const toast = await this.toastController.create({
        message: `Bienvenido, ${this.identifier}!`, // Mensaje de bienvenida
        duration: 2000,
        position: 'top'
      });
      toast.present();
      this.router.navigate(['/home']); // Redirige al usuario a la página de inicio
    } catch (error) {
      const errorMessage = error.code === 'auth/wrong-password' ? 
        'Contraseña incorrecta. Por favor, intenta de nuevo.' : 
        'Error al iniciar sesión. Verifica tus credenciales.';
        
      const toast = await this.toastController.create({
        message: errorMessage,
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  }

  navigateToResetPassword() {
    this.router.navigate(['/restablecer']);
  }

  register() {
    this.router.navigate(['/registro']);
  }
}
