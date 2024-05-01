package ec.edu.ista.springgc1.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.ColumnTransformer;
import org.springframework.lang.Nullable;

import lombok.Data;

@Data
@Entity
@Table(name = "referencia_personal")
public class Referencia_Personal {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_refe_personal")
	private Long id;

	@ManyToOne
	@JoinColumn(name = "graduado_id", referencedColumnName = "graduado_id")
	private Graduado graduado;

	@ColumnTransformer(write = "UPPER(?)")
	private String nombreReferencia;

	@Nullable
	@Column(name = "telefono")
	private String telefono;

	@Nullable
	@Column(name = "email")
	private String email;
}