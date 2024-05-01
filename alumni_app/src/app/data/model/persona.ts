export class Persona {
    id?: number;
    'cedula': string;
    'primerNombre': string;
    'segundoNombre': string;
    'fechaNacimiento': Date;
    'telefono': string;
    'apellidoPaterno': string;
    'apellidoMaterno': string;
    'sexo'?: Sexo;
}
export enum Sexo {
    MASCULINO = 'MASCULINO',
    FEMENINO = 'FEMENINO',
    OTRO = 'OTRO'
  }