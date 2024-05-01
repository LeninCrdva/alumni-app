
import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AdministradorService } from '../../../data/service/administrador.service';
import { Administrador } from '../../../data/model/administrador';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-nuevo-administrador-modal',
  templateUrl: './nuevo-administrador-modal.component.html',
  styleUrls: ['./nuevo-administrador-modal.component.css']
})
export class NuevoAdministradorModalComponent implements OnInit {
  nuevoAdministrador: Administrador = new Administrador();
  onClose: EventEmitter<string> = new EventEmitter();
  usuarioGuardado: string = localStorage.getItem('name') || '';
  formularioValido: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private administradorService: AdministradorService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.nuevoAdministrador.usuario = this.usuarioGuardado;
  }

  guardarAdministrador() {
    // Verificar si el formulario es válido (puedes mantener tu lógica actual aquí)
    if (this.validarFormulario()) {
      // Realizar la operación de guardado solo si el formulario es válido
      this.administradorService.createAdministrador(this.nuevoAdministrador).subscribe(
        (result) => {
          console.log('Administrador creado con éxito:', result);
          this.onClose.emit('guardadoExitoso');
          this.bsModalRef.hide();
        },
        (error) => {
          console.error('Error al crear administrador:', error);
        }
      );
    } else {
      console.error('Formulario no válido. Verifica que todos los campos estén llenos.');
    }
  }

  cerrarModal() {
    // No permitir cerrar el modal si el formulario no es válido
    if (this.validarFormulario()) {
      this.bsModalRef.hide();
    } else {
      console.error('No se puede cerrar el modal. Verifica que todos los campos estén llenos.');
    }
  }

  private validarFormulario(): boolean {
    return this.formularioValido = !!this.nuevoAdministrador.cargo && !!this.nuevoAdministrador.email && !!this.nuevoAdministrador.usuario;
  }
}
