package ec.edu.ista.springgc1.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import ec.edu.ista.springgc1.model.entity.Periodo;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

@Repository
public interface PeriodoRepository extends GenericRepository<Periodo>{
	Optional<Periodo> findByNombre(String nombre);
	

}
