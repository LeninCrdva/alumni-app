package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.entity.Postulacion;
import ec.edu.ista.springgc1.model.enums.EstadoPostulacion;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.persistence.Tuple;
import java.time.LocalDateTime;
import java.util.List;

public interface PostulacionRepository extends GenericRepository<Postulacion> {

    List<Postulacion> findAllByOfertaLaboralId(Long ofertaLaboralId);

    List<Postulacion> findAllByGraduadoUsuarioId(Long id);

    List<Postulacion> findAllByGraduadoUsuarioNombreUsuario(String nombreUsuario);

    Integer countPostulacionByFechaPostulacionIsStartingWith(LocalDateTime fechaPostulacion);

    Integer countByGraduadoIdAndOfertaLaboralId(Long idGraduado, Long idOfertaLaboral);

    @Query("SELECT p FROM Graduado G LEFT OUTER JOIN Postulacion p ON g = p.graduado WHERE p.graduado IS NULL")
    List<Postulacion> findGraduadosSinPostulacion();

    @Query("SELECT DATE_FORMAT(p.fechaPostulacion, '%Y-%m-%d'), count(p.fechaPostulacion) FROM Postulacion p GROUP BY DATE_FORMAT(p.fechaPostulacion, '%Y-%m-%d')")
    List<Tuple> countPostulacionesPorDia();

    @Query("SELECT p FROM Postulacion p WHERE p.ofertaLaboral.id = :ofertaLaboralId AND p.estado = 'ACEPTADO'")
    List<Postulacion> findAllByOfertaLaboralIdAccepted(Long ofertaLaboralId);
    
    @Query("SELECT DISTINCT p FROM Postulacion p JOIN p.graduado g JOIN g.titulos t JOIN t.carrera c " +
            "WHERE g.id = :graduadoId AND UPPER(c.nombre) LIKE UPPER(CONCAT('%', :nombreCarrera, '%')) AND p.estado = :estado")
     List<Postulacion> findDistinctByGraduadoIdAndCarreraAndEstado(
         @Param("graduadoId") Long graduadoId,
         @Param("nombreCarrera") String nombreCarrera,
         @Param("estado") EstadoPostulacion estado
     );

     @Query("SELECT COUNT(DISTINCT p) FROM Postulacion p JOIN p.graduado g JOIN g.titulos t JOIN t.carrera c " +
            "WHERE g.id = :graduadoId AND UPPER(c.nombre) LIKE UPPER(CONCAT('%', :nombreCarrera, '%')) AND p.estado = :estado")
     int countDistinctByGraduadoIdAndCarreraAndEstado(
         @Param("graduadoId") Long graduadoId,
         @Param("nombreCarrera") String nombreCarrera,
         @Param("estado") EstadoPostulacion estado
     );
}
