export class Eventos {

    constructor(
        public id_prom: number,
        public titulo: string,
        public subTitulo: string,
        public resumen: string,
        public foto_portada: Uint8Array,
        public tipoxml: string,
        public colorFondo: string
    ) { }
}