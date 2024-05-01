import { Carrera } from "./carrera";

export class Periodo {
    id?: number;
    'nombre': string;
    'estado': boolean;
    'fechaInicio': Date;
    'fechaFin': Date;
    'carreras': Carrera[];
}
