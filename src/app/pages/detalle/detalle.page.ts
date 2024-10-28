import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Adopcion } from 'src/app/models/Adopcion'; // Asegúrate de que la ruta sea correcta
import { Share } from '@capacitor/share'; // Importa el plugin de Share

@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.page.html',
  styleUrls: ['detalle.page.scss'],
})
export class DetallePage implements OnInit {
  pet: Adopcion | null = null; // Cambiado a tipo Adopcion
  qrData: string = ''; // Datos del QR

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      // Obtén el ID de la adopción desde los parámetros
      const id = params['id']; // Asegúrate de que el ID se pase en los parámetros de consulta

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
    // Asigna los datos del QR a la variable qrData
    this.qrData = JSON.stringify(this.pet);
  }

  async shareAdopcion() {
    if (this.pet) {
      const vacunasText = this.pet.vacuna ? 'Al día' : 'Pendientes';
      const esterilizadoText = this.pet.esterilizado ? 'Sí' : 'No';
  
      // Enlace al detalle de la mascota
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
