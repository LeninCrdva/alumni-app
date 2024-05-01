import { Component, OnInit } from '@angular/core';
import { AnswerService } from '../../../data/service/AnswerService';
import { GraduadoWithUnansweredSurveysDTO } from '../../../data/model/DTO/GraduadoWithUnansweredSurveysDTO';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.css'
})
export class SeguimientoComponent implements OnInit {

  unanswerList: GraduadoWithUnansweredSurveysDTO[] = [];
  answerList: any[] = [];
  selectedFilter: string = 'with-answers';

  constructor(private answerService: AnswerService) { 
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    // Configurar las fuentes que necesitas utilizar
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    };
  }

  ngOnInit(): void {
    this.getAnsweredSurveys();
  }

  async onFilterChange() {
    if (this.selectedFilter === 'with-answers') {
      await this.getAnsweredSurveys();
    } else if (this.selectedFilter === 'no-answers') {
      await this.getUnansweredSurveys();
    }
  }

  async getUnansweredSurveys() {
    this.answerService.getGraduadosWithUnansweredSurveys().subscribe((data) => {
      this.unanswerList = data;
    });
  }

  async getAnsweredSurveys() {
    this.answerService.getEncuestasRespondidasPorGraduado('').subscribe((data) => {
      this.answerList = data;
    });
  }
  downloadAsPDF2(): void {
    let titleText: string;
    let tableHeader: string;
  
    // Determinar el texto del título y encabezado de la tabla según el filtro seleccionado
    if (this.selectedFilter === 'with-answers') {
      titleText = 'LISTADO DE GRADUADOS QUE HAN RESPONDIO';
      tableHeader = 'Título Encuesta Respondida';
    } else if (this.selectedFilter === 'no-answers') {
      titleText = 'LISTADO DE GRADUADOS QUE NO HAN RESPONDIO';
      tableHeader = 'Título Encuesta no Respondida';
    } else {
      // Filtro no reconocido, maneja según sea necesario
      return;
    }
  
    const docDefinition = {
      content: [
        { text: titleText, style: 'header' },
        { text: `Filtrado por: ${this.selectedFilter === 'with-answers' ? 'Graduados que han respondido' : 'Graduados que no han respondido'}`, style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto'],
            body: this.selectedFilter === 'with-answers'
              ? this.answerList.map(answer => [
                  { text: answer.tituloEncuesta, style: 'cell' },
                  { text: this.createEmailLinks(answer.correosGraduados), style: 'cell' }
                ])
              : this.unanswerList.map(unanswer => [
                  { text: unanswer.encuestasNoContestadas.join(', '), style: 'cell' },
                  { text: `Nombres: ${unanswer.nombres}\nApellidos: ${unanswer.apellidos}\nCédula: ${unanswer.cedula}\nCorreo: ${unanswer.email}`, style: 'cell' }
                ])
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 10, 0, 10] } as any,
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] } as any,
        cell: { fontSize: 12, margin: [0, 5, 0, 5] } as any
      }
    };
  
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download(`Encuestas_${this.selectedFilter === 'with-answers' ? 'Graduados que han respondido' : 'GraduadosNoRespondidas'}.pdf`);
  }
  
  createEmailLinks(emails: string[]): any[] {
    const styledEmails = emails.map((email, index) => {
      const trimmedEmail = email.trim();
      const isEmail = /\S+@\S+\.\S+/.test(trimmedEmail); // Verificar si es un correo electrónico
  
      // Determinar el estilo basado en si es un correo electrónico o no
      const style = isEmail ? { color: 'blue', decoration: 'underline' } : { color: 'black' };
  
      return {
        text: trimmedEmail, // Usar el correo electrónico sin cambios
        style: style
      };
    });
  
    return styledEmails.map(email => [
      { text: email.text, style: email.style || 'cell' },
      '\n' // Agregar un salto de línea después de cada correo electrónico
    ]).flat(); // Aplanar la matriz para convertirla en una lista de elementos
  }
  
  
  
  downloadAsExcel(): void {
    let titleText: string;
    let tableHeader: string;
  
    // Determinar el texto del título y encabezado de la tabla según el filtro seleccionado
    if (this.selectedFilter === 'with-answers') {
      titleText = 'LISTADO DE GRADUADOS QUE HAN RESPONDIDO';
      tableHeader = 'Título Encuesta Respondida';
    } else if (this.selectedFilter === 'no-answers') {
      titleText = 'LISTADO DE GRADUADOS QUE NO HAN RESPONDIDO';
      tableHeader = 'Título Encuesta no Respondida';
    } else {
      // Filtro no reconocido, manejar según sea necesario
      return;
    }
  
    const dataRows = this.selectedFilter === 'with-answers'
      ? this.answerList.map(answer => [
          answer.tituloEncuesta,
          this.getEmailList(answer.correosGraduados) // Obtener lista de correos electrónicos formateada
        ])
      : this.unanswerList.map(unanswer => [
          unanswer.encuestasNoContestadas.join(', '),
          `Nombres: ${unanswer.nombres}\nApellidos: ${unanswer.apellidos}\nCédula: ${unanswer.cedula}\nCorreo: ${unanswer.email}`
        ]);
  
    // Crear nueva hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const sheetName = 'Data';
    const worksheet = XLSX.utils.aoa_to_sheet([['', titleText], ['', `Filtrado por: ${this.selectedFilter === 'with-answers' ? 'Graduados que han respondido' : 'Graduados que no han respondido'}`], ['', '']]);
  
    // Agregar encabezados de tabla
    XLSX.utils.sheet_add_aoa(worksheet, [
      [tableHeader, 'Correos Graduados']
    ], { origin: 'A4' });
  
    // Agregar filas de datos
    XLSX.utils.sheet_add_aoa(worksheet, dataRows, { origin: 'A6' });
  
    // Agregar hoja de cálculo al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
    // Escribir el libro de Excel en un archivo
    const excelFilename = this.selectedFilter === 'with-answers'
      ? 'Graduados que han respondido.xlsx'
      : 'Graduados que no han respondido.xlsx';
  
    XLSX.writeFile(workbook, excelFilename);
    console.log(`Archivo Excel "${excelFilename}" creado correctamente.`);
  }
  
  getEmailList(emails: string[]): string {
    return emails.join('\n'); // Unir correos electrónicos en una lista separada por saltos de línea
  }

}
