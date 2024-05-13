package ec.edu.ista.springgc1.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.model.dto.GraduadoDTO;
import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.model.entity.OfertasLaborales;
import ec.edu.ista.springgc1.service.impl.GraduadoServiceImpl;
import ec.edu.ista.springgc1.view.View;


@RestController
@RequestMapping("/graduados")
public class GraduadoController {

    @Autowired
    private GraduadoServiceImpl estudianteService;

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping
    @JsonView(View.Public.class)
    ResponseEntity<List<?>> list() {
        return ResponseEntity.ok(estudianteService.findAll());
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteService.findById(id));
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/with-pdf/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findWithPdfById(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteService.findByIdWithPdf(id));
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/otros-graduados/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findOtrosGraduados(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteService.findAllGraduadosNotIn(id));
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/resumen/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findByIdResumen(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteService.findByIdToDTO(id));
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/usuario/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteService.findByUsuario(id));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR')")
    @GetMapping("/user-id/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findToDTOByUserId(@PathVariable long id) {
        return ResponseEntity.ok(estudianteService.findDTOByUserId(id));
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/user/{username}")
    @JsonView(View.Public.class)
    ResponseEntity<List<OfertasLaborales>> findByUserName(@PathVariable("username") String username) {
        return ResponseEntity.ok(estudianteService.findByUsuarioNombreUsuario(username));
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/mis-carreras/{idGraduado}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findCarrerasByGraduado(@PathVariable Long idGraduado) {
        return ResponseEntity.ok(estudianteService.findCarrerasByGraduado(idGraduado));
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/total")
    @JsonView(View.Public.class)
    ResponseEntity<?> countEstudiantes() {
        return ResponseEntity.ok(Collections.singletonMap("total:", estudianteService.count()));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GRADUADO')")
    @PostMapping
    ResponseEntity<?> create(@Valid @RequestBody GraduadoDTO estudianteDTO) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(estudianteService.save(estudianteDTO));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GRADUADO')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody GraduadoDTO estudianteDTO) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(estudianteService.update(id, estudianteDTO));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GRADUADO')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Graduado estudianteFromDb = estudianteService.findById(id);
        estudianteService.delete(estudianteFromDb.getId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/without-oferta")
    @JsonView(View.Public.class)
    ResponseEntity<List<?>> listWithOut() {
        return ResponseEntity.ok(estudianteService.findGRaduadoWithOutOfertas());
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPRESARIO', 'GRADUADO')")
    @GetMapping("/all")
    @JsonView(View.Public.class)
    ResponseEntity<List<Graduado>> findAllGraduados() {
        return ResponseEntity.ok(estudianteService.findAllGraduados());
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/count-sex")
    @JsonView(View.Public.class)
    public ResponseEntity<?> countSex() {
        return ResponseEntity.ok(estudianteService.countBySex());
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @GetMapping("/with-oferta")
    @JsonView(View.Public.class)
    ResponseEntity<List<Graduado>> findAllGraduadosConOfertas() {
        return ResponseEntity.ok(estudianteService.findGraduadosWithOfertas());
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @GetMapping("/sin-experiencia")
    @JsonView(View.Public.class)
    ResponseEntity<List<Graduado>> findAllGraduadosSinExperiencia() {
        return ResponseEntity.ok(estudianteService.findGraduadosSinExperiencia());
    }

    @GetMapping("/exists/email/{email}")
    @JsonView(View.Public.class)
    ResponseEntity<?> existsByEmail(@PathVariable String email) {
        return ResponseEntity.ok(estudianteService.existsByEmailPersonalIgnoreCase(email));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/without-title/{id}")
    public ResponseEntity<?> controlCase(@PathVariable Long id, @Valid @RequestBody GraduadoDTO estudianteDTO) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(estudianteService.updateBasicData(id, estudianteDTO));
    }
}
