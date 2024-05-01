import { Component } from '@angular/core';
import { AnswerService } from '../../../data/service/AnswerService';
import { Carrera } from '../../../data/model/carrera';
import { Survey } from '../../../data/model/Survey';
import { CarreraService } from '../../../data/service/carrera.service';
import { SurveyService } from '../../../data/service/SurveyService';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';

interface AnswerData {
  [careerName: string]: {
    [surveyTitle: string]: Array<{
      questionId: number;
      questionText: string;
      responsesByOption: { [option: string]: number };
      questionAnswers: string[] | null;
      numResponses: number;
      totalGraduadosforcarrer: any;
      graduadosRespondidosforcarrer: any;
      typeQuestion: any;
    }>;
  };
}
@Component({
  selector: 'app-respuestas-encuesta-carrera',
  templateUrl: './respuestas-encuesta-carrera.component.html',
  styleUrl: './respuestas-encuesta-carrera.component.css'
})
export class RespuestasEncuestaCarreraComponent {

  answerList: any[] = [];
  careerName!: string;
  surveyTitle!: string;

  careerList: Carrera[] = [];
  surveyList: Survey[] = [];

  constructor(private answerService: AnswerService, private careerService: CarreraService, private surveyService: SurveyService) 
  { 
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
    this.getCareerList();
    this.getSurveyList();
  }

  async onFilterChange() {
    if (this.careerName && this.surveyTitle) {
      this.getAnswersByCareerNameAndSurveyTitle();
    }
  }

  getAnswersByCareerNameAndSurveyTitle() {
    this.answerService.getSurveyQuestionsAnswersByCareerWithCareerNameAndSurveyTitle(this.careerName, this.surveyTitle)
      .subscribe(
        (data: AnswerData) => {
          if (data && data[this.careerName] && data[this.careerName][this.surveyTitle]) {
            this.answerList = data[this.careerName][this.surveyTitle];
          }
        }
      );
  }

  async getCareerList() {
    this.careerService.getCarreras().subscribe((data) => {
      this.careerList = data;
    });
  }

  async getSurveyList() {
    this.surveyService.getAllSurveysWithQuestionsAndOptions().subscribe((data) => {
      this.surveyList = data;
    });
  }
 
  // Asignar las fuentes de pdfMake
  downloadAsPDF(): void {
    const docDefinition = {
      content: [
        { text: `Respuestas de la encuesta "${this.surveyTitle}" para la carrera "${this.careerName}"`, style: 'header' },
        { text: '\n' }, // Salto de línea

        // Contenido de respuestas
        ...this.answerList.map(answer => [
          { text: answer.questionText, style: 'subheader' },
          ...(answer.responsesByOption && Object.keys(answer.responsesByOption).length > 0
            ? [
              { text: 'Opciones de respuesta:', style: 'subsubheader' },
              {
                ul: Object.entries(answer.responsesByOption).map(([option, count]) => `${option}: ${count}`)
              }
            ]
            : [
              { text: 'Esta pregunta no tiene opciones de respuesta predefinidas.' }
            ]),
          ...(answer.questionAnswers && answer.questionAnswers.length > 0
            ? [
              { text: 'Respuestas de texto:', style: 'subsubheader' },
              {
                ul: answer.questionAnswers.map((text: string) => ({ text: text }))
              }
            ]
            : [])
        ]),
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 10, 0, 10] } as any,
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] } as any,
        subsubheader: { fontSize: 12, bold: true, margin: [0, 5, 0, 5] } as any
      }
    };

    // Crear y descargar el documento PDF
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download(`Respuestas_${this.surveyTitle}_${this.careerName}.pdf`);
  }
  
  downloadAsExcel(): void {
    const data = this.answerList.map(answer => ({
      'Pregunta': answer.questionText,
      'Opciones de respuesta': answer.responsesByOption ? Object.entries(answer.responsesByOption).map(([option, count]) => `${option}: ${count}`).join(', ') : '',
      'Respuestas de texto': answer.questionAnswers ? answer.questionAnswers.join(', ') : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Respuestas');

    XLSX.writeFile(workbook, `Respuestas_${this.surveyTitle}_${this.careerName}.xlsx`);
  }

}
