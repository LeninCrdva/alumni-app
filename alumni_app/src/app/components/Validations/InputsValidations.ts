export class InputsValidations {
    static isEmail(email: string): boolean {
        // Expresión regular para validar un formato de correo electrónico básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static onlyNumbers(value: string): boolean {
        // Expresión regular para validar que la cadena contiene solo números
        const numbersRegex = /^[0-9]+$/;
        return numbersRegex.test(value);
    }

    static onlyLetters(value: string): boolean {
        // Expresión regular para validar que la cadena contiene solo letras
        const lettersRegex = /^[a-zA-Z]+$/;
        return lettersRegex.test(value);
    }

    // Note: Evento de tipo keyevent (Solo se podra escribir numeros en el input)
    static allowOnlyNumbers(event: any) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    // Note: Evento de tipo keyevent (Solo se podra escribir letras en el input)
    static allowOnlyLetters(event: KeyboardEvent): void {
        const inputChar = String.fromCharCode(event.charCode);
        const lettersRegex = /^[a-zA-Z]+$/;

        if (!lettersRegex.test(inputChar)) {
            event.preventDefault();
        }
    }
}