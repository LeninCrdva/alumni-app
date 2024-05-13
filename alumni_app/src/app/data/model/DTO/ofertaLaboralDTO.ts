export class ofertaLaboralDTO {
    id?: number;
    'salario': number;
    'fechaCierre': Date;
    'fechaPublicacion': Date;
    'cargo': string;
    'experiencia': string;
    'fechaApertura': Date;
    'areaConocimiento': string;    
    'estado': string;
    'nombreEmpresa': string;
    'tipo'?: string;
    'tiempo'?: string;
    'fotoPortada'?: string;
    'sitioweb': string;
    [key: string]: any;
}