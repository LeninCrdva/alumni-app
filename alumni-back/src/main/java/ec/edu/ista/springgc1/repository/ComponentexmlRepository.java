package ec.edu.ista.springgc1.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import ec.edu.ista.springgc1.model.entity.Componentexml;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

@Repository
public interface ComponentexmlRepository extends GenericRepository<Componentexml> {
    boolean existsByTipo(String tipo);

    Optional<Componentexml> findByTipo(String tipo);
}
