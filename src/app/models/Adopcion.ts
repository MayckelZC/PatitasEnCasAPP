export interface Adopcion {
<<<<<<< HEAD
    id: string;                  // ID único del documento en Firestore
    userId: string;              // ID del usuario que creó la adopción
    tipoMascota: string;         // Perro, Gato, Otro
    tamano: string;              // Pequeño, Mediano, Grande
    nombre?: string;             // Nombre de la mascota (opcional)
    edad: string;                // Edad en años o meses
    sexo: string;                // Macho o Hembra
    raza: string;                // Raza de la mascota
    color: string;               // Color de la mascota
    descripcion?: string;        // Descripción adicional (opcional)
    esterilizado?: boolean;      // Si está esterilizado (booleano)
    vacuna?: boolean;            // Si tiene vacunas (booleano)
    url: string;                 // URL de la imagen subida
    fechaCreacion: any;          // Fecha de creación, se usará Timestamp de Firestore
  }
=======
    id: string;
    tipoMascota: string;   
    tamano: string;        
    nombre?: string;       
    edad: string;         
    sexo: string;          
    raza: string;          
    color: string;         
    descripcion?: string;  
    esterilizado?: string; 
    vacuna?: string;      
    url: string;          
}
>>>>>>> parent of 51eb55f (commit-)
  