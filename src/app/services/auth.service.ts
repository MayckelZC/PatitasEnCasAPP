// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/user';
import { SessionService } from './session.service';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private sessionService: SessionService
  ) {}

  // Método para registrar un nuevo usuario con campos adicionales
  async register(
    nombreUsuario: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      console.log('Iniciando registro para:', nombreUsuario, email);

      // Verificar si el nombre de usuario ya existe
      const nombreUsuarioSnapshot = await firstValueFrom(
        this.firestore
          .collection<User>('users', ref => ref.where('nombreUsuario', '==', nombreUsuario))
          .valueChanges()
      );

      if (nombreUsuarioSnapshot.length > 0) {
        throw new Error('El nombre de usuario ya está en uso. Por favor, elige otro.');
      }

      // Crear el usuario en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      if (!uid) throw new Error('No se pudo obtener el UID del usuario');

      // Guardar la información adicional en Firestore
      await this.firestore.collection('users').doc(uid).set({
        nombreUsuario,
        email,
        uid,
      });

      console.log('Datos del usuario guardados en Firestore correctamente.');
    } catch (error: any) {
      console.error('Error al crear la cuenta:', error.message);
      // Mapear códigos de error a mensajes amigables
      let message = 'No se pudo completar el registro.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'El correo electrónico ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Correo electrónico inválido.';
      } else if (error.code === 'auth/weak-password') {
        message = 'La contraseña es demasiado débil.';
      } else if (error.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  }

  // Método para iniciar sesión
  async login(identifier: string, password: string, keepSession: boolean): Promise<any> {
    try {
      let email: string;

      // Verificar si el identificador es un correo electrónico válido
      if (this.validateEmail(identifier)) {
        email = identifier;
      } else {
        // Buscar el correo electrónico asociado al nombre de usuario
        const userSnapshot = await firstValueFrom(
          this.firestore
            .collection<User>('users', ref => ref.where('nombreUsuario', '==', identifier))
            .valueChanges()
        );

        if (userSnapshot.length === 0) {
          throw new Error('Usuario no encontrado.');
        }

        email = userSnapshot[0].email;
      }

      // Iniciar sesión con el correo electrónico y la contraseña
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);

      // Guardar la sesión
      this.sessionService.saveSession(userCredential.user?.uid, keepSession);
      return userCredential;
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      // Mapear códigos de error a mensajes amigables
      let message = 'No se pudo iniciar sesión.';
      if (error.code === 'auth/user-not-found') {
        message = 'Usuario no encontrado.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Contraseña incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Correo electrónico inválido.';
      }
      throw new Error(message);
    }
  }

  // Método para obtener el usuario actual
  async getCurrentUser(): Promise<User | null> {
    const user = await this.afAuth.currentUser;
    if (user) {
      try {
        const userDoc = await firstValueFrom(this.firestore.collection<User>('users').doc(user.uid).valueChanges());
        return userDoc || null;
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        return null;
      }
    }
    return null;
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => !!user));
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.sessionService.clearSession();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw new Error('No se pudo cerrar sesión.');
    }
  }

  // Método para restablecer contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Correo de restablecimiento enviado');
    } catch (error: any) {
      console.error('Error al enviar correo de restablecimiento:', error);
      // Mapear códigos de error a mensajes amigables
      let message = 'No se pudo enviar el correo de restablecimiento.';
      if (error.code === 'auth/user-not-found') {
        message = 'Usuario no encontrado.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Correo electrónico inválido.';
      }
      throw new Error(message);
    }
  }

  // Función para validar si una cadena es un correo electrónico válido
  private validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(email.toLowerCase());
  }
}
