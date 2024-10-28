import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private authService: AuthService) {
    this.initializeApp();
  }

  async initializeApp() {
    // Verifica si hay un usuario en localStorage
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      // Si el ID de usuario existe, se considera que el usuario está autenticado
      this.router.navigate(['/home']); // Redirige al usuario a la página de inicio
    } else {
      // Si no hay ID de usuario, redirige a la página de inicio de sesión
      this.router.navigate(['/login']);
    }
  }
}
