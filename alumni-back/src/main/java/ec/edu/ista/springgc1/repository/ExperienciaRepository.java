package ec.edu.ista.springgc1.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import ec.edu.ista.springgc1.model.entity.Experiencia;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

@Repository
public interface ExperienciaRepository extends GenericRepository<Experiencia> {

	Optional<Experiencia> findById(Long id);

	List<Experiencia> findAllByCedulaGraduado_Id(Long id);
}
