// src/app/pages/restablecer/restablecer.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage {
  restablecerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController
  ) {
    this.restablecerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (newPassword && confirmPassword) {
      return newPassword.value === confirmPassword.value ? null : { mismatch: true };
    }
    return null;
  }

  async onSubmit() {
    if (this.restablecerForm.valid) {
      const { email, newPassword } = this.restablecerForm.value;

      // Aquí iría el código para enviar la solicitud al servidor
      // Ejemplo: this.http.post(apiUrl, { email, newPassword }).toPromise();

      const alert = await this.alertController.create({
        header: 'Contraseña Cambiada',
        message: `La contraseña para ${email} ha sido cambiada exitosamente.`,
        buttons: ['OK'],
      });

      await alert.present();
    } else {
      // El formulario es inválido; los mensajes de error se muestran automáticamente
      return;
    }
  }
}
