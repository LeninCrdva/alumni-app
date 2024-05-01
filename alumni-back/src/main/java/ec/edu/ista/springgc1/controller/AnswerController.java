package ec.edu.ista.springgc1.controller;

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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ec.edu.ista.springgc1.model.dto.AnswerSearchDTO;
import ec.edu.ista.springgc1.model.dto.GraduadoWithUnansweredSurveysDTO;
import ec.edu.ista.springgc1.model.dto.QuestionWithAnswersDTO;
import ec.edu.ista.springgc1.model.dto.QuestionWithAnswersStatsDTO;
import ec.edu.ista.springgc1.model.dto.SurveyQuestionsAnswersDTO;
import ec.edu.ista.springgc1.model.dto.SurveyQuestionsAnswersStatsDTO;
import ec.edu.ista.springgc1.model.entity.Answer;
import ec.edu.ista.springgc1.model.entity.Carrera;
import ec.edu.ista.springgc1.model.entity.Question;
import ec.edu.ista.springgc1.model.entity.Survey;
import ec.edu.ista.springgc1.model.enums.QuestionType;
import ec.edu.ista.springgc1.repository.AnswerRepository;
import ec.edu.ista.springgc1.repository.GraduadoRepository;
import ec.edu.ista.springgc1.repository.SurveyRepository;
import ec.edu.ista.springgc1.service.impl.AnswerServiceImp;

@RestController
@RequestMapping("/api/answer")
public class AnswerController {

    @Autowired
    private AnswerServiceImp answerService;
    @Autowired
    private GraduadoRepository graduadoRepository;
    @Autowired
    private AnswerRepository answerRepository;
    @Autowired
    private SurveyRepository surveyRepository;

    private int graduadosRespondidos;

