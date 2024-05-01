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
import ec.edu.ista.springgc1.model.entity.Carrera;
import ec.edu.ista.springgc1.service.impl.CarreraServiceImp;

@RestController
@RequestMapping("/carreras")
public class CarreraController {

    @Autowired
    private CarreraServiceImp CarreraService;

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping
    ResponseEntity<List<?>> list() {
        return ResponseEntity.ok(CarreraService.findAll());
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}")
    ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(CarreraService.findById(id));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    ResponseEntity<?> create(@Valid @RequestBody Carrera carrera) {
        if (CarreraService.findByNombre(carrera.getNombre()).isPresent()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Ya se encuentra registrado la Carrera");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CarreraService.save(carrera));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Carrera carrera) {
        Carrera carreraFromDb = CarreraService.findById(id);
        if (!carrera.getNombre().equalsIgnoreCase(carreraFromDb.getNombre()) && CarreraService.findByNombre(carrera.getNombre()).isPresent()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Ya se encuentra registrado la carrera");
        }
        carreraFromDb.setNombre(carrera.getNombre());
        carreraFromDb.setDescripcion(carrera.getDescripcion());

        return ResponseEntity.status(HttpStatus.CREATED).body(CarreraService.save(carreraFromDb));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Carrera carreraFromDb = CarreraService.findById(id);
        CarreraService.delete(carreraFromDb.getId());
        return ResponseEntity.noContent().build();
    }
}
