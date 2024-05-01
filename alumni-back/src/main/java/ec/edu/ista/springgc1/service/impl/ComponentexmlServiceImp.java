package ec.edu.ista.springgc1.service.impl;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.web.multipart.MultipartFile;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.ComponenteXMLDTO;
import ec.edu.ista.springgc1.model.entity.Componentexml;
import ec.edu.ista.springgc1.model.entity.DataCompression;
import ec.edu.ista.springgc1.repository.ComponentexmlRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;

@Service
public class ComponentexmlServiceImp extends GenericServiceImpl<Componentexml> implements Mapper<Componentexml, ComponenteXMLDTO> {

    private DataCompression dataCompression = new DataCompression();

    @Autowired
    private ComponentexmlRepository componentexmlRepository;

    @Override
    public Componentexml mapToEntity(ComponenteXMLDTO componenteXMLDTO) {
        Componentexml componentexml = new Componentexml();
        componentexml.setId(componenteXMLDTO.getId());
        componentexml.setFoto_portada(componenteXMLDTO.getFoto_portada());
        componentexml.setXml_file(componenteXMLDTO.getXml_file());
        componentexml.setTipo(componenteXMLDTO.getTipo());

        return componentexml;
    }

    @Override
    public ComponenteXMLDTO mapToDTO(Componentexml componentexml) {
        ComponenteXMLDTO componenteXMLDTO = new ComponenteXMLDTO();
        componenteXMLDTO.setId(componentexml.getId());
        componenteXMLDTO.setTipo(componentexml.getTipo());
        componenteXMLDTO.setFoto_portada(componentexml.getFoto_portada());
        componenteXMLDTO.setXml_file(componentexml.getXml_file());
        return componenteXMLDTO;
    }

    @Override
    public List findAll() {
        return componentexmlRepository.findAll().stream().map(componentexml -> {
            try {
                byte[] fotoBytes = dataCompression.decompress(componentexml.getFoto_portada());
                componentexml.setFoto_portada(fotoBytes);

                String xmlString = new String(componentexml.getXml_file().getBytes(), StandardCharsets.UTF_8);
                componentexml.setXml_file(xmlString);
                return mapToDTO(componentexml);
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Error al procesar la foto", e);
            }
        }).collect(Collectors.toList());
    }

    public ComponenteXMLDTO findByIdToDTO(long id) {
        try {
            Componentexml componentexml = componentexmlRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", id));

            byte[] fotoBytes = dataCompression.decompress(componentexml.getFoto_portada());
            componentexml.setFoto_portada(fotoBytes);

            String xmlString = new String(componentexml.getXml_file().getBytes(), StandardCharsets.UTF_8);
            componentexml.setXml_file(xmlString);
            return mapToDTO(componentexml);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al procesar la foto", e);
        }
    }

    public Optional<Componentexml> findComponentexmlByTipo(String tipo) {
        return componentexmlRepository.findByTipo(tipo);
    }

    public Componentexml saveData(MultipartFile foto_portada, MultipartFile xml_file, String tipo) {
        try {
            ComponenteXMLDTO componenteXMLDTO = new ComponenteXMLDTO();
            componenteXMLDTO.setTipo(tipo);

            String xmlString = new String(xml_file.getBytes(), StandardCharsets.UTF_8);
            componenteXMLDTO.setXml_file(xmlString);

            byte[] imagenBytes = foto_portada.getBytes();
            byte[] imagenComprimida = dataCompression.compress(imagenBytes, 1000);

            componenteXMLDTO.setFoto_portada(imagenComprimida);
            return componentexmlRepository.save(mapToEntity(componenteXMLDTO));
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al procesar la foto", e);
        }
    }

    public Componentexml update(long id, MultipartFile foto_portada, MultipartFile xml_file, String tipo) {
        try {
            Componentexml componentexml = componentexmlRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", id));

            componentexml.setTipo(tipo);

            if (xml_file != null && !xml_file.isEmpty()) {
                String xmlString = new String(xml_file.getBytes(), StandardCharsets.UTF_8);
                componentexml.setXml_file(xmlString);
            }

            if (foto_portada != null && !foto_portada.isEmpty()) {
                byte[] imagenBytes = foto_portada.getBytes();
                byte[] imagenComprimida = dataCompression.compress(imagenBytes, 1000);

                componentexml.setFoto_portada(imagenComprimida);
            }

            return componentexmlRepository.save(componentexml);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al procesar la foto", e);
        }
    }
}