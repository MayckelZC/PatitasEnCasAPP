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

  constructor(private alertController: AlertController, private router: Router) { }

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

    // Aquí puedes agregar la lógica de autenticación real.
    // Si la autenticación es exitosa:
    localStorage.setItem('username', this.username); // Guarda el nombre de usuario en el almacenamiento local
    this.router.navigate(['/home']);
  }

  forgotPassword() {
    // Navegar a la página de "Olvidar Contraseña"
    console.log('Navegar a la página de Olvidar Contraseña');
    // Ejemplo: this.navController.navigateForward('/forgot-password');
  }

  register() {
    // Navegar a la página de "Registrarse"
    this.router.navigate(['/registro']); // Cambia el nombre de la ruta según corresponda
  }
}
