package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.view.View;
import lombok.Data;

@Data
public class SurveyQuestionsAnswersStatsDTO implements Serializable {
    @JsonView(View.Public.class)
    private Long surveyId;
    @JsonView(View.Public.class)
    private String surveyTitle;
    @JsonView(View.Public.class)
    private String surveyDescription;
    @JsonView(View.Public.class)
    private List<QuestionWithAnswersStatsDTO> questionsWithAnswers;
    @JsonView(View.Public.class)
    private long totalGraduados;
    @JsonView(View.Public.class)
    private int graduadosRespondidos;
    @JsonView(View.Public.class)
    private String careerName;
}
