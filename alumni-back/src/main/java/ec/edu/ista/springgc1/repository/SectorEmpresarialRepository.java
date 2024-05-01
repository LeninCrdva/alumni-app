package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.entity.SectorEmpresarial;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SectorEmpresarialRepository  extends GenericRepository<SectorEmpresarial> {
    Optional<SectorEmpresarial> findByNombre(String nombre);
}
