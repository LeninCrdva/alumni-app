package ec.edu.ista.springgc1.model.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.view.View;
import lombok.Data;
@Data
public class GraduadoWithUnansweredSurveysDTO {
	@JsonView(View.Public.class)
	 private String nombres;
	@JsonView(View.Public.class)
	    private String apellidos;
	@JsonView(View.Public.class)
	    private String cedula;
	@JsonView(View.Public.class)
	    private String email;
	@JsonView(View.Public.class)
	    private List<String> encuestasNoContestadas;

}
