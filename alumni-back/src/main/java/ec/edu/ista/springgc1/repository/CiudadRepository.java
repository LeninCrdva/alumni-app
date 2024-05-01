package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.entity.Ciudad;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CiudadRepository extends GenericRepository<Ciudad> {

    Optional<Ciudad> findByNombre(String nombre);
}
