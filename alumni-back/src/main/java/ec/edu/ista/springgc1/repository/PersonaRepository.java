package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.entity.Persona;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
import java.util.Optional;

import org.springframework.stereotype.Repository;
@Repository
public interface PersonaRepository extends GenericRepository<Persona>{
 public Optional<Persona> findBycedula(String cedula);
 public Boolean existsBycedula(String cedula);

 public Boolean existsByTelefono(String telefono);
}
