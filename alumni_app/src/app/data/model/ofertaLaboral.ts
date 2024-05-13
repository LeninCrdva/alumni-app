import { Empresa } from "./empresa";

export class ofertaLaboral {
    id?: number;
    'salario': number;
    'fechaCierre': Date;
    'fechaPublicacion': Date;
    'cargo': string;
    'experiencia': string;
    'fechaApertura': Date;
    'areaConocimiento': string;    
    'estado': string;
    'empresa': Empresa;
    'tipo': string;
    'fotoPortada': string;
    'tiempo'?: string;
    'sitioweb': string;
}