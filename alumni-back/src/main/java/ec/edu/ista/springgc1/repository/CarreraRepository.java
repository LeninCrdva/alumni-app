package ec.edu.ista.springgc1.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import ec.edu.ista.springgc1.model.entity.Carrera;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
@Repository
public interface CarreraRepository  extends GenericRepository<Carrera>{
	 Optional<Carrera> findByNombre(String nombre);
}
