import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ValidatorEc {
    private coeficientesCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    private coeficientesRucPrivado = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    private coeficientesRucPublico = [3, 2, 7, 6, 5, 4, 3, 2];

    constructor() { }

    validarCedula(cedula: string): boolean {
        if (!this.validarLongitud(cedula, 10)) return false;
        if (!this.validarCodigoProvincia(cedula.slice(0, 2))) return false;
        if (!this.validarTercerDigito(cedula[2], 'cedula')) return false;

        const digitoVerificador = parseInt(cedula[9], 10);
        const digitosIniciales = cedula.slice(0, 9);

        return this.algoritmoModulo10(digitosIniciales, digitoVerificador);
    }

    validarRucPersonaNatural(ruc: string): boolean {
        if (!this.validarLongitud(ruc, 13)) return false;
        if (!this.validarCodigoProvincia(ruc.slice(0, 2))) return false;
        if (!this.validarTercerDigito(ruc[2], 'ruc_natural')) return false;
        if (!this.validarCodigoEstablecimiento(ruc.slice(10, 13))) return false;

        const digitoVerificador = parseInt(ruc[9], 10);
        const digitosIniciales = ruc.slice(0, 9);

        return this.algoritmoModulo10(digitosIniciales, digitoVerificador);
    }

    validarRucSociedadPrivada(ruc: string): boolean {
        if (!this.validarLongitud(ruc, 13)) return false;
        if (!this.validarCodigoProvincia(ruc.slice(0, 2))) return false;
        if (!this.validarTercerDigito(ruc[2], 'ruc_privada')) return false;
        if (!this.validarCodigoEstablecimiento(ruc.slice(10, 13))) return false;

        const digitoVerificador = parseInt(ruc[9], 10);
        const digitosIniciales = ruc.slice(0, 9);

        return this.algoritmoModulo11(digitosIniciales, digitoVerificador, 'ruc_privada');
    }

    validarRucSociedadPublica(ruc: string): boolean {
        if (!this.validarLongitud(ruc, 13)) return false;
        if (!this.validarCodigoProvincia(ruc.slice(0, 2))) return false;
        if (!this.validarTercerDigito(ruc[2], 'ruc_publica')) return false;
        if (!this.validarCodigoEstablecimiento(ruc.slice(9, 13))) return false;

        const digitoVerificador = parseInt(ruc[8], 10);
        const digitosIniciales = ruc.slice(0, 8);

        return this.algoritmoModulo11(digitosIniciales, digitoVerificador, 'ruc_publica');
    }

    private validarLongitud(numero: string, longitudEsperada: number): boolean {
        return numero.length === longitudEsperada;
    }

    private validarCodigoProvincia(codigo: string): boolean {
        const codigoProvincia = parseInt(codigo, 10);
        return codigoProvincia > 0 && codigoProvincia <= 24 || codigoProvincia === 30;
    }

    private validarTercerDigito(tercerDigito: string, tipo: 'cedula' | 'ruc_natural' | 'ruc_privada' | 'ruc_publica'): boolean {
        const digito = parseInt(tercerDigito, 10);
        switch (tipo) {
            case 'cedula':
            case 'ruc_natural':
                return digito >= 0 && digito <= 5;
            case 'ruc_privada':
                return digito === 9;
            case 'ruc_publica':
                return digito === 6;
            default:
                return false;
        }
    }

    private validarCodigoEstablecimiento(codigo: string): boolean {
        const codigoEstablecimiento = parseInt(codigo, 10);
        return codigoEstablecimiento >= 1;
    }

    private algoritmoModulo10(digitosIniciales: string, digitoVerificador: number): boolean {
        let total = 0;
        for (let i = 0; i < digitosIniciales.length; i++) {
            const digito = parseInt(digitosIniciales[i], 10);
            let valorPosicion = digito * this.coeficientesCedula[i];
            if (valorPosicion >= 10) {
                valorPosicion = valorPosicion.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
            }
            total += valorPosicion;
        }

        const residuo = total % 10;
        const resultado = residuo === 0 ? 0 : 10 - residuo;

        return resultado === digitoVerificador;
    }

    private algoritmoModulo11(digitosIniciales: string, digitoVerificador: number, tipo: 'ruc_privada' | 'ruc_publica'): boolean {
        let coeficientes: number[];
        if (tipo === 'ruc_privada') {
            coeficientes = this.coeficientesRucPrivado;
        } else {
            coeficientes = this.coeficientesRucPublico;
        }

        let total = 0;
        for (let i = 0; i < digitosIniciales.length; i++) {
            const digito = parseInt(digitosIniciales[i], 10);
            total += digito * coeficientes[i];
        }

        const residuo = total % 11;
        const resultado = residuo === 0 ? 0 : 11 - residuo;

        return resultado === digitoVerificador;
    }
}