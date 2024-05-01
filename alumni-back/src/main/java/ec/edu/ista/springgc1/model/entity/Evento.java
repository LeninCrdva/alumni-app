package ec.edu.ista.springgc1.model.entity;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.view.View;
import lombok.Data;

@Data
@Entity
public class Evento {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "id_prom")
	    @JsonView(View.Public.class)
	    private Long id_prom;

	    @Column(name = "titulo")
	    @JsonView(View.Public.class)
	    private String titulo;

	    @Column(name = "subTitulo")
	    @JsonView(View.Public.class)
	    private String subTitulo;

	    @Lob
	    @Column(name = "resumen", length = 10485760)
	    @JsonView(View.Public.class)
	    private String resumen;

	    @Column(name = "colorFondo")
	    @JsonView(View.Public.class)
	    private String colorFondo;

	    @Lob
	    @Column(name = "foto_portada", columnDefinition = "LONGBLOB")
	    @JsonView(View.Public.class)
	    private byte[] foto_portada;
	
	    @ManyToOne
	    @JoinColumn(name = "id_componentxml", referencedColumnName = "id_componentxml")
	    @JsonView(View.Public.class)
	    private Componentexml tipoxml;
	    
	    @ManyToOne
		@JoinColumn(name = "id_ciudad", referencedColumnName = "id_ciudad")
		@JsonView(View.Public.class)
		private Ciudad ciudad;

}
