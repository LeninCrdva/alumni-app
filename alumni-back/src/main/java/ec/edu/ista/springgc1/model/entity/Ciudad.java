package ec.edu.ista.springgc1.model.entity;

import lombok.Data;

import javax.persistence.*;

import org.hibernate.annotations.ColumnTransformer;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.view.View;

@Data
@Entity
@Table(name = "ciudad")
public class Ciudad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ciudad")
    @JsonView(View.Public.class)
    private Long id;

    @Column(unique = true)
    @ColumnTransformer(write = "UPPER(?)")
    @JsonView(View.Base.class)
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "id_provincia", referencedColumnName = "id_provincia")
    @JsonView(View.Base.class)
    private Provincia provincia;
}
