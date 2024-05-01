package ec.edu.ista.springgc1.model.entity;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.view.View;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnTransformer;

@Data
@Entity
@Table(name = "rol")
@AllArgsConstructor
@NoArgsConstructor
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long id;

    @NotEmpty
    @Column(nullable = false, length = 20)
    @ColumnTransformer(write = "UPPER(?)")
    @JsonView(View.Public.class)
    private String nombre;

    @NotEmpty
    @ColumnTransformer(write = "UPPER(?)")
    @Column(length = 255)
    private String descripcion;

    public Rol(String rol, String descripcion) {
        this.nombre = rol;
        this.descripcion = descripcion;
    }
}
