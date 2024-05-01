import { Component, OnInit, ViewChild } from '@angular/core';
import { TituloService } from '../../../../data/service/titulo.service';
import { DataTablesService } from '../../../../data/DataTables.service';
import { AlertsService } from '../../../../data/Alerts.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-graduados-titulo-carrera',
  templateUrl: './graduados-titulo-carrera.component.html',
  styleUrl: './graduados-titulo-carrera.component.css'
})
export class GraduadosTituloCarreraComponent implements OnInit {

  graduatedWithTitleAndCareer: any[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  initializeTable: boolean = true;
  dtoptions: DataTables.Settings = {};
  columnTitles: string[] = ['#', 'Cédula', 'Apellidos y Nombres', 'Email', 'Carrera', 'Título'];

  constructor(
    public dtService: DataTablesService,
    private alertService: AlertsService,
    private titleService: TituloService
  ) { }

  ngOnInit(): void {
    this.dtoptions = this.dtService.setupDtOptions(this.columnTitles, 'Buscar graduado...', false);
    this.getGraduatedWithTitleAndCareer();
  }

  getGraduatedWithTitleAndCareer(): void {
    this.titleService.getGraduatedWithTitleAndCareer().subscribe(
      (data) => {
        this.graduatedWithTitleAndCareer = [];
        this.graduatedWithTitleAndCareer = data;
        console.log(this.graduatedWithTitleAndCareer);
        if (this.initializeTable) {
          this.dtTrigger.next(null);
          this.initializeTable = false;
        } else {
          this.dtService.rerender(this.dtElement, this.dtTrigger);
        }
      }
    );
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

        const title = 'INFORME DE GRADUADOS';
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

        try {
          doc.save(`${new Date().toISOString()}_REPORTE_GRADUADOS_CARRERA.pdf`);
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

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, 'Graduados');

      XLSX.writeFile(wb, 'reporte_graduados_carrera.xlsx');

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
