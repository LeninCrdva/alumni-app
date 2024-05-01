import { Component, Input,OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Survey } from '../../../data/model/Survey';
import { Question,QuestionType } from '../../../data/model/Question';
import { ApiService } from '../../../data/service/api.service';
import { AnswerSearchDTO } from '../../../data/model/DTO/AnswerSearchDTO';
import { AnswerService } from '../../../data/service/AnswerService';
import { GraduadoService } from '../../../data/service/graduado.service';
import Swal from 'sweetalert2';
import { Graduado3 } from '../../../data/model/graduado';
@Component({
  selector: 'app-encuestasaresponderform',
  templateUrl: './encuestasaresponderform.component.html',
  styleUrl: './encuestasaresponderform.component.css'
})

export class EncuestasaresponderformComponent {
    @Input() survey: Survey = new Survey('', '',false ,[]);
    public carreras: string[] = []; 
     public selectedCarrera: string = ''; 
     public userEmail: string = '';
     public surveyTitle: string = '';
     public comentario: string = '';
     usuarioGuardado: string = localStorage.getItem('name') || '';
     public PreguntasRespeustas: Record<number, string> = {};
    constructor(public bsModalRef: BsModalRef,private apiservice: ApiService
      , private answerService:AnswerService,
      private graduadoService: GraduadoService) {} 
    ngOnInit(): void {
      this.surveyTitle = this.survey.title;
      this.apiservice.getCarreras().subscribe(
        (data) => {
          this.carreras = data.map((carrera: any) => carrera.nombre) || [];
          //console.log("carreras: ", this.carreras);
        },
        (error) => {
          console.error('Error al obtener el listado de carreras:', error);
        }
      );
      this.usuarioGuardado = localStorage.getItem('name') || '';
      this,this.buscarGraduadosPorUsuario();
     
    }
    graduate: Graduado3 = new Graduado3();
    
  buscarGraduadosPorUsuario() {
    this.graduadoService.searchGraduadosByUsuario(this.usuarioGuardado).subscribe(
      graduadosEncontrados => {
        this.graduate = graduadosEncontrados[0];
        this.userEmail=this.graduate.emailPersonal;
      }
    );
  }
    mandarRespuestas(answerDTO: AnswerSearchDTO): void {
      this.answerService.saveAnswer(answerDTO).subscribe(
        (respuesta) => {
          Swal.fire({
            icon: 'success',
            title: 'Respuesta enviada con éxito',
            confirmButtonText: 'Entendido'
          }).then(() => {
            this.limpiarRespuestas();
            this.bsModalRef.hide();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar la respuesta',
            text: 'Por favor inténtalo de nuevo. y revise el corrreo electronico que esta ingresando',
            confirmButtonText: 'Entendido'
          });
        }
      );
    }
    
  limpiarRespuestas(): void {
    this.userEmail = '';
    this.comentario='';
    this.selectedCarrera = '';
    this.PreguntasRespeustas = {};
    this.selectedOptions = [];
  }
    isQuestionAbierta(question: Question): boolean {
      return question.type === QuestionType.ABIERTA;
    }
  
    isQuestionOpcionMultiple(question: Question): boolean {
      return question.type === QuestionType.OPCION_MULTIPLE;
    }
    isQuestionOpcionMultipleUnico(question: Question): boolean {
      return question.type === QuestionType.OPCION_MULTIPLEUNICO;
    }
  
    isQuestionCalificacion1_10(question: Question): boolean {
      return question.type === QuestionType.CALIFICACION_1_10;
    }
  
    isQuestionCalificacion1_5(question: Question): boolean {
      return question.type === QuestionType.CALIFICACION_1_5;
    }
  
    isQuestionSiNo(question: Question): boolean {
      return question.type === QuestionType.SI_NO;
    }
  
    getOptions(question: Question): string[] {
      if (question.type === QuestionType.CALIFICACION_1_10) {
        return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
      } else if (question.type === QuestionType.CALIFICACION_1_5) {
        return ['1', '2', '3', '4', '5'];
      } else if (question.type === QuestionType.SI_NO) {
        return ['Sí', 'No'];
      } else if (question.type === QuestionType.OPCION_MULTIPLEUNICO) {
       
        return question.options || [];
      } else {
        return []; 
      }
    }

    validarRespuestas(): boolean {
      if (!this.userEmail || !this.selectedCarrera || !this.PreguntasRespeustas || Object.keys(this.PreguntasRespeustas).length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Por favor responda las preguntas.',
          confirmButtonText: 'Entendido'
        });
        return false;
      }
      return true;
    }
    
    
    selectedOptions: SelectedOption[] = [];
  
    toggleOption(questionId: number | undefined, option: string): void {
      const selectedOption: SelectedOption = { questionId, option };
    
      const index = this.selectedOptions.findIndex(opt =>
        opt.questionId === questionId && opt.option === option
      );
    
      if (index === -1) {
        // Si la opción no está en el array, la añadimos
        this.selectedOptions.push(selectedOption);
      } else {
        // Si la opción ya está en el array, la eliminamos
        this.selectedOptions.splice(index, 1);
      }
    
      //console.log(this.selectedOptions); // Imprimir el array para verificarlo
    }
    
    responderEncuesta(): void {
      // Objeto para almacenar las respuestas
      const respuestas: Record<number, string> = {};
    
      // Procesar cada pregunta y sus respuestas
      this.survey.questions.forEach(question => {
        let respuesta: string = '';
    
        if (this.isQuestionOpcionMultiple(question)) {
          const respuestasSeleccionadas = this.selectedOptions.filter(opt =>
            opt.questionId === question.id
          );
    
          if (respuestasSeleccionadas.length > 0) {
            const opcionesSeleccionadas = respuestasSeleccionadas.map(opt => opt.option);
            respuesta = opcionesSeleccionadas.join('-');
          }
        } else if (this.isQuestionOpcionMultipleUnico(question)) {
          // Para preguntas de opción única
          const radio = document.querySelector(`input[name='${question.id}']:checked`) as HTMLInputElement | null;
          if (radio) {
            respuesta = radio.value;
          }
        } else if (this.isQuestionAbierta(question)) {
          const textbox = document.querySelector(`#question_${question.id}`) as HTMLInputElement | null; // Buscar por id
          if (textbox) {
            respuesta = textbox.value;
          }
        } else if (this.isQuestionCalificacion1_10(question) || this.isQuestionCalificacion1_5(question) || this.isQuestionSiNo(question)) {
          // Para preguntas de calificación (1-10, 1-5, Sí/No)
          const radio = document.querySelector(`input[name='${question.id}']:checked`) as HTMLInputElement | null;
          if (radio) {
            respuesta = radio.value;
          }
        }
    
      
        if (respuesta ) {
          if (question.id === undefined) {
            console.error('ID de pregunta indefinido. No se puede agregar.');
            return;
          }
          respuestas[question.id] = respuesta;
        }
      });
    
      // Guardar las respuestas en la variable PreguntasRespeustas
      this.PreguntasRespeustas = respuestas;
    
      if (this.validarRespuestas()) {
        // Crear el DTO de respuesta para enviar
        const answerDTO: AnswerSearchDTO = new AnswerSearchDTO(
          0,
          this.userEmail,
          this.selectedCarrera,
          this.surveyTitle,
          this.PreguntasRespeustas,
          this.comentario
        );
    
        // Enviar las respuestas
        this.mandarRespuestas(answerDTO);
      } 
      
    }
    
  


    
}
interface SelectedOption {
  questionId: number|undefined;
  option: string;
}