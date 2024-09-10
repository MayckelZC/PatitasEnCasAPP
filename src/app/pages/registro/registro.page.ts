import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';

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
    private toastController: ToastController,
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
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Deseas crear tu cuenta?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Confirmar',
            handler: async () => {
              console.log('Formulario enviado', this.cuentaForm.value);
              const toast = await this.toastController.create({
                message: 'Cuenta creada con éxito.',
                duration: 3000,
                position: 'bottom',
                cssClass: 'toast-center',
              });
              toast.present();
            },
          },
        ],
      });

      await alert.present();
    } else {
      console.log('Formulario inválido');
    }
  }

  onClear() {
    this.cuentaForm.reset();
    this.validationProgress = 0; // Reset progress when clearing the form
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
}
