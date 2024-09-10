import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crearadopcion',
  templateUrl: './crearadopcion.page.html',
  styleUrls: ['./crearadopcion.page.scss'],
})
export class CrearadopcionPage implements OnInit {
  adopcionForm!: FormGroup;
  imageUrl?: string;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController
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
    });
  }

  async onSubmit() {
    console.log('onSubmit called'); // Verifica si el método se está llamando
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
              console.log('Formulario enviado', this.adopcionForm.value);
              const toast = await this.toastController.create({
                message: 'Adopción creada con éxito.',
                duration: 3000,
                position: 'top',
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
    this.adopcionForm.reset();
    this.imageUrl = undefined;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Tipo de archivo no válido o archivo demasiado grande');
      }
    }
  }
}
