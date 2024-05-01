import { Persona } from "./persona";
import { Usuario } from "./usuario";

export class Administrador {
    id?: number;
    'cargo': string;
    'estado': boolean= true;
    'email': string;
    'usuario':string;

}

export class Administrador2 {
    id?: number;
    'cargo': string;
    'estado': boolean;
    'email': string;
    'usuario': Usuario;
}

export class Administrador3 {
    id?: number;
    'cargo': string;
    'estado': boolean;
    'email': string;
    'usuario': string;
}

export class AdministradorFullData {
    id?: number;
    'cargo': string;
    'estado': boolean;
    'email': string;
    'usuario': string;
    'persona': Persona;
}