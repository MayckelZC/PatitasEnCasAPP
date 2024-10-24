import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Adopcion } from 'src/app/models/Adopcion'; // Asegúrate de que la ruta sea correcta

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
}
