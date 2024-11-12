// src/app/services/session.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly SESSION_KEY = 'user_session';

  // Guarda la sesión en localStorage o sessionStorage
  saveSession(uid: string | undefined, keepSession: boolean): void {
    if (uid) {
      const storage = keepSession ? localStorage : sessionStorage;
      storage.setItem(this.SESSION_KEY, uid);
    }
  }

  // Obtiene la sesión almacenada
  getSession(): string | null {
    return sessionStorage.getItem(this.SESSION_KEY) || localStorage.getItem(this.SESSION_KEY);
  }

  // Limpia la sesión almacenada
  clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }
}
