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

import ec.edu.ista.springgc1.model.dto.CapacitacionDTO;
import ec.edu.ista.springgc1.model.entity.Capacitacion;
import ec.edu.ista.springgc1.service.impl.CapacitacionServiceImpl;

@RestController
@RequestMapping("capacitacion")
public class CapacitacionController {

	@Autowired
	private CapacitacionServiceImpl capacitacionService;

	@PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GRADUADO', 'EMPRESARIO', 'RESPONSABLE_CARRERA')")
	@GetMapping("/list")
	public ResponseEntity<List<?>> listAllCapacitacion() {
		return ResponseEntity.ok(capacitacionService.findAllToDTO());
	}

	@PreAuthorize("hasAnyRole('GRADUADO', 'RESPONSABLE_CARRERA', 'EMPRESARIO', 'ADMINISTRADOR')")
	@GetMapping("/find-cap/{id}")
	public ResponseEntity<?> findCapacById(@PathVariable("id") Long id) {
		return ResponseEntity.ok(capacitacionService.findTrainingByIdToDTO(id));
	}

	@PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GRADUADO')")
	@PostMapping("/save-cap")
	public ResponseEntity<?> saveTraining(@Valid @RequestBody CapacitacionDTO capacitacionDTO) {
		if (capacitacionDTO.getNombre().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}

		if (capacitacionService.findByNombre(capacitacionDTO.getNombre()).isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}

		return ResponseEntity.status(HttpStatus.CREATED).body(capacitacionService.save(capacitacionDTO));
	}

	@PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GRADUADO')")
	@PutMapping("update-cap/{id}")
	public ResponseEntity<?> updateTraining(@PathVariable("id") Long id,
			@Valid @RequestBody CapacitacionDTO capacitacion) {
		CapacitacionDTO capacitacionDb = capacitacionService.findTrainingByIdToDTO(id);
		
		capacitacionDb.setInstitucion(capacitacion.getInstitucion());
		capacitacionDb.setTipoCertificado(capacitacion.getTipoCertificado());
		capacitacionDb.setFechaInicio(capacitacion.getFechaInicio());
		capacitacionDb.setFechaFin(capacitacion.getFechaFin());
		capacitacionDb.setNumHoras(capacitacion.getNumHoras());
		capacitacionDb.setNombre(capacitacion.getNombre());
		capacitacionDb.setCedula(capacitacion.getCedula());

		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(capacitacionService.save(capacitacionDb));
	}

	@PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GRADUADO')") //This method should be an updated of state...
	@DeleteMapping("/delete-cap/{id}")
	public ResponseEntity<?> deleteTrainingById(@PathVariable("id") Long id){
		Capacitacion capacitacionDb = capacitacionService.findById(id);
        capacitacionService.delete(capacitacionDb.getId());
		
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
}
