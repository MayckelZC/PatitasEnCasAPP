import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from './auth.service';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {}

  // Método para subir una imagen al storage y obtener su URL
  uploadImage(file: File): Observable<string> {
    const filePath = `user-images/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<string>((observer) => {
      task.snapshotChanges()
        .pipe(finalize(() => fileRef.getDownloadURL().subscribe(observer)))
        .subscribe();
    });
  }

  // Método para registrar un usuario con los datos y la URL de la imagen
  async registerUser(data: User & { password: string }, imageUrl: string): Promise<void> {
    const userData = {
      ...data,
      imageUrl, // Asegura que la URL de la imagen se incluya
    };

    // Llamar al método register del servicio AuthService
    await this.authService.register(userData);
  }
}
