import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from '../../services/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crearadopcion',
  templateUrl: './crearadopcion.page.html',
  styleUrls: ['./crearadopcion.page.scss'],
})
export class CrearadopcionPage implements OnInit {
  adopcionForm!: FormGroup;
  selectedImage: File | null = null;
  previewImage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.adopcionForm = this.formBuilder.group({
      tipoMascota: ['', Validators.required],
      tamano: ['', Validators.required],
      etapaVida: ['', Validators.required],
      edadMeses: ['', [Validators.min(0), Validators.max(12), Validators.pattern('^[0-9]+$')]],
      edadAnios: ['', [Validators.min(1), Validators.max(100), Validators.pattern('^[0-9]+$')]],
      nombre: ['', [Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$')]], // Se aceptan tildes y ñ
      sexo: ['', Validators.required],
      raza: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$')]], // Se aceptan tildes y ñ
      color: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$')]], // Se aceptan tildes y ñ
      esterilizado: [false],
      vacuna: [false],
      microchip: [false],
      descripcion: ['', [Validators.pattern('^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñÜü., ]*$')]], // Se aceptan tildes y caracteres básicos
      condicionesSalud: ['', [Validators.pattern('^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñÜü., ]*$')]], // Se aceptan tildes y caracteres básicos
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

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No se seleccionó ningún archivo.');
    }
  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      allowEditing: false,
    });

    if (image?.dataUrl) {
      this.previewImage = image.dataUrl;
      this.selectedImage = this.dataURLtoFile(image.dataUrl, 'captured_image.png');
    }
  }

  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedImage) return null;
    const filePath = `adopciones/${new Date().getTime()}_${this.selectedImage.name}`;
    const fileRef = this.storage.ref(filePath);
    await this.storage.upload(filePath, this.selectedImage);
    return fileRef.getDownloadURL().toPromise();
  }

  async onSubmit() {
    if (this.adopcionForm.valid) {
      const formData = this.adopcionForm.value;

      // Validación adicional para Edad Meses
      if (formData.etapaVida === 'cachorro') {
        if (formData.edadMeses > 12) {
          const toast = await this.toastController.create({
            message: 'La edad en meses no puede ser mayor a 12.',
            duration: 3000,
            color: 'danger',
            position: 'top',
          });
          toast.present();
          return;
        }
      }

      // Validación adicional para Edad Años
      if (formData.etapaVida === 'adulto') {
        if (formData.edadAnios < 1 || formData.edadAnios > 100) {
          const toast = await this.toastController.create({
            message: 'La edad en años debe estar entre 1 y 100.',
            duration: 3000,
            color: 'danger',
            position: 'top',
          });
          toast.present();
          return;
        }
      }

      const currentUser = await this.authService.getCurrentUser();

      if (currentUser) {
        formData.userId = currentUser.uid;
        const imageUrl = await this.uploadImage();
        formData.urlImagen = imageUrl;

        try {
          await this.firestore.collection('mascotas').add(formData);

          // Mostrar mensaje de éxito
          const toast = await this.toastController.create({
            message: 'Adopción creada con éxito.',
            duration: 3000,
            position: 'top',
          });
          toast.present();

          // Limpiar formulario
          this.adopcionForm.reset();
          this.previewImage = null;
          this.selectedImage = null;

          // Redirigir al home y refrescar
          this.router.navigate(['/home']).then(() => {
            location.reload();
          });
        } catch (error) {
          console.error('Error guardando adopción:', error);
          const toast = await this.toastController.create({
            message: 'Hubo un error al guardar la adopción. Por favor, intenta nuevamente.',
            duration: 3000,
            color: 'danger',
            position: 'top',
          });
          toast.present();
        }
      }
    } else {
      // Mostrar mensaje si el formulario no es válido
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos requeridos correctamente.',
        duration: 3000,
        color: 'warning',
        position: 'top',
      });
      toast.present();
    }
  }

  onClear() {
    this.adopcionForm.reset();
    this.previewImage = null;
    this.selectedImage = null;
  }

  onEdadMesesChange(event: any) {
    const value = event.detail.value;
    if (value !== null && value !== undefined) {
      const numericValue = Number(value);
      if (numericValue > 12) {
        this.adopcionForm.get('edadMeses')?.setValue(12);
      } else if (numericValue < 0) {
        this.adopcionForm.get('edadMeses')?.setValue(0);
      }
    }
  }

  onEdadAniosChange(event: any) {
    const value = event.detail.value;
    if (value !== null && value !== undefined) {
      const numericValue = Number(value);
      if (numericValue > 100) {
        this.adopcionForm.get('edadAnios')?.setValue(100);
      } else if (numericValue < 1) {
        this.adopcionForm.get('edadAnios')?.setValue(1);
      }
    }
  }
}
