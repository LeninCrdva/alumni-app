package ec.edu.ista.springgc1.model.entity;

import java.util.Date;

import javax.persistence.*;

import org.springframework.beans.factory.annotation.Value;

import lombok.Data;

@Entity
@Data
public class RecoveryToken {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String token;
	
	@Temporal(TemporalType.TIMESTAMP)
	private Date expiration;
	
	private Boolean active = Boolean.TRUE;
	
	@ManyToOne
	@JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario")
	private Usuario usuario;
}