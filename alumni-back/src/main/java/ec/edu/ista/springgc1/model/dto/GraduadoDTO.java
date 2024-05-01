package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.ElementCollection;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.view.View;
import org.springframework.format.annotation.DateTimeFormat;

import ec.edu.ista.springgc1.model.entity.Usuario;
import lombok.Data;

@Data
public class GraduadoDTO implements Serializable {

	@JsonView({View.Public.class, View.Postulacion.class})
	private Long id;

	@JsonView(View.Public.class)
	@NotEmpty
	private String usuario;

	@JsonView(View.Public.class)
	@NotEmpty
	private String ciudad;

	@DateTimeFormat(pattern = "YYYY-MM-dd")
	@JsonView(View.Public.class)
	private LocalDate anioGraduacion;

	@JsonView(View.Public.class)
	@NotEmpty
	private String emailPersonal;

	@JsonView(View.Public.class)
	@NotEmpty
	private String estadoCivil;

	private String rutaPdf;

	@JsonView(View.Public.class)
	private String urlPdf;
}
