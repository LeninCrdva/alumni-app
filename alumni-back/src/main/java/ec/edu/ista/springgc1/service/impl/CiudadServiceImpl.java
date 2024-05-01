package ec.edu.ista.springgc1.service.impl;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.CiudadDTO;
import ec.edu.ista.springgc1.model.entity.Ciudad;
import ec.edu.ista.springgc1.model.entity.Provincia;
import ec.edu.ista.springgc1.repository.CiudadRepository;
import ec.edu.ista.springgc1.repository.ProvinciaRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CiudadServiceImpl extends GenericServiceImpl<Ciudad> implements Mapper<Ciudad, CiudadDTO> {

    @Autowired
    private CiudadRepository ciudadRepository;

    @Autowired
    private ProvinciaRepository provinciaRepository;

    @Override
    public Ciudad mapToEntity(CiudadDTO ciudadDTO) {
        Ciudad ciudad = new Ciudad();
        Provincia provincia = provinciaRepository.findByNombre(ciudadDTO.getProvincia())
                .orElseThrow(()-> new ResourceNotFoundException("nombre",ciudadDTO.getProvincia()));

        ciudad.setId(ciudadDTO.getId());
        ciudad.setNombre(ciudadDTO.getNombre());
        ciudad.setProvincia(provincia);

        return ciudad;
    }

    @Override
    public CiudadDTO mapToDTO(Ciudad ciudad) {
        CiudadDTO ciudadDTO = new CiudadDTO();
        ciudadDTO.setId(ciudad.getId());
        ciudadDTO.setNombre(ciudad.getNombre());
        ciudadDTO.setProvincia(ciudad.getProvincia().getNombre());

        return ciudadDTO;
    }

    @Override
    public List findAll() {
        return ciudadRepository.findAll()
                .stream()
                .map(c -> mapToDTO(c))
                .collect(Collectors.toList());
    }

    @Override
    public Ciudad save(Object entity) {
        return ciudadRepository.save(mapToEntity((CiudadDTO) entity));
    }


    public CiudadDTO findByIdToDTO(long id) {
        return mapToDTO(ciudadRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", id)));
    }

    public Optional<Ciudad> findByNombre(String nombre){
        return ciudadRepository.findByNombre(nombre);
    }
}
