package ec.edu.ista.springgc1.repository;

import java.util.List;
import java.util.Optional;

import ec.edu.ista.springgc1.model.entity.Graduado;
import org.springframework.stereotype.Repository;
import ec.edu.ista.springgc1.model.entity.Referencia_Personal;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

@Repository
public interface ReferenciaPersonalRepository extends GenericRepository<Referencia_Personal> {

	Optional<Referencia_Personal> findById(Long id);
	Optional<Referencia_Personal> findByEmail(String email);
	Optional<Referencia_Personal> findByTelefono(String telefono);
	List<Referencia_Personal> findAllByGraduadoId(Long id);
}
