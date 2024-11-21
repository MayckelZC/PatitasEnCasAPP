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

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      const id = params['id'];
      if (id) {
        await this.fetchPetDetails(id);
      }
    });
  }

  private async fetchPetDetails(id: string) {
    try {
      const petDoc = await this.firestore.collection<Adopcion>('mascotas').doc(id).get().toPromise();
      if (petDoc?.exists) {
        this.pet = petDoc.data() as Adopcion;
        await this.fetchUserDetails(this.pet.userId);
      } else {
        console.warn(`No se encontró la mascota con ID: ${id}`);
      }
    } catch (error) {
      console.error('Error al obtener los datos de la mascota:', error);
    }
  }

  private async fetchUserDetails(userId: string) {
    try {
      const userDoc = await this.firestore.collection<User>('users').doc(userId).get().toPromise();
      if (userDoc?.exists) {
        this.user = userDoc.data() as User;
      } else {
        console.warn(`No se encontró el usuario con ID: ${userId}`);
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }

  async shareDetails() {
    if (!this.pet) {
      console.error('No se pudo compartir, los detalles de la mascota no están disponibles.');
      return;
    }

    const shareContent = this.getShareContent();
    try {
      await Share.share({
        title: 'Detalles de la Mascota en Adopción',
        text: shareContent,
        url: this.pet.urlImagen,
        dialogTitle: 'Compartir Detalles',
      });
    } catch (error) {
      console.error('Error al intentar compartir detalles:', error);
    }
  }

  private getShareContent(): string {
    const { tipoMascota, etapaVida, edadMeses, edadAnios, raza, color, vacuna, esterilizado, microchip, tamano, condicionesSalud, descripcion, nombre } = this.pet!;
    const edadText = etapaVida === 'cachorro' ? `${edadMeses} meses` : `${edadAnios} años`;
    const vacunasText = vacuna ? 'Al día' : 'Pendientes';
    const esterilizadoText = esterilizado ? 'Sí' : 'No';
    const microchipText = microchip ? 'Sí' : 'No';

    return `
      Detalles de la Mascota en Adopción:
      - Tipo de Mascota: ${tipoMascota}
      - Edad: ${edadText}
      - Raza: ${raza}
      - Color: ${color}
      - Vacunas: ${vacunasText}
      - Esterilizado: ${esterilizadoText}
      - Microchip: ${microchipText}
      - Tamaño: ${tamano}
      - Condiciones de Salud: ${condicionesSalud || 'Ninguna'}
      - Descripción: ${descripcion || 'Sin descripción disponible'}
      Imagen: Esta es la foto de ${nombre || 'la mascota en adopción'}.
    `.trim();
  }

  async sendAdoptionEmail() {
    if (!this.pet || !this.user?.email) {
      console.error('No se pudo enviar el correo. Asegúrate de que los detalles del usuario y la mascota estén disponibles.');
      return;
    }

    const mailSubject = 'Adoptar';
    const mailBody = this.getMailBody();
    const mailToLink = `mailto:${this.user.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    try {
      window.location.href = mailToLink;
    } catch (error) {
      console.error('Error al intentar enviar el correo:', error);
    }
  }

  private getMailBody(): string {
    const { tipoMascota, etapaVida, edadMeses, edadAnios, raza, color, vacuna, esterilizado, microchip, tamano, condicionesSalud, descripcion, nombre } = this.pet!;
    const edadText = etapaVida === 'cachorro' ? `${edadMeses} meses` : `${edadAnios} años`;
    const vacunasText = vacuna ? 'Al día' : 'Pendientes';
    const esterilizadoText = esterilizado ? 'Sí' : 'No';
    const microchipText = microchip ? 'Sí' : 'No';

    return `
      Hola, estoy interesado/a en adoptar a tu mascota publicada en la plataforma.

      Detalles de la Mascota:
      - Nombre: ${nombre || 'Sin nombre'}
      - Tipo de Mascota: ${tipoMascota}
      - Edad: ${edadText}
      - Raza: ${raza}
      - Color: ${color}
      - Vacunas: ${vacunasText}
      - Esterilizado: ${esterilizadoText}
      - Microchip: ${microchipText}
      - Tamaño: ${tamano}
      - Condiciones de Salud: ${condicionesSalud || 'Ninguna'}
      - Descripción: ${descripcion || 'Sin descripción disponible'}

      Espero tu respuesta para continuar con el proceso de adopción.

      Saludos,
    `.trim();
  }
}
