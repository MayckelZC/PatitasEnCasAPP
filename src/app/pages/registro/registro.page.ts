import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  registroForm!: FormGroup;
  passwordMismatch: boolean = false;
  progress: number = 0; // Valor del progreso (0 a 1)

  constructor(private fb: FormBuilder, private alertController: AlertController) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });

    // Escuchar cambios en los campos del formulario para actualizar el progreso
    this.registroForm.valueChanges.subscribe(() => this.updateProgress());
  }

  // Validador para comprobar si las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.registroForm.valid && !this.passwordMismatch) {
      const alert = await this.alertController.create({
        header: '¡Registro Exitoso!',
        message: 'Bienvenido a PatitasEnCasAPP',
        buttons: ['OK']
      });
      await alert.present();

      // Establecer el progreso al 100%
      this.progress = 1;

      console.log('Formulario enviado', this.registroForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  // Actualiza el progreso del formulario
  updateProgress() {
    const totalFields = 4; // Número total de campos (username, email, password, confirmPassword)
    let filledFields = 0;

    const controls = this.registroForm.controls;
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control.valid && (control.touched || control.dirty)) {
        filledFields++;
      }
    });

    this.progress = filledFields / totalFields;
  }
}
