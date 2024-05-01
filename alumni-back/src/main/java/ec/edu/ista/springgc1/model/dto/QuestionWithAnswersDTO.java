package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.view.View;
import lombok.Data;

@Data
public class QuestionWithAnswersDTO implements Serializable {
	@JsonView(View.Public.class)
    private Long questionId;
	@JsonView(View.Public.class)
    private String surveytitle;
	@JsonView(View.Public.class)
    private String suverydescricpion;
	@JsonView(View.Public.class)
    private String questionText;
	@JsonView(View.Public.class)
    private List<String> answers;
}