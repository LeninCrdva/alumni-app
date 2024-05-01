package ec.edu.ista.springgc1.service.impl;

import ec.edu.ista.springgc1.model.entity.Rol;
import ec.edu.ista.springgc1.repository.RolRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RolServiceImpl extends GenericServiceImpl<Rol> {

    @Autowired
    private RolRepository rolRepository;

    public Optional<Rol> findByNombre(String nombre){
        return rolRepository.findByNombre(nombre);
    }
}
