import { Question } from "./Question";
export class Survey {
    id?: number;
    title: string;
    description: string;
    questions: Question[];
    estado?: boolean = false;
    constructor(title: string, description: string,estado:boolean, questions: Question[] = []) {
        this.title = title;
        this.description = description;
        this.questions = questions.slice(); 
        this.estado = estado;
    }
}   