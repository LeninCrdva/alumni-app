import { Graduado } from "./graduado";
import { Carrera } from "./carrera";
import { Survey } from "./Survey";

export class Answer {
    id?: number;
    graduado?: Graduado;
    carrera?: Carrera;
    survey?: Survey;
    answers?: Record<number, string>;
    openAnswer?: string;

    constructor(
        id: number,
        graduado: Graduado | undefined,
        carrera: Carrera,
        survey: Survey,
        answers: Record<number, string>,
        openAnswer: string
    ) {
        this.id = id;
        this.graduado = graduado;
        this.carrera = carrera;
        this.survey = survey;
        this.answers = answers;
        this.openAnswer = openAnswer;
    }

    static createWithoutGraduado(
        id: number,
        carrera: Carrera,
        survey: Survey,
        answers: Record<number, string>,
        openAnswer: string
    ): Answer {
        return new Answer(id, undefined, carrera, survey, answers, openAnswer);
    }

    assignAnswerToQuestion(questionId: number, answer: string): void {
        if (!this.answers) {
            this.answers = {};
        }
        this.answers[questionId] = answer;
    }
}