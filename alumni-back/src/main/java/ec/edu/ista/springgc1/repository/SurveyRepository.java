package ec.edu.ista.springgc1.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ec.edu.ista.springgc1.model.entity.Survey;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

public interface SurveyRepository extends GenericRepository<Survey> {
	  Optional<Survey> findByTitle(String title);
}
