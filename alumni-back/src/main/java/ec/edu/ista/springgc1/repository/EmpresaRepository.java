package ec.edu.ista.springgc1.repository;


import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ec.edu.ista.springgc1.model.entity.Empresa;
import ec.edu.ista.springgc1.model.entity.Postulacion;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

public interface EmpresaRepository extends GenericRepository<Empresa> {
    Optional<Empresa> findByNombre(String nombre);

    public Boolean existsByNombreIgnoreCase(String name);

    @Query("SELECT e FROM Empresa e JOIN e.empresario u WHERE UPPER(u.usuario.nombreUsuario) = UPPER(:nombreUsuario)")
    Set<Empresa> findByNombreUsuario(@Param("nombreUsuario") String nombreUsuario);

    @Query(value = "SELECT e.* FROM empresa e LEFT JOIN ofertaslaborales o ON e.id_empresa = o.id_empresa WHERE o.oferta_id IS NULL", nativeQuery = true)
    List<Empresa> findEmpresasSinOfertas();

    boolean existsByRuc(String ruc);
    
    @Query("SELECT p FROM Postulacion p JOIN p.ofertaLaboral o " +
            "WHERE o.empresa.id = :empresaId")
     List<Postulacion> findAllByOfertaLaboralEmpresaId(@Param("empresaId") Long empresaId);
    
    List<Empresa> findAllByEstadoTrue();
}
