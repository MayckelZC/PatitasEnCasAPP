import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'; // Asegúrate de importar AbstractControl
import { AuthService } from '../../services/auth.service'; // Asegúrate de que el servicio de autenticación esté importado
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  cuentaForm: FormGroup; // Usamos FormGroup para el formulario
  validationProgress: number = 0; // Para la barra de progreso

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cuentaForm = this.formBuilder.group({
      nombreUsuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      confirmarContraseña: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });

    this.cuentaForm.valueChanges.subscribe(() => {
      this.updateValidationProgress();
    });
  }

  passwordValidator(control: AbstractControl) {
    const value = control.value;
    if (value && !/[a-zA-Z]/.test(value)) {
      return { noLetter: true };
    }
    return null;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const contraseña = formGroup.get('contraseña')?.value;
    const confirmarContraseña = formGroup.get('confirmarContraseña')?.value;
    return contraseña === confirmarContraseña ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.cuentaForm.valid) {
      const { correo, contraseña } = this.cuentaForm.value;

      // Comprobar si el correo ya está registrado
      const existingUser = await this.authService.getUserByEmail(correo);
      if (existingUser) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'El correo electrónico ya está registrado.',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }

      try {
        // Intentar registrar el nuevo usuario
        await this.authService.register(correo, contraseña);
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Cuenta creada con éxito.',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: error.message,
          buttons: ['OK'],
        });
        await alert.present();
      }
    } else {
      console.log('Formulario inválido');
    }
  }

  updateValidationProgress() {
    const totalFields = 4; // Número total de campos
    let validFields = 0;

    if (this.cuentaForm.get('nombreUsuario')?.valid) validFields++;
    if (this.cuentaForm.get('correo')?.valid) validFields++;
    if (this.cuentaForm.get('contraseña')?.valid) validFields++;
    if (this.cuentaForm.get('confirmarContraseña')?.valid) validFields++;

    this.validationProgress = validFields / totalFields;
  }

  onClear() {
    this.cuentaForm.reset();
    this.validationProgress = 0; // Resetear el progreso al limpiar
  }
}
