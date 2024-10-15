import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated(): boolean {
    // Aquí puedes agregar la lógica para verificar si el usuario está autenticado
    // Por ejemplo, revisando si hay un token en localStorage
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Otros métodos de autenticación
}
