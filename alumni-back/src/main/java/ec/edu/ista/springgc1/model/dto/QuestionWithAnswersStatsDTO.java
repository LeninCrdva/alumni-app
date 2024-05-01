package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.view.View;
import lombok.Data;
@Data
public class QuestionWithAnswersStatsDTO implements Serializable {
    @JsonView(View.Public.class)
    private Long questionId;
    @JsonView(View.Public.class)
    private String questionText;
    @JsonView(View.Public.class)
    private Map<String, Long> responsesByOption; // Para preguntas con opciones múltiples
    @JsonView(View.Public.class)
    private List<String> questionAnswers; // Respuestas a la pregunta abierta
    @JsonView(View.Public.class)
    private long numResponses; // Número total de respuestas
    @JsonView(View.Public.class)
    private Long totalGraduadosforcarrer; //total por carrera
    @JsonView(View.Public.class) 
    private Integer graduadosRespondidosforcarrer; //respndidos graduados de carrera
    @JsonView(View.Public.class)
    private String typeQuestion; //tipo de pregunta

    // Constructor vacío
    public QuestionWithAnswersStatsDTO() {
        this.responsesByOption = new HashMap<>();
    }
}