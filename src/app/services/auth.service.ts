import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/user';
import { SessionService } from './session.service';
import { Observable } from 'rxjs';
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
    password: string,
    nombreCompleto: string,
    telefono: string,
    direccion: string
  ): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      if (!uid) throw new Error('No se pudo obtener el UID del usuario');

      // Guardar la información adicional en Firestore
      await this.firestore.collection('users').doc(uid).set({
        nombreUsuario,
        email,
        nombreCompleto,
        telefono,
        direccion,
        uid,
      });
      console.log('Datos del usuario guardados en Firestore correctamente.');
    } catch (error: any) {
      console.error('Error al crear la cuenta:', error.message);
      throw new Error(`No se pudo completar el registro. Error: ${error.message}`);
    }
  }

  // Método para iniciar sesión
  async login(identifier: string, password: string, keepSession: boolean): Promise<any> {
    try {
      const userSnapshot = await this.firestore
        .collection('users', ref => ref.where('nombreUsuario', '==', identifier))
        .get()
        .toPromise();

      let userCredential;
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const email = (userDoc.data() as User).email;
        userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      } else {
        userCredential = await this.afAuth.signInWithEmailAndPassword(identifier, password);
      }

      this.sessionService.saveSession(userCredential.user?.uid, keepSession);
      return userCredential;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('No se pudo iniciar sesión.');
    }
  }

  // Método para obtener el usuario actual
  async getCurrentUser(): Promise<User | null> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userDoc = await this.firestore.collection('users').doc(user.uid).get().toPromise();
      return userDoc?.exists ? (userDoc.data() as User) : null;
    }
    return null;
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => !!user));
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    await this.afAuth.signOut();
    this.sessionService.clearSession();
  }

  // Método para restablecer contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Correo de restablecimiento enviado');
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento:', error);
      throw new Error('No se pudo enviar el correo de restablecimiento.');
    }
  }
}
