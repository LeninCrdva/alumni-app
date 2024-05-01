package ec.edu.ista.springgc1.controller;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.model.dto.AuditEntryDTO;
import ec.edu.ista.springgc1.service.impl.AuditEntryServiceImp;
import ec.edu.ista.springgc1.view.View;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/audit-entry")
public class AuditEntryController {

    private final AuditEntryServiceImp auditEntryServiceImp;

    public AuditEntryController(AuditEntryServiceImp auditEntryServiceImp) {
        this.auditEntryServiceImp = auditEntryServiceImp;
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping()
    public  ResponseEntity<List<?>> findAll() {
        return ResponseEntity.ok(auditEntryServiceImp.findAll());
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/{id}")
    @JsonView(View.Public.class)
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(auditEntryServiceImp.findById(id));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    @JsonView(View.Public.class)
    public ResponseEntity<?> save(@Valid @RequestBody AuditEntryDTO auditEntry) {
        return ResponseEntity.ok(auditEntryServiceImp.save(auditEntry));
    }
}
