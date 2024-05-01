package ec.edu.ista.springgc1.model.entity;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.view.View;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

import org.hibernate.annotations.ColumnTransformer;

@Data
@Entity
@Table(name = "provincia")
public class Provincia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_provincia")
    private Long id;

    @Column(unique = true)
    @ColumnTransformer(write = "UPPER(?)")
    @JsonView(View.Base.class)
    private String nombre;

    @NotEmpty
    @Column(nullable = false, length = 50)
    @JsonView(View.Base.class)
    private String pais;

    public Provincia() {

    }
    public Provincia(String nombre) {
        this.nombre = nombre;
    }

}
