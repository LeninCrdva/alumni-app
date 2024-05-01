import { QuestionWithAnswersStatsDTO } from "./QuestionWithAnswersStatsDTO";

export class SurveyQuestionsAnswersStatsDTO{
    surveyId: number;
    surveyTitle: string;
    surveyDescription: string;
    questionsWithAnswers: QuestionWithAnswersStatsDTO[];
    totalGraduados: number;
    graduadosRespondidos: number;
    
    constructor(
      surveyId: number,
      surveyTitle: string,
      surveyDescription: string,
      questionsWithAnswers: QuestionWithAnswersStatsDTO[],
      totalGraduados: number,
      graduadosRespondidos: number
    ) {
      this.surveyId = surveyId;
      this.surveyTitle = surveyTitle;
      this.surveyDescription = surveyDescription;
      this.questionsWithAnswers = questionsWithAnswers;
      this.totalGraduados = totalGraduados;
      this.graduadosRespondidos = graduadosRespondidos;
    }
}