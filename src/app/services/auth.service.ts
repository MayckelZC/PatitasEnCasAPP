import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private sessionService: SessionService
  ) {}

  // Método para registrar un nuevo usuario
  async register(nombreUsuario: string, email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.firestore.collection('users').doc(userCredential.user?.uid).set({
        nombreUsuario,
        email,
        uid: userCredential.user?.uid
      });
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  // Método para iniciar sesión con persistencia utilizando `SessionService`
  async login(identifier: string, password: string, keepSession: boolean): Promise<any> {
    try {
      // Buscar el usuario por nombre de usuario en Firestore
      const userSnapshot = await this.firestore
        .collection('users', ref => ref.where('nombreUsuario', '==', identifier))
        .get()
        .toPromise();

      let userCredential;
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data() as User;
        const email = userData.email;

        // Iniciar sesión usando el correo electrónico obtenido
        userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      } else {
        // Si no se encuentra por nombre de usuario, intenta con el correo
        userCredential = await this.afAuth.signInWithEmailAndPassword(identifier, password);
      }

      // Guardar la sesión utilizando `SessionService`
      this.sessionService.saveSession(userCredential.user?.uid, keepSession);

      return userCredential;
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
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

  // Método para obtener los datos del usuario actual
  async getUserData(uid: string): Promise<User | null> {
    const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
    return userDoc.exists ? (userDoc.data() as User) : null;
  }

  // Método para obtener el usuario actual
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.getUserData(user.uid).then(userData => resolve(userData)).catch(reject);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Método para enviar un correo de restablecimiento de contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      throw error;
    }
  }
}
