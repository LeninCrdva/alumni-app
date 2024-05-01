import { Persona, Sexo } from "../persona";

export class RegisterDTO {
    'cedula': string;

    'primerNombre': string;

    'segundoNombre': string;

    'fechaNacimiento': Date;

    'telefono': string;

    'apellidoPaterno': string;

    'apellidoMaterno': string;

    'sexo': Sexo;

    // Atributos de Usuario
    'nombreUsuario': string;

    'clave': string;

    'rol': string;

    'estado': boolean;

    'rutaImagen': string;

    'urlImagen': string;
}

