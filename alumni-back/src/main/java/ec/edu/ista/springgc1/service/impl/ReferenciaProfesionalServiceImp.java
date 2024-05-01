package ec.edu.ista.springgc1.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.ReferenciaProfesionalDTO;
import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.model.entity.ReferenciaProfesional;
import ec.edu.ista.springgc1.repository.GraduadoRepository;
import ec.edu.ista.springgc1.repository.ReferenciaProfesionalRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;

@Service
public class ReferenciaProfesionalServiceImp extends GenericServiceImpl<ReferenciaProfesional>
		implements Mapper<ReferenciaProfesional, ReferenciaProfesionalDTO> {

	@Autowired
	private ReferenciaProfesionalRepository referenciaProfesionalRepository;

	@Autowired
	private GraduadoRepository graduadoRepository;

	@Override
	public ReferenciaProfesional mapToEntity(ReferenciaProfesionalDTO referenciaProfesionalDTO) {

		ReferenciaProfesional referenciaProfesional = new ReferenciaProfesional();
		Graduado graduado = graduadoRepository
				.findByUsuarioPersonaCedulaContaining(referenciaProfesionalDTO.getGraduado())
				.orElseThrow(() -> new ResourceNotFoundException("Referencia Profesional",
						referenciaProfesionalDTO.getNombre()));

		referenciaProfesional.setId(referenciaProfesionalDTO.getId());
		referenciaProfesional.setGraduado(graduado);
		referenciaProfesional.setNombre(referenciaProfesionalDTO.getNombre());
		referenciaProfesional.setInstitucion(referenciaProfesionalDTO.getInstitucion());
		referenciaProfesional.setEmail(referenciaProfesionalDTO.getEmail());

		return referenciaProfesional;

	}

	@Override
	public ReferenciaProfesionalDTO mapToDTO(ReferenciaProfesional referenciaProfesional) {

		ReferenciaProfesionalDTO referenciaProfesionalDTO = new ReferenciaProfesionalDTO();

		referenciaProfesionalDTO.setId(referenciaProfesional.getId());
		referenciaProfesionalDTO.setGraduado(referenciaProfesional.getGraduado().getUsuario().getPersona().getCedula());
		referenciaProfesionalDTO.setNombre(referenciaProfesional.getNombre());
		referenciaProfesionalDTO.setInstitucion(referenciaProfesional.getInstitucion());
		referenciaProfesionalDTO.setEmail(referenciaProfesional.getEmail());

		return referenciaProfesionalDTO;
	}

	@Override
	public List<?> findAll() {
		return referenciaProfesionalRepository.findAll().stream().map(c -> mapToDTO(c)).collect(Collectors.toList());
	}

	public ReferenciaProfesionalDTO findByIdToDTO(Long id) {
		ReferenciaProfesional referenciaProfesional = referenciaProfesionalRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("id", id));

		return mapToDTO(referenciaProfesional);
	}

	public Graduado findByUsuarioPersonaCedulaContaining(String cedula) {
		return graduadoRepository.findByUsuarioPersonaCedulaContaining(cedula)
				.orElseThrow(() -> new ResourceNotFoundException("cedula", cedula));
	}

	@Override
	public ReferenciaProfesional save(Object entity) {
		return referenciaProfesionalRepository.save(mapToEntity((ReferenciaProfesionalDTO) entity));
	}

	public List<ReferenciaProfesionalDTO> findByNombreUsuario(String nombreUsuario) {
		List<ReferenciaProfesional> referencias = referenciaProfesionalRepository.findByNombreUsuario(nombreUsuario);
		return referencias.stream().map(this::mapToDTO).collect(Collectors.toList());
	}

}
