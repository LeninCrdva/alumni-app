import { Ciudad } from "./ciudad";
import { Usuario } from "./usuario";

export class Graduado {
    id?: number;
    'usuario': Usuario;
    'ciudad': Ciudad;
    'anioGraduacion': Date;
    'emailPersonal': string;
    'estadoCivil': string;
    'rutaPdf': string;
    'urlPdf': string;
}

export class Graduado1 {
    id?: number;
    'usuario': Usuario;
    'ciudad': Ciudad;
    'anioGraduacion': Date;
    'emailPersonal': string;
    'estadoCivil': string;
    'rutaPdf': string;
    'urlPdf': string;
}

export class Graduado2 {
    id?: number;
    'nombre': string;
    'usuario': Usuario;
    'ciudad': Ciudad;
    'anioGraduacion': Date;
    'emailPersonal': string;
    'estadoCivil': string;
    'rutaPdf': string;
    'urlPdf': string;
}

export class Graduado3 {
    id?: number;
    'usuario': string;
    'ciudad': string;
    'anioGraduacion': Date;
    'emailPersonal': string;
    'estadoCivil': string;
    'rutaPdf': string;
    'urlPdf': string;
}
export class Graduado4 {
    'id': number = 0;
    'usuario': string;
    'ciudad': string;
    'anioGraduacion': Date;
    'emailPersonal': string;
    'estadoCivil': string;
    'rutaPdf': string;
    'urlPdf': string;
}