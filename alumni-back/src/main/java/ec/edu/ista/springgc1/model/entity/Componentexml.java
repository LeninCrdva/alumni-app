package ec.edu.ista.springgc1.model.entity;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.view.View;
import lombok.Data;
@Data
@Entity
@Table(name = "componentexml")
public class Componentexml {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_componentxml")
    @JsonView({View.Public.class })
    private Long id;

    @Column(name = "tipo")
    @JsonView({View.Public.class })
    private String tipo;

    @Lob
    @Column(name = "xml_file", columnDefinition = "LONGTEXT")
    @JsonView({View.Public.class })
    private String xml_file;

    @Lob
    @Column(name = "foto_portada",columnDefinition = "LONGBLOB")
    @JsonView({View.Public.class })
    private byte[] foto_portada;
}
