package ec.edu.ista.springgc1.model.entity;

import java.util.List;

import javax.persistence.*;

import lombok.Data;

@Deprecated
@Entity
@Data
@Table(name = "contrataciones")
public class Contratacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "oferta_id")
    private OfertasLaborales ofertaLaboral;

    @ManyToMany
    @JoinTable(
            name = "contrataciones_graduados",
            joinColumns = @JoinColumn(name = "contratacion_id"),
            inverseJoinColumns = @JoinColumn(name = "graduado_id"))
    private List<Graduado> graduados;


}