package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.entity.Rol;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends GenericRepository<Rol> {
    Optional<Rol> findByNombre(String nombre);
}
