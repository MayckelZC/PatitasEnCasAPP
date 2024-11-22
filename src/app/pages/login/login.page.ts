import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/loginservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  identifier: string = ''; // Almacena el correo electrónico o nombre de usuario
  password: string = ''; // Almacena la contraseña
  keepSession: boolean = false; // Variable para mantener la sesión iniciada

  constructor(private loginService: LoginService) {}

  async login() {
    await this.loginService.login(this.identifier, this.password, this.keepSession);
  }

  navigateToResetPassword() {
    this.loginService.navigateToResetPassword();
  }

  register() {
    this.loginService.navigateToRegister();
  }
}
