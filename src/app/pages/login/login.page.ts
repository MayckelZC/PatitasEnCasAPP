import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //declarar un modelo para obtener los input del login
  login: any = {
    usuario: "",
    password: ""
  }
  //defino una variable para indicar el campo vacío
  field: string = "";
  constructor(public router: Router, public toastController: ToastController) { }

  ngOnInit() {
  }
  ingresar() {
    if (this.validateModel(this.login)) {
      const username = this.login.usuario;
      this.presentToast("bottom", `Bienvenid@, ${username}!`);
      //agrego creación de NavigationExtras para pasar parámetros a ota page
      let navigationExtras: NavigationExtras = {
        state: { login: this.login }
      };
      this.router.navigate(['/home'], navigationExtras);
    } else {
      this.presentToast("bottom", "Debes ingresar tu " + this.field, 2000);
    }
  }
  /**
     * validateModel sirve para validar que se ingrese algo en los
     * campos del html mediante su modelo
     */
  validateModel(model: any) {
    //Recorro el modelo 'login' revisando las entradas del Object
    for (var [key, value] of Object.entries(model)) {
      //si un valor es "" retorno falso e indico el nombre del campo que falta
      if (value == "") {
        //rescato el nombre del campo vacío
        this.field = key;
        return false;
      }
    }
    return true;
  }
  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, duration?: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration ? duration : 2500,
      position: position,
    });

    await toast.present();
  }





}
