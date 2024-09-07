import { Component, AfterViewInit } from '@angular/core';
import { AnimationController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

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
  readonly allPets = [
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
  filteredPets = [...this.allPets];
  username: string = '';

  constructor(
    private animationCtrl: AnimationController,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngAfterViewInit() {
    this.createDogAnimation();
    this.username = localStorage.getItem('username') || 'Invitado';
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
            localStorage.removeItem('username');
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  createAdoption() {
    console.log('Crear adopción');
    this.router.navigate(['/crearadopcion']);
  }

  readQR() {
    console.log('Leer QR');
    this.router.navigate(['/read-qr']);
  }
}
