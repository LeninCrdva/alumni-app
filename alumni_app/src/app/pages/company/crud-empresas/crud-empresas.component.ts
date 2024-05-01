import { Component } from '@angular/core';

@Component({
  selector: 'app-crud-empresas',
  templateUrl: './crud-empresas.component.html',
  styleUrls: ['./crud-empresas.component.css']
})
export class CrudEmpresasComponent {

  editarClicked = false;

  onEditarClick(): void {
    this.editarClicked = true;
  }

  onRegistrarClick(): void {
    this.editarClicked = false;
  }
}
