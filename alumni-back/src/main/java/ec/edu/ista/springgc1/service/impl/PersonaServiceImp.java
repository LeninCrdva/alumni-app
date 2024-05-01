package ec.edu.ista.springgc1.service.impl;

import java.util.Optional;

import ec.edu.ista.springgc1.model.dto.RegistroDTO;
import ec.edu.ista.springgc1.model.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.ista.springgc1.model.entity.Persona;
import ec.edu.ista.springgc1.repository.PersonaRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PersonaServiceImp extends GenericServiceImpl<Persona> {

    @Autowired
    private PersonaRepository personarepository;

    public Optional<Persona> findBycedula(String cedula) {
        return personarepository.findBycedula(cedula);
    }

    @Transactional
    public Persona getPersona(RegistroDTO usuarioDTO) {
        Persona persona = new Persona();

        persona.setCedula(usuarioDTO.getCedula());
        persona.setPrimerNombre(usuarioDTO.getPrimerNombre());
        persona.setSegundoNombre(usuarioDTO.getSegundoNombre());
        persona.setApellidoPaterno(usuarioDTO.getApellidoPaterno());
        persona.setApellidoMaterno(usuarioDTO.getApellidoMaterno());
        persona.setFechaNacimiento(usuarioDTO.getFechaNacimiento());
        persona.setTelefono(usuarioDTO.getTelefono());
        persona.setSexo(usuarioDTO.getSexo());
        return save(persona);
    }

    @Transactional
    public boolean existsByCedula(String cedula) {
        return personarepository.existsBycedula(cedula);
    }

    @Transactional
    public boolean existsByTelefono(String telefono) {
        return personarepository.existsByTelefono(telefono);
    }
}
