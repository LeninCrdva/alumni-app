package ec.edu.ista.springgc1.controller;

import java.util.List;
import java.util.Set;

import javax.validation.Valid;

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

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.model.dto.EmpresaDTO;
import ec.edu.ista.springgc1.model.entity.Empresa;
import ec.edu.ista.springgc1.service.impl.EmpresaServiceImpl;


@RestController
@RequestMapping("/empresas")
public class EmpresaController {
    @Autowired
    private EmpresaServiceImpl empresaService;

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping
    @JsonView(View.Public.class)
    ResponseEntity<List<?>> list() {
        return ResponseEntity.ok(empresaService.findAll());
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.findById(id));
    }

    @GetMapping("exists/nombre/{nombre}")
    @JsonView(View.Public.class)
    ResponseEntity<?> existsByNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(empresaService.existsBynombre(nombre));
    }

    @GetMapping("exists/ruc/{ruc}")
    @JsonView(View.Public.class)
    ResponseEntity<?> existsByRuc(@PathVariable String ruc) {
        return ResponseEntity.ok(empresaService.existByRuc(ruc));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPRESARIO')")
    @PostMapping
    ResponseEntity<?> create(@Valid @RequestBody EmpresaDTO eDTO) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(empresaService.save(eDTO));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPRESARIO')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody EmpresaDTO eDTO) {
        // Obtener la empresa existente
        Empresa existingEmpresa = empresaService.findById(id);
        if (!existingEmpresa.getNombre().equals(eDTO.getNombre()) && empresaService.existsBynombre(eDTO.getNombre())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ya existe otra empresa con el mismo nombre.");
        }

        // Actualizar la empresa
        EmpresaDTO updatedEmpresa = empresaService.update(id, eDTO);
        return ResponseEntity.ok(updatedEmpresa);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPRESARIO')")
    @DeleteMapping("/{id}")
    ResponseEntity<?> delete(@PathVariable Long id) {
        empresaService.delete(id);
        return ResponseEntity.ok("Empresa eliminada exitosamente.");
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPRESARIO')")
    @GetMapping("/by-usuario/{nombreUsuario}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findByNombreUsuario(@PathVariable String nombreUsuario) {
        Set<EmpresaDTO> empresas = empresaService.findByNombreUsuario(nombreUsuario);
        return ResponseEntity.ok(empresas);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPRESARIO')")
    @PutMapping("/pdf-ruc/{id}/{rutaPdfRuc}")
    @JsonView(View.Public.class)
    public ResponseEntity<?> updatePdfRuc(@PathVariable Long id, @PathVariable String rutaPdfRuc) {
        EmpresaDTO updatedEmpresa = empresaService.updatePdfRuc(id, rutaPdfRuc);
        return ResponseEntity.ok(updatedEmpresa);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @GetMapping("/sin-oferta-laboral")
    @JsonView(View.Public.class)
    public Set<EmpresaDTO> obtenerEmpresasSinOfertaLaboral() {
        return empresaService.findEmpresasSinOfertaLaboral();
    }
}
