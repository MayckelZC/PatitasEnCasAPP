export interface Adopcion {
    id: string;
    tipoMascota: string;
    tamano: string;
    etapaVida: string; // Cachorro o Adulto
    edadMeses?: number; // Solo para cachorro
    edadAnios?: number; // Solo para adulto
    nombre?: string;
    sexo: string;
    raza: string;
    color: string;
    descripcion?: string;
    esterilizado?: boolean;
    vacuna?: boolean;
    microchip?: boolean;
    condicionesSalud?: string;
    urlImagen: string;
    userId: string; // ID del usuario que creó la adopción
}
  