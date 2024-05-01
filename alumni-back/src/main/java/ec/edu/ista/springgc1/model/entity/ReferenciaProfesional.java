package ec.edu.ista.springgc1.model.entity;

import javax.persistence.*;
import javax.validation.constraints.Email;

import org.hibernate.annotations.ColumnTransformer;

import lombok.Data;

@Data
@Entity
public class ReferenciaProfesional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "graduadoId", referencedColumnName = "graduado_id")
    private Graduado graduado;

    @ColumnTransformer(write = "UPPER(?)")
    private String nombre;

    @ColumnTransformer(write = "UPPER(?)")
    private String institucion;

    @Email(message = "Debe ser una dirección de correo electrónico válida.")
    @Column(name = "email", nullable = false, length = 255)
    private String email;
}
