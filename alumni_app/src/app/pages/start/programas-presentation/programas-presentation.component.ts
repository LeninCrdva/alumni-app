import { Component } from '@angular/core';
import { Eventos } from '../../../data/model/Eventos';
import { Eventos_Service } from '../../../data/service/eventoservice';
import { Router } from '@angular/router';
import { XmlserviceService } from '../../../data/service/xmlservice.service';
import { componentxml } from '../../../data/model/componentxml';
@Component({
  selector: 'app-programas-presentation',
  templateUrl: './programas-presentation.component.html',
  styleUrl: './programas-presentation.component.css'
})
export class ProgramasPresentationComponent {

  programasMList: Eventos[] = [];
  componentesXmlList: componentxml[] = [];

  constructor(private programasService: Eventos_Service, private router: Router
    , private xmlService: XmlserviceService) { }

  ngOnInit(): void {
    this.loadData();
  }


  loadData() {
    this.programasService.get().subscribe(
      result => {
        this.programasMList = result;
      },
      (error: any) => console.error(error)
    );
  }

  verMas(tipo: string) {
    this.xmlService.getByTipo(tipo).subscribe(
      (data: any) => {
        const idComponenteXml = data.id;
        const rutaAcceso = `/inicio/component/${idComponenteXml}`;
        this.router.navigate([rutaAcceso]);
      },
      error => {
        console.error('Error al buscar el componente XML:', error);
      }
    );
  }

}