    // Endpoint para guardar una respuesta
    @PreAuthorize("hasRole('GRADUADO')")
    @PostMapping("/save")
    public ResponseEntity<Answer> saveAnswer(@RequestBody AnswerSearchDTO answerDTO) {
        Answer savedAnswer = answerService.saveAnswer(answerDTO);
        return new ResponseEntity<>(savedAnswer, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/survey/{surveyId}/questions-answers")
    public ResponseEntity<Map<String, Object>> getQuestionsWithAnswersBySurveyId(@PathVariable Long surveyId) {
        Optional<Survey> optionalSurvey = surveyRepository.findById(surveyId);
        if (optionalSurvey.isPresent()) {
            Survey survey = optionalSurvey.get();
            List<Question> questions = survey.getQuestions();
            List<Answer> answers = answerRepository.findBySurveyId(surveyId);

            List<Map<String, Object>> questionWithAnswersList = new ArrayList<>();
            for (Question question : questions) {
                Map<String, Object> questionWithAnswers = new HashMap<>();
                questionWithAnswers.put("questionId", question.getId());

                List<String> questionAnswers = new ArrayList<>();
                for (Answer answer : answers) {
                    if (answer.getAnswers().containsKey(question.getId())) {
                        questionAnswers.add(answer.getAnswers().get(question.getId()));
                    }
                }
                questionWithAnswers.put("answers", questionAnswers);

                questionWithAnswersList.add(questionWithAnswers);
            }

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("surveyId", surveyId);
            response.put("surveyTitle", survey.getTitle());
            response.put("surveyDescription", survey.getDescription());
            response.put("questionsWithAnswers", questionWithAnswersList);

            return ResponseEntity.ok(response);
        } else {
            throw new IllegalArgumentException("No se encontró la encuesta con ID: " + surveyId);
        }
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'ADMINISTRADOR','RESPONSABLE_CARRERA')")
    @GetMapping("/all-surveys-questions-answers")
    public ResponseEntity<List<SurveyQuestionsAnswersDTO>> getAllSurveysWithQuestionsAndAnswers() {
        List<SurveyQuestionsAnswersDTO> surveyQuestionsAnswersList = answerService.loadAllSurveysWithQuestionsAndAnswers();
        return ResponseEntity.ok(surveyQuestionsAnswersList);
    }

    //Ya con muestra de conteo
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @GetMapping("/all-surveys-questions-answers-stats")
    public ResponseEntity<List<SurveyQuestionsAnswersStatsDTO>> getAllSurveysWithQuestionsAnswersAndStats() {
        List<SurveyQuestionsAnswersStatsDTO> surveyQuestionsAnswersStatsList = answerService.loadAllSurveysWithQuestionsAnswersAndStats();
        return ResponseEntity.ok(surveyQuestionsAnswersStatsList);
    }


    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @GetMapping("/survey-questions-answers-by-career-coments")
    public ResponseEntity<Map<String, Map<String, List<String>>>> getSurveyQuestionsAnswersByCareercoment() {
        List<Survey> allSurveys = surveyRepository.findAll();
        Map<String, Map<String, List<String>>> surveyByCareerMap = new HashMap<>();

        for (Survey survey : allSurveys) {
            List<Answer> answers = answerRepository.findBySurveyId(survey.getId());
            Map<String, List<String>> surveyCommentsMap = new HashMap<>();

            for (Answer answer : answers) {
                String career = answer.getCarrera().getNombre(); // Carrera asociada a la respuesta
                List<String> careerComments = surveyCommentsMap.computeIfAbsent(career, k -> new ArrayList<>());

                // Obtener el comentario abierto de la respuesta y agregarlo a la lista de comentarios de la carrera
                String openAnswer = answer.getOpenAnswer();
                if (openAnswer != null && !openAnswer.isEmpty()) {
                    careerComments.add(openAnswer);
                }
            }

            // Agregar el mapa de comentarios de la encuesta al mapa de carreras
            for (Map.Entry<String, List<String>> entry : surveyCommentsMap.entrySet()) {
                String career = entry.getKey();
                if (!surveyByCareerMap.containsKey(career)) {
                    surveyByCareerMap.put(career, new HashMap<>());
                }
                surveyByCareerMap.get(career).put(survey.getTitle(), entry.getValue());
            }
        }

        return ResponseEntity.ok(surveyByCareerMap);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @GetMapping("/survey-questions-answers-by-career")
    public ResponseEntity<Map<String, Map<String, List<QuestionWithAnswersDTO>>>> getSurveyQuestionsAnswersByCareer() {
        List<Survey> allSurveys = surveyRepository.findAll();
        Map<String, Map<String, List<QuestionWithAnswersDTO>>> surveyByCareerMap = new HashMap<>();

        for (Survey survey : allSurveys) {
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

            for (Answer answer : answers) {
                String career = answer.getCarrera().getNombre(); // Suponiendo que cada respuesta tiene una carrera asociada
                if (!surveyByCareerMap.containsKey(career)) {
                    surveyByCareerMap.put(career, new HashMap<>());
                }

                if (!surveyByCareerMap.get(career).containsKey(survey.getTitle())) {
                    surveyByCareerMap.get(career).put(survey.getTitle(), new ArrayList<>());
                }

                surveyByCareerMap.get(career).get(survey.getTitle()).addAll(questionsWithAnswers);
            }
        }

        return ResponseEntity.ok(surveyByCareerMap);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @GetMapping("/unanswered-surveys")
    public ResponseEntity<List<GraduadoWithUnansweredSurveysDTO>> getGraduadosWithUnansweredSurveys() {
        List<GraduadoWithUnansweredSurveysDTO> result = answerService.getGraduadosWithUnansweredSurveys();
        return ResponseEntity.ok(result);
    }

    //Metodo para reporte por carrera
    private Map<String, Long> countResponsesByOption2(List<Answer> validAnswers, Question question) {
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

    //Segundo metodo

    private List<Answer> getValidAnswersForQuestion2(Long questionId, List<Answer> answers) {
        return answers.stream()
                .filter(answer -> answer.getAnswers() != null && answer.getAnswers().containsKey(questionId))
                .collect(Collectors.toList());
    }

    //
    // @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @GetMapping("/survey-questions-answers-by-career-reportcontitulo")
    public ResponseEntity<Map<String, Map<String, List<QuestionWithAnswersStatsDTO>>>> getSurveyQuestionsAnswersByCareer2(
            @RequestParam(required = false) String carreraNombre) {

        List<Survey> allSurveys = surveyRepository.findAll();
        Map<String, Map<String, List<QuestionWithAnswersStatsDTO>>> surveyByCareerMap = new HashMap<>();

        for (Survey survey : allSurveys) {
            List<QuestionWithAnswersStatsDTO> questionsWithAnswers = new ArrayList<>();
            List<Question> questions = survey.getQuestions();
            List<Answer> answers = answerRepository.findBySurveyId(survey.getId());

            for (Question question : questions) {
                List<Answer> validAnswers = getValidAnswersForQuestion2(question.getId(), answers);

                if (!validAnswers.isEmpty()) {
                    QuestionWithAnswersStatsDTO questionDTO = new QuestionWithAnswersStatsDTO();
                    questionDTO.setQuestionId(question.getId());
                    questionDTO.setQuestionText(question.getText());
                    questionDTO.setTypeQuestion(question.getType().name());

                    if (question.getType() == QuestionType.ABIERTA) {
                        // Filtrar respuestas abiertas
                        List<String> questionAnswers = validAnswers.stream()
                                .filter(answer -> answer.getAnswers().containsKey(question.getId()))
                                .map(answer -> answer.getAnswers().get(question.getId()))
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList());

                        questionDTO.setQuestionAnswers(questionAnswers);
                        questionDTO.setNumResponses(questionAnswers.size());
                    } else {
                        // Calcular estadísticas por opción para preguntas de opciones
                        Map<String, Long> responsesByOption = countResponsesByOption2(validAnswers, question);
                        questionDTO.setResponsesByOption(responsesByOption);
                    }

                    questionsWithAnswers.add(questionDTO);
                }
            }

            for (Answer answer : answers) {
                String careerName = answer.getCarrera().getNombre();

                // Filtrar por nombre de carrera si se proporciona
                if (carreraNombre == null || carreraNombre.isEmpty() || careerName.equalsIgnoreCase(carreraNombre)) {
                    if (!surveyByCareerMap.containsKey(careerName)) {
                        surveyByCareerMap.put(careerName, new HashMap<>());
                    }

                    if (!surveyByCareerMap.get(careerName).containsKey(survey.getTitle())) {
                        surveyByCareerMap.get(careerName).put(survey.getTitle(), new ArrayList<>());
                    }

                    surveyByCareerMap.get(careerName).get(survey.getTitle()).addAll(questionsWithAnswers);
                }
            }
        }

        return ResponseEntity.ok(surveyByCareerMap);
    }

    private List<Answer> cachedAnswers;

    // @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @GetMapping("/survey-questions-answers-by-careerandsurveytitle-report")
    public ResponseEntity<Map<String, Map<String, List<QuestionWithAnswersStatsDTO>>>> getSurveyQuestionsAnswersByCareer(
            @RequestParam(required = true) String carreraNombre,
            @RequestParam(required = false) String surveyTitle) {

        List<Survey> allSurveys = surveyRepository.findAll();
        Map<String, Map<String, List<QuestionWithAnswersStatsDTO>>> surveyByCareerMap = new HashMap<>();

        // Obtener la lista de respuestas una vez al principio del método y almacenarla en la variable cachedAnswers
        List<Answer> cachedAnswers = answerRepository.findAll(); // Aquí puedes cambiar la lógica según tu repositorio

        for (Survey survey : allSurveys) {
            // Verificar si la encuesta coincide con surveyTitle (si se proporciona)
            if (surveyTitle != null && !surveyTitle.isEmpty() && !survey.getTitle().equalsIgnoreCase(surveyTitle)) {
                continue; // Saltar esta encuesta si no coincide con el título proporcionado
            }

            List<QuestionWithAnswersStatsDTO> questionsWithAnswers = new ArrayList<>();
            List<Question> questions = survey.getQuestions();

            for (Question question : questions) {
                List<Answer> validAnswers = getValidAnswersForQuestion(question.getId(), cachedAnswers);

                if (!validAnswers.isEmpty()) {
                    QuestionWithAnswersStatsDTO questionDTO = new QuestionWithAnswersStatsDTO();
                    questionDTO.setQuestionId(question.getId());
                    questionDTO.setQuestionText(question.getText());

                    if (question.getType() == QuestionType.ABIERTA) {
                        // Filtrar respuestas abiertas
                        List<String> questionAnswers = validAnswers.stream()
                                .filter(answer -> answer.getAnswers().containsKey(question.getId()))
                                .map(answer -> answer.getAnswers().get(question.getId()))
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList());

                        questionDTO.setQuestionAnswers(questionAnswers);
                        questionDTO.setNumResponses(questionAnswers.size());
                    } else {
                        // Calcular estadísticas por opción para preguntas de opciones
                        Map<String, Long> responsesByOption = countResponsesByOption(validAnswers, question);
                        questionDTO.setResponsesByOption(responsesByOption);
                    }

                    questionsWithAnswers.add(questionDTO);
                }
            }

            for (Answer answer : cachedAnswers) {
                String careerName = answer.getCarrera().getNombre();

                // Filtrar por nombre de carrera si se proporciona
                if (carreraNombre == null || carreraNombre.isEmpty() || careerName.equalsIgnoreCase(carreraNombre)) {
                    // Obtener el título de la encuesta
                    String currentSurveyTitle = survey.getTitle();

                    // Verificar si la encuesta coincide con surveyTitle (si se proporciona)
                    if (surveyTitle == null || surveyTitle.isEmpty() || currentSurveyTitle.equalsIgnoreCase(surveyTitle)) {
                        // Si no existe la clave de la carrera en el mapa principal, inicialízala
                        surveyByCareerMap.putIfAbsent(careerName, new HashMap<>());

                        // Obtener el mapa interno de encuestas y preguntas por título de encuesta
                        Map<String, List<QuestionWithAnswersStatsDTO>> surveyMap = surveyByCareerMap.get(careerName);

                        // Si no existe la clave del título de la encuesta en el mapa interno, inicialízala
                        surveyMap.putIfAbsent(currentSurveyTitle, new ArrayList<>());

                        // Agregar las preguntas con respuestas al mapa interno bajo el título de la encuesta
                        surveyMap.get(currentSurveyTitle).addAll(questionsWithAnswers);
                    }
                }
            }
        }

        return ResponseEntity.ok(surveyByCareerMap);
    }
    // Método para obtener respuestas válidas para una pregunta específica
    private List<Answer> getValidAnswersForQuestion(Long questionId, List<Answer> answers) {
        return answers.stream()
                .filter(answer -> answer.getAnswers().containsKey(questionId))
                .collect(Collectors.toList());
    }
    private Map<String, Long> countResponsesByOption(List<Answer> answers, Question question) {
        Map<String, Long> responsesByOption = new HashMap<>();
        List<String> options = question.getOptions();

        for (String option : options) {
            long count = answers.stream()
                    .map(answer -> answer.getAnswers().get(question.getId()))
                    .filter(option::equalsIgnoreCase)
                    .count();

            responsesByOption.put(option, count);
        }

        return responsesByOption;
    }


    private int getNumGraduadosRespondidosByCareer(String carreraNombre, List<Answer> answers) {
        // Utilizar un conjunto para contar graduados únicos que respondieron
        Set<Long> graduadoIdsRespondidos = answers.stream()
                .filter(answer -> answer.getCarrera() != null && answer.getCarrera().getNombre().equalsIgnoreCase(carreraNombre))
                .map(answer -> answer.getGraduado().getId())
                .collect(Collectors.toSet());

        return graduadoIdsRespondidos.size();
    }


    //Graduados
    @PreAuthorize("hasAnyRole('GRADUADO', 'ADMINISTRADOR','RESPONSABLE_CARRERA')")
    @GetMapping("/respondidas")
    public ResponseEntity<List<Map<String, Object>>> getEncuestasRespondidasPorGraduado(@RequestParam(required = false) String correoGraduado) {
        try {
            List<Map<String, Object>> encuestasRespondidas = answerService.getEncuestasRespondidasPorGraduado(correoGraduado);
            return ResponseEntity.ok(encuestasRespondidas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
