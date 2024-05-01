export class QuestionWithAnswersDTO {
    questionId: number;
    surveyTitle: string;
    surveyDescription: string;
    questionText: string;
    answers: string[];
  
    constructor(
      questionId: number,
      surveyTitle: string,
      surveyDescription: string,
      questionText: string,
      answers: string[]
    ) {
      this.questionId = questionId;
      this.surveyTitle = surveyTitle;
      this.surveyDescription = surveyDescription;
      this.questionText = questionText;
      this.answers = answers;
    }
  }