package ec.edu.ista.springgc1.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import ec.edu.ista.springgc1.model.entity.Persona;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;


@Repository
public interface GraduadoRepository extends GenericRepository<Graduado> {

    Optional<Graduado> findByUsuarioId(long id_usuario);

    Optional<Graduado> findByUsuarioPersonaCedulaContaining(String cedula);

    List<Graduado> findByEmailPersonalIn(Set<String> email_personal);

    Optional<Graduado> findByUsuarioNombreUsuario(String name);

    Optional<Graduado> findByEmailPersonal(String emailPersonal);

    Integer countAllByUsuarioPersonaSexo(Persona.Sex usuario_persona_sexo);

    boolean existsByEmailPersonalIgnoreCase(String emailPersonal);

    //@Query("SELECT g FROM Graduado g LEFT JOIN g.ofertas o WHERE o IS NULL")
    @Query("SELECT g FROM Graduado g WHERE NOT EXISTS (SELECT 1 FROM Postulacion p WHERE p.graduado = g)")
    List<Graduado> findAllGraduadosWithoutOfertas();

    @Query("SELECT g FROM Graduado g INNER JOIN Postulacion p ON (p.graduado = g)")
    List<Graduado> findAllGraduadosWithOfertas();

    @Query("SELECT g FROM Graduado g WHERE g NOT IN (SELECT e.cedulaGraduado FROM Experiencia e)")
    List<Graduado> findAllGraduadosSinExperiencia();

    @Query("SELECT g FROM Graduado g WHERE g.usuario.id <> :idUsuario")
    List<Graduado> findByUsuarioIdNot(@Param("idUsuario") long idUsuario);

    @Query("SELECT COUNT(g) FROM Graduado g")
    long countAll();

    @Query("SELECT t.graduado.id, c.nombre from Carrera c JOIN Titulo t ON c.id = t.carrera.id JOIN t.graduado g WHERE g.id = :idGraduado")
    Object[] findCarrerasByGraduado(@Param("idGraduado") Long idGraduado);
}
