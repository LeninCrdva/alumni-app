import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import {  BsModalRef } from 'ngx-bootstrap/modal';
import { Survey } from '../../../data/model/Survey';
import { Question,QuestionType } from '../../../data/model/Question';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-encuesta-detalle-modal',
  templateUrl: './encuesta-detalle-modal.component.html',
  styleUrl: './encuesta-detalle-modal.component.css'
})
export class EncuestaDetalleModalComponent {

  @Input() survey: Survey = new Survey('', '',false ,[]);
  @ViewChild('elementToCapture') elementToCapture!: ElementRef<HTMLDivElement>;
  constructor(public bsModalRef: BsModalRef) {} 

  downloadAsPDF(): void {
    const element = document.getElementById('elementToCapture');
  
    if (element) {
      html2canvas(element, {
        scrollY: -window.scrollY, // Capturar todo el contenido incluido el desplazamiento vertical
        scale: 1, // Ajustar la escala si es necesario
      }).then((canvas) => {
        const imgWidth = 210; // Ancho de la página A4 en mm (210mm para retrato)
        const scaleFactor = imgWidth / canvas.width;
        const imgHeight = canvas.height * scaleFactor;
  
        const doc = new jsPDF('p', 'mm', 'a4');
        doc.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);
        doc.save('encuesta.pdf');
      });
    } else {
      console.error('No se encontró el elemento para capturar.');
    }
  }
  getQuestionTypeLabel(question: Question): string {
    switch (question.type) {
      case QuestionType.ABIERTA:
        return 'Pregunta Abierta';
      case QuestionType.OPCION_MULTIPLE:
        return 'Pregunta de Opción Múltiple';
      case QuestionType.OPCION_MULTIPLEUNICO:
        return 'Pregunta de Opción Múltiple Única';
      case QuestionType.CALIFICACION_1_10:
        return 'Calificación del 1 al 10';
      case QuestionType.CALIFICACION_1_5:
        return 'Calificación del 1 al 5';
      case QuestionType.SI_NO:
        return 'Sí o No';
      default:
        return 'Tipo de Pregunta Desconocido';
    }
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
}
