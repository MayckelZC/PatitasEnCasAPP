import { Component, AfterViewInit } from '@angular/core';
import { AnimationController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Adopcion } from 'src/app/models/Adopcion';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  readonly dogImages: string[] = [
    'assets/imgs/pixelart-bird.gif',
    'assets/imgs/pixelart-cat.png',
    'assets/imgs/pixelart-dog.png',
  ];

  selectedFilter: string = 'all';
  allAdopciones: Adopcion[] = [];
  filteredAdopciones: Adopcion[] = [];
  nombreUsuario: string = '';
  searchTerm: string = ''; // Agrega esta línea para la búsqueda

  constructor(
    private animationCtrl: AnimationController,
    private router: Router,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  async ngAfterViewInit() {
    this.createDogAnimation();

    // Obtener el usuario actual
    const currentUser = await this.authService.getCurrentUser();
    this.nombreUsuario = currentUser ? currentUser.nombreUsuario : 'Invitado'; // Usa nombreUsuario directamente

    // Cargar adopciones desde Firestore
    await this.loadAdopciones();
  }

  async loadAdopciones() {
    const snapshot = await this.firestore.collection<Adopcion>('mascotas').get().toPromise();
    this.allAdopciones = snapshot.docs.map(doc => {
      const data = doc.data() as Adopcion;
      return { id: doc.id, ...data }; // Asegúrate de agregar el ID aquí
    });
    this.filteredAdopciones = [...this.allAdopciones]; // Inicializa la lista filtrada
  }

  createDogAnimation() {
    const dogElement = document.querySelector('.animated-dog') as HTMLImageElement;

    if (dogElement) {
      const randomImage = this.dogImages[Math.floor(Math.random() * this.dogImages.length)];
      dogElement.src = randomImage;

      dogElement.onerror = () => {
        console.error('No se pudo cargar la imagen:', randomImage);
        dogElement.src = 'assets/imgs/default-dog.png'; // Imagen por defecto en caso de error
      };

      const dogAnimation = this.animationCtrl.create()
        .addElement(dogElement)
        .duration(1500)
        .iterations(Infinity)
        .keyframes([
          { offset: 0, transform: 'translateX(0px)' },
          { offset: 0.5, transform: 'translateX(20px)' },
          { offset: 1, transform: 'translateX(0px)' },
        ]);

      dogAnimation.play();
    } else {
      console.error('El elemento .animated-dog no se encontró en el DOM');
    }
  }

  filterPets() {
    const term = this.searchTerm.toLowerCase();
    this.filteredAdopciones = this.allAdopciones.filter(adopcion => 
      adopcion.nombre.toLowerCase().includes(term)
    );

    // Filtrado por tipo de mascota
    if (this.selectedFilter !== 'all') {
      this.filteredAdopciones = this.filteredAdopciones.filter(adopcion => 
        adopcion.tipoMascota === this.selectedFilter
      );
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.authService.logout(); // Llama al método de cierre de sesión del AuthService
            localStorage.removeItem('userId'); // Elimina el ID del usuario de localStorage
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  viewDetails(adopcion: Adopcion) {
    this.router.navigate(['/detalle'], {
      queryParams: { 
        id: adopcion.id, // Ahora pasamos el ID
        tipoMascota: adopcion.tipoMascota,
        tamano: adopcion.tamano,
        nombre: adopcion.nombre,
        edad: adopcion.edad,
        sexo: adopcion.sexo,
        raza: adopcion.raza,
        color: adopcion.color,
        descripcion: adopcion.descripcion,
        esterilizado: adopcion.esterilizado,
        vacuna: adopcion.vacuna,
        url: adopcion.url // Agregamos la URL de la imagen
      }
    });
  }

  createAdoption() {
    this.router.navigate(['/crearadopcion']);
  }

  readQR() {
    this.router.navigate(['/read-qr']);
  }
}
