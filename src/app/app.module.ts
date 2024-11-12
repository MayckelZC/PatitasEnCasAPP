// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat'; // Usa compat para mayor facilidad
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Importa autenticación
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Importa Firestore
import { environment } from '../environments/environment'; // Archivo de configuración del entorno

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, // Añade ReactiveFormsModule aquí
    AngularFireModule.initializeApp(environment.firebaseConfig), // Inicializa Firebase
    AngularFireAuthModule, // Proporciona el módulo de autenticación
    AngularFirestoreModule, // Proporciona el módulo de Firestore
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
