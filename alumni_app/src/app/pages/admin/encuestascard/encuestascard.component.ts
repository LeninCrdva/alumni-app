import { Component } from '@angular/core';
import { SurveyService } from '../../../data/service/SurveyService';
import { Survey } from '../../../data/model/Survey';
import { SurveyDetailsModalComponent } from '../survey-details-modal/survey-details-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { QuestionType ,Question} from '../../../data/model/Question';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-encuestascard',
  templateUrl: './encuestascard.component.html',
  styleUrl: './encuestascard.component.css'
})
export class EncuestascardComponent {
  surveys: Survey[] = [];

  constructor(private surveyService: SurveyService,private modalService: BsModalService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadSurveys();
    this.initForm();
  }

  loadSurveys(): void {
    this.surveyService.getAllSurveysWithQuestionsAndOptions()
      .subscribe(
        (surveys: Survey[]) => {
          this.surveys = surveys;
          //console.log('Encuestas con preguntas y opciones:', this.surveys);
        },
        (error) => {
          //console.error('Error al recuperar encuestas:', error);
        
        }
      );
  }

  viewSurvey(survey: Survey): void {
    const initialState = { survey }; 
    this.modalService.show(SurveyDetailsModalComponent, { initialState });
  }

 

  deleteSurvey(survey: Survey): void {
    const confirmMessage = '¿Estás seguro de eliminar esta encuesta?';
  
    Swal.fire({
      icon: 'warning',
      title: 'Confirmación',
      text: confirmMessage,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (survey.id === undefined) {
          console.error('ID de encuesta indefinido. No se puede eliminar.');
          return;
        }
  
        const surveyId = survey.id;
        this.surveyService.deleteSurveyById(surveyId).subscribe(
          () => {
            this.loadSurveys();
            Swal.fire({
              icon: 'success',
              title: 'Encuesta eliminada exitosamente',
              timer: 1500,
              showConfirmButton: false
            });
          },
          (error) => {
            console.error('Error al eliminar encuesta:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar encuesta',
              text: 'No se pudo eliminar la encuesta debido a que tiene respuestas asociadas.',
              confirmButtonText: 'Entendido'
            });
          }
        );
      } else {
        console.log('Acción cancelada. No se eliminará la encuesta.');
      }
    });
  }
  

  //Para modificar la encuesta
  form: FormGroup | any;
   idNumber: number | undefined;
   questionTypeLabels = {
    [QuestionType.ABIERTA]: 'Pregunta Abierta',
    [QuestionType.OPCION_MULTIPLE]: 'Opción Múltiple',
    [QuestionType.CALIFICACION_1_10]: 'Calificación 1/10',
    [QuestionType.CALIFICACION_1_5]: 'Calificación 1/5',
    [QuestionType.SI_NO]: 'Sí / No',
    [QuestionType.OPCION_MULTIPLEUNICO]: 'Opción Múltiple Único'
  };

  questionTypes: QuestionType[] = [
    QuestionType.ABIERTA,
    QuestionType.OPCION_MULTIPLE,
    QuestionType.CALIFICACION_1_10,
    QuestionType.CALIFICACION_1_5,
    QuestionType.SI_NO,
    QuestionType.OPCION_MULTIPLEUNICO
  ];
  initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required], 
      description: [''],
      questions: this.fb.array([]) 
    });
  }
  private convertToQuestionType(value: string | null): QuestionType {
    if (value && Object.values(QuestionType).includes(value as QuestionType)) {
      return value as QuestionType;
    }
    throw new Error(`Tipo de pregunta inválido: ${value}`);
  }
  
 
  
  loadSurveyToForm(survey: Survey): void {
    this.form.patchValue({
      title: survey.title,
      description: survey.description
    });

    const questionsArray = this.form.get('questions') as FormArray;
    questionsArray.clear();

    survey.questions.forEach(question => {
      const questionGroup = this.fb.group({
        id: [question.id],
        text: [question.text, Validators.required],
        type: [this.convertToQuestionType(question.type), Validators.required],
        options: [question.options.join('\n')]
      });
      questionGroup.get('type')?.valueChanges.subscribe(value => {
        const convertedType = this.convertToQuestionType(value); // Convertir el valor seleccionado
        questionGroup.get('type')?.setValue(convertedType, { emitEvent: false }); // Actualizar el control sin emitir evento
      });
      const typeControl = questionGroup.get('type');
      typeControl?.valueChanges.subscribe(value => {
        if (value === QuestionType.CALIFICACION_1_5) {
          questionGroup.get('options')?.setValue('1\n2\n3\n4\n5'); // Establecer valores del 1 al 5
        } else if (value === QuestionType.CALIFICACION_1_10) {
          questionGroup.get('options')?.setValue('1\n2\n3\n4\n5\n6\n7\n8\n9\n10'); // Establecer valores del 1 al 10
        } else if (value === QuestionType.SI_NO) {
          questionGroup.get('options')?.setValue('Sí\nNo'); // Establecer valores de Sí/No
        }

        if (value === QuestionType.CALIFICACION_1_5 ||
            value === QuestionType.CALIFICACION_1_10 ||
            value === QuestionType.SI_NO) {
          questionGroup.get('options')?.disable(); 
        } else {
          questionGroup.get('options')?.enable(); 
        }
      });

    
      if (typeControl?.value === QuestionType.CALIFICACION_1_5) {
        questionGroup.get('options')?.setValue('1\n2\n3\n4\n5'); 
        questionGroup.get('options')?.disable(); 
      } else if (typeControl?.value === QuestionType.CALIFICACION_1_10) {
        questionGroup.get('options')?.setValue('1\n2\n3\n4\n5\n6\n7\n8\n9\n10'); 
        questionGroup.get('options')?.disable(); 
      } else if (typeControl?.value === QuestionType.SI_NO) {
        questionGroup.get('options')?.setValue('Sí\nNo'); 
        questionGroup.get('options')?.disable();
      }
      questionsArray.push(questionGroup);
    });
  }
  


  
  updateSurvey(survey: Survey): void {
    this.loadSurveyToForm(survey);
    this.idNumber=survey.id;
    ($('#editModal') as any).modal('show');
  }
  confirmUpdateState(event: any, survey: Survey): void {
    const confirmMessage = `¿Quieres activar/desactivar la encuesta "${survey.title}"?`;
  
    Swal.fire({
      icon: 'question',
      title: 'Confirmación',
      text: confirmMessage,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const newEstado = !survey.estado;
  
        if (survey.id === undefined) {
          console.error('ID de encuesta indefinido. No se puede actualizar el estado.');
          return;
        }
  
        const surveyId = survey.id;
        this.surveyService.updateSurveyState(surveyId, newEstado).subscribe(
          updatedSurvey => {
            survey.estado = newEstado;
          }
        );
      } else {
        // Si el usuario cancela, restaurar el estado original del checkbox
        event.target.checked = survey.estado; 
        console.log('Acción cancelada. No se actualizará el estado.');
      }
    });
  }
  
  

  saveSurveyChanges(): void {
    if (this.form.valid) {
      const updatedSurvey = {
        id: this.idNumber,
        title: this.form.value.title,
        estado:false,
        description: this.form.value.description,
        questions: this.form.value.questions.map((question: any) => {
          let options: string[] = [];
        
  
          // Determinar las opciones basadas en el tipo de pregunta
          if (question.type === QuestionType.CALIFICACION_1_5) {
            options = ['1', '2', '3', '4', '5'];
          } else if (question.type === QuestionType.CALIFICACION_1_10) {
            options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
          } else if (question.type === QuestionType.ABIERTA) {
            options = [];
          } else if (question.type === QuestionType.SI_NO) {
            options = ['Sí', 'No'];
          } else {
            // Para otros tipos de pregunta, obtener las opciones del formulario
            options = question.options ? question.options.split('\n') : [];
          }
  
          return {
            id: question.id,
            text: question.text,
            type: this.convertToQuestionType(question.type.toString()),
            options: options
          };
        })
      };
  
      if (this.idNumber === undefined) {
        console.error('ID de encuesta indefinido. No se puede actualizar.');
        return;
      }
  
      const updatesurveyId = this.idNumber;
    //  console.log('ID de la encuesta update:', updatesurveyId, ',Datos mandados:', updatedSurvey);
  
      // Llamar al servicio para actualizar la encuesta
        this.surveyService.updateSurvey(updatesurveyId, updatedSurvey).subscribe(
            () => {
              
              ($('#editModal') as any).modal('hide');
              Swal.fire({
                icon: 'success',
                title: 'Actualización completada',
                showConfirmButton: true, 
                confirmButtonText: 'Cerrar',
              }).then((result) => {
                
                if (result.isConfirmed) {
                  
                  Swal.close();
                  location.reload();
                }
              });
              
             
            },
            (error) => {
              
             
              Swal.fire({
                icon: 'error',
                title: 'No se pudo actualizar la encuesta',
                text: 'La encuesta no puede ser actualizada porque ya tiene respuestas o el título ya está siendo utilizado por otra encuesta.',
                confirmButtonText: 'Entendido'
              });
              
            }
          );
      
  
    } else {
      // Formulario inválido o ID no disponible
      Swal.fire({
        icon: 'warning',
        title: 'Por favor completa el formulario correctamente antes de guardar.',
        confirmButtonText: 'Entendido'
      });
      
    }
  }
  
 
  removeQuestion(qI: number): void {
    const questionsArray = this.form.get('questions') as FormArray;
    
   
    const totalQuestions = questionsArray.length;
    
   
    for (let i = totalQuestions - 1; i >= 0; i--) {
      if (i === qI) {
       
        questionsArray.removeAt(i);
        break; 
      }
    }
  }
  
  
  addNewQuestion(): void {
    const questionsArray = this.form.get('questions') as FormArray;
    if (questionsArray.length >= 40) {
      alert('Se ha alcanzado el límite máximo de preguntas (40). No se pueden agregar más preguntas.');
      return; 
    }
    const newQuestionGroup = this.fb.group({
      id: [null],
      text: ['', Validators.required],
      type: [QuestionType.ABIERTA, Validators.required],
      options: [''] 
    });
  
  
    newQuestionGroup.get('type')?.valueChanges.subscribe(value => {
      if (value === QuestionType.CALIFICACION_1_5) {
        newQuestionGroup.get('options')?.setValue('1\n2\n3\n4\n5'); 
        newQuestionGroup.get('options')?.disable(); 
      } else if (value === QuestionType.CALIFICACION_1_10) {
        newQuestionGroup.get('options')?.setValue('1\n2\n3\n4\n5\n6\n7\n8\n9\n10'); 
        newQuestionGroup.get('options')?.disable(); 
      } else if (value === QuestionType.SI_NO) {
        newQuestionGroup.get('options')?.setValue('Sí\nNo'); 
        newQuestionGroup.get('options')?.disable(); 
      } else {
        newQuestionGroup.get('options')?.enable();
      }
    });
  
    // Agregar el nuevo grupo de pregunta al arreglo de preguntas en el formulario
    questionsArray.push(newQuestionGroup);
  }
  
  
}
