package ec.edu.ista.springgc1.service.impl;

import ec.edu.ista.springgc1.model.entity.Provincia;
import ec.edu.ista.springgc1.repository.ProvinciaRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProvinciaServiceImpl extends GenericServiceImpl<Provincia>{

    @Autowired
    private ProvinciaRepository provinciaRepository;

    public Optional<Provincia> findByNombre(String provincia){
        return provinciaRepository.findByNombre(provincia);
    }

}
