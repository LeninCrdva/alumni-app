package ec.edu.ista.springgc1.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.LogroDTO;
import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.model.entity.Logro;
import ec.edu.ista.springgc1.repository.GraduadoRepository;
import ec.edu.ista.springgc1.repository.LogroRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;

@Service
public class LogroServiceImpl extends GenericServiceImpl<Logro> implements Mapper<Logro, LogroDTO>{

	@Autowired
	private LogroRepository logroRepository;
	
	@Autowired
	private GraduadoRepository graduadoRepository;
	
	public Optional<Logro> findByTipo(String tipo){
		return logroRepository.findByTipo(tipo);
	}
	
	@Override
	public Logro save(Object entity) {
		return logroRepository.save(mapToEntity((LogroDTO) entity));
	}
	
	public List findAllDTO() {
		return logroRepository.findAll()
				.stream()
				.map(c -> mapToDTO(c))
				.collect(Collectors.toList());
	}
	
	public LogroDTO findLogroByIdToDTO(Long id) {
		return mapToDTO(logroRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("id", id)));
	}

	@Override
	public Logro mapToEntity(LogroDTO logroDTO) {
		Logro logro = new Logro();
		Graduado graduado = graduadoRepository.findByUsuarioPersonaCedulaContaining(logroDTO.getCedula())
				.orElseThrow(() -> new ResourceNotFoundException("cedula", logroDTO.getCedula()));
		logro.setDescripcion(logroDTO.getDescripcion());
		logro.setGraduado(graduado);
		logro.setTipo(logroDTO.getTipoLogro());
		
		return logro;
	}

	@Override
	public LogroDTO mapToDTO(Logro logro) {
		LogroDTO logroDTO = new LogroDTO();
		logroDTO.setId(logro.getId());
		logroDTO.setCedula(logro.getGraduado().getUsuario().getPersona().getCedula());
		logroDTO.setDescripcion(logro.getDescripcion());
		logroDTO.setTipoLogro(logro.getTipo());

		return logroDTO;
	}
}
