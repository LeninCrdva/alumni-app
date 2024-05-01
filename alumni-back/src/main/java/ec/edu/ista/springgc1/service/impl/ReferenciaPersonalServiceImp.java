package ec.edu.ista.springgc1.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.ReferenciaPersonalDTO;
import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.model.entity.Referencia_Personal;
import ec.edu.ista.springgc1.repository.GraduadoRepository;
import ec.edu.ista.springgc1.repository.ReferenciaPersonalRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;

@Service
public class ReferenciaPersonalServiceImp extends GenericServiceImpl<Referencia_Personal>
		implements Mapper<Referencia_Personal, ReferenciaPersonalDTO> {

	@Autowired
	private ReferenciaPersonalRepository referenciaPersonalRepository;
	@Autowired
	private GraduadoRepository graduadoRepository;

	@Override
	public Referencia_Personal mapToEntity(ReferenciaPersonalDTO referenciaPersonalDTO) {
		Referencia_Personal referenciaPersonal = new Referencia_Personal();
		Graduado graduado = graduadoRepository
				.findByUsuarioPersonaCedulaContaining(referenciaPersonalDTO.getCedulaGraduado())
				.orElseThrow(() -> new ResourceNotFoundException("De Graduado",
						referenciaPersonalDTO.getNombreReferencia()));

		referenciaPersonal.setId(referenciaPersonalDTO.getId());
		referenciaPersonal.setGraduado(graduado);
		referenciaPersonal.setNombreReferencia(referenciaPersonalDTO.getNombreReferencia());
		referenciaPersonal.setEmail(referenciaPersonalDTO.getEmail());
		referenciaPersonal.setTelefono(referenciaPersonalDTO.getTelefono());
		return referenciaPersonal;
	}

	@Override
	public ReferenciaPersonalDTO mapToDTO(Referencia_Personal referenciaPersonal) {

		ReferenciaPersonalDTO referenciaPersonalDTO = new ReferenciaPersonalDTO();
		referenciaPersonalDTO.setId(referenciaPersonal.getId());
		referenciaPersonalDTO.setNombreReferencia(referenciaPersonal.getNombreReferencia());
		referenciaPersonalDTO.setCedulaGraduado(referenciaPersonal.getGraduado().getUsuario().getPersona().getCedula());
		referenciaPersonalDTO.setEmail(referenciaPersonal.getEmail());
		referenciaPersonalDTO.setTelefono(referenciaPersonal.getTelefono());
		return referenciaPersonalDTO;
	}

	/*
	 * Ojo con la List<?> es solo prueba
	 */
	@Override
	public List<?> findAll() {
		return referenciaPersonalRepository.findAll().stream().map(c -> mapToDTO(c)).collect(Collectors.toList());
	}

	public ReferenciaPersonalDTO findByIdToDTO(Long id) {
		Referencia_Personal referenciaPersonal = referenciaPersonalRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("id", id));

		return mapToDTO(referenciaPersonal);
	}

	public Graduado findByUsuarioPersonaCedulaContaining(String cedula) {
		return graduadoRepository.findByUsuarioPersonaCedulaContaining(cedula)
				.orElseThrow(() -> new ResourceNotFoundException("cedula", cedula));
	}

	@Override
	public Referencia_Personal save(Object entity) {

		return referenciaPersonalRepository.save(mapToEntity((ReferenciaPersonalDTO) entity));
	}

	public Optional<Referencia_Personal> findByEmail(String email) {
		return referenciaPersonalRepository.findByEmail(email);
	}

	public Optional<Referencia_Personal> findByTelefono(String telefono) {
		return referenciaPersonalRepository.findByTelefono(telefono);
	}

}
