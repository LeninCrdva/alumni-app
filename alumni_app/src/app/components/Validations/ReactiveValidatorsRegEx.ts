export class ValidatorsUtil {

    static patternOnlyLettersValidator(): RegExp {
        return /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]{2,20}$/;
    }

    static patterOnlyNumbersValidator(): RegExp {
        return /^[0-9]{10}$/;
    }

    static patternOnlyLettersAndNumbersValidator(): RegExp {
        return /^[a-zA-Z][a-zA-Z0-9]{1,9}$/;
    }

    static patternPasswordValidator(): RegExp {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    }

    static patternEmailValidator(): RegExp {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    }

    static patternRucValidator(): RegExp {
        return /^[0-9]{13}$/;
    }

    static patternWebsiteValidator(): RegExp {
        return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
    }

    static patternPeriodNameValidator(): RegExp {
        return /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s0-9]{5,50}$/;
    }
}