import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service'; // Importa el servicio de autenticación

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
    private firestore: AngularFirestore, // Inyecta el servicio de Firestore
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {}

  ngOnInit() {
    this.adopcionForm = this.formBuilder.group({
      tipoMascota: ['', Validators.required],
      tamano: ['', Validators.required],
      nombre: ['', [Validators.pattern('^[A-Za-z]+$')]], // Solo letras, opcional
      edad: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]], // Solo números
      sexo: ['', Validators.required],
      raza: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]], // Solo letras y espacios
      color: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]], // Solo letras y espacios
      esterilizado: [false],
      vacuna: [false],
      descripcion: ['', [Validators.pattern('^[A-Za-z0-9 ]*$')]], // Acepta letras, números y espacios
      url: ['', [Validators.required, Validators.pattern('https?://.+')]], // URL de la imagen
    });
  }

  async onSubmit() {
    if (this.adopcionForm.valid) {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Deseas crear esta nueva adopción?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Creación de adopción cancelada');
            },
          },
          {
            text: 'Confirmar',
            handler: async () => {
              const formData = this.adopcionForm.value;

              // Obtener el usuario actual
              const currentUser = await this.authService.getCurrentUser();
              if (currentUser) {
                formData.userId = currentUser.uid; // Agregar userId

                // Guarda los datos en Firestore
                try {
                  await this.firestore.collection('mascotas').add(formData);
                  const toast = await this.toastController.create({
                    message: 'Adopción creada con éxito.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'toast-center',
                  });
                  toast.present();
                  this.adopcionForm.reset(); // Limpia el formulario
                } catch (error) {
                  console.error('Error guardando adopción:', error);
                  const toast = await this.toastController.create({
                    message: 'Error al guardar la adopción.',
                    duration: 2000,
                    position: 'top',
                  });
                  toast.present();
                }
              } else {
                const toast = await this.toastController.create({
                  message: 'No se pudo obtener el usuario actual.',
                  duration: 2000,
                  position: 'top',
                });
                toast.present();
              }
            },
          },
        ],
      });

      await alert.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos correctamente.',
        duration: 2000,
        position: 'top',
      });
      toast.present();
      console.log('Formulario inválido');
    }
  }

  onClear() {
    this.adopcionForm.reset(); // Limpia el formulario
  }
}
