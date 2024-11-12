import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  cuentaForm!: FormGroup;
  validationProgress = 0;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.cuentaForm = this.formBuilder.group({
      nombreCompleto: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContraseña: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }
  

  onClear() {
    this.cuentaForm.reset();
    this.validationProgress = 0; // Resetear el progreso
  }

  async onSubmit() {
    if (this.cuentaForm.valid) {
      const {
        nombreCompleto,
        nombreUsuario,
        correo,
        contraseña,
        telefono,
        direccion
      } = this.cuentaForm.value;
  
      try {
        // Llamada al servicio con los 6 argumentos esperados
        await this.authService.register(
          nombreCompleto,
          nombreUsuario,
          correo,
          contraseña,
          telefono,
          direccion
        );
  
        localStorage.setItem('username', nombreUsuario);
  
        const toast = await this.toastController.create({
          message: 'Cuenta creada con éxito.',
          duration: 3000,
          position: 'top',
        });
        toast.present();
  
        this.router.navigate(['/home']);
      } catch (error) {
        let errorMessage = 'Error al crear la cuenta. Por favor, intenta de nuevo.';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'El correo electrónico ya está en uso.';
        }
        const alert = await this.alertController.create({
          header: 'Error',
          message: errorMessage,
          buttons: ['OK'],
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  

  passwordValidator(control: AbstractControl) {
    const value = control.value;
    if (value && !/[a-zA-Z]/.test(value)) {
      return { noLetter: true };
    }
    return null;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('contraseña')?.value;
    const confirmPassword = formGroup.get('confirmarContraseña')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  updateValidationProgress() {
    const totalFields = 4; // Número total de campos
    let validFields = 0;

    if (this.cuentaForm.get('nombreUsuario')?.valid) validFields++;
    if (this.cuentaForm.get('correo')?.valid) validFields++;
    if (this.cuentaForm.get('contraseña')?.valid) validFields++;
    if (this.cuentaForm.get('confirmarContraseña')?.valid) validFields++;

    this.validationProgress = validFields / totalFields; // Actualiza el progreso
  }
}
