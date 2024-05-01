export class Titulo {

    constructor(
        public id: number,
        public nombreTitulo: string,
        public tipo: string,
        public numRegistro: string,
        public fechaEmision: Date,
        public fechaRegistro: Date,
        public nivel: string,
        public institucion: string,
        public nombreCarrera: string,
        public cedula: string
    ) { }
}