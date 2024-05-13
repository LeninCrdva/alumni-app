import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fechaNacimientoValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const fechaNacimiento = new Date(control.value);
    const limiteInferior = new Date('1950-01-01');

    if (fechaNacimiento < limiteInferior) {
      return { 'fechaNacimientoInvalida': true };
    } else if (fechaNacimiento > new Date('2005-12-31')) {
      return { 'fechaNacimientoInvalida': true };
    }
    
    return null;
  };
}
