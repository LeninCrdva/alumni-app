package ec.edu.ista.springgc1.model.entity;

import lombok.Data;

import java.time.LocalDate;

import javax.persistence.*;

import org.hibernate.annotations.ColumnTransformer;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@Entity
@Table(name = "capacitacion")
public class Capacitacion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_capacitacion")
	private Long id;

	@ManyToOne
	@JoinColumn(name = "graduado_id", referencedColumnName = "graduado_id")
	private Graduado graduado;

	@DateTimeFormat(pattern = "YYYY-MM-dd")
	private LocalDate fechaInicio;

	@DateTimeFormat(pattern = "YYYY-MM-dd")
	private LocalDate fechaFin;

	@ColumnTransformer(write = "UPPER(?)")
	private String nombre;

	@ColumnTransformer(write = "UPPER(?)")
	private String institucion;

	private Integer horas;

	@ColumnTransformer(write = "UPPER(?)")
	private String tipoCertificado;

}
