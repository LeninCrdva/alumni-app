export enum EstadoPostulacion {
    CANCELADA_POR_ADMINISTRADOR,
    CANCELADA_POR_GRADUADO,
    APLICANDO,
    NO_PRESENTADO,
    RECHAZADO,
    ACEPTADO
}

export enum EstadoOfertaLaboral {
    EN_CONVOCATORIA,
    EN_EVALUACION,
    EN_SELECCION,
    FINALIZADA,
    CANCELADA,
    REACTIVADA
}

export enum AuditActionType {
    INSERT,
    UPDATE,
    DELETE
}