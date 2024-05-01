package ec.edu.ista.springgc1.controller;

import java.util.List;

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

import ec.edu.ista.springgc1.model.dto.AdminDTO;
import ec.edu.ista.springgc1.model.entity.Administrador;
import ec.edu.ista.springgc1.service.impl.AdministradorServiceImpl;

@RestController
@RequestMapping("/administradores")
public class AdministradorController {

	@Autowired
    private AdministradorServiceImpl adminService;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    @JsonView(View.Public.class)
    ResponseEntity<List<?>> list() {
        return ResponseEntity.ok(adminService.findAll());
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.findById(id));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/usuario/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.findByUsuario(id));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("exists/email/{email}")
    @JsonView(View.Public.class)
    ResponseEntity<?> existsByEmail(@PathVariable String email) {
        return ResponseEntity.ok(adminService.existsByEmail(email));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR') or isAnonymous()") // <--Chane this, it's not possible to create an admin if you are not logged in...
    @PostMapping
    ResponseEntity<?> create(@Valid @RequestBody AdminDTO adminDTO) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminService.save(adminDTO));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody AdminDTO adminDTO) {
    	 AdminDTO adminFromDb = adminService.findByIdToDTO(id);       
    	 adminFromDb.setUsuario(adminDTO.getUsuario());
    	 adminFromDb.setEstado(adminDTO.isEstado());
    	 adminFromDb.setCargo(adminDTO.getCargo());
    	 adminFromDb.setEmail(adminDTO.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.save(adminFromDb));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
    	Administrador adminFromDb = adminService.findById(id);
    	adminService.delete(adminFromDb.getId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/todos")
    @JsonView(View.Public.class)
    ResponseEntity<List<Administrador>> findAllAdministradores() {
        return ResponseEntity.ok(adminService.findAllAdministradores());
    }

}
