package ec.edu.ista.springgc1.model.entity;

import lombok.Data;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnTransformer;

@Data
@Entity
@Table(name = "logro")
public class Logro implements Serializable{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_logro")
	private Long id;

	@ManyToOne
	@JoinColumn(name = "graduado_id", referencedColumnName = "graduado_id")
	private Graduado graduado;

	@ColumnTransformer(write = "UPPER(?)")
	private String descripcion;

	@ColumnTransformer(write = "UPPER(?)")
	private String tipo;
}
