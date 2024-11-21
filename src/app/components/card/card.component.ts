import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card', // Este selector debe coincidir
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() nombre!: string;
  @Input() tipoMascota!: string;
  @Input() etapaVida!: string;
  @Input() edadMeses?: number;
  @Input() edadAnios?: number;
  @Input() descripcion!: string;
  @Input() urlImagen!: string;
  @Input() onDetails!: () => void; // Asegúrate de que todos los Inputs estén aquí
}
