import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Survey } from '../model/Survey';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private baseUrl = environment.apiURL + '/api/surveys';

  constructor(private http: HttpClient) { }

  saveOrUpdateSurvey(survey: Survey): Observable<Survey> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Survey>(this.baseUrl, survey, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  getSurveyById(surveyId: number): Observable<Survey> {
    return this.http.get<Survey>(`${this.baseUrl}/${surveyId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteSurveyById(surveyId: number): Observable<void> {
    const url = `${this.baseUrl}/${surveyId}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  addQuestionToSurvey(surveyId: number, question: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(`${this.baseUrl}/${surveyId}/questions`, question, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteSurveyAndRelated(surveyId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${surveyId}/related`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateSurvey(surveyId: number, updatedSurvey: Survey): Observable<Survey> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<Survey>(`${this.baseUrl}/${surveyId}`, updatedSurvey, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  getAllSurveysWithQuestionsAndOptions(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.baseUrl}/withQuestionsAndOptions`);
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

  updateSurveyState(surveyId: number, newEstado: boolean): Observable<Survey> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const url = `${this.baseUrl}/${surveyId}/updateState`;
    const queryParams = `newEstado=${newEstado}`;

    return this.http.put<Survey>(`${url}?${queryParams}`, null, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

}