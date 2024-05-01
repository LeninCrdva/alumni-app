package ec.edu.ista.springgc1.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.ComponenteXMLDTO;
import ec.edu.ista.springgc1.model.dto.Evento_MDTO;
import ec.edu.ista.springgc1.model.entity.Ciudad;
import ec.edu.ista.springgc1.model.entity.Componentexml;
import ec.edu.ista.springgc1.model.entity.DataCompression;
import ec.edu.ista.springgc1.model.entity.Evento;
import ec.edu.ista.springgc1.model.entity.Usuario;
import ec.edu.ista.springgc1.repository.CiudadRepository;
import ec.edu.ista.springgc1.repository.ComponentexmlRepository;
import ec.edu.ista.springgc1.repository.Evento_MRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;

@Service
public class EventoServiceImpl extends GenericServiceImpl<Evento> implements Mapper<Evento, Evento_MDTO>{

    private DataCompression dataCompression = new DataCompression();

    @Autowired
    private Evento_MRepository programasMRepository;
    @Autowired
    private ComponentexmlRepository componentexmlRepository;
    @Autowired
    private CiudadRepository ciudadRepository;

    public Evento mapToEntity(Evento_MDTO programasMdto) {
    	Evento programas_m = new Evento();
        programas_m.setId_prom(programasMdto.getId_prom());
        programas_m.setTitulo(programasMdto.getTitulo());
        programas_m.setSubTitulo(programasMdto.getSubTitulo());
        programas_m.setResumen(programasMdto.getResumen());
        programas_m.setColorFondo(programasMdto.getColorFondo());
        programas_m.setFoto_portada(programasMdto.getFoto_portada());
        Componentexml componentexml = componentexmlRepository.findByTipo(programasMdto.getTipoxml())
                .orElseThrow(() -> new ResourceNotFoundException("Componentexml", programasMdto.getTipoxml()));
        Ciudad ciudad = ciudadRepository.findByNombre(programasMdto.getNombreciudad())
                .orElseThrow(() -> new ResourceNotFoundException("ciudad", "Cuenca"));
        programas_m.setCiudad(ciudad);
        programas_m.setTipoxml(componentexml);

        return programas_m;
    }

    @Override
    public Evento_MDTO mapToDTO(Evento programasM) {
    	Evento_MDTO programas_mdto = new Evento_MDTO();

        programas_mdto.setId_prom(programasM.getId_prom());
        programas_mdto.setTitulo(programasM.getTitulo());
        programas_mdto.setSubTitulo(programasM.getSubTitulo());
        programas_mdto.setResumen(programasM.getResumen());
        programas_mdto.setFoto_portada(programasM.getFoto_portada());
        programas_mdto.setColorFondo(programasM.getColorFondo());
        programas_mdto.setTipoxml(programasM.getTipoxml().getTipo());
        programas_mdto.setNombreciudad("CUENCA");

        return programas_mdto;
    }

    @Override
    public List<Evento_MDTO> findAll() {
        return programasMRepository.findAll().stream().map(programas_m -> {
            try {
                // Descomprimir la imagen antes de mapear a DTO
                byte[] fotoBytes = dataCompression.decompress(programas_m.getFoto_portada());
                programas_m.setFoto_portada(fotoBytes);
                return mapToDTO(programas_m);
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Error al procesar la foto", e);
            }
        }).collect(Collectors.toList());
    }

    public Evento_MDTO findByIdToDTO(long id) {
        try {
        	Evento programas_m = programasMRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", id));

            byte[] fotoBytes = dataCompression.decompress(programas_m.getFoto_portada());
            programas_m.setFoto_portada(fotoBytes);
            return mapToDTO(programas_m);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al procesar la foto", e);
        }
    }

    public Evento save(MultipartFile foto_portada, String titulo, String subTitulo, String resumen, String tipoxml, String colorFondo) {
        try {
        	Evento_MDTO programas_mdto = new Evento_MDTO();
            programas_mdto.setTitulo(titulo);
            programas_mdto.setSubTitulo(subTitulo);
            programas_mdto.setResumen(resumen);
            programas_mdto.setTipoxml(tipoxml);
            programas_mdto.setColorFondo(colorFondo);
            programas_mdto.setNombreciudad("CUENCA");

            byte[] imagenBytes = foto_portada.getBytes();
            byte[] imagenComprimida = dataCompression.compress(imagenBytes, 1000);

            programas_mdto.setFoto_portada(imagenComprimida);
            return programasMRepository.save(mapToEntity(programas_mdto));
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al procesar la foto", e);
        }
    }

    public Evento update(long id, MultipartFile foto_portada, String titulo, String subTitulo, String resumen, String colorFondo, String tipoxml) {
        try {
        	Evento programas_m = programasMRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", id));

            programas_m.setTitulo(titulo);
            programas_m.setSubTitulo(subTitulo);
            programas_m.setResumen(resumen);
            programas_m.setColorFondo(colorFondo);
            Componentexml componentexml = componentexmlRepository.findByTipo(tipoxml)
                    .orElseThrow(() -> new ResourceNotFoundException("Componentexml:", tipoxml));
            Ciudad ciudad = ciudadRepository.findByNombre("CUENCA")
                    .orElseThrow(() -> new ResourceNotFoundException("ciudad","Cuenca"));
            
            programas_m.setCiudad(ciudad);
            programas_m.setTipoxml(componentexml);

            if (foto_portada != null && !foto_portada.isEmpty())
            {
                byte[] imagenBytes = foto_portada.getBytes();
                byte[] imagenComprimida = dataCompression.compress(imagenBytes, 1000);

                programas_m.setFoto_portada(imagenComprimida);
            }

            return programasMRepository.save(programas_m);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al procesar la foto", e);
        }
    }
}
