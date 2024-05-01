package ec.edu.ista.springgc1.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ec.edu.ista.springgc1.exception.AppException;
import ec.edu.ista.springgc1.model.entity.Periodo;
import ec.edu.ista.springgc1.service.impl.PeriodosServiceImp;



@RestController
@RequestMapping("/peridos")
public class PeridoController {

    @Autowired
    private PeriodosServiceImp periodoService;

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping
    ResponseEntity<List<?>> list() {
        return ResponseEntity.ok(periodoService.findAll());
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}")
    ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(periodoService.findById(id));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    ResponseEntity<?> create(@Valid @RequestBody Periodo p) {
        if (periodoService.findByNombre(p.getNombre()).isPresent()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Ya se encuentra registrado el periodo");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(periodoService.save(p));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Periodo p) {
        Periodo periodoFromDb = periodoService.findById(id);
        if (!p.getNombre().equalsIgnoreCase(periodoFromDb.getNombre()) && periodoService.findByNombre(p.getNombre()).isPresent()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Ya se encuentra registrado el Periodo");
        }
        periodoFromDb.setNombre(p.getNombre());
        periodoFromDb.setFechaFin(p.getFechaFin());
        periodoFromDb.setFechaInicio(p.getFechaInicio());
        periodoFromDb.setEstado(p.getEstado());
        periodoFromDb.setCarreras(p.getCarreras());
        return ResponseEntity.status(HttpStatus.CREATED).body(periodoService.save(periodoFromDb));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Periodo pFromDb = periodoService.findById(id);
        periodoService.delete(pFromDb.getId());
        return ResponseEntity.noContent().build();
    }
}
