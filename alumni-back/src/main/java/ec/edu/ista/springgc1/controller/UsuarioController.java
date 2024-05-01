package ec.edu.ista.springgc1.controller;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.model.dto.UsuarioDTO;
import ec.edu.ista.springgc1.model.entity.Usuario;
import ec.edu.ista.springgc1.service.impl.UsuarioServiceImpl;

import ec.edu.ista.springgc1.view.View;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.amazonaws.services.sns.model.ResourceNotFoundException;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioServiceImpl usuarioService;

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping
    @JsonView(View.Public.class)
    public ResponseEntity<List<?>> list() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/resumen/{id}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findByIdResumen(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.findByIdToDTO(id));
    }

    @GetMapping("exists/username/{username}")
    @JsonView(View.Public.class)
    ResponseEntity<?> existsByUsername(@PathVariable String username) {
        return ResponseEntity.ok(usuarioService.existsByUsername(username.toUpperCase()));
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'EMPRESARIO', 'ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody UsuarioDTO usuarioDTO) {

        Usuario usuario = usuarioService.update(id, usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RESPONSABLE_CARRERA')")
    @PutMapping("/state-update/{id}")
    public ResponseEntity<?> updateState(@PathVariable Long id, @RequestParam Boolean state) {
        try {
            Boolean isOk = usuarioService.updateState(id, state);
            return ResponseEntity.status(HttpStatus.OK).body(isOk);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'EMPRESARIO', 'ADMINISTRADOR')")
    @PutMapping("/photo/{id}/{url_imagen}")
    public ResponseEntity<?> updatePhoto(@PathVariable Long id, @PathVariable String url_imagen) {
        Usuario usuario = usuarioService.updatePhoto(id, url_imagen);
        return ResponseEntity.status(HttpStatus.OK).body(usuario);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/some-data/{id}")
    public ResponseEntity<?> updateSomeData(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioService.updateSomeData(id, usuarioDTO);
        return ResponseEntity.status(HttpStatus.OK).body(usuario);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Usuario estudianteFromDb = usuarioService.findById(id);
        usuarioService.delete(estudianteFromDb.getId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
    @GetMapping("/by-username/{username}")
    @JsonView(View.Public.class)
    ResponseEntity<?> findByUsername(@PathVariable String username) {
        try {
            Usuario usuario = usuarioService.findByUsername2(username);
            return ResponseEntity.ok(usuario);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
