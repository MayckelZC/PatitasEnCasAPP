import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  registroForm!: FormGroup;
  passwordMismatch: boolean = false;
  progress: number = 0; // Valor del progreso (0 a 1)

  constructor(private fb: FormBuilder, private alertController: AlertController) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator.bind(this) // Asegúrate de vincular el contexto
    });

    // Cargar datos desde el almacenamiento local si existen
    this.loadFromLocalStorage();

    // Escuchar cambios en los campos del formulario para actualizar el progreso
    this.registroForm.valueChanges.subscribe(() => this.updateProgress());
  }

  // Validador para comprobar si las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    // Actualizar el estado de passwordMismatch
    this.passwordMismatch = password.value !== confirmPassword.value;
    
    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.registroForm.valid) {
      if (this.passwordMismatch) {
        // No hacer nada adicional ya que passwordMismatch se maneja en la plantilla
        return;
      } else {
        const alert = await this.alertController.create({
          header: '¡Registro Exitoso!',
          message: 'Bienvenido a PatitasEnCasAPP',
          buttons: ['OK']
        });
        await alert.present();
        
        // Guardar datos en el almacenamiento local
        this.saveToLocalStorage();

        // Establecer el progreso al 100%
        this.progress = 1;

        console.log('Formulario enviado', this.registroForm.value);
      }
    } else {
      console.log('Formulario inválido');
    }
  }

  // Actualiza el progreso del formulario
  updateProgress() {
    const totalFields = 4; // Número total de campos (username, email, password, confirmPassword)
    let filledFields = 0;
    
    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      if (control?.valid && control?.touched) {
        filledFields++;
      }
    });
    
    this.progress = filledFields / totalFields;
  }

  // Guarda los datos del formulario en el almacenamiento local
  saveToLocalStorage() {
    const formData = this.registroForm.value;
    localStorage.setItem('registroFormData', JSON.stringify(formData));
  }

  // Carga los datos del formulario desde el almacenamiento local
  loadFromLocalStorage() {
    const storedData = localStorage.getItem('registroFormData');
    if (storedData) {
      this.registroForm.setValue(JSON.parse(storedData));
    }
  }
}
