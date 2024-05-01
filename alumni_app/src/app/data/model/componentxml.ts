export class componentxml {
  id?: number;
  tipo: string;
  xml_file: string;
  foto_portada: Uint8Array | undefined;

  constructor(id?: number, tipo: string = '', xml_file: string = '') {
    this.id = id;
    this.tipo = tipo;
    this.xml_file = xml_file;
  }
}