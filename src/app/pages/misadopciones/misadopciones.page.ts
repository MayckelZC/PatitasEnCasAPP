import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service';
import { Adopcion } from 'src/app/models/Adopcion';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-misadopciones',
  templateUrl: './misadopciones.page.html',
  styleUrls: ['./misadopciones.page.scss'],
})
export class MisAdopcionesPage implements OnInit {
  misAdopciones: Adopcion[] = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser) {
      const snapshot = await this.firestore.collection<Adopcion>('mascotas', ref => ref.where('userId', '==', currentUser.uid)).get().toPromise();
      this.misAdopciones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Adopcion[];
    }
  }

  async deleteAdopcion(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar esta adopción?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.firestore.collection('mascotas').doc(id).delete().then(() => {
              console.log('Adopción eliminada con éxito');
              this.misAdopciones = this.misAdopciones.filter(adopcion => adopcion.id !== id);
            }).catch(error => {
              console.error('Error al eliminar la adopción:', error);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  editAdopcion(adopcion: Adopcion) {
    this.router.navigate(['/modificar'], { queryParams: { id: adopcion.id } }); // Cambia a la página de modificar con el ID
  }

}
