import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
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

  // Método de salida para "Conocer Más"
  @Input() onDetails!: () => void;
}
