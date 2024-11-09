import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';
import { of, throwError } from 'rxjs';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access if user is authenticated', (done) => {
    spyOn(authService, 'isAuthenticated').and.returnValue(of(true));

    authGuard.canActivate().subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should deny access and redirect to login if user is not authenticated', (done) => {
    spyOn(authService, 'isAuthenticated').and.returnValue(of(false));

    authGuard.canActivate().subscribe(result => {
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });

  it('should handle errors and redirect to login', (done) => {
    spyOn(authService, 'isAuthenticated').and.returnValue(throwError(() => new Error('Error')));

    authGuard.canActivate().subscribe(result => {
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
