package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;
import java.time.LocalDate;
import javax.validation.constraints.NotEmpty;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CapacitacionDTO implements Serializable{
	private Long id;

    @NotEmpty
    private String nombre;

    private String cedula;
    
    private String institucion;

    private String tipoCertificado;

    private Integer numHoras;
    
    @DateTimeFormat(pattern = "YYYY-MM-dd")
    private LocalDate fechaInicio;

    @DateTimeFormat(pattern = "YYYY-MM-dd")
    private LocalDate fechaFin;
}
