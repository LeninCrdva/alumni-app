package ec.edu.ista.springgc1.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.model.dto.Evento_MDTO;
import ec.edu.ista.springgc1.model.entity.DataCompression;
import ec.edu.ista.springgc1.model.entity.Evento;
import ec.edu.ista.springgc1.repository.Evento_MRepository;
import ec.edu.ista.springgc1.service.impl.EventoServiceImpl;
import ec.edu.ista.springgc1.view.View;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/programasM")
public class EventosController {
	 private DataCompression dataCompression = new DataCompression();

	    @Autowired
	    private EventoServiceImpl programasMService;
	    @PreAuthorize("permitAll()")
	    @GetMapping("/list")
	    public ResponseEntity<List<Evento_MDTO>> list() {
	        try {
	            List<Evento_MDTO> blogs = programasMService.findAll();
	            return new ResponseEntity<>(blogs, HttpStatus.OK);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	    @PreAuthorize("hasRole('ADMINISTRADOR')")
	    @GetMapping("/findbyId/{id}")
	    public ResponseEntity<?> getById(@PathVariable("id") Integer id) {
	        try {
	        	Evento_MDTO programas_mdto = programasMService.findByIdToDTO(id);
	            return ResponseEntity.ok(programas_mdto);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

	    @GetMapping(value = "/{id}/base64")
	   
	    public ResponseEntity<String> findByIdAsBase64(@PathVariable Long id) {
	        Evento programas_m = programasMService.findById(id);
	        try {
	            byte[] fotoBytes = dataCompression.decompress(programas_m.getFoto_portada());
	            String base64Image = Base64.getEncoder().encodeToString(fotoBytes);
	            return ResponseEntity.ok(base64Image);
	        } catch (IOException e) {
	            e.printStackTrace();
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	        }
	    }
	    @PreAuthorize("hasRole('ADMINISTRADOR')")
	    @PostMapping(value = "/create", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	    public ResponseEntity<?> save(@RequestParam("foto_portada") MultipartFile foto_portada,
	                                  @RequestParam("titulo") String titulo,
	                                  @RequestParam("subTitulo") String subTitulo,
	                                  @RequestParam("resumen") String resumen,
	                                  @RequestParam("tipoxml") String tipoxml,
	                                  @RequestParam("colorFondo") String colorFondo) {
	        try {
	        	Evento saveProgramaM = programasMService.save(foto_portada, titulo, subTitulo, resumen, tipoxml, colorFondo);
	            return ResponseEntity.status(HttpStatus.CREATED).body(saveProgramaM);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	    @PreAuthorize("hasRole('ADMINISTRADOR')")

	    @PutMapping(value = "/update/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	    public ResponseEntity<?> updateConfigById(@PathVariable long id,
	                                              @RequestParam(value = "foto_portada", required = false) MultipartFile foto_portada,
	                                              @RequestParam("titulo") String titulo,
	                                              @RequestParam("subTitulo") String subTitulo,
	                                              @RequestParam("resumen") String resumen,
	                                              @RequestParam("colorFondo") String colorFondo,
	                                              @RequestParam("tipoxml") String tipoxml) {
	        try {
	        	Evento updatedProgram = programasMService.update(id, foto_portada, titulo, subTitulo, resumen, colorFondo, tipoxml);
	            return ResponseEntity.status(HttpStatus.OK).body(updatedProgram);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

	    @PreAuthorize("hasRole('ADMINISTRADOR')")
	    @DeleteMapping("/delete/{id}")
	    public ResponseEntity<Evento> delete(@PathVariable Integer id) {
	        programasMService.delete(id);
	        return new ResponseEntity<>(HttpStatus.OK);
	    }
}
