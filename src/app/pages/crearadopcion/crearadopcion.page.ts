import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Adopcion } from '../../models/Adopcion';

@Component({
  selector: 'app-crearadopcion',
  templateUrl: './crearadopcion.page.html',
  styleUrls: ['./crearadopcion.page.scss'],
})
export class CrearadopcionPage implements OnInit {
  adopcionForm!: FormGroup;
  selectedImage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.adopcionForm = this.formBuilder.group({
      tipoMascota: ['', Validators.required],
      tamano: ['', Validators.required],
      nombre: [''],
      edad: ['', Validators.required],
      sexo: ['', Validators.required],
      raza: [''],
      color: ['', Validators.required],
      descripcion: [''],
      esterilizado: [false],
      vacuna: [false],
      url: ['', Validators.required]
    });
  }

  async seleccionarImagen() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    if (image && image.base64String) {
      this.selectedImage = `data:image/jpeg;base64,${image.base64String}`;
      await this.subirImagenAFirebase(this.selectedImage);
    }
  }

  async subirImagenAFirebase(base64Image: string) {
    const timestamp = new Date().getTime();
    const filePath = `mascotas/${timestamp}.jpeg`;
    const fileRef = this.storage.ref(filePath);

    try {
      await fileRef.putString(base64Image, 'data_url');
      const downloadURL = await fileRef.getDownloadURL().toPromise();
      this.adopcionForm.controls['url'].setValue(downloadURL);
      this.presentToast('Imagen subida exitosamente.');
    } catch (error) {
      console.error(error);
      this.presentToast('Error al subir la imagen.');
    }
  }

  async onSubmit() {
    if (this.adopcionForm.valid) {
      const formData: Adopcion = {
        ...this.adopcionForm.value,
        fechaCreacion: new Date(),
        userId: (await this.authService.getCurrentUser())?.uid || ''
      };
      await this.firestore.collection('mascotas').add(formData);
      this.presentToast('Adopción creada con éxito.');
      this.adopcionForm.reset();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}
