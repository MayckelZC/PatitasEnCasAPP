import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Adopcion } from 'src/app/models/Adopcion';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {
  adopcionForm: FormGroup;
  adopcionId: string;

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router // Agrega el router para redirección
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.adopcionId = params['id']; // Obtener el ID desde queryParams
      this.adopcionForm = this.formBuilder.group({
        tipoMascota: [''],
        tamano: [''],
        nombre: [''],
        edad: [''],
        sexo: [''],
        raza: [''],
        color: [''],
        descripcion: [''],
        url: [''],
        esterilizado: [false],
        vacuna: [false],
      });
      this.loadAdopcion(); // Cargar datos después de obtener el ID
    });
  }

  loadAdopcion() {
    this.firestore.collection('mascotas').doc(this.adopcionId).valueChanges().subscribe((adopcion: Adopcion) => {
      if (adopcion) {
        this.adopcionForm.patchValue(adopcion);
      } else {
        console.error('No se encontró la adopción con el ID:', this.adopcionId);
      }
    }, error => {
      console.error('Error al cargar la adopción:', error);
    });
  }

  async onSubmit() {
    try {
      await this.firestore.collection('mascotas').doc(this.adopcionId).update(this.adopcionForm.value);
      console.log('Adopción actualizada con éxito');
      this.router.navigate(['/misadopciones']); // Redirige después de guardar
    } catch (error) {
      console.error('Error al actualizar la adopción:', error);
    }
  }

  onClear() {
    this.adopcionForm.reset();
  }
}
