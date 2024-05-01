import { EstadoPostulacion } from "./enum/enums";
import { Graduado } from "./graduado";
import { ofertaLaboral } from "./ofertaLaboral";

export class Postulacion {
    id?: number;
    graduado?: Graduado;
    ofertaLaboral?: ofertaLaboral;
    estado?: String;
    fechaPostulacion?: Date;
    fechaActualizacion?: Date;
    fechaCancelacion?: Date;
}