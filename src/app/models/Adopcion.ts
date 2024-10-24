// models/adopcion.ts
export interface Adopcion {
    id: string;
    tipoMascota: string;   // Tipo de mascota: perro, gato, u otro
    tamano: string;        // Tamaño de la mascota: pequeño, mediano, grande
    nombre?: string;       // Nombre de la mascota (opcional)
    edad: string;         // Edad de la mascota
    sexo: string;          // Sexo de la mascota: macho o hembra
    raza: string;          // Raza de la mascota
    color: string;         // Color de la mascota
    descripcion?: string;  // Descripción de la mascota (opcional)
    esterilizado?: string; // Indica si la mascota está esterilizada
    vacuna?: string;      // Indica si la mascota está vacunada
    url: string;          // URL de la imagen de la mascota
}
  