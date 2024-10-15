import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Aquí va la lógica de tu guard
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  return isAuthenticated;
};
