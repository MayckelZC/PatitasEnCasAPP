import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Adopcion } from 'src/app/models/Adopcion'; // Asegúrate de que la ruta sea correcta
import { Share } from '@capacitor/share'; 

@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.page.html',
  styleUrls: ['detalle.page.scss'],
})
export class DetallePage implements OnInit {
  pet: Adopcion | null = null; 
  qrData: string = ''; 

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      // Obtén el ID de la adopción desde los parámetros
      const id = params['id'];

      // Cargar los datos de Firestore
      if (id) {
        const petDoc = await this.firestore.collection<Adopcion>('mascotas').doc(id).get().toPromise();
        if (petDoc.exists) {
          this.pet = petDoc.data() as Adopcion; // Carga los datos en la propiedad pet
        }
      }
    });
  }

  generateQRCode() {
    this.qrData = JSON.stringify(this.pet);
  }

  async shareAdopcion() {
    if (this.pet) {
      const vacunasText = this.pet.vacuna ? 'Al día' : 'Pendientes';
      const esterilizadoText = this.pet.esterilizado ? 'Sí' : 'No';
      const microchipText = this.pet.microchip ? 'Sí' : 'No';

      const edadText = this.pet.etapaVida === 'cachorro'
        ? `${this.pet.edadMeses} meses`
        : `${this.pet.edadAnios} años`;

      const detailLink = `https://sitioenconstruccion.com/detalle?id=${this.pet.id}`; 

      const shareContent = `
        Detalles de la Mascota en Adopción:
        Tipo de Mascota: ${this.pet.tipoMascota}
        Edad: ${edadText}
        Raza: ${this.pet.raza}
        Color: ${this.pet.color}
        Vacunas: ${vacunasText}
        Esterilizado: ${esterilizadoText}
        Microchip: ${microchipText}
        Tamaño: ${this.pet.tamano}
        Condiciones de Salud: ${this.pet.condicionesSalud || 'Ninguna'}
        Descripción: ${this.pet.descripcion}
        Para más detalles, visita: ${detailLink}
      `.trim();

      await Share.share({
        title: 'Detalles de la Mascota en Adopción',
        text: shareContent,
        url: this.pet.urlImagen, 
        dialogTitle: 'Compartir Detalles',
      });
    } else {
      console.error('No se pudo compartir, los detalles de la mascota no están disponibles.');
    }
  }
}
