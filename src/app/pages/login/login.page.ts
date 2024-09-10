import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importar desde @angular/router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  login() {
    if (this.username.trim() === '') {
      this.presentAlert('Error', 'El campo de usuario es obligatorio.');
      return;
    }

    if (this.password.trim() === '') {
      this.presentAlert('Error', 'El campo de contraseña es obligatorio.');
      return;
    }

    localStorage.setItem('username', this.username); // Guarda el nombre de usuario en el almacenamiento local
    this.router.navigate(['/home']);
  }

  navigateToResetPassword() {
    this.router.navigate(['/restablecer']); // Cambia la ruta según la configuración de tus rutas
  }

  register() {
    this.router.navigate(['/registro']); // Cambia el nombre de la ruta según corresponda
  }
}
