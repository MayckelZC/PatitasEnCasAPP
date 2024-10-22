import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { UserCredential } from 'firebase/auth'; // Importar UserCredential correctamente
import firebase from 'firebase/compat/app'; // Usar compat para evitar problemas de tipo

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  // Propiedad para obtener el estado de autenticación del usuario
  get user(): Observable<any> {
    return this.afAuth.authState; // Devuelve el estado de autenticación del usuario
  }

  async login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string): Promise<UserCredential> {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    await this.firestore.collection('users').doc(userCredential.user.uid).set({
      email: email,
    });
    return userCredential; // Esto ahora debería funcionar correctamente
  }

  async logout() {
    return this.afAuth.signOut();
  }

  async getUserByEmail(email: string): Promise<boolean> {
    const users = await this.firestore.collection('users', ref => ref.where('email', '==', email)).get().toPromise();
    return !users.empty; // Devuelve true si el correo ya está registrado
  }
}
