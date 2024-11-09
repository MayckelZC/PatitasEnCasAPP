import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;
  let toastController: ToastController;

  beforeEach(waitForAsync(() => {
    const authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(Promise.resolve({ user: { uid: '123' } }))
    };

    const sessionServiceMock = {
      saveSession: jasmine.createSpy('saveSession')
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
        ToastController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    toastController = TestBed.inject(ToastController);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if identifier is empty', async () => {
    component.identifier = '';
    component.password = 'password';
    await component.login();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should show error if password is empty', async () => {
    component.identifier = 'test@example.com';
    component.password = '';
    await component.login();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call authService.login() with correct credentials', async () => {
    component.identifier = 'test@example.com';
    component.password = 'password';
    component.keepSession = true;
    await component.login();
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password', true);
    expect(sessionService.saveSession).toHaveBeenCalledWith('123', true);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show correct error message for wrong password', async () => {
    const toastSpy = spyOn(component, 'showToast').and.callThrough();
    authService.login = jasmine.createSpy('login').and.returnValue(Promise.reject({ code: 'auth/wrong-password' }));

    component.identifier = 'test@example.com';
    component.password = 'wrongpassword';

    await component.login();
    await fixture.whenStable();

    // Verificar que showToast sea llamado con el mensaje correcto
    expect(toastSpy).toHaveBeenCalledWith('Contraseña incorrecta. Por favor, intenta de nuevo.');
  });
});
