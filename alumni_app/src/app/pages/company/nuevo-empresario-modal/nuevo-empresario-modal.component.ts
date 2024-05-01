import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EmpresarioService } from '../../../data/service/empresario.service';
import { Empresario2 } from '../../../data/model/empresario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Persona } from '../../../data/model/persona';
import { Rol } from '../../../data/model/rol';
import { UserService } from '../../../data/service/UserService';
@Component({
  selector: 'app-nuevo-empresario-modal',
  templateUrl: './nuevo-empresario-modal.component.html',
  styleUrl: './nuevo-empresario-modal.component.css'
})
export class NuevoEmpresarioModalComponent implements OnInit {
  nuevoEmpresario: Empresario2 = new Empresario2();
  @Output() onClose: EventEmitter<string> = new EventEmitter();
  usuarioGuardado: string = localStorage.getItem('name') || '';
  formularioEmpresario: FormGroup = new FormGroup({});
  mensajeMostrado = false;
  usuarios: any = {};
  name: string | null = localStorage.getItem('name');


  constructor(
    public bsModalRef: BsModalRef,
    private empresarioService: EmpresarioService, 
    private formBuilder: FormBuilder,
    private usuarioService: UserService,
    
  ) {}

  ngOnInit() {
    this.obtenerUsuario();
    this.buildForm();
    this.nuevoEmpresario.usuario = this.usuarioGuardado;

    this.usuarios = {
      clave: '',
      nombreUsuario: '',
      estado: false,
      url_imagen: '',
      persona: new Persona,
      ruta_imagen: '',
      rol: new Rol
    }
  }

  buildForm() {
    this.formularioEmpresario = this.formBuilder.group({
    
      puesto: ['', Validators.required],
      anios: [null, [Validators.required, Validators.min(0)]],
      usuario: [this.usuarioGuardado, Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  guardarEmpresario() {
      // Realizar la operación de guardado
      this.empresarioService.createEmpresario(this.formularioEmpresario.value).subscribe(
        (result) => {
         
          this.mensajeMostrado = true; 
          this.mostrarSweetAlert(true);
        },
        (error) => {
          console.error('Error al crear Empresario:', error);
          this.mostrarSweetAlert(false);
        }
      );

  }

  mostrarSweetAlert(esExitoso: boolean) {
    const titulo = esExitoso ? 'Completado exitosamente' : 'Error al guardar';
    const mensaje = esExitoso ? 'La empresa se ha guardado exitosamente.' : 'Hubo un error al intentar guardar la empresa.';

    Swal.fire({
      icon: esExitoso ? 'success' : 'error',
      title: titulo,
      text: mensaje,
      allowOutsideClick: !esExitoso,
    }).then((result) => {
      if (esExitoso || result.isConfirmed) {
        this.onClose.emit(esExitoso ? 'guardadoExitoso' : 'errorGuardado');
        this.bsModalRef.hide();
      }
    });
  }

  cerrarModal() {
    if (this.mensajeMostrado) {
      this.bsModalRef.hide();
    } 
  }

  obtenerUsuario(){
    const username = this.name || ''; // Provide a default value for the parameter
    this.usuarioService.getUsuarioByUsername(username).subscribe(
      usuario => {
        this.usuarios = usuario;
       
        this.nuevoEmpresario.usuario = this.usuarios.nombreUsuario;
        this.nuevoEmpresario.estado = this.usuarios.estado
        localStorage.setItem('idUser', this.usuarios.id);
       
      },
      error => console.error('Error al obtener usuario:', error)
    );
  }

  calcularEdad(): number {
   
    const fechaNacimientoString =this.usuarios.persona.fechaNacimiento;
  
    const fechaNacimiento = new Date(fechaNacimientoString);

    // Fecha actual
    const fechaActual = new Date();

    // Calcula la diferencia de tiempo en milisegundos
    const diferenciaEnMilisegundos = fechaActual.getTime() - fechaNacimiento.getTime();

    // Convierte la diferencia de milisegundos a años
    const edadEnAnios = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25);

    // Redondea la edad a un número entero
    const edadRedondeada = Math.floor(edadEnAnios);
    this.nuevoEmpresario.anios = edadRedondeada;

          return edadRedondeada;
  }
}