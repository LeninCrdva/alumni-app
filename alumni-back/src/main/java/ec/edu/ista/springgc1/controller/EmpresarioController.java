package ec.edu.ista.springgc1.controller;

import java.util.List;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.view.View;
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

import ec.edu.ista.springgc1.model.dto.EmpresarioDTO;
import ec.edu.ista.springgc1.model.entity.Empresario;
import ec.edu.ista.springgc1.service.impl.EmpresarioServiceImpl;


@RestController
@RequestMapping("/empresarios")
public class EmpresarioController {

    @Autowired
    private EmpresarioServiceImpl emprendimientoService;

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping
    @JsonView(View.Public.class)
    ResponseEntity<List<?>> list() {
        return ResponseEntity.ok(emprendimientoService.findAll());
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(emprendimientoService.findById(id));
    }

    @GetMapping("exists/email/{email}")
    @JsonView(View.Public.class)
    ResponseEntity<?> existsByEmail(@PathVariable String email) {
        System.out.println("Email: " + email);
        return ResponseEntity.ok(emprendimientoService.existByEmail(email));
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/usuario/{usuario}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findByUserUsername(@PathVariable String usuario) {
        return ResponseEntity.ok(emprendimientoService.findByUsuario(usuario));
    }

    @PreAuthorize("hasAnyRole('EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/user-data/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findByUserUserId(@PathVariable Long id) {
        return ResponseEntity.ok(emprendimientoService.findByIdToDTO(id));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPRESARIO') or isAnonymous()") // <--Change this, it's not possible to create an admin if you are not logged in...
    @PostMapping
    ResponseEntity<?> create(@Valid @RequestBody EmpresarioDTO empresarioDTO) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(emprendimientoService.save(empresarioDTO));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPRESARIO')")
    @PutMapping("/{id}")
    ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody EmpresarioDTO empresarioDTO) {
        EmpresarioDTO updatedEmpresario = emprendimientoService.update(id, empresarioDTO);
        return ResponseEntity.ok(updatedEmpresario);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPRESARIO')")
    @DeleteMapping("/{id}")
    ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            emprendimientoService.delete(id);
            return ResponseEntity.ok("Empresa eliminada exitosamente.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la empresa.");
        }
    }
}
