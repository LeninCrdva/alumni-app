import { SafeResourceUrl } from "@angular/platform-browser";
import { Ciudad } from "../ciudad";
import { sectorempresarial } from "../sectorEmpresarial";

export class EmpresaDTO {
    id?: number;
    'empresario': string;
    'ciudad': Ciudad;
    'sectorEmpresarial': sectorempresarial;
    'ruc': string;
    'nombre': string;
    'tipoEmpresa': string;
    'razonSocial': string;
    'area': string;
    'sitioWeb': string;
    'ubicacion': string;
    'estado': boolean;
    'rutaPdfRuc'?: string;
    'urlPdfRuc'?: string;
}