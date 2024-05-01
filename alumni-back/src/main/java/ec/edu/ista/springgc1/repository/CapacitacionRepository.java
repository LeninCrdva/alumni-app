package ec.edu.ista.springgc1.repository;

import java.util.List;
import java.util.Optional;

import ec.edu.ista.springgc1.model.entity.Capacitacion;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

public interface CapacitacionRepository extends GenericRepository<Capacitacion>{
	Optional<Capacitacion> findByNombre(String nombre);

	List<Capacitacion> findAllByGraduadoId(Long id);
}
