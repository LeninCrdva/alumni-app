package ec.edu.ista.springgc1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ec.edu.ista.springgc1.model.entity.Answer;
import ec.edu.ista.springgc1.model.entity.Question;
import ec.edu.ista.springgc1.model.entity.Survey;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

public interface AnswerRepository extends GenericRepository<Answer>{
	
	 @Query(value = "SELECT * FROM answer WHERE :questionId IN (SELECT a.question_id FROM answer_question_mapping a WHERE a.answer_id = answer.answer_id) AND survey_id = :surveyId", nativeQuery = true)
	    List<Answer> findByQuestionIdAndSurveyId(@Param("questionId") Long questionId, @Param("surveyId") Long surveyId);
	 
	 List<Answer> findBySurveyId(Long surveyId);	 
	 
	 @Query("SELECT a FROM Answer a WHERE :questionId IN (SELECT KEY(resp) FROM a.answers resp)")
	    List<Answer> findByQuestionId(@Param("questionId") Long questionId);
	 
	 @Query(value = "SELECT * FROM answer WHERE survey_id = :surveyId AND graduado_id = :graduadoId", nativeQuery = true)
	    List<Answer> findBySurveyIdAndGraduadoId(@Param("surveyId") Long surveyId, @Param("graduadoId") Long graduadoId);
	 
	  @Query(value = "SELECT COUNT(DISTINCT graduado_id) FROM answer WHERE id_carrera = :carreraNombre", nativeQuery = true)
	    long countTotalGraduadosByCarrera(@Param("carreraNombre") String carreraNombre);
	  
	  @Query(value = "SELECT COUNT(DISTINCT graduado_id) FROM answer WHERE id_carrera = :carreraNombre AND graduado_id IN (SELECT id FROM graduado WHERE responded = true)", nativeQuery = true)
	    int countGraduadosRespondidosByCarrera(@Param("carreraNombre") String carreraNombre);
	  
	  @Query("SELECT a FROM Answer a WHERE a.graduado.emailPersonal = :correoGraduado")
	    List<Answer> findByGraduadoCorreo(@Param("correoGraduado") String correoGraduado);

}
