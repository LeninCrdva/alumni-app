package ec.edu.ista.springgc1.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.ista.springgc1.model.dto.AnswerSearchDTO;
import ec.edu.ista.springgc1.model.dto.GraduadoWithUnansweredSurveysDTO;
import ec.edu.ista.springgc1.model.dto.QuestionWithAnswersDTO;
import ec.edu.ista.springgc1.model.dto.QuestionWithAnswersStatsDTO;
import ec.edu.ista.springgc1.model.dto.SurveyQuestionsAnswersDTO;
import ec.edu.ista.springgc1.model.dto.SurveyQuestionsAnswersStatsDTO;
import ec.edu.ista.springgc1.model.entity.Answer;
import ec.edu.ista.springgc1.model.entity.Carrera;
import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.model.entity.Question;
import ec.edu.ista.springgc1.model.entity.Survey;
import ec.edu.ista.springgc1.model.entity.Usuario;
import ec.edu.ista.springgc1.model.enums.QuestionType;
import ec.edu.ista.springgc1.repository.AnswerRepository;
import ec.edu.ista.springgc1.repository.CarreraRepository;
import ec.edu.ista.springgc1.repository.GraduadoRepository;
import ec.edu.ista.springgc1.repository.SurveyRepository;

@Service
@Transactional
public class AnswerServiceImp {
	  @Autowired
	    private AnswerRepository answerRepository;

	    @Autowired
	    private GraduadoRepository graduadoRepository;

	    @Autowired
	    private CarreraRepository carreraRepository;
	    @Autowired
	    private SurveyRepository surveyRepository;

	    public Answer saveAnswer(AnswerSearchDTO answerDTO) {
	       
	        Optional<Graduado> optionalGraduado = graduadoRepository.findByEmailPersonal(answerDTO.getGraduadoEmail());
	        if (!optionalGraduado.isPresent()) {
	            throw new IllegalArgumentException("Graduado no encontrado con el email: " + answerDTO.getGraduadoEmail());
	        }
	        Graduado graduado = optionalGraduado.get();

	        Optional<Carrera> optionalCarrera = carreraRepository.findByNombre(answerDTO.getCarreraNombre());
	        if (!optionalCarrera.isPresent()) {
	            throw new IllegalArgumentException("Carrera no encontrada con el nombre: " + answerDTO.getCarreraNombre());
	        }
	        Carrera carrera = optionalCarrera.get();  
	        Optional<Survey> optionalSurvey = surveyRepository.findByTitle(answerDTO.getSurveyTitle());
	        if (!optionalSurvey.isPresent()) {
	            throw new IllegalArgumentException("Encuesta no encontrada con el título: " + answerDTO.getSurveyTitle());
	        }
	        Survey survey = optionalSurvey.get();

	        Answer answer = new Answer();
	        answer.setGraduado(graduado);
	        answer.setCarrera(carrera);
	        answer.setSurvey(survey);
	        answer.setOpenAnswer(answerDTO.getOpenAnswer());

	       
	        if (answerDTO.getQuestionResponses() != null && !answerDTO.getQuestionResponses().isEmpty()) {
	            for (Map.Entry<Long, String> entry : answerDTO.getQuestionResponses().entrySet()) {
	                answer.assignAnswerToQuestion(entry.getKey(), entry.getValue());
	            }
	        }

	     
	        return answerRepository.save(answer);
	    }
	    //listar preguntas con respuestas por encuesta por id sirvery
	    public Map<Question, List<Answer>> loadQuestionsWithAnswersBySurveyId(Long surveyId) {
	        Optional<Survey> optionalSurvey = surveyRepository.findById(surveyId);
	        if (optionalSurvey.isPresent()) {
	            Survey survey = optionalSurvey.get();
	            List<Question> questions = survey.getQuestions();
	            List<Answer> answers = answerRepository.findBySurveyId(surveyId);

	            Map<Question, List<Answer>> questionAnswersMap = new HashMap<>();

	            for (Question question : questions) {
	                List<Answer> questionAnswers = new ArrayList<>();
	                for (Answer answer : answers) {
	                    if (answer.getAnswers().containsKey(question.getId())) {
	                        questionAnswers.add(answer);
	                    }
	                }
	                questionAnswersMap.put(question, questionAnswers);
	            }

	            return questionAnswersMap;
	        } else {
	            throw new IllegalArgumentException("No se encontró la encuesta con ID: " + surveyId);
	        }
	    }



	    // Método auxiliar para obtener las respuestas de una pregunta específica
	    private List<Answer> getAnswersForQuestion(Long questionId, List<Answer> allAnswers) {
	        List<Answer> questionAnswers = new ArrayList<>();
	        for (Answer answer : allAnswers) {
	            if (answer.getAnswers().containsKey(questionId)) {
	                questionAnswers.add(answer);
	            }
	        }
	        return questionAnswers;
	    }

	    
	    //All
	    
