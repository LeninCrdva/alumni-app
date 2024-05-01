import { Persona } from "./persona";
import { Rol } from "./rol";

export class Usuario {
    id?: number;
    'clave': string;
    'nombreUsuario': string;
    'estado': boolean;
    'urlImagen': string;
    'persona': Persona;
    'rutaImagen': string;
    'rol': Rol;
}

export class UsuarioFixed { 
    id?: number;
    'clave': string;
    'nombreUsuario': string;
    'estado': boolean;
    'urlImagen': string;
    'persona': Persona;
    'rutaImagen': string;
    'rol': Rol;
}