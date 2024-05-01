import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmpresaService } from '../../../../data/service/empresa.service';
import { Empresa } from '../../../../data/model/empresa';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { DataTablesService } from '../../../../data/DataTables.service';
import { AlertsService } from '../../../../data/Alerts.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-empresa-report',
  templateUrl: './empresa-report.component.html',
  styleUrl: './empresa-report.component.css'
})
export class EmpresaReportComponent implements OnInit {
  empresa: Empresa[] = [];

  // =====================================================
  //*               DATA TABLE Y FILTROS
  // =======================================================

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  initializeTable: boolean = true;
  dtoptions: DataTables.Settings = {};
  columnTitles: string[] = ['#', 'RUC', 'Nombre Empresa', 'Tipo De Empresa', 'Ciudad'];

  constructor(
    private empresaService: EmpresaService,
    public dtService: DataTablesService,
    private alertService: AlertsService,
  ) { }

  ngOnInit(): void {
    this.dtoptions = this.dtService.setupDtOptions(this.columnTitles, 'Buscar empresa...', false);
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.getEmpresas().subscribe(
      empresas => {
        this.empresa = [];
        this.empresa = empresas;
        console.log('Empresas cargadas:', this.empresa);

        if (this.initializeTable) {
          this.dtTrigger.next(null);
          this.initializeTable = false;
        } else {
          this.dtService.rerender(this.dtElement, this.dtTrigger);
        }
      },
      error => {
        console.error('Error al cargar los graduados:', error);
      }
    );
  }

  cargarEmpresaSinPublicar(): void {
    this.empresaService.getEmpresaSinOfertasLab().subscribe(
      empresas => {
        this.empresa = empresas;
        console.log('Empresas cargadas:', this.empresa);
      },
      error => {
        console.error('Error al cargar los graduados:', error);
      }
    );
  }

  aplicarFiltros(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement)?.value;
    switch (selectedValue) {
      case 'todos':
        this.cargarEmpresas();
        break;
      case 'sinPublicar':
        this.cargarEmpresaSinPublicar();
        break;
      default:
        console.log('Opción de filtro no reconocida:', selectedValue);
        break;
    }
  }

  descargarPDF(): void {
    this.alertService.mostrarAlertaCargando();

    this.dtoptions.pageLength = -1;

    if (this.initializeTable) {
      this.dtTrigger.next(null);
      this.initializeTable = false;
    } else {
      this.dtService.rerender(this.dtElement, this.dtTrigger);
    }

    setTimeout(() => {
      const DATA: any = document.getElementById('htmlData');
      const doc = new jsPDF('p', 'pt', 'a4');

      const options = {
        background: 'white',
        scale: 3,
      };

      html2canvas(DATA, options).then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 15;
        const bufferY = 35;

        const title = 'INFORME DE EMPRESAS';
        const fontSize = 16;
        const titleWidth = doc.getStringUnitWidth(title) * fontSize / doc.internal.scaleFactor;
        const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
        const titleY = bufferY - 10;

        const imgProps = (doc as any).getImageProperties(img); // Corrección aquí
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.setFont('helvetica', 'bold');
        doc.text(title, titleX, titleY);

        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );

        // Guardar el PDF después de añadir la imagen
        try {
          doc.save(`${new Date().toISOString()}_REPORTE_EMPRESAS.pdf`);
          this.alertService.detenerAlertaCargando();

          this.dtoptions.pageLength = 10;

          if (this.initializeTable) {
            this.dtTrigger.next(null);
            this.initializeTable = false;
          } else {
            this.dtService.rerender(this.dtElement, this.dtTrigger);
          }
        } catch (error) {
          console.error('Error al guardar el PDF:', error);
        }
      }).catch((error) => {
        console.error('Error al generar el PDF:', error);
      });
    }, 2000);
  }


  exportarExcel(): void {
    this.alertService.mostrarAlertaCargando();
    this.dtoptions.pageLength = -1;

    if (this.initializeTable) {
      this.dtTrigger.next(null);
      this.initializeTable = false;
    } else {
      this.dtService.rerender(this.dtElement, this.dtTrigger);
    }

    const excelData: any[] = [];

    // Obtener los títulos de las columnas y agregarlos como la primera fila
    const content = document.getElementById('htmlData');
    const tableHeaders = content?.querySelectorAll('table thead th:not(:first-child)');
    const columnTitles: string[] = [];
    
    setTimeout(() => {
      tableHeaders?.forEach((header: any) => {
        columnTitles.push(header.innerText);
      });
      excelData.push(columnTitles);

      // Obtener los datos de la tabla y agregarlos al arreglo excelData
      const tableRows = content?.querySelectorAll('table tbody tr');
      tableRows?.forEach((row: any) => {
        const rowData: any[] = [];
        const columns = row.querySelectorAll('td:not(:first-child)');
        columns.forEach((column: any) => {
          rowData.push(column.innerText);
        });
        excelData.push(rowData);
      });

      // Crear un nuevo libro de Excel y agregar la hoja de trabajo
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, 'Empresas');

      // Guardar el libro de Excel como un archivo
      XLSX.writeFile(wb, 'reporte_empresas.xlsx');

      this.alertService.detenerAlertaCargando();
      this.dtoptions.pageLength = 10;

      if (this.initializeTable) {
        this.dtTrigger.next(null);
        this.initializeTable = false;
      } else {
        this.dtService.rerender(this.dtElement, this.dtTrigger);
      }
    }, 2000);
  }
}
