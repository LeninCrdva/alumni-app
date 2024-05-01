package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;
import java.time.LocalDate;
import javax.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

@Data
public class TituloDTO implements Serializable {

    private Long id;


    private String cedula;

    @NotNull
    private String tipo;

    @NotNull
    private String nivel;

    @NotNull
    private String institucion;

    @NotNull
    private String nombreTitulo;

    @NotNull
	@DateTimeFormat(pattern = "YYYY-MM-dd")
    private LocalDate fechaEmision;

    @NotNull
	@DateTimeFormat(pattern = "YYYY-MM-dd")
    private LocalDate fechaRegistro;

    @NotNull
    private String numRegistro;

    @NotNull
    private String nombreCarrera;
}
