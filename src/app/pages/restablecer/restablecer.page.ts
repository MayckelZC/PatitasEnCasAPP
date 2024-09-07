import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {
  resetPasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (this.resetPasswordForm.valid) {
      // Lógica para enviar el formulario y restablecer la contraseña
      const email = this.resetPasswordForm.get('email')?.value;

      // Mostrar alerta de éxito
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: `Se ha enviado un enlace de restablecimiento de contraseña al correo electrónico: ${email}.`,
        buttons: ['OK'],
      });

      await alert.present();

      // Redirigir al usuario a la página de inicio de sesión o a otra página
      this.router.navigate(['/login']);
    } else {
      console.log('Formulario inválido');
    }
  }
}
