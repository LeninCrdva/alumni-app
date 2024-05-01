package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;
import java.time.LocalDate;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.view.View;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

@Data
public class PersonaDTO  implements Serializable{

	@JsonView(View.Base.class)
	private Long id;

	@JsonView(View.Base.class)
    @NotEmpty
	private String cedula;

	@JsonView(View.Base.class)
    @NotEmpty
	private String primerNombre;

	@JsonView(View.Base.class)
    @NotEmpty
	private String segundoNombre;

	@JsonView(View.Base.class)
	@DateTimeFormat(pattern = "YYYY-MM-dd")
	private LocalDate fechaNacimiento;

	@JsonView(View.Base.class)
    @NotEmpty
	private String telefono;

	@JsonView(View.Base.class)
    @NotEmpty
	private String apellidoPaterno;

	@JsonView(View.Base.class)
    @NotEmpty
	private String apellidoMaterno;
}
