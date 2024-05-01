export class AnswerSearchDTO {
    id?: number;
    graduadoEmail: string;
    carreraNombre: string;
    surveyTitle: string;
    questionResponses: Record<number, string>;
    openAnswer?: string;
  
    constructor(
      id: number,
      graduadoEmail: string,
      carreraNombre: string,
      surveyTitle: string,
      questionResponses: Record<number, string>,
      openAnswer: string
    ) {
      this.id = id;
      this.graduadoEmail = graduadoEmail;
      this.carreraNombre = carreraNombre;
      this.surveyTitle = surveyTitle;
      this.questionResponses = questionResponses;
      this.openAnswer = openAnswer;
    }

    assignResponseToQuestion(questionId: number, response: string): void {
      this.questionResponses[questionId] = response;
    }
  }