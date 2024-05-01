import { Survey } from "./Survey";
export class Question {
    id?: number;
    'text': string;
    'type': QuestionType;
    'survey'?: Survey;
    'options': string[];

    constructor(text: string, type: QuestionType, options: string[] = []) {
        this.text = text;
        this.type = type;
        this.options = options;
    }
}

export enum QuestionType {
    ABIERTA = 'ABIERTA',
    OPCION_MULTIPLE = 'OPCION_MULTIPLE',
    CALIFICACION_1_10 = 'CALIFICACION_1_10',
    CALIFICACION_1_5 = 'CALIFICACION_1_5',
    SI_NO = 'SI_NO',
    OPCION_MULTIPLEUNICO='OPCION_MULTIPLEUNICO'
}
