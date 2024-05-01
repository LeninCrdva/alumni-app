package ec.edu.ista.springgc1.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.CapacitacionDTO;
import ec.edu.ista.springgc1.model.entity.Capacitacion;
import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.repository.CapacitacionRepository;
import ec.edu.ista.springgc1.repository.GraduadoRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;

@Service
public class CapacitacionServiceImpl extends GenericServiceImpl<Capacitacion> implements Mapper<Capacitacion, CapacitacionDTO>{
	
	@Autowired
	private CapacitacionRepository capacitacionRepository;

	@Autowired
	private GraduadoRepository graduadoRepository;
	
	@Override
	public Capacitacion mapToEntity(CapacitacionDTO capaciDTO) {
		Capacitacion capacitacion = new Capacitacion();
		Graduado graduado = graduadoRepository.findByUsuarioPersonaCedulaContaining(capaciDTO.getCedula())
				.orElseThrow(() -> new ResourceNotFoundException("cedula", capacitacion.getGraduado()));
		capacitacion.setGraduado(graduado);
		capacitacion.setNombre(capaciDTO.getNombre());
		capacitacion.setInstitucion(capaciDTO.getInstitucion());
		capacitacion.setTipoCertificado(capaciDTO.getTipoCertificado());
		capacitacion.setFechaFin(capaciDTO.getFechaFin());
		capacitacion.setFechaInicio(capaciDTO.getFechaInicio());
		capacitacion.setHoras(capaciDTO.getNumHoras());
		capacitacion.setId(capaciDTO.getId());
		
		return capacitacion;
	}

	@Override
	public CapacitacionDTO mapToDTO(Capacitacion capacitacion) {
		CapacitacionDTO capaciDTO = new CapacitacionDTO();
		capaciDTO.setId(capacitacion.getId());
		capaciDTO.setInstitucion(capacitacion.getInstitucion());
		capaciDTO.setNombre(capacitacion.getNombre());
		capaciDTO.setTipoCertificado(capacitacion.getTipoCertificado());
		capaciDTO.setCedula(capacitacion.getGraduado().getUsuario().getPersona().getCedula());
		capaciDTO.setNumHoras(capacitacion.getHoras());
		capaciDTO.setFechaFin(capacitacion.getFechaFin());
		capaciDTO.setFechaInicio(capacitacion.getFechaInicio());
		return capaciDTO;
	}
	
	public Optional<Capacitacion> findByNombre(String nombre){
		return capacitacionRepository.findByNombre(nombre);
	}
	
	public List findAllToDTO() {
		return capacitacionRepository.findAll()
				.stream()
				.map(c -> mapToDTO(c))
				.collect(Collectors.toList());
	}
	
	public CapacitacionDTO findTrainingByIdToDTO(Long id) {
		return mapToDTO(capacitacionRepository.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("id", id)));
	}
	
	@Override
	public Capacitacion save(Object entity) {
		return capacitacionRepository.save(mapToEntity((CapacitacionDTO) entity));
	}
}
