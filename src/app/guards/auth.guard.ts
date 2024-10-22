import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated().pipe(
      map(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/login']); // Redirige al login si no está autenticado
          return false; // Bloquea el acceso
        }
        return true; // Permite el acceso
      }),
      catchError((error) => {
        console.error('Error checking authentication', error); // Manejo de errores
        this.router.navigate(['/login']); // Redirigir al login en caso de error
        return of(false); // Bloquea el acceso
      })
    );
  }
}
