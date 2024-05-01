import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Answer } from '../model/Answer';
import { AnswerSearchDTO } from '../model/DTO/AnswerSearchDTO';
import { SurveyQuestionsAnswersDTO } from '../model/DTO/SurveyQuestionsAnswersDTO';
import { GraduadoWithUnansweredSurveysDTO } from '../model/DTO/GraduadoWithUnansweredSurveysDTO';
import { SurveyQuestionsAnswersStatsDTO } from '../model/DTO/SurveyQuestionsAnswersStatsDTO';
@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private baseUrl = environment.apiURL + '/api/answer';

  constructor(private http: HttpClient) { }

  saveAnswer(answerDTO: AnswerSearchDTO): Observable<Answer> {
    const url = `${this.baseUrl}/save`;
    return this.http.post<Answer>(url, answerDTO)
      .pipe(
        catchError(this.handleError)
      );
  }

  getQuestionsWithAnswersBySurveyId(surveyId: number): Observable<any> {
    const url = `${this.baseUrl}/survey/${surveyId}/questions-answers`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSurveyQuestionsAnswersByCareercoment(): Observable<any> {
    const url = `${this.baseUrl}/survey-questions-answers-by-career-coments`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllSurveysWithQuestionsAndAnswers(): Observable<SurveyQuestionsAnswersDTO[]> {
    const url = `${this.baseUrl}/all-surveys-questions-answers`;
    return this.http.get<SurveyQuestionsAnswersDTO[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllSurveysWithQuestionsAnswersAndStats(): Observable<SurveyQuestionsAnswersStatsDTO[]> {
    const url = `${this.baseUrl}/all-surveys-questions-answers-stats`;
    return this.http.get<SurveyQuestionsAnswersStatsDTO[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSurveyQuestionsAnswersByCareerComent(): Observable<any> {
    const url = `${this.baseUrl}/survey-questions-answers-by-career-coments`;
    return this.http.get<SurveyQuestionsAnswersDTO[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSurveyQuestionsAnswersByCareer(): Observable<any> {
    const url = `${this.baseUrl}/survey-questions-answers-by-career`;
    return this.http.get<SurveyQuestionsAnswersDTO[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getGraduadosWithUnansweredSurveys(): Observable<GraduadoWithUnansweredSurveysDTO[]> {
    const url = `${this.baseUrl}/unanswered-surveys`;
    return this.http.get<GraduadoWithUnansweredSurveysDTO[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSurveyQuestionsAnswersByCareer2(carrera: string): Observable<any> {
    const url = `${this.baseUrl}/survey-questions-answers-by-career-reportcontitulo?carreraNombre=${carrera}`;
    // Realiza la solicitud HTTP con los parámetros
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }


  getSurveyQuestionsAnswersByCareerWithCareerName(carreraNombre: string = ''): Observable<any> {
    const url = `${this.baseUrl}/survey-questions-answers-by-career-report?carreraNombre=${carreraNombre}`;
    // Realiza la solicitud HTTP con los parámetros
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEncuestasRespondidasPorGraduado(correoGraduado: string): Observable<any> {
    const url = `${this.baseUrl}/respondidas?correoGraduado=${correoGraduado}`;
    // Realiza la solicitud HTTP con los parámetros
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSurveyQuestionsAnswersByCareerWithCareerNameAndSurveyTitle(carreraNombre: string, surveyTitle: string) {
    const url = `${this.baseUrl}/survey-questions-answers-by-careerandsurveytitle-report?carreraNombre=${carreraNombre}&surveyTitle=${surveyTitle}`;
    // Realiza la solicitud HTTP con los parámetros
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    //console.error('Error en la petición:', error);

    let errorMessage = 'Error en la petición. Por favor, intenta nuevamente.';

    if (error.error instanceof ErrorEvent) {

      errorMessage = `Error: ${error.error.message}`;
    } else {

      // errorMessage = `Error código ${error.status}: ${error.error.message}`;
    }

    return throwError(errorMessage);
  }
}
