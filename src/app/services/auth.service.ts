import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/user'; // Asegúrate de que esta ruta sea correcta
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  // Método para registrar un nuevo usuario
  async register(nombreUsuario: string, email: string, password: string): Promise<void> {
    try {
      // Crea un nuevo usuario con email y contraseña
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      
      // Guarda el nombre de usuario, el correo y el uid en Firestore
      await this.firestore.collection('users').doc(userCredential.user?.uid).set({
        nombreUsuario,
        email,
        uid: userCredential.user?.uid // Guarda el uid
      });
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }

  // Método para iniciar sesión con nombre de usuario o correo electrónico
  async login(identifier: string, password: string): Promise<any> {
    try {
      // Busca el usuario en Firestore por nombre de usuario
      const userSnapshot = await this.firestore.collection('users', ref => ref.where('nombreUsuario', '==', identifier)).get().toPromise();
      
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data() as User; // Asegúrate de que userData sea del tipo User
        const email = userData.email; // Obtiene el correo electrónico del documento

        // Intenta iniciar sesión con el correo electrónico
        return await this.afAuth.signInWithEmailAndPassword(email, password);
      } else {
        // Si no se encuentra el usuario por nombre, intenta con el correo
        return await this.afAuth.signInWithEmailAndPassword(identifier, password);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => !!user)); // Devuelve true si hay un usuario autenticado
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }

  // Método para obtener los datos del usuario actual
  async getUserData(uid: string): Promise<User | null> {
    const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
    return userDoc.exists ? (userDoc.data() as User) : null; // Retorna null si el documento no existe
  }

  // Método para obtener el usuario actual
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.getUserData(user.uid).then(userData => {
            resolve(userData);
          }).catch(error => {
            console.error('Error al obtener datos del usuario:', error);
            reject(error);
          });
        } else {
          resolve(null); // No hay usuario autenticado
        }
      });
    });
  }
  
  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }
  



}
