import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestablecerPage } from './restablecer.page';
import { AuthService } from '../../services/auth.service';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';

describe('RestablecerPage', () => {
  let component: RestablecerPage;
  let fixture: ComponentFixture<RestablecerPage>;
  let authService: AuthService;

  beforeEach(() => {
    const authServiceMock = {
      resetPassword: jasmine.createSpy('resetPassword').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      declarations: [RestablecerPage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(RestablecerPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if email is empty', async () => {
    component.email = '';
    await component.onSubmit();
    expect(authService.resetPassword).not.toHaveBeenCalled();
  });

  it('should call resetPassword if email is valid', async () => {
    component.email = 'test@example.com';
    await component.onSubmit();
    expect(authService.resetPassword).toHaveBeenCalledWith('test@example.com');
  });
});
