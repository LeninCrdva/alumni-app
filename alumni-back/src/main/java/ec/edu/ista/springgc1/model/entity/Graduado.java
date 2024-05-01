package ec.edu.ista.springgc1.model.entity;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.Email;

import org.hibernate.annotations.ColumnTransformer;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import ec.edu.ista.springgc1.view.View;

@Data
@Entity
@Table(name = "graduado")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Graduado {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "graduado_id")
	@JsonView({View.Public.class, View.Postulacion.class})
	private Long id;

	@OneToOne
	@JoinColumn(referencedColumnName = "id_usuario")
	@JsonView(View.Public.class)
	private Usuario usuario;

	@ManyToOne
	@JoinColumn(name = "id_ciudad", referencedColumnName = "id_ciudad")
	@JsonView(View.Public.class)
	private Ciudad ciudad;

	@DateTimeFormat(pattern = "YYYY-MM-dd")
	@JsonView(View.Public.class)
	private LocalDate anioGraduacion;

	@Email(message = "Debe ser una dirección de correo electrónico válida.")
	@Column(name = "email_personal", nullable = false, length = 255, unique = true)
	@JsonView(View.Public.class)
	private String emailPersonal;

	@ColumnTransformer(write = "UPPER(?)")
	@JsonView(View.Public.class)
	private String estadoCivil;
	@JsonView(View.Public.class)
	private String rutaPdf;

	@JsonView(View.Public.class)
	@Transient
	private String urlPdf;
	
	@OneToMany(mappedBy = "graduado")
	@JsonIgnore
	private List<Titulo> titulos;
}
