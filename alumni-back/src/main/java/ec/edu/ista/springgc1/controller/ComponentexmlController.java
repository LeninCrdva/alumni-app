package ec.edu.ista.springgc1.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ec.edu.ista.springgc1.model.dto.ComponenteXMLDTO;
import ec.edu.ista.springgc1.model.entity.Componentexml;
import ec.edu.ista.springgc1.service.impl.ComponentexmlServiceImp;


@RestController
@RequestMapping("/componentxml")
public class ComponentexmlController {

    @Autowired
    private ComponentexmlServiceImp componentexmlService;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/list")
    public ResponseEntity<List<ComponenteXMLDTO>> list() {
        try {
            List<ComponenteXMLDTO> complist = componentexmlService.findAll();
            return new ResponseEntity<>(complist, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PreAuthorize("permitAll()")
    @GetMapping("/findbyId/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Integer id) {
        try {
            ComponenteXMLDTO componenteXMLDTO = componentexmlService.findByIdToDTO(id);
            return ResponseEntity.ok(componenteXMLDTO);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("permitAll()")
    @GetMapping("/findById/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            Componentexml componentexml = componentexmlService.findById(id);
            if (componentexml != null) {
                return ResponseEntity.ok(componentexml);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PreAuthorize("permitAll()")
    @GetMapping("/findByTipo/{tipo}")
    public ResponseEntity<?> findByTipo(@PathVariable String tipo) {
        try {
            Optional<Componentexml> componentexmlOptional = componentexmlService.findComponentexmlByTipo(tipo);

            if (componentexmlOptional.isPresent()) {
                return ResponseEntity.ok(componentexmlOptional.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping(value = "/create", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> save(@RequestParam("tipo") String tipo, @RequestParam("xml_file") MultipartFile xml_file, @RequestParam("foto_portada") MultipartFile foto_portada) {
        try {
            Componentexml componentexml = componentexmlService.saveData(foto_portada, xml_file, tipo);
            return ResponseEntity.status(HttpStatus.CREATED).body(componentexml);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping(value = "/update/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateConfigById(@PathVariable long id, @RequestParam(value = "foto_portada", required = false) MultipartFile foto_portada, @RequestParam(value = "xml_file", required = false) MultipartFile xml_file, @RequestParam("tipo") String tipo) {
        try {
            Componentexml updatedProgram = componentexmlService.update(id, foto_portada, xml_file, tipo);
            return ResponseEntity.status(HttpStatus.OK).body(updatedProgram);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Componentexml> delete(@PathVariable Integer id) {
        componentexmlService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
