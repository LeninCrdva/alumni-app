import { Component, OnInit } from '@angular/core';
import { GraduadoWithUnansweredSurveysDTO } from '../../../data/model/DTO/GraduadoWithUnansweredSurveysDTO';
import { AnswerService } from '../../../data/service/AnswerService';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.css'
})
export class SeguimientoComponent implements OnInit {
  
  unanswerList: GraduadoWithUnansweredSurveysDTO[] = [];
  answerList: any[] = [];
  selectedFilter: string = 'with-answers';

  constructor(private answerService: AnswerService) { }

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

}
