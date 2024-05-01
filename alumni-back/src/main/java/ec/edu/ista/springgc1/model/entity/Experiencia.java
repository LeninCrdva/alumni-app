package ec.edu.ista.springgc1.model.entity;

import lombok.Data;

import javax.persistence.*;

import org.hibernate.annotations.ColumnTransformer;

@Data
@Entity
@Table(name = "experiencia")
public class Experiencia {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_experiencia")
	private Long id;

	@ManyToOne
	@JoinColumn(name = "graduado_id", referencedColumnName = "graduado_id")
	private Graduado cedulaGraduado;

	@ColumnTransformer(write = "UPPER(?)")
	private String cargo;

	@ColumnTransformer(write = "UPPER(?)")
	private String duracion;

	@ColumnTransformer(write = "UPPER(?)")
	private String nombreInstitucion;

	@ColumnTransformer(write = "UPPER(?)")
	private String actividad;

	@ColumnTransformer(write = "UPPER(?)")
	private String areaTrabajo;
}