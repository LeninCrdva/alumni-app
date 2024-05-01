package ec.edu.ista.springgc1.model.entity;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.view.View;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.ColumnTransformer;
import org.springframework.lang.Nullable;

@Data
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    @JsonView(View.Public.class)
    private Long id;

    private String clave;

    @Column(name = "nombre_usuario", unique = true)
    @ColumnTransformer(write = "UPPER(?)")
	@JsonView(View.Public.class)
    private String nombreUsuario;

	@JsonView(View.Public.class)
    @NotNull
    private Boolean estado;

    @OneToOne
    @NotNull
    @JoinColumn(name = "id_rol", referencedColumnName = "id_rol", nullable = false)
	@JsonView(View.Public.class)
    private Rol rol;
    
    @JsonView(View.Public.class)
    private String rutaImagen;

    @Transient
	@JsonView(View.Public.class)
    private String urlImagen;

    @ManyToOne
    @JoinColumn(referencedColumnName = "cod_perso")
	@JsonView(View.Public.class)
    Persona persona;
}
