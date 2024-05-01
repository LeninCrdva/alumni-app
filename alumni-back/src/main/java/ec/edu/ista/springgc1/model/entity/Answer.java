package ec.edu.ista.springgc1.model.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;

import lombok.Data;

@Data
@Entity
public class Answer {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graduado_id")
    private Graduado graduado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_carrera")
    private Carrera carrera;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id")
    private Survey survey;

    @ElementCollection
    @MapKeyColumn(name = "question_id")
    @CollectionTable(name = "answer_question_mapping", joinColumns = @JoinColumn(name = "answer_id"))
    @Column(name = "answer")
    private Map<Long, String> answers = new HashMap<>();

    private String openAnswer;

    public void assignAnswerToQuestion(Long questionId, String answer) {
        answers.put(questionId, answer);
    }
}
