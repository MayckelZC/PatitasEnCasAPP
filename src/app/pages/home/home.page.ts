import { Component, AfterViewInit } from '@angular/core';
import { AnimationController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Interfaz Mascota
interface Pet {
  nombre: string;
  tipoMascota: string;
  edad: number;
  sexo: string;
  raza: string;
  color: string;
  esterilizado: boolean;
  vacuna: boolean;
  tamano: string;
  descripcion: string;
  image: string;
}

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
  readonly allPets: Pet[] = [
    {
      nombre: 'Rex',
      tipoMascota: 'perro',
      edad: 3,
      sexo: 'Macho',
      raza: 'Labrador',
      color: 'Marrón',
      esterilizado: true,
      vacuna: true,
      tamano: 'Grande',
      descripcion: 'Rex es un perro amigable y enérgico que busca un hogar amoroso. ¡Adóptalo y dale una segunda oportunidad!',
      image: 'https://th.bing.com/th/id/R.6b2026c15d2cc7b6c6453118b8758eb8?rik=p5hZWemaKDXfVg&riu=http%3a%2f%2fwww.razasdeperros.com%2fwp-content%2fuploads%2f2013%2f10%2fDepositphotos_8405161_m.jpg&ehk=076xT4EInAZGdk61vPke7foOGNpYlmbQT2JXi%2fSiMIw%3d&risl=&pid=ImgRaw&r=0'
    },
    {
      nombre: 'Misty',
      tipoMascota: 'gato',
      edad: 2,
      sexo: 'Hembra',
      raza: 'Siamesa',
      color: 'Gris',
      esterilizado: true,
      vacuna: true,
      tamano: 'Pequeña',
      descripcion: 'Misty es una gata tranquila y cariñosa que adora las siestas al sol. ¡Dale la oportunidad de ser parte de tu familia!',
      image: 'https://th.bing.com/th/id/OIP.B-GtznvQ82H9zcQO7FQs2QHaE8?rs=1&pid=ImgDetMain'
    },
    {
      nombre: 'Polly',
      tipoMascota: 'otro',
      edad: 1,
      sexo: 'Desconocido',
      raza: 'Cotorra',
      color: 'Verde',
      esterilizado: false,
      vacuna: false,
      tamano: 'Pequeña',
      descripcion: 'Polly es una cotorra juguetona y habladora. ¡Haz que su alegría sea parte de tu hogar!',
      image: 'https://th.bing.com/th/id/OIP.blLe3ZV9JfNWshN5ikwsbQHaEK?rs=1&pid=ImgDetMain'
    }
  ];
  filteredPets: Pet[] = [...this.allPets];
  nombreUsuario: string = ''; // Cambié username a nombreUsuario

  constructor(
    private animationCtrl: AnimationController,
    private router: Router,
    private alertCtrl: AlertController,
    private authService: AuthService // Inyecta AuthService
  ) {}

  async ngAfterViewInit() {
    this.createDogAnimation();
    const currentUser = await this.authService.getCurrentUser(); // Obtiene el usuario actual

    if (currentUser) {
      const user = await this.authService.getUserData(currentUser.uid); // Obtener datos del usuario
      this.nombreUsuario = user ? user.nombreUsuario : 'Invitado'; // Usa nombreUsuario
    } else {
      this.nombreUsuario = 'Invitado'; // Si no hay usuario, usa 'Invitado'
    }
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
    this.filteredPets = this.selectedFilter === 'all' 
      ? [...this.allPets] 
      : this.allPets.filter(pet => pet.tipoMascota === this.selectedFilter);
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

  viewDetails(pet: Pet) {
    this.router.navigate(['/detalle'], {
      queryParams: { 
        nombre: pet.nombre,
        tipoMascota: pet.tipoMascota,
        edad: pet.edad,
        sexo: pet.sexo,
        raza: pet.raza,
        color: pet.color,
        esterilizado: pet.esterilizado,
        vacuna: pet.vacuna,
        tamano: pet.tamano,
        descripcion: pet.descripcion,
        image: pet.image
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
