package ec.edu.ista.springgc1.controller;

import ec.edu.ista.springgc1.exception.AppException;
import ec.edu.ista.springgc1.model.entity.Provincia;
import ec.edu.ista.springgc1.service.impl.ProvinciaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


@RestController
@RequestMapping("/provincias")
public class ProvinciaController {

    @Autowired
    private ProvinciaServiceImpl provinciaService;

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping
    ResponseEntity<?> list() {
        return ResponseEntity.ok(provinciaService.findAll());
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}")
    ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(provinciaService.findById(id));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    ResponseEntity<?> create(@Valid @RequestBody Provincia provincia) {

        if (provinciaService.findByNombre(provincia.getNombre()).isPresent()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "el dato ingresado ya fue registrado");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(provinciaService.save(provincia));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Provincia provincia) {
        Provincia provinciaFromDb = provinciaService.findById(id);

        if (!provincia.getNombre().equalsIgnoreCase(provinciaFromDb.getNombre()) && provinciaService.findByNombre(provincia.getNombre()).isPresent()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "el dato ingresado ya fue registrado");
        }

        provinciaFromDb.setNombre(provincia.getNombre());
        provinciaFromDb.setPais(provincia.getPais());

        return ResponseEntity.status(HttpStatus.CREATED).body(provinciaService.save(provinciaFromDb));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Provincia provinciaFromDb = provinciaService.findById(id);
        provinciaService.delete(provinciaFromDb.getId());
        return ResponseEntity.noContent().build();
    }
}
