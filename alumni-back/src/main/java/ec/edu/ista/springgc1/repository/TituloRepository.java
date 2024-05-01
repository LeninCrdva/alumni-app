package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.entity.Carrera;
import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.model.entity.Titulo;
import ec.edu.ista.springgc1.model.enums.EstadoPostulacion;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TituloRepository extends GenericRepository<Titulo>{
    List<Titulo> findAllByGraduadoId(Long id);
    
    @Query("SELECT t FROM Titulo t WHERE t.carrera = :carrera")
    List<Titulo> findAllByCarrera(@Param("carrera") Carrera carrera);


    @Query("SELECT DISTINCT t.graduado FROM Titulo t WHERE UPPER(t.carrera.nombre) = UPPER(:nombreCarrera)")
    List<Graduado> findDistinctGraduadosByNombreCarrera(@Param("nombreCarrera") String nombreCarrera);
    
    
    @Query("SELECT t.carrera.nombre, g.usuario.persona.sexo, COUNT(g) " +
            "FROM Titulo t " +
            "JOIN t.graduado g " +
            "GROUP BY t.carrera.nombre, g.usuario.persona.sexo")
     List<Object[]> contarGraduadosPorSexoPorCarrera();
     
     //Prueba
     @Query("SELECT t FROM Titulo t WHERE t.graduado = :graduado")
     List<Titulo> findAllByGraduado(@Param("graduado") Graduado graduado);
     
     @Query("SELECT t.graduado FROM Titulo t WHERE UPPER(t.carrera.nombre) = UPPER(:nombreCarrera)")
     List<Graduado> findAllGraduadosByNombreCarrera(@Param("nombreCarrera") String nombreCarrera);

    @Query("SELECT c.nombre, t.nombreTitulo, g.emailPersonal, p.primerNombre, p.segundoNombre, p.apellidoPaterno, p.apellidoMaterno, p.cedula " +
            "FROM Graduado g JOIN g.usuario u JOIN u.persona p JOIN g.titulos t JOIN t.carrera c")
    List<Object[]> findGraduadosByCarreraTitulo();
    

}
