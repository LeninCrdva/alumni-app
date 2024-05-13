import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurveyService } from '../../../data/service/SurveyService';
import { Survey } from '../../../data/model/Survey';
import { QuestionType, Question } from '../../../data/model/Question';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrl: './encuestas.component.css'
})
export class EncuestasComponent {
  
  form: FormGroup | any;

  constructor(
    private fb: FormBuilder, private surveyService: SurveyService
  ) { }

  ngOnInit() {
    this.setForm()
  }

  setForm() {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      questions: this.fb.array([])
    })
  }

  async create() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return alert('Por favor, ingrese los datos como se indica.');
    }

    const formData = this.form.value;
    console.log("Preguntas:", formData.questions);
    const questions: Question[] = formData.questions.map((questionData: any) => {
      let type: QuestionType;

      switch (questionData.type) {
        case 1:
          type = QuestionType.ABIERTA;
          break;
        case '2':
          type = QuestionType.OPCION_MULTIPLE;
          break;
        case '3':
          type = QuestionType.CALIFICACION_1_10;
          break;
        case '4':
          type = QuestionType.CALIFICACION_1_5;
          break;
        case '5':
          type = QuestionType.SI_NO;
          break;
        case '6':
          type = QuestionType.OPCION_MULTIPLEUNICO;
          break;
        default:
          throw new Error(`Tipo de pregunta inválido: ${questionData.type}`);
      }


      const options: string[] = questionData.options.map((option: any) => option.title);

      return new Question(questionData.title, type, options || []);
    });
    
    console.log("Preguntas trasnformadas:", questions);
    const newSurvey: Survey = {
      title: formData.title,
      description: formData.description,
      questions: questions,
      estado: false
    };

    console.log('Survey:', newSurvey.questions);

    try {
      const response = await this.surveyService.saveOrUpdateSurvey(newSurvey).toPromise();

      if (response) {
       // console.log('Respuesta del servicio:', response);
        alert('Encuesta creada exitosamente.');
      } else {
        alert('Error: Respuesta del servicio no válida.');
      }

      // Reiniciar el formulario después de la creación exitosa
      this.setForm();
    } catch (error) {
      console.error('Error al crear la encuesta:', error);
      alert('Error al crear la encuesta. Por favor, inténtalo de nuevo.');
    }
  }

  addQuestion() {
    const questions: FormArray = this.form.get('questions') as FormArray
    if (questions.length >= 100) {
      Swal.fire({
        icon: 'warning',
        title: '¡Límite máximo de preguntas alcanzado!',
        text: 'Ya has alcanzado el límite máximo de preguntas.',
      });
      return;
    }
    
    questions.push(this.fb.group({
      title: [null, [Validators.required]],
      type: [1, [Validators.required]],
      options: this.fb.array([])
    }))

    const question: FormGroup = questions.controls[(questions.length - 1)] as FormGroup

    question.get('type')?.valueChanges.subscribe(type => {
      const options: FormArray = question.get('options') as FormArray

      while (options.length !== 0) {
        options.removeAt(0)
      }

      switch (type) {
        case '2':
          options.push(this.fb.group({
            title: [null, [Validators.required]]
          }))

          question.get('options')?.setValidators([Validators.required])
          question.get('options')?.updateValueAndValidity()
          break

        case '3':
          options.push(this.fb.group({
            title: 1
          }))

          options.push(this.fb.group({
            title: 2
          }))

          options.push(this.fb.group({
            title: 3
          }))

          options.push(this.fb.group({
            title: 4
          }))

          options.push(this.fb.group({
            title: 5
          }))

          options.push(this.fb.group({
            title: 6
          }))

          options.push(this.fb.group({
            title: 7
          }))

          options.push(this.fb.group({
            title: 8
          }))

          options.push(this.fb.group({
            title: 9
          }))

          options.push(this.fb.group({
            title: 10
          }))

          question.get('options')?.setValidators([Validators.required])
          question.get('options')?.updateValueAndValidity()
          break

        case '4':
          options.push(this.fb.group({
            title: 1
          }))

          options.push(this.fb.group({
            title: 2
          }))

          options.push(this.fb.group({
            title: 3
          }))

          options.push(this.fb.group({
            title: 4
          }))

          options.push(this.fb.group({
            title: 5
          }))

          question.get('options')?.setValidators([Validators.required])
          question.get('options')?.updateValueAndValidity()
          break

        case '5':
          options.push(this.fb.group({
            title: 'Si'
          }))

          options.push(this.fb.group({
            title: 'No'
          }))

          question.get('options')?.setValidators([Validators.required])
          question.get('options')?.updateValueAndValidity()
          break
        case '6':
          options.push(this.fb.group({
            title: [null, [Validators.required]]
          }))

          question.get('options')?.setValidators([Validators.required])
          question.get('options')?.updateValueAndValidity()
          break

        default:
          question.get('options')?.clearValidators()
          question.get('options')?.updateValueAndValidity()
          break
      }
    })
  }

  removeQuestion(qI: number) {
    const questions: FormArray = this.form.get('questions') as FormArray

    questions.removeAt(qI)
  }

  addOption(qI: number) {
    const questions: FormArray = this.form.get('questions') as FormArray
    const options: FormArray = questions.controls[qI].get('options') as FormArray

    options.push(this.fb.group({
      title: [null, [Validators.required]]
    }))
  }

  removeOption(qI: number, oI: number) {
    const questions: FormArray = this.form.get('questions') as FormArray
    const options: FormArray = questions.controls[qI].get('options') as FormArray

    options.removeAt(oI)
  }
}