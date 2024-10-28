import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Adopcion } from 'src/app/models/Adopcion';
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

      const detailLink = `https://tusitio.com/detalle?id=${this.pet.id}`; // Cambia 'tusitio.com' por tu dominio real.

      const shareContent = `
        Detalles de la Mascota en Adopción:
        Tipo de Mascota: ${this.pet.tipoMascota}
        Edad: ${this.pet.edad}
        Raza: ${this.pet.raza}
        Color: ${this.pet.color}
        Vacunas: ${vacunasText}
        Esterilizado: ${esterilizadoText}
        Tamaño: ${this.pet.tamano}
        Descripción: ${this.pet.descripcion}
        Para más detalles, visita: ${detailLink}
        Imagen: ${this.pet.url}
      `.trim();

      await Share.share({
        title: 'Detalles de la Mascota en Adopción',
        text: shareContent,
        url: this.pet.url, // Asegúrate de que esta URL es válida
        dialogTitle: 'Compartir Detalles',
      });
    } else {
      console.error('No se pudo compartir, los detalles de la mascota no están disponibles.');
    }
  }

}
