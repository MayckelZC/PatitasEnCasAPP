import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  // Método para registrar un nuevo usuario con imagen, nombre completo, teléfono y dirección
  async uploadImageAndRegister(
    file: File,
    nombreCompleto: string,
    nombreUsuario: string,
    email: string,
    password: string,
    telefono: string,
    direccion: string
  ): Promise<void> {
    try {
      // Crea un nuevo usuario con email y contraseña
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      // Subir la imagen a Firebase Storage
      const filePath = `users/${uid}`;
      const fileRef = this.storage.ref(filePath);
      await this.storage.upload(filePath, file);
      const imageUrl = await fileRef.getDownloadURL().toPromise();

      // Guarda los datos del usuario en Firestore
      await this.firestore.collection('users').doc(uid).set({
        uid,
        nombreCompleto,
        nombreUsuario,
        email,
        telefono,
        direccion,
        imageUrl
      });
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  // Método para verificar si un nombre de usuario está disponible
  async isUsernameAvailable(username: string): Promise<boolean> {
    const users = await this.firestore
      .collection('users', ref => ref.where('nombreUsuario', '==', username))
      .get()
      .toPromise();

    return users?.empty ?? true; // Devuelve true si no hay coincidencias
  }

  // Método para verificar si un número de teléfono está disponible
  async isPhoneAvailable(phone: string): Promise<boolean> {
    const users = await this.firestore
      .collection('users', ref => ref.where('telefono', '==', phone))
      .get()
      .toPromise();

    return users?.empty ?? true; // Devuelve true si no hay coincidencias
  }

  // Método para iniciar sesión con nombre de usuario o correo electrónico
  async login(identifier: string, password: string, keepSession: boolean): Promise<any> {
    try {
      const userSnapshot = await this.firestore.collection('users', ref => ref.where('nombreUsuario', '==', identifier)).get().toPromise();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data() as User;
        const email = userData.email;

        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        
        if (keepSession) {
          localStorage.setItem('userId', userCredential.user?.uid || '');
        }
        return userCredential;
      } else {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(identifier, password);
        
        if (keepSession) {
          localStorage.setItem('userId', userCredential.user?.uid || '');
        }
        return userCredential;
      }
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
    localStorage.removeItem('userId');
  }

  // Método para obtener los datos del usuario por UID
  async getUserData(uid: string): Promise<User | null> {
    const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
    return userDoc.exists ? (userDoc.data() as User) : null;
  }

  // Método para obtener el usuario actualmente autenticado
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe(async user => {
        if (user) {
          try {
            const userData = await this.getUserData(user.uid);
            resolve(userData);
          } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            reject(error);
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  // Método para restablecer la contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      throw error;
    }
  }


  async isEmailAvailable(email: string): Promise<boolean> {
    const users = await this.firestore
      .collection('users', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise();
  
    return users?.empty ?? true; // Devuelve true si no hay coincidencias
  }
  
}
