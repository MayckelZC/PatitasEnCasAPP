import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly USER_KEY = 'userId';

  // Método para guardar la sesión del usuario
  saveSession(userId: string, keepSession: boolean): void {
    if (keepSession) {
      localStorage.setItem(this.USER_KEY, userId); // Persistir en localStorage
    } else {
      sessionStorage.setItem(this.USER_KEY, userId); // Persistir en sessionStorage
    }
  }

  // Método para obtener la sesión del usuario
  getSession(): string | null {
    return localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
  }

  // Método para verificar si hay un usuario autenticado
  isLoggedIn(): boolean {
    return !!this.getSession();
  }

  // Método para eliminar la sesión del usuario
  clearSession(): void {
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }
}
