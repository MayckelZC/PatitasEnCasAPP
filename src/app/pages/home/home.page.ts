import { Component, AfterViewInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importar desde @angular/router

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  dogImages: string[] = [
    'assets/imgs/pixelart-bird.gif',
    'assets/imgs/pixelart-cat.png',
    'assets/imgs/pixelart-dog.png',
  ];

  selectedFilter: string = 'all'; // Valor inicial del filtro
  allPets = [
    { name: 'Rex', type: 'dog', age: 3, description: 'Rex es un perro amigable y enérgico que busca un hogar amoroso. ¡Adóptalo y dale una segunda oportunidad!', image: 'https://th.bing.com/th/id/R.6b2026c15d2cc7b6c6453118b8758eb8?rik=p5hZWemaKDXfVg&riu=http%3a%2f%2fwww.razasdeperros.com%2fwp-content%2fuploads%2f2013%2f10%2fDepositphotos_8405161_m.jpg&ehk=076xT4EInAZGdk61vPke7foOGNpYlmbQT2JXi%2fSiMIw%3d&risl=&pid=ImgRaw&r=0' },
    { name: 'Misty', type: 'cat', age: 2, description: 'Misty es una gata tranquila y cariñosa que adora las siestas al sol. ¡Dale la oportunidad de ser parte de tu familia!', image: 'https://th.bing.com/th/id/OIP.B-GtznvQ82H9zcQO7FQs2QHaE8?rs=1&pid=ImgDetMain' },
    { name: 'Polly', type: 'other', age: 1, description: 'Polly es una cotorra juguetona y habladora. ¡Haz que su alegría sea parte de tu hogar!', image: 'https://th.bing.com/th/id/OIP.blLe3ZV9JfNWshN5ikwsbQHaEK?rs=1&pid=ImgDetMain' }
  ];
  filteredPets = [...this.allPets];

  constructor(private animationCtrl: AnimationController, private router: Router) {}

  ngAfterViewInit() {
    this.createDogAnimation();
  }

  createDogAnimation() {
    const dogElement = document.querySelector('.animated-dog') as HTMLImageElement;

    if (dogElement) {
      // Selecciona una imagen aleatoria
      const randomImage = this.dogImages[Math.floor(Math.random() * this.dogImages.length)];
      dogElement.src = randomImage;

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
    if (this.selectedFilter === 'all') {
      this.filteredPets = [...this.allPets];
    } else {
      this.filteredPets = this.allPets.filter(pet => pet.type === this.selectedFilter);
    }
  }

  logout() {
    // Lógica para cerrar sesión
    this.router.navigate(['/login']);
  }
}
