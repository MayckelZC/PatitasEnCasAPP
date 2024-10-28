import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class HuachitosService {
  private apiUrl = 'https://huachitos.cl/api/animales'; // Cambia la URL a la API correcta

  constructor() {}

  async getAnimals() {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data.data; // Devuelve solo los datos que necesitamos
    } catch (error) {
      console.error('Error fetching animals:', error);
      throw error; // Propagar el error para manejarlo más adelante
    }
  }
}
