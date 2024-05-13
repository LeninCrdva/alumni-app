package ec.edu.ista.springgc1.model.entity;

import java.time.LocalDate;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.view.View;
import lombok.Data;
import org.hibernate.annotations.ColumnTransformer;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@Entity
@Table(name = "persona")
public class Persona {
	@Id
	@Column(name = "cod_perso")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonView(View.Base.class)
	private Long id;

	@Column(name = "cedula", unique = true, nullable = false)
	@Pattern(regexp = "\\d+", message = "La cédula debe contener solo dígitos")
	@Size(min = 10, max = 10, message = "La cédula debe tener exactamente 10 dígitos")
	@JsonView(View.Base.class)
	private String cedula;

	@JsonView(View.Base.class)
	@ColumnTransformer(write = "UPPER(?)")
	private String primerNombre;

	@JsonView(View.Base.class)
	@ColumnTransformer(write = "UPPER(?)")
	private String segundoNombre;

	@Column(name = "fecha_nacimiento", nullable = false)
	@DateTimeFormat(pattern = "YYYY-MM-dd")
	@JsonView(View.Base.class)
	private LocalDate fechaNacimiento;

	@Size(min = 10, max = 10, message = "El número de celular debe tener exactamente 10 dígitos")
	@Pattern(regexp = "\\d+", message = "El número de celular debe contener solo dígitos")
	@JsonView(View.Base.class)
	private String telefono;

	@JsonView(View.Base.class)
	@ColumnTransformer(write = "UPPER(?)")
	private String apellidoPaterno;

	@JsonView(View.Base.class)
	@ColumnTransformer(write = "UPPER(?)")
	private String apellidoMaterno;

	@JsonView(View.Base.class)
	@Enumerated(EnumType.STRING)
	private Sex sexo;

	public enum Sex {
		MASCULINO, FEMENINO, OTRO;
	}
}
