import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from '../../services/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
      descripcion: ['', [Validators.pattern('^[A-Za-z0-9 ]*$')]]
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

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
      console.log('Imagen seleccionada:', file.name);
    } else {
      console.error('No se seleccionó ningún archivo.');
    }
  }
  

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      allowEditing: false
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
      const currentUser = await this.authService.getCurrentUser();

      if (currentUser) {
        formData.userId = currentUser.uid;
        const imageUrl = await this.uploadImage();
        formData.urlImagen = imageUrl;

        try {
          await this.firestore.collection('mascotas').add(formData);
          const toast = await this.toastController.create({
            message: 'Adopción creada con éxito.',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.adopcionForm.reset();
          this.previewImage = null;
          this.selectedImage = null;
        } catch (error) {
          console.error('Error guardando adopción:', error);
        }
      }
    }
  }

  onClear() {
    this.adopcionForm.reset();
    this.previewImage = null;
    this.selectedImage = null;
  }
}
