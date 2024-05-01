package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;

import javax.validation.constraints.NotEmpty;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ReferenciaProfesionalDTO implements Serializable {

	private Long id;

	private String graduado;

	private String nombre;

	private String institucion;

	private String email;
}
