package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.entity.Question;
import ec.edu.ista.springgc1.model.entity.Survey;
import ec.edu.ista.springgc1.model.enums.QuestionType;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

import java.util.Collection;
import java.util.List;

public interface QuestionRepository extends GenericRepository<Question> {

    List<Question> findQuestionsBySurveyId(Long surveyId);

    List<Question> findQuestionsBySurveyIdAndType(Long survey_id, QuestionType type);

    List<Question> findQuestionsBySurveyIdAndTypeIn(Long survey_id, Collection<QuestionType> type);

    List<Question> findQuestionsBySurveyIdAndTypeNotIn(Long survey_id, Collection<QuestionType> type);

    List<Question> findQuestionsBySurveyIdAndTextContaining(Long surveyId, String text);

    List<Question> findQuestionsBySurveyIdAndTextContainingAndType(Long survey_id, String text, QuestionType type);

    List<Question> findQuestionsBySurveyIdAndTextContainingAndTypeIn(Long survey_id, String text, Collection<QuestionType> type);

    List<Question> findQuestionsBySurveyIdAndTextContainingAndTypeNotIn(Long survey_id, String text, Collection<QuestionType> type);

    List<Question> findQuestionsBySurveyIdAndOptionsContaining(Long surveyId, String option);

    List<Question> findQuestionsBySurveyIdAndOptionsContainingAndTextContaining(Long surveyId, String option, String text);
    
    List<Question> findBySurvey(Survey survey);

    void deleteBySurvey(Survey survey);

    void deleteBySurveyId(Long surveyId);
    
}
