import { OfertasLaboralesComponent } from "../../pages/company/ofertas-laborales/ofertas-laborales.component";
import { Graduado } from "./graduado";

export interface contratacion {
    id: number;
    ofertaLaboral: OfertasLaboralesComponent; // Asegúrate de tener una interfaz o clase para OfertasLaborales
    graduados: Graduado; // Asegúrate de tener una interfaz o clase para Graduado
  }