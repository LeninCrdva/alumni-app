package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.model.enums.EstadoOferta;
import ec.edu.ista.springgc1.view.View;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

@Data
public class OfertasLaboralesDTO implements Serializable {

    @JsonView({View.Postulacion.class, View.Public.class})
    private Long id;

    @JsonView({View.Postulacion.class, View.Public.class})
    private double salario;

    @DateTimeFormat(pattern = "YYYY-MM-dd HH:mm:ss")
    @JsonView({View.Postulacion.class, View.Public.class})
    private LocalDateTime fechaCierre;

    @DateTimeFormat(pattern = "YYYY-MM-dd HH:mm:ss")
    @JsonView({View.Postulacion.class, View.Public.class})
    private LocalDateTime fechaPublicacion;

    @JsonView({View.Postulacion.class, View.Public.class})
    private String cargo;

    @JsonView({View.Postulacion.class, View.Public.class})
    private String tiempo;

    @JsonView({View.Postulacion.class, View.Public.class})
    private String experiencia;

    @DateTimeFormat(pattern = "YYYY-MM-dd HH:mm:ss")
    @JsonView({View.Postulacion.class, View.Public.class})
    private LocalDateTime fechaApertura;

    @JsonView({View.Postulacion.class, View.Public.class})
    private String areaConocimiento;

    @JsonView({View.Postulacion.class, View.Public.class})
    private EstadoOferta estado;

    @JsonView({View.Postulacion.class, View.Public.class})
    private String nombreEmpresa;

    @JsonView({View.Postulacion.class, View.Public.class})
    private String fotoPortada;

    @JsonView({View.Postulacion.class, View.Public.class})
    private String tipo;
}