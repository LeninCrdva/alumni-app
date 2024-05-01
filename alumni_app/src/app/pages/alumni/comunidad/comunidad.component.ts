import { Component, EventEmitter, Output } from '@angular/core';
import { Graduado, Graduado1 } from '../../../data/model/graduado';
import { Subject } from 'rxjs';
import { GraduadoService } from '../../../data/service/graduado.service';
import { Usuario } from '../../../data/model/usuario';
import { Ciudad } from '../../../data/model/ciudad';
import { Rol } from '../../../data/model/rol';
import { Persona } from '../../../data/model/persona';
import { Provincia } from '../../../data/model/provincia';
import { UserService } from '../../../data/service/UserService';
@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['comunidad.component.css']
})
export class ComunidadComponent {
  selectedGraduado: Graduado1 | null = null;

  public urlImage: string = '';
  public rutaimagen: string = '';
  public graduadoid: number = 0;
  public idstring: string = '';
  public nombres: string = '';
  public apellidos: string = '';
  graduado: Graduado1 = { id: 0, usuario: new Usuario(), ciudad: new Ciudad(), anioGraduacion: new Date(), emailPersonal: '', estadoCivil: '', rutaPdf: '', urlPdf: '' };

  graduadosList: Graduado1[] = [];
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private graduadoService: GraduadoService, private userservice: UserService) { }

  ngOnInit(): void {
    this.setupDtOptions();
    this.loadData();

    // this.loadUserDataByUsername();
    // this.idstring = localStorage.getItem('idGraduado') || '';
    // this.graduadoid = parseInt(this.idstring, 10);
  }
  showGraduadoDetails(graduado: Graduado1) {
    this.selectedGraduado = graduado;
  }
  contactarPorWhatsapp(numeroTelefono: string): void {
    const numeroCorregido = numeroTelefono.substring(1);
    const numeroConCodigoPais = `593${numeroCorregido}`;
    const mensaje = "Hola, estoy interesado en contactarte.";
    const enlaceWhatsapp = `https://wa.me/${numeroConCodigoPais}?text=${encodeURIComponent(mensaje)}`;
    window.open(enlaceWhatsapp, "_blank");
}



  setupDtOptions() {
    this.dtoptions = {
      pagingType: 'fullNumbers',
      searching: true,
      lengthChange: true,
      language: {
        search: 'Buscar:',
        searchPlaceholder: 'Buscar graduado...',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        infoEmpty: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        paginate: {
          first: 'Primera',
          last: 'Última',
          next: 'Siguiente',
          previous: 'Anterior',
        },
        lengthMenu: 'Mostrar MENU_ registros por página',
        zeroRecords: 'No se encontraron registros coincidentes'
      },
      lengthMenu: [10, 25, 50]
    };
  }


  loadData() {
    const userId = localStorage.getItem('user_id');
    this.graduadoService.getGraduadosNotIn(userId ? parseInt(userId) : 0).subscribe(
      (result) => {

        this.graduadosList = result;
       // console.log("Graduados obtenidos:", this.graduadosList);

      },
      () => this.dtTrigger.next(null)
    );
  }

  private mapGraduado(graduado: Graduado1): Graduado1 {
    const usuario = new Usuario();
    usuario.id = graduado.usuario.id;
    usuario.clave = graduado.usuario.clave;
    usuario.nombreUsuario = graduado.usuario.nombreUsuario;
    usuario.estado = graduado.usuario.estado;
    usuario.urlImagen = graduado.usuario.urlImagen;
    usuario.persona = this.mapPersona(graduado.usuario.persona);
    usuario.rutaImagen = graduado.usuario.rutaImagen;
    usuario.rol = this.mapRol(graduado.usuario.rol);

    const ciudad = new Ciudad();
    ciudad.id = graduado.ciudad.id;
    ciudad.nombre = graduado.ciudad.nombre;
    ciudad.provincia = this.mapProvincia(graduado.ciudad.provincia);

    const graduadoMapped = new Graduado1();
    graduadoMapped.id = graduado.id;
    graduadoMapped.usuario = usuario;
    graduadoMapped.ciudad = ciudad;
    graduadoMapped.anioGraduacion = graduado.anioGraduacion;
    graduadoMapped.emailPersonal = graduado.emailPersonal;
    graduadoMapped.estadoCivil = graduado.estadoCivil;
    graduadoMapped.rutaPdf = graduado.rutaPdf;
    graduadoMapped.urlPdf = graduado.urlPdf;

    return graduadoMapped;
  }

  private mapPersona(persona: Persona): Persona {
    const personaMapped = new Persona();
    personaMapped.id = persona.id;
    personaMapped.cedula = persona.cedula;
    personaMapped.primerNombre = persona.primerNombre;
    personaMapped.segundoNombre = persona.segundoNombre;
    personaMapped.fechaNacimiento = persona.fechaNacimiento;
    personaMapped.telefono = persona.telefono;
    personaMapped.apellidoPaterno = persona.apellidoPaterno;
    personaMapped.apellidoMaterno = persona.apellidoMaterno;

    return personaMapped;
  }

  private mapRol(rol: Rol): Rol {
    const rolMapped = new Rol();
    rolMapped.id = rol.id;
    rolMapped.nombre = rol.nombre;
    rolMapped.descripcion = rol.descripcion;

    return rolMapped;
  }

  private mapProvincia(provincia: Provincia): Provincia {
    const provinciaMapped = new Provincia();
    provinciaMapped.id = provincia.id;
    provinciaMapped.nombre = provincia.nombre;
    provinciaMapped.pais = provincia.pais;

    return provinciaMapped;
  }

  loadUserDataByUsername() {
    const storedRutaImagen = localStorage.getItem('rutaImagen');
    const storedUrlImagen = localStorage.getItem('urlImagen');
    if (storedRutaImagen && storedUrlImagen) {
      this.rutaimagen = storedRutaImagen;
      this.urlImage = storedUrlImagen;
    } else {
      console.error('La información de imagen no está disponible en localStorage.');
    }
  }
}
