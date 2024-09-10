import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.page.html',
  styleUrls: ['detalle.page.scss'],
})
export class DetallePage implements OnInit {
  pet: any = {}; 
  qrData: string = ''; // Datos del QR

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pet = {
        nombre: params['nombre'],
        tipoMascota: params['tipoMascota'],
        edad: Number(params['edad']),
        sexo: params['sexo'],
        raza: params['raza'],
        color: params['color'],
        esterilizado: params['esterilizado'] === 'true',
        vacuna: params['vacuna'] === 'true',
        tamano: params['tamano'],
        descripcion: params['descripcion'],
        image: params['image']
      };
    });
  }

  generateQRCode() {
    // Asigna los datos del QR a la variable qrData
    this.qrData = JSON.stringify(this.pet);
  }
}
