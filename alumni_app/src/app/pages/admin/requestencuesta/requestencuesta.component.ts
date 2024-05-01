import { Component, OnInit } from '@angular/core';
import { AnswerService } from '../../../data/service/AnswerService';

import { Observable } from 'rxjs';
import { SurveyQuestionsAnswersStatsDTO } from '../../../data/model/DTO/SurveyQuestionsAnswersStatsDTO';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-requestencuesta',
  templateUrl: './requestencuesta.component.html',
  styleUrl: './requestencuesta.component.css'
})
export class RequestencuestaComponent {
  surveyQuestionsAnswersStatsList$: Observable<SurveyQuestionsAnswersStatsDTO[]> = new Observable<SurveyQuestionsAnswersStatsDTO[]>();
  constructor(private answerService: AnswerService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
    this.loadsurveysWithQuestionsAnswersAndStats();
  }
  
  loadsurveysWithQuestionsAnswersAndStats(): void {
    this.surveyQuestionsAnswersStatsList$ = this.answerService.getAllSurveysWithQuestionsAnswersAndStats();
  
    this.surveyQuestionsAnswersStatsList$.subscribe(data => {
      //console.log('Encuestas con preguntas, respuestas y estadísticas:', data);
    }, error => {
      console.error('Error al cargar encuestas con preguntas, respuestas y estadísticas:', error);
    });
  }
  downloadAsExcel(survey: SurveyQuestionsAnswersStatsDTO): void {
    const surveysData: Array<Array<any>> = [];
    
    survey.questionsWithAnswers.forEach((question, index) => {
      const rowData: Array<any> = [
        survey.surveyTitle,
        survey.surveyDescription,
        question.questionText,
        question.typeQuestion,
        `Pregunta ${index + 1}` // Agregar indicador de número de pregunta
      ];

      if (question.typeQuestion === 'ABIERTA') {
        // Para preguntas abiertas, agregar cada respuesta como una celda individual
        question.questionAnswers.forEach(answer => {
          surveysData.push([...rowData, answer]); // Agregar cada respuesta como una fila separada
        });
      } else {
        // Para otros tipos de preguntas, agregar cada opción de respuesta como una celda individual
        for (const [key, value] of Object.entries(question.responsesByOption)) {
          const response = `${key}: ${value}`;
          surveysData.push([...rowData, response]); // Agregar cada opción de respuesta como una fila separada
        }
      }
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ['Encuesta', 'Descripción', 'Pregunta', 'Tipo de Pregunta', 'Número de Pregunta', 'Respuestas'],
      ...surveysData
    ]);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${survey.surveyTitle}`);
    XLSX.writeFile(wb, `${survey.surveyTitle}.xlsx`);
  }
  downloadAsPDF(survey: SurveyQuestionsAnswersStatsDTO): void {
    const doc = new jsPDF();

    let yPos = 10; // Iniciar posición Y para el contenido

    // Encabezado del PDF
    doc.text(`Encuesta: ${survey.surveyTitle}`, 10, yPos);
    yPos += 10;
    doc.text(`Descripción: ${survey.surveyDescription}`, 10, yPos);
    yPos += 15; // Incrementar más para dejar espacio después de la descripción
    doc.text('Respuestas:', 10, yPos);
    yPos += 10; // Espacio después del encabezado de respuestas

    // Iterar sobre las preguntas y respuestas
    survey.questionsWithAnswers.forEach((question, index) => {
      const questionText = `${index + 1}. ${question.questionText}`;
      doc.text(questionText, 10, yPos);

      // Calcular el espacio necesario para las respuestas
      const answersText = this.formatAnswers(question);
      const answersTextLines = doc.splitTextToSize(answersText, doc.internal.pageSize.width - 50); // Ancho disponible para texto

      // Obtener la altura del texto de las respuestas
      const answersTextHeight = doc.getTextDimensions(answersTextLines).h;

      yPos += 5; // Aumentar yPos para dejar espacio antes de las respuestas
      doc.text(answersTextLines, 25, yPos); // Mostrar las respuestas
      yPos += answersTextHeight + 10; // Espacio adicional entre preguntas
    });

    // Guardar y descargar el archivo PDF
    doc.save(`${survey.surveyTitle}.pdf`);
  }

  // Método para formatear las respuestas según el tipo de pregunta
  private formatAnswers(question: any): string {
    if (question.typeQuestion === 'ABIERTA') {
      return question.questionAnswers.join('\n'); // Respuestas abiertas separadas por salto de línea
    } else {
      let answersText = '';
      for (const [key, value] of Object.entries(question.responsesByOption)) {
        answersText += `${key}: ${value}\n`; // Opciones de respuesta formateadas
      }
      return answersText;
    }
  }

  downloadAsPDF2(survey: SurveyQuestionsAnswersStatsDTO): void {
    const docDefinition = {
      content: [
        { text: `Encuesta: ${survey.surveyTitle}`, style: 'header' },
        { text: `Descripción: ${survey.surveyDescription}`, style: 'subheader' },
        { text: `Tipo de Pregunta:`, style: 'subheader' },
        { text: 'Respuestas:', style: 'subheader' },
        {
          table: {
            widths: ['auto', 'auto', 'auto'], // Ancho de las columnas
            body: [
              ['Pregunta', 'Tipo', 'Respuestas'], // Encabezados de la tabla
              ...this.buildTableRows(survey.questionsWithAnswers) // Filas de la tabla
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 10, 0, 10] as [number, number, number, number] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] as [number, number, number, number] }
      }
    };

    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download(`${survey.surveyTitle}.pdf`);
  }

  // Método para construir las filas de la tabla con preguntas, tipos y respuestas
  private buildTableRows(questions: any[]): Array<Array<string>> {
    const rows: Array<Array<string>> = [];
    questions.forEach((question, index) => {
      let answersText = '';
      if (question.typeQuestion === 'ABIERTA') {
        answersText = question.questionAnswers.join('\n'); // Respuestas abiertas
      } else {
        for (const [key, value] of Object.entries(question.responsesByOption)) {
          answersText += `${key}: ${value}\n`; // Opciones de respuesta
        }
      }
      const questionText = `${index + 1}. ${question.questionText}`;
      const typeQuestion = question.typeQuestion;
      rows.push([questionText, typeQuestion, answersText]);
    });
    return rows;
  }

}
