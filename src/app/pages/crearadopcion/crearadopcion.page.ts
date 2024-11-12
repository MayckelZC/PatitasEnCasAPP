import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-crearadopcion',
  templateUrl: './crearadopcion.page.html',
  styleUrls: ['./crearadopcion.page.scss'],
})
export class CrearadopcionPage implements OnInit {
  adopcionForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.adopcionForm = this.formBuilder.group({
      tipoMascota: ['', Validators.required],
      tamano: ['', Validators.required],
      etapaVida: ['', Validators.required],
      edadMeses: ['', [Validators.min(0), Validators.max(12), Validators.pattern('^[0-9]+$')]],
      edadAnios: ['', [Validators.min(1), Validators.max(100), Validators.pattern('^[0-9]+$')]],
      nombre: ['', [Validators.pattern('^[A-Za-z]+$')]],
      sexo: ['', Validators.required],
      raza: ['', [Validators.pattern('^[A-Za-z ]+$')]],
      color: ['', [Validators.pattern('^[A-Za-z ]+$')]],
      esterilizado: [false],
      vacuna: [false],
      microchip: [false],
      descripcion: ['', [Validators.pattern('^[A-Za-z0-9 ]*$')]],
      urlImagen: ['', [Validators.pattern('https?://.+')]]
    });

    this.adopcionForm.get('etapaVida')?.valueChanges.subscribe((etapa) => {
      this.actualizarValidacionesEdad(etapa);
    });
  }

  actualizarValidacionesEdad(etapa: string) {
    const edadMesesControl = this.adopcionForm.get('edadMeses');
    const edadAniosControl = this.adopcionForm.get('edadAnios');

    if (etapa === 'cachorro') {
      edadMesesControl?.setValidators([Validators.required, Validators.min(0), Validators.max(12), Validators.pattern('^[0-9]+$')]);
      edadAniosControl?.clearValidators();
      edadAniosControl?.reset();
    } else if (etapa === 'adulto') {
      edadAniosControl?.setValidators([Validators.required, Validators.min(1), Validators.max(100), Validators.pattern('^[0-9]+$')]);
      edadMesesControl?.clearValidators();
      edadMesesControl?.reset();
    }

    edadMesesControl?.updateValueAndValidity();
    edadAniosControl?.updateValueAndValidity();
  }

  validarEdadMeses(event: any) {
    const inputValue = event.target.value;
    if (inputValue > 12) {
      event.target.value = 12;
      this.adopcionForm.get('edadMeses')?.setValue(12);
    }
  }

  validarEdadAnios(event: any) {
    const inputValue = event.target.value;
    if (inputValue > 100) {
      event.target.value = 100;
      this.adopcionForm.get('edadAnios')?.setValue(100);
    }
  }

  async onSubmit() {
    if (this.adopcionForm.valid) {
      const formData = this.adopcionForm.value;
      const currentUser = await this.authService.getCurrentUser();

      if (currentUser) {
        formData.userId = currentUser.uid;

        try {
          await this.firestore.collection('mascotas').add(formData);
          const toast = await this.toastController.create({
            message: 'Adopción creada con éxito.',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.adopcionForm.reset();
        } catch (error) {
          console.error('Error guardando adopción:', error);
        }
      }
    }
  }

  onClear() {
    this.adopcionForm.reset();
  }
}
