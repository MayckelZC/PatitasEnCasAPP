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

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(isAuth => {
        if (isAuth) {
          return true; // Permite el acceso si está autenticado
        } else {
          this.router.navigate(['/login']); // Redirige si no está autenticado
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error checking authentication', error);
        this.router.navigate(['/login']); // Redirige al login en caso de error
        return of(false);
      })
    );
  }
}
