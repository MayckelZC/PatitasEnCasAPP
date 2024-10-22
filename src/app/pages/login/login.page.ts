import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Importar Router para navegación

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string; // Cambié de username a email para que sea más claro
  password: string;

  constructor(private authService: AuthService, private router: Router) {}

  // Método para manejar el inicio de sesión
  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        // Redirigir al usuario a la página de inicio después de iniciar sesión
        this.router.navigate(['/home']);
      })
      .catch(error => {
        // Manejar errores, puedes mostrar un mensaje de alerta
        console.error('Error de inicio de sesión:', error);
      });
  }

  // Método para navegar a la página de restablecimiento de contraseña
  navigateToResetPassword() {
    this.router.navigate(['/restablecer']);
  }

  // Método para navegar a la página de registro
  register() {
    this.router.navigate(['/registro']);
  }
}
