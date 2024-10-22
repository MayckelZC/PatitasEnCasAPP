import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user.pipe(
      map(user => {
        if (user) {
          return true; // Si hay un usuario autenticado, permite el acceso
        } else {
          this.router.navigate(['/login']); // Si no, redirige a la página de login
          return false;
        }
      })
    );
  }
}