	 // Método para listar todas las encuestas con preguntas y respuestas asociadas
	    public List<SurveyQuestionsAnswersDTO> loadAllSurveysWithQuestionsAndAnswers() {
	        List<Survey> allSurveys = surveyRepository.findAll();
	        List<SurveyQuestionsAnswersDTO> surveyQuestionsAnswersList = new ArrayList<>();

	        for (Survey survey : allSurveys) {
	            SurveyQuestionsAnswersDTO surveyDTO = new SurveyQuestionsAnswersDTO();
	            surveyDTO.setSurveyId(survey.getId());
	            surveyDTO.setSurveyTitle(survey.getTitle());
	            surveyDTO.setSurveyDescription(survey.getDescription());

	            List<QuestionWithAnswersDTO> questionsWithAnswers = new ArrayList<>();
	            List<Question> questions = survey.getQuestions();
	            List<Answer> answers = answerRepository.findBySurveyId(survey.getId());

	            for (Question question : questions) {
	                List<String> questionAnswers = answers.stream()
	                    .filter(answer -> answer.getSurvey().getId().equals(survey.getId()) && answer.getAnswers().containsKey(question.getId()))
	                    .map(answer -> answer.getAnswers().get(question.getId()))
	                    .collect(Collectors.toList());

	                QuestionWithAnswersDTO questionDTO = new QuestionWithAnswersDTO();
	                questionDTO.setQuestionId(question.getId());
	                questionDTO.setQuestionText(question.getText());
	                questionDTO.setAnswers(questionAnswers);

	                questionsWithAnswers.add(questionDTO);
	            }

	            surveyDTO.setQuestionsWithAnswers(questionsWithAnswers);
	            surveyQuestionsAnswersList.add(surveyDTO);
	        }

	        return surveyQuestionsAnswersList;
	    }
	    
	    
	    //Lista de graduados
	    public List<GraduadoWithUnansweredSurveysDTO> getGraduadosWithUnansweredSurveys() {
	        List<Graduado> graduados = graduadoRepository.findAll();
	        List<GraduadoWithUnansweredSurveysDTO> result = new ArrayList<>();

	        for (Graduado graduado : graduados) {
	            GraduadoWithUnansweredSurveysDTO dto = buildGraduadoDTO(graduado);
	            result.add(dto);
	        }

	        return result;
	    }

	    private GraduadoWithUnansweredSurveysDTO buildGraduadoDTO(Graduado graduado) {
	        Usuario usuario = graduado.getUsuario();
	        List<Survey> allSurveys = surveyRepository.findAll();
	        List<String> encuestasNoContestadas = new ArrayList<>();

	        for (Survey survey : allSurveys) {
	            if (survey.getEstado()) { 
	                if (!isSurveyAnswered(survey, graduado)) {
	                    encuestasNoContestadas.add(survey.getTitle());
	                }
	            }
	        }

	        GraduadoWithUnansweredSurveysDTO dto = new GraduadoWithUnansweredSurveysDTO();
	        dto.setNombres(usuario.getPersona().getPrimerNombre()+" "+usuario.getPersona().getSegundoNombre());
	        dto.setApellidos(usuario.getPersona().getApellidoPaterno()+" "+usuario.getPersona().getApellidoMaterno());
	        dto.setCedula(usuario.getPersona().getCedula());
	        dto.setEmail(graduado.getEmailPersonal());
	        dto.setEncuestasNoContestadas(encuestasNoContestadas);

	        return dto;
	    }

