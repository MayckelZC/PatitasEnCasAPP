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
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {
    this.registroForm = this.fb.group(
      {
        nombreUsuario: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        contraseña: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContraseña: ['', Validators.required],
        nombreCompleto: ['', Validators.required],
        telefono: [''],
        direccion: [''],
        aceptarTerminos: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Método para manejar el envío del formulario
  async onSubmit() {
    if (this.registroForm.valid) {
      const { nombreUsuario, correo, contraseña, nombreCompleto, telefono, direccion } = this.registroForm.value;
      this.loading = true;

      try {
        await this.authService.register(
          nombreUsuario,
          correo,
          contraseña,
          nombreCompleto,
          telefono,
          direccion
        );
        this.showToast('Cuenta creada con éxito.');
        this.navCtrl.navigateRoot('/home');
      } catch (error: any) {
        console.error('Error al crear la cuenta:', error);
        this.showToast('Hubo un error al crear la cuenta.');
      } finally {
        this.loading = false;
      }
    } else {
      this.showToast('Por favor, completa todos los campos obligatorios.');
    }
  }

  // Método para limpiar el formulario
  limpiarFormulario() {
    this.registroForm.reset();
    this.showToast('Formulario limpiado.');
  }

  // Validación personalizada para asegurar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contraseña')?.value;
    const confirmPassword = form.get('confirmarContraseña')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Método para mostrar un mensaje Toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  // Método para verificar si un campo tiene errores
  isFieldInvalid(field: string): boolean {
    const control = this.registroForm.get(field);
    return control && control.invalid && control.touched;
  }
}
