package ec.edu.ista.springgc1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ec.edu.ista.springgc1.model.entity.Contratacion;

public interface ContratacionRepository extends JpaRepository<Contratacion, Long> {
	List<Contratacion> findByOfertaLaboralId(Long ofertaLaboralId);
}
