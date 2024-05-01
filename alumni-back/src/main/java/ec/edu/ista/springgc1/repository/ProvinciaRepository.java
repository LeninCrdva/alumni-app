package ec.edu.ista.springgc1.repository;
import ec.edu.ista.springgc1.model.entity.Provincia;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProvinciaRepository extends GenericRepository<Provincia> {

    Optional<Provincia> findByNombre (String provincia);

}
