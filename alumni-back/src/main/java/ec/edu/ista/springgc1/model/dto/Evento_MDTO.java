package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.view.View;
import lombok.Data;
@Data
public class Evento_MDTO implements Serializable{
	@JsonView(View.Public.class)
	  private Long id_prom;
	@JsonView(View.Public.class)
	    private String titulo;
	@JsonView(View.Public.class)
	    private String subTitulo;
	@JsonView(View.Public.class)
	    private String resumen;
	@JsonView(View.Public.class)
	    private String colorFondo;
	@JsonView(View.Public.class)
	    private byte[] foto_portada;
	@JsonView(View.Public.class)
	    private String tipoxml;
	@JsonView(View.Public.class)
	    private String nombreciudad;
}
