package ec.edu.ista.springgc1.controller;

import java.util.List;
import java.util.Optional;

import ec.edu.ista.springgc1.model.dto.MailRequest;
import ec.edu.ista.springgc1.service.mail.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ec.edu.ista.springgc1.model.entity.Question;
import ec.edu.ista.springgc1.model.entity.Survey;
import ec.edu.ista.springgc1.service.impl.SurveyServiceImp;

@RestController
@RequestMapping("/api/surveys")
public class SurveyController {

    @Value("${spring.mail.username}")
    private String from;

    @Autowired
    private SurveyServiceImp surveyService;

    @Autowired
    private EmailService emailService;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<Survey> saveOrUpdateSurvey(@RequestBody Survey survey) {
        Survey savedSurvey = surveyService.saveSurvey(survey);
        return new ResponseEntity<>(savedSurvey, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'ADMINISTRADOR')")
    @GetMapping("/{surveyId}")
    public ResponseEntity<Survey> findSurveyById(@PathVariable Long surveyId) {
        Optional<Survey> survey = surveyService.findSurveyById(surveyId);
        return survey.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{surveyId}")
    public ResponseEntity<String> deleteSurveyById(@PathVariable Long surveyId) {
        try {
            surveyService.deleteSurveyById(surveyId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {

            String errorMessage = "No se puede eliminar la encuesta porque tiene respuestas asociadas.";
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorMessage);
        }
    }


    @PreAuthorize("hasAnyRole('GRADUADO', 'ADMINISTRADOR')")
    @PostMapping("/{surveyId}/questions")
    public ResponseEntity<Question> addQuestionToSurvey(@PathVariable Long surveyId, @RequestBody Question question) {
        Question savedQuestion = surveyService.addQuestionToSurvey(surveyId, question);
        return new ResponseEntity<>(savedQuestion, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{surveyId}/related")
    public ResponseEntity<Void> deleteSurveyAndRelated(@PathVariable Long surveyId) {
        surveyService.deleteSurveyAndRelated(surveyId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @GetMapping("/withQuestionsAndOptions")
    public ResponseEntity<?> getAllSurveysWithQuestionsAndOptions() {
        try {
            return ResponseEntity.ok(surveyService.getAllSurveysWithQuestionsAndOptions());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al recuperar las encuestas: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'ADMINISTRADOR')")
    @PutMapping("/{surveyId}")
    public ResponseEntity<Survey> updateSurvey(@PathVariable Long surveyId, @RequestBody Survey updatedSurvey) {
        Optional<Survey> existingSurveyOptional = surveyService.findSurveyById(surveyId);

        if (existingSurveyOptional.isPresent()) {
            Survey existingSurvey = existingSurveyOptional.get();
            existingSurvey.setTitle(updatedSurvey.getTitle());
            existingSurvey.setDescription(updatedSurvey.getDescription());

            List<Question> existingQuestions = existingSurvey.getQuestions();
            List<Question> updatedQuestions = updatedSurvey.getQuestions();

            for (Question updatedQuestion : updatedQuestions) {
                Optional<Question> existingQuestionOptional = existingQuestions.stream()
                        .filter(q -> q.getId().equals(updatedQuestion.getId()))
                        .findFirst();

                if (existingQuestionOptional.isPresent()) {

                    Question existingQuestion = existingQuestionOptional.get();
                    existingQuestion.setText(updatedQuestion.getText());
                    existingQuestion.setType(updatedQuestion.getType());
                    existingQuestion.setOptions(updatedQuestion.getOptions());
                } else {
                    updatedQuestion.setSurvey(existingSurvey);
                    existingQuestions.add(updatedQuestion);
                }
            }


            try {
                Survey savedSurvey = surveyService.updateSurvey(existingSurvey);
                return ResponseEntity.ok(savedSurvey);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(null); // Manejar errores
            }
        } else {
            return ResponseEntity.notFound().build(); // La encuesta no se encontró
        }
    }


    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @PutMapping("/{surveyId}/updateState")
    public ResponseEntity<Survey> updateSurveyState(@PathVariable Long surveyId, @RequestParam Boolean newEstado) {
        try {
            Survey updatedSurvey = surveyService.updateSurveyState(surveyId, newEstado);

            MailRequest request = new MailRequest(from, "Cambio de estado de encuesta", newEstado ? "survey-activated" : "survey-desactivated");

            emailService.sendEmail(request, updatedSurvey, newEstado ? "survey-activated" : "survey-desactivated");

            return ResponseEntity.ok(updatedSurvey);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

}