	    private boolean isSurveyAnswered(Survey survey, Graduado graduado) {
	        List<Answer> answers = answerRepository.findBySurveyIdAndGraduadoId(survey.getId(), graduado.getId());
	        return !answers.isEmpty();
	    }
	    //Resultados 
	    public List<SurveyQuestionsAnswersStatsDTO> loadAllSurveysWithQuestionsAnswersAndStats() {
	        List<Survey> allSurveys = surveyRepository.findAll();
	        List<SurveyQuestionsAnswersStatsDTO> surveyQuestionsAnswersStatsList = new ArrayList<>();

	        for (Survey survey : allSurveys) {
	            SurveyQuestionsAnswersStatsDTO surveyDTO = new SurveyQuestionsAnswersStatsDTO();
	            surveyDTO.setSurveyId(survey.getId());
	            surveyDTO.setSurveyTitle(survey.getTitle());
	            surveyDTO.setSurveyDescription(survey.getDescription());

	            List<QuestionWithAnswersStatsDTO> questionsWithAnswers = new ArrayList<>();
	            List<Question> questions = survey.getQuestions();
	            List<Answer> answers = answerRepository.findBySurveyId(survey.getId());

	            for (Question question : questions) {
	                List<Answer> validAnswers = getValidAnswersForQuestion(question.getId(), answers);

	                QuestionWithAnswersStatsDTO questionDTO = new QuestionWithAnswersStatsDTO();
	                questionDTO.setQuestionId(question.getId());
	                questionDTO.setQuestionText(question.getText());
					questionDTO.setTypeQuestion(question.getType().name());

	                if (question.getType() == QuestionType.ABIERTA) {
	                    // Para preguntas abiertas, obtenemos las respuestas y el número de respuestas
	                    List<String> questionAnswers = validAnswers.stream()
	                            .map(answer -> answer.getAnswers().get(question.getId()))
	                            .filter(Objects::nonNull) // Filtrar respuestas no nulas
	                            .collect(Collectors.toList());
	                    
	                    questionDTO.setQuestionAnswers(questionAnswers);
	                    questionDTO.setNumResponses(questionAnswers.size());
	                } else {
	                    // Para preguntas con opciones, calculamos estadísticas por opción
	                    Map<String, Long> responsesByOption = countResponsesByOption(validAnswers, question);
	                    questionDTO.setResponsesByOption(responsesByOption);
	                }

	                questionsWithAnswers.add(questionDTO);
	            }

	            surveyDTO.setQuestionsWithAnswers(questionsWithAnswers);
	            surveyDTO.setTotalGraduados(graduadoRepository.countAll());
	            surveyDTO.setGraduadosRespondidos(getNumGraduadosQueRespondieron(survey));

	            surveyQuestionsAnswersStatsList.add(surveyDTO);
	        }

	        return surveyQuestionsAnswersStatsList;
	    }

private List<Answer> getValidAnswersForQuestion(Long questionId, List<Answer> answers) {
    return answers.stream()
            .filter(answer -> answer.getAnswers() != null && answer.getAnswers().containsKey(questionId))
            .collect(Collectors.toList());
}

private Map<String, Long> countResponsesByOption(List<Answer> validAnswers, Question question) {
    Map<String, Long> responsesByOption = new HashMap<>();

    for (Answer answer : validAnswers) {
        if (answer.getAnswers() != null) {
            String answerValue = answer.getAnswers().get(question.getId());
            if (answerValue != null) {
                responsesByOption.merge(answerValue, 1L, Long::sum);
            }
        }
    }

    return responsesByOption;
}

public int getNumGraduadosQueRespondieron(Survey survey) {
    Set<Long> graduadoIdsQueRespondieron = new HashSet<>();
    List<Answer> answers = answerRepository.findBySurveyId(survey.getId());

    for (Answer answer : answers) {
        if (answer.getGraduado() != null) {
            graduadoIdsQueRespondieron.add(answer.getGraduado().getId());
        }
    }

    return graduadoIdsQueRespondieron.size();
}
//Seguimiento graduados
public List<Map<String, Object>> getEncuestasRespondidasPorGraduado(String correoGraduado) {
    List<Map<String, Object>> encuestasRespondidas = new ArrayList<>();

    if (correoGraduado == null || correoGraduado.isEmpty()) {
        // Si no se proporciona el correoGraduado, recuperar todas las respuestas
        List<Answer> respuestas = answerRepository.findAll();

        // Agrupar las respuestas por encuesta
        Map<Long, List<Answer>> encuestasMap = new HashMap<>();
        for (Answer respuesta : respuestas) {
            Long encuestaId = respuesta.getSurvey().getId();
            if (!encuestasMap.containsKey(encuestaId)) {
                encuestasMap.put(encuestaId, new ArrayList<>());
            }
            encuestasMap.get(encuestaId).add(respuesta);
        }

        // Construir la lista de encuestas respondidas
        for (Long encuestaId : encuestasMap.keySet()) {
            Map<String, Object> encuestaInfo = new HashMap<>();
            encuestaInfo.put("tituloEncuesta", encuestasMap.get(encuestaId).get(0).getSurvey().getTitle());
            
            // Obtener los correos de los graduados que han respondido
            List<String> correosGraduados = new ArrayList<>();
            for (Answer respuesta : encuestasMap.get(encuestaId)) {
                correosGraduados.add(respuesta.getGraduado().getEmailPersonal());
            }
            encuestaInfo.put("correosGraduados", correosGraduados);

            encuestasRespondidas.add(encuestaInfo);
        }
    } else {
        // Si se proporciona un correoGraduado, recuperar las respuestas asociadas a ese graduado
        Graduado graduado = graduadoRepository.findByEmailPersonal(correoGraduado)
                .orElseThrow(() -> new IllegalArgumentException("Graduado no encontrado con el correo: " + correoGraduado));
        
        List<Answer> respuestasGraduado = answerRepository.findByGraduadoCorreo(correoGraduado);

        // Agrupar las respuestas por encuesta
        Map<Long, List<Answer>> encuestasMap = new HashMap<>();
        for (Answer respuesta : respuestasGraduado) {
            Long encuestaId = respuesta.getSurvey().getId();
            if (!encuestasMap.containsKey(encuestaId)) {
                encuestasMap.put(encuestaId, new ArrayList<>());
            }
            encuestasMap.get(encuestaId).add(respuesta);
        }

        // Construir la lista de encuestas respondidas por el graduado específico
        for (Long encuestaId : encuestasMap.keySet()) {
            Map<String, Object> encuestaInfo = new HashMap<>();
            encuestaInfo.put("tituloEncuesta", encuestasMap.get(encuestaId).get(0).getSurvey().getTitle());
            encuestaInfo.put("correosGraduados", Collections.singletonList(correoGraduado));
            encuestasRespondidas.add(encuestaInfo);
        }
    }

    return encuestasRespondidas;
}
	   
}
