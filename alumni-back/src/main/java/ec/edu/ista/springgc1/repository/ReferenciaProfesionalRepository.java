package ec.edu.ista.springgc1.repository;

import java.util.List;
import java.util.Optional;

import ec.edu.ista.springgc1.model.entity.Graduado;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ec.edu.ista.springgc1.model.entity.ReferenciaProfesional;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

@Repository
public interface ReferenciaProfesionalRepository extends GenericRepository<ReferenciaProfesional> {

	Optional<ReferenciaProfesional> findById(Long id);

	@Query("SELECT rp FROM ReferenciaProfesional rp JOIN rp.graduado g JOIN g.usuario u WHERE UPPER(u.nombreUsuario) = UPPER(:nombreUsuario)")
	List<ReferenciaProfesional> findByNombreUsuario(@Param("nombreUsuario") String nombreUsuario);

	List<ReferenciaProfesional> findAllByGraduadoId(Long id);
}
