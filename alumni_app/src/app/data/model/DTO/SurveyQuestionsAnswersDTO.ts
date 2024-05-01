import { QuestionWithAnswersDTO } from "./QuestionWithAnswersDTO";
export class SurveyQuestionsAnswersDTO {
    surveyId: number;
    surveyTitle: string;
    surveyDescription: string;
    questionsWithAnswers: QuestionWithAnswersDTO[];
  
    constructor(
      surveyId: number,
      surveyTitle: string,
      surveyDescription: string,
      questionsWithAnswers: QuestionWithAnswersDTO[]
    ) {
      this.surveyId = surveyId;
      this.surveyTitle = surveyTitle;
      this.surveyDescription = surveyDescription;
      this.questionsWithAnswers = questionsWithAnswers;
    }
  }