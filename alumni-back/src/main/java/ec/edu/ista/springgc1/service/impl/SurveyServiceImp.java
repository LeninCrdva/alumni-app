package ec.edu.ista.springgc1.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.ista.springgc1.model.entity.Answer;
import ec.edu.ista.springgc1.model.entity.Question;
import ec.edu.ista.springgc1.model.entity.Survey;
import ec.edu.ista.springgc1.repository.AnswerRepository;
import ec.edu.ista.springgc1.repository.QuestionRepository;
import ec.edu.ista.springgc1.repository.SurveyRepository;

@Service
@Transactional
public class SurveyServiceImp {
	   @Autowired
	    private SurveyRepository surveyRepository;

	    @Autowired
	    private QuestionRepository questionRepository;

	    @Autowired
	    private AnswerRepository answerRepository;

	    @Transactional
	    public Survey saveSurvey(Survey survey) {
	    	 String title = survey.getTitle();
	         if (title != null && !title.isEmpty()) {
	             Optional<Survey> existingSurvey = surveyRepository.findByTitle(title);
	             if (existingSurvey.isPresent()) {
	                 throw new IllegalArgumentException("El título '" + title + "' ya está en uso.");
	             }
	         }
	        survey = surveyRepository.save(survey);

	        List<Question> questions = survey.getQuestions();
	        if (questions != null && !questions.isEmpty()) {
	            for (Question question : questions) {
	              
	                question.setSurvey(survey);

	              
	                Question savedQuestion = questionRepository.save(question);

	              
	            }
	        }

	        return survey;
	    }
	    
	    
	    public Survey updateSurvey(Survey updatedSurvey) {
	        Long surveyId = updatedSurvey.getId();

	    
	        if (hasAnswersForSurvey(surveyId)) {
	            throw new IllegalArgumentException("No se puede editar la encuesta porque ya tiene respuestas asociadas.");
	            
	        }

	      
	        String newTitle = updatedSurvey.getTitle();
	        if (titleChangedAndAlreadyInUse(surveyId, newTitle)) {
	            throw new IllegalArgumentException("El título '" + newTitle + "' ya está en uso por otra encuesta.");
	        }

	        
	        Optional<Survey> existingSurveyOptional = surveyRepository.findById(surveyId);
	        if (existingSurveyOptional.isPresent()) {
	            Survey existingSurvey = existingSurveyOptional.get();

	           
	            existingSurvey.setTitle(updatedSurvey.getTitle());
	            existingSurvey.setDescription(updatedSurvey.getDescription());

	          
	            List<Question> existingQuestions = existingSurvey.getQuestions();
	            List<Question> updatedQuestions = updatedSurvey.getQuestions();

	            for (Question updatedQuestion : updatedQuestions) {
	                Long questionId = updatedQuestion.getId();
	                if (questionId != null) {
	                   
	                    Optional<Question> existingQuestionOptional = existingQuestions.stream()
	                            .filter(q -> q.getId().equals(questionId))
	                            .findFirst();

	                    if (existingQuestionOptional.isPresent()) {
	                       
	                        Question existingQuestion = existingQuestionOptional.get();
	                        existingQuestion.setText(updatedQuestion.getText());
	                        existingQuestion.setType(updatedQuestion.getType());
	                        existingQuestion.setOptions(updatedQuestion.getOptions());
	                    }
	                } else {
	                    
	                    updatedQuestion.setSurvey(existingSurvey);
	                    existingQuestions.add(updatedQuestion);
	                }
	            }

	           
	            return surveyRepository.save(existingSurvey);
	        } else {
	            throw new IllegalArgumentException("No se encontró la encuesta con ID: " + surveyId);
	        }
	    }

	    private boolean hasAnswersForSurvey(Long surveyId) {
	        List<Answer> answers = answerRepository.findBySurveyId(surveyId);
	        return !answers.isEmpty();
	    }

	    private boolean titleChangedAndAlreadyInUse(Long surveyId, String newTitle) {
	    	  Optional<Survey> existingSurvey = surveyRepository.findByTitle(newTitle);

	        if (existingSurvey != null && !existingSurvey.get().getId().equals(surveyId)) {
	            return true;
	        }

	        return false;
	    }
	    
	    
	    public Optional<Survey> findSurveyById(Long surveyId) {
	        return surveyRepository.findById(surveyId);
	    }
	    
	    public void deleteSurveyById(Long surveyId) {
	        if (hasAnswersForSurvey(surveyId)) {
	            throw new IllegalArgumentException("No se puede eliminar la encuesta porque ya tiene respuestas asociadas.");
	        }

	        surveyRepository.deleteById(surveyId);
	    }
	    
	   
	    public Question addQuestionToSurvey(Long surveyId, Question question) {
	        Optional<Survey> optionalSurvey = surveyRepository.findById(surveyId);
	        if (optionalSurvey.isPresent()) {
	            Survey survey = optionalSurvey.get();
	            question.setSurvey(survey);
	            return questionRepository.save(question);
	        }
	        throw new IllegalArgumentException("No se encontró la encuesta con ID: " + surveyId);
	    }

	    
	    
	    public void deleteSurveyAndRelated(Long surveyId) {
	        Optional<Survey> optionalSurvey = surveyRepository.findById(surveyId);
	        if (optionalSurvey.isPresent()) {
	            Survey survey = optionalSurvey.get();

	           
	            List<Question> questions = survey.getQuestions();

	          
	            for (Question question : questions) {
	                questionRepository.delete(question);
	            }

	           
	            surveyRepository.delete(survey);
	        } else {
	            throw new IllegalArgumentException("No se encontró la encuesta con ID: " + surveyId);
	        }
	    }
	    
	    
	    public List<Survey> getAllSurveysWithQuestionsAndOptions() {
	     
	        List<Survey> surveys = surveyRepository.findAll();


	        return surveys;
	    }
	    

	    public Survey updateSurveyState(Long surveyId, Boolean newEstado) {
	        Optional<Survey> existingSurveyOptional = surveyRepository.findById(surveyId);

	        if (existingSurveyOptional.isPresent()) {
	            Survey existingSurvey = existingSurveyOptional.get();
	            existingSurvey.setEstado(newEstado); // Actualizar solo el estado
	            return surveyRepository.save(existingSurvey);
	        } else {
	            throw new IllegalArgumentException("No se encontró la encuesta con ID: " + surveyId);
	        }
	    }

}
