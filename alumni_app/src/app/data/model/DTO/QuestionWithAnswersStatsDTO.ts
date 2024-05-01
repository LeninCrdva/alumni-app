export class QuestionWithAnswersStatsDTO {
    questionId: number;
    questionText: string;
    answers: string[];
    responsesByOption = new Map<string, number>();
    questionAnswers: string[];
    numResponses: number;
    totalGraduadosforcarrer: number;
    graduadosRespondidosforcarrer: number;
    typeQuestion: string;

    constructor(
        questionId: number,
        questionText: string,
        answers: string[],
        questionAnswers: string[],
        numResponses: number,
        totalGraduadosforcarrer: number,
        graduadosRespondidosforcarrer: number,
        typeQuestion: string,
    ) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.answers = answers;
        this.questionAnswers = questionAnswers;
        this.numResponses = numResponses;
        this.totalGraduadosforcarrer = totalGraduadosforcarrer;
        this.graduadosRespondidosforcarrer = graduadosRespondidosforcarrer;
        this.typeQuestion = typeQuestion;
    }
}