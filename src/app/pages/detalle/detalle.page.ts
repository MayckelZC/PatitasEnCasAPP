// src/app/pages/detalle/detalle.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Adopcion } from 'src/app/models/Adopcion';
import { User } from 'src/app/models/user';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.page.html',
  styleUrls: ['detalle.page.scss'],
})
export class DetallePage implements OnInit {
  pet: Adopcion | null = null; 
  user: User | null = null;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const id = params['id'];

      if (id) {
        try {
          // Obtener los datos de la mascota
          const petDoc = await this.firestore.collection<Adopcion>('mascotas').doc(id).get().toPromise();
          if (petDoc.exists) {
            this.pet = petDoc.data() as Adopcion;

            // Obtener los datos del usuario que creó la publicación usando 'userId'
            const userId = this.pet.userId;
            const userDoc = await this.firestore.collection<User>('users').doc(userId).get().toPromise();
            if (userDoc.exists) {
              this.user = userDoc.data() as User;
            } else {
              console.warn(`No se encontró el usuario con ID: ${userId}`);
            }
          } else {
            console.warn(`No se encontró la mascota con ID: ${id}`);
          }
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      }
    });
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
