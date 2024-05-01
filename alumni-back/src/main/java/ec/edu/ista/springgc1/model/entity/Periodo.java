package ec.edu.ista.springgc1.model.entity;

import javax.persistence.*;
import javax.persistence.Id;
import java.time.LocalDate;
import java.util.Set;
import java.util.HashSet;

import org.hibernate.annotations.ColumnTransformer;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@Entity
@Table(name = "periodo")
public class Periodo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_periodo")
    private Long id;

	@DateTimeFormat(pattern = "YYYY-MM-dd")
    private LocalDate fechaInicio;

	@DateTimeFormat(pattern = "YYYY-MM-dd")
    private LocalDate fechaFin;

    private Boolean estado = true;

    @ColumnTransformer(write = "UPPER(?)")
    private String nombre;

    @ManyToMany
    @JoinTable(
            name = "periodo_carrera",
            joinColumns = @JoinColumn(name = "id_periodo"),
            inverseJoinColumns = @JoinColumn(name = "id_carrera"))
    private Set<Carrera> carreras = new HashSet<>();
}
