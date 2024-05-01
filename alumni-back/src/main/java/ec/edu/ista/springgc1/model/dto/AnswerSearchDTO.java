package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.model.entity.Survey;
import ec.edu.ista.springgc1.view.View;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerSearchDTO implements Serializable {
	@JsonView(View.Public.class)
	 private Long id;
	@JsonView(View.Public.class)
	    private String graduadoEmail;
	@JsonView(View.Public.class)
	    private String carreraNombre;
	@JsonView(View.Public.class)
	    private String surveyTitle;
	@JsonView(View.Public.class)
	    private Map<Long, String> questionResponses;
	@JsonView(View.Public.class)
	    private String openAnswer;

}
