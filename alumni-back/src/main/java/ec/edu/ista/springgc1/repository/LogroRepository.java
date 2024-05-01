package ec.edu.ista.springgc1.repository;

import java.util.List;
import java.util.Optional;

import ec.edu.ista.springgc1.model.entity.Graduado;
import org.springframework.stereotype.Repository;

import ec.edu.ista.springgc1.model.entity.Logro;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

@Repository
public interface LogroRepository extends GenericRepository<Logro>{
	Optional<Logro> findByTipo(String tipo);

	List<Logro> findAllByGraduadoId(Long id);
}