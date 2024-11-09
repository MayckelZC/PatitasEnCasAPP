import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {
    // Inicializar el formulario con validaciones
    this.registroForm = this.fb.group(
      {
        nombreUsuario: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        contraseña: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContraseña: ['', Validators.required],
        nombreCompleto: ['', Validators.required],
        telefono: [''],
        direccion: [''],
        preferenciaMascota: [''],
        tamanoPreferido: [''],
        aceptarTerminos: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Validación personalizada para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contraseña')?.value;
    const confirmPassword = form.get('confirmarContraseña')?.value;
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  // Método para manejar el envío del formulario
  async onSubmit() {
    if (this.registroForm.valid) {
      try {
        const { nombreUsuario, correo, contraseña } = this.registroForm.value;
        await this.authService.register(nombreUsuario, correo, contraseña);
        this.showToast('Cuenta creada con éxito.');
        this.navCtrl.navigateRoot('/home');
      } catch (error) {
        this.showToast(this.getErrorMessage(error));
      }
    } else {
      this.showToast('Por favor, completa todos los campos obligatorios.');
    }
  }

  // Método para verificar si un campo tiene errores
  isFieldInvalid(field: string): boolean {
    const control = this.registroForm.get(field);
    return control && control.invalid && control.touched;
  }

  // Método para mostrar mensajes de error
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }

  // Manejar mensajes de error para el registro
  private getErrorMessage(error: any): string {
    if (error.code === 'auth/email-already-in-use') {
      return 'Este correo ya está registrado.';
    } else if (error.code === 'auth/weak-password') {
      return 'La contraseña es muy débil.';
    } else {
      return 'Hubo un error al crear la cuenta. Inténtalo de nuevo.';
    }
  }
}
