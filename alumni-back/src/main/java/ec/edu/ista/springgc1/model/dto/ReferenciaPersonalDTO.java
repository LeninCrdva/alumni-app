package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;

import javax.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReferenciaPersonalDTO implements Serializable {

	private Long id;

	@NotEmpty
	private String nombreReferencia;

	@NotEmpty
	private String cedulaGraduado;

	private String telefono;

	private String email;
}
