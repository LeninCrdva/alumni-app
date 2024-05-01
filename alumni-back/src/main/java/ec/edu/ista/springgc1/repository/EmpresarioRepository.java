package ec.edu.ista.springgc1.repository;

import java.util.List;
import java.util.Optional;

import ec.edu.ista.springgc1.model.dto.EmpresarioDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ec.edu.ista.springgc1.model.entity.Empresario;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
import org.springframework.stereotype.Repository;


public interface EmpresarioRepository extends GenericRepository<Empresario> {
    @Query(value = "SELECT * FROM empresario e INNER JOIN usuario u ON e.id_usuario = u.id_usuario WHERE u.nombre_usuario = :username", nativeQuery = true)
    List<Empresario> findByUsuario(@Param("username") String username);

    Optional<Empresario> findByUsuarioNombreUsuarioIgnoreCase(String nombreUsuario);

    Optional<Empresario> findByEmail(String email);

    Optional<Empresario> findByUsuarioId(Long id);

    boolean existsByEmailIgnoreCase(String email);
}
