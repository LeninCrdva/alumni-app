package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.view.View;
import lombok.Data;

@Data
public class ComponenteXMLDTO implements Serializable {
	@JsonView(View.Public.class)
    private Long id;
	@JsonView(View.Public.class)
    private String tipo;
	@JsonView(View.Public.class)
    private String xml_file;
	@JsonView(View.Public.class)
    private byte[] foto_portada;
}
