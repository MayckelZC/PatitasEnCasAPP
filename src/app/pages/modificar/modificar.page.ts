import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Adopcion } from 'src/app/models/Adopcion';
import { ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {
  adopcionForm!: FormGroup;
  adopcionId!: string;
  previewImage: string | null = null;
  selectedImage: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.adopcionId = params['id'];
      this.initForm();
      this.loadAdopcion();
    });
  }

  initForm() {
    this.adopcionForm = this.formBuilder.group({
      tipoMascota: ['', Validators.required],
      tamano: ['', Validators.required],
      etapaVida: [''],
      edadMeses: ['', [Validators.min(0), Validators.max(12), Validators.pattern('^[0-9]+$')]],
      edadAnios: ['', [Validators.min(1), Validators.max(100), Validators.pattern('^[0-9]+$')]],
      nombre: ['', [Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$')]], // Acepta tildes y ñ
      sexo: ['', Validators.required],
      raza: ['', [Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$')]], // Acepta tildes y ñ
      color: ['', [Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$')]], // Acepta tildes y ñ
      descripcion: ['', [Validators.pattern('^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñÜü., ]*$')]], // Acepta tildes, números y signos básicos
      condicionesSalud: ['', [Validators.pattern('^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñÜü., ]*$')]], // Se agrega "Condiciones de Salud"
      urlImagen: [''],
      esterilizado: [false],
      vacuna: [false],
      microchip: [false],
    });
  }

  loadAdopcion() {
    this.firestore
      .collection('mascotas')
      .doc(this.adopcionId)
      .valueChanges()
      .subscribe((adopcion: Adopcion | undefined) => {
        if (adopcion) {
          this.adopcionForm.patchValue(adopcion);
          this.previewImage = adopcion.urlImagen || null;
        }
      });
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

      // Si se seleccionó una nueva imagen, súbela y actualiza la URL
      if (this.selectedImage) {
        const imageUrl = await this.uploadImage();
        formData.urlImagen = imageUrl;
      }

      try {
        await this.firestore.collection('mascotas').doc(this.adopcionId).update(formData);

        // Mostrar mensaje de éxito al usuario
        const toast = await this.toastController.create({
          message: 'Adopción actualizada con éxito.',
          duration: 2000,
          position: 'top',
        });
        await toast.present();

        // Redirigir al usuario a la página de inicio
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al actualizar la adopción:', error);
      }
    }
  }

  onClear() {
    this.adopcionForm.reset();
    this.previewImage = null;
    this.selectedImage = null;
  }
}
