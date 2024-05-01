package ec.edu.ista.springgc1.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.model.entity.OfertasLaborales;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

public interface OfertaslaboralesRepository extends GenericRepository<OfertasLaborales> {
    List<OfertasLaborales> findOfertasByIdIn(List<Long> idOfertas);
   
    
    Optional<OfertasLaborales> findByTipo(String tipo);

    @Query("SELECT o FROM OfertasLaborales o JOIN o.empresa e JOIN e.empresario em JOIN em.usuario u WHERE UPPER(u.nombreUsuario) = UPPER(:nombreUsuario)")
    List<OfertasLaborales> buscarOfertasPorNombreUsuario(@Param("nombreUsuario") String nombreUsuario);

    //@Query("SELECT o.graduados FROM OfertasLaborales o WHERE o.id = :ofertaId")
    //List<Graduado> findGraduadosByOfertaId(@Param("ofertaId") Long ofertaId); <-- This method not use, however, use the method in PostulacionRepository

    @Query("SELECT o FROM OfertasLaborales o JOIN o.empresa e WHERE UPPER(e.nombre) = UPPER(:nombreEmpresa)")
    List<OfertasLaborales> findOfertasByNombreEmpresa(@Param("nombreEmpresa") String nombreEmpresa);

    /*@Modifying
    @Query("UPDATE OfertasLaborales o SET o.graduados = :graduados WHERE o.id = :ofertaId")
    void seleccionarContratados(@Param("ofertaId") Long ofertaId, @Param("graduados") List<Graduado> graduados);*/

    @Query("SELECT o FROM OfertasLaborales o WHERE o NOT IN (SELECT p.ofertaLaboral FROM Postulacion p WHERE p.graduado.id = :id) AND (o.estado = 'EN_CONVOCATORIA' OR o.estado = 'REACTIVADA') AND o.fechaCierre >= CURRENT_TIMESTAMP")
    List<OfertasLaborales> findOfertasWithOutPostulacionByGraduadoId(@Param("id") Long id);

    @Query("SELECT o FROM OfertasLaborales o WHERE o.estado != 'FINALIZADA'")
    List<OfertasLaborales> findOfertasLaboralesWithOutEstadoFinalizado();
}
