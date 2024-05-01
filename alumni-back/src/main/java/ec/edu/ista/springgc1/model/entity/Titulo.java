package ec.edu.ista.springgc1.model.entity;

import java.time.LocalDate;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.view.View;
import org.hibernate.annotations.ColumnTransformer;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@Entity
@Table(name = "titulo")
public class Titulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_titulo")
    @JsonView(View.Public.class)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "graduado_id", referencedColumnName = "graduado_id")
    @JsonView(View.Public.class)
    private Graduado graduado;

    @ColumnTransformer(write = "UPPER(?)")
    @JsonView(View.Public.class)
    private String tipo;

    @ColumnTransformer(write = "UPPER(?)")
    @JsonView(View.Public.class)
    private String nivel;

    @ColumnTransformer(write = "UPPER(?)")
    @JsonView(View.Public.class)
    private String institucion;

    @ColumnTransformer(write = "UPPER(?)")
    @JsonView(View.Public.class)
    private String nombreTitulo;

    @DateTimeFormat(pattern = "YYYY-MM-dd")
    @JsonView(View.Public.class)
    private LocalDate fechaEmision;

    @DateTimeFormat(pattern = "YYYY-MM-dd")
    @JsonView(View.Public.class)
    private LocalDate fechaRegistro;

    @Column(name = "num_registro", nullable = false, length = 20)
    @Size(min = 5, max = 20, message = "El número de registro debe tener exactamente min 5 dígitos maximo 20")
    @Pattern(regexp = "\\d+", message = "El número de registro debe contener solo dígitos.")
    @JsonView(View.Public.class)
    private String numRegistro;

    @ManyToOne
    @JoinColumn(name = "id_carrera", referencedColumnName = "id_carrera")
    @JsonView(View.Public.class)
    private Carrera carrera;
}