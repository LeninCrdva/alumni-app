package ec.edu.ista.springgc1.controller;

import ec.edu.ista.springgc1.exception.AppException;
import ec.edu.ista.springgc1.model.dto.CiudadDTO;
import ec.edu.ista.springgc1.model.entity.Ciudad;
import ec.edu.ista.springgc1.service.impl.CiudadServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/ciudades")
public class CiudadController {

    @Autowired
    private CiudadServiceImpl ciudadService;

    @PreAuthorize("permitAll()")
    @GetMapping
    ResponseEntity<List<?>> list() {
        return ResponseEntity.ok(ciudadService.findAll());
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}")
    ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ciudadService.findById(id));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    ResponseEntity<?> create(@Valid @RequestBody CiudadDTO ciudadDTO) {
        if (ciudadService.findByNombre(ciudadDTO.getNombre()).isPresent()){
            throw new AppException(HttpStatus.BAD_REQUEST,"Ya se encuentra registrado la Ciudad");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ciudadService.save(ciudadDTO));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody CiudadDTO ciudadDTO) {
        CiudadDTO ciudadFromDb = ciudadService.findByIdToDTO(id);
        if (!ciudadDTO.getNombre().equalsIgnoreCase(ciudadFromDb.getNombre()) && ciudadService.findByNombre(ciudadDTO.getNombre()).isPresent()){
            throw new AppException(HttpStatus.BAD_REQUEST,"Ya se encuentra registrado la Ciudad");
        }
        ciudadFromDb.setNombre(ciudadDTO.getNombre());
        ciudadFromDb.setProvincia(ciudadDTO.getProvincia());

        return ResponseEntity.status(HttpStatus.CREATED).body(ciudadService.save(ciudadFromDb));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Ciudad ciudadFromDb = ciudadService.findById(id);
        ciudadService.delete(ciudadFromDb.getId());
        return ResponseEntity.noContent().build();
    }
}
