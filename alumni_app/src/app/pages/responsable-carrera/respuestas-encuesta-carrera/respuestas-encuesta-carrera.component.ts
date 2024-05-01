import { Component } from '@angular/core';
import { Carrera } from '../../../data/model/carrera';
import { Survey } from '../../../data/model/Survey';
import { AnswerService } from '../../../data/service/AnswerService';
import { CarreraService } from '../../../data/service/carrera.service';
import { SurveyService } from '../../../data/service/SurveyService';

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

  constructor(private answerService: AnswerService, private careerService: CarreraService, private surveyService: SurveyService) { }

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

}
