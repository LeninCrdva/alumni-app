import { Component, OnInit } from '@angular/core';
import { AnswerService } from '../../../data/service/AnswerService';
import { SurveyQuestionsAnswersDTO } from '../../../data/model/DTO/SurveyQuestionsAnswersDTO';
import { Observable } from 'rxjs';
import { SurveyQuestionsAnswersStatsDTO } from '../../../data/model/DTO/SurveyQuestionsAnswersStatsDTO';

@Component({
  selector: 'app-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrl: './respuestas.component.css'
})
export class RespuestasComponent {
  surveyQuestionsAnswersStatsList$: Observable<SurveyQuestionsAnswersStatsDTO[]> = new Observable<SurveyQuestionsAnswersStatsDTO[]>();
  constructor(private answerService: AnswerService) { }

  ngOnInit(): void {
    this.loadsurveysWithQuestionsAnswersAndStats();
  }
  
  loadsurveysWithQuestionsAnswersAndStats(): void {
    this.surveyQuestionsAnswersStatsList$ = this.answerService.getAllSurveysWithQuestionsAnswersAndStats();
  
    this.surveyQuestionsAnswersStatsList$.subscribe(data => {
      console.log('Encuestas con preguntas, respuestas y estadísticas:', data);
    }, error => {
      console.error('Error al cargar encuestas con preguntas, respuestas y estadísticas:', error);
    });
  }
}
