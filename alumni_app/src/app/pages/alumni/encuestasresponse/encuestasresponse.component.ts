import { Component } from '@angular/core';
import { SurveyService } from '../../../data/service/SurveyService';
import { Survey } from '../../../data/model/Survey';
import { EncuestasaresponderformComponent } from '../encuestasaresponderform/encuestasaresponderform.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-encuestasresponse',
  templateUrl: './encuestasresponse.component.html',
  styleUrls: ['./encuestasresponse.component.css']
})
export class EncuestasresponseComponent {
  surveys: Survey[] = [];

  constructor(private surveyService: SurveyService, private modalService: BsModalService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.surveyService.getAllSurveysWithQuestionsAndOptions()
      .subscribe(
        (surveys: Survey[]) => {
          this.surveys = surveys.filter(survey => survey.estado === true);
        },
        (error) => {
          // Manejar errores aquí
        }
      );
  }

  viewSurvey(survey: Survey): void {
    const initialState = { survey };
    const modalOptions: ModalOptions = {
      initialState,
      class: 'modal-lg' // Aquí es donde especificas el tamaño del modal
    };
    this.modalService.show(EncuestasaresponderformComponent, modalOptions);
  }
}
