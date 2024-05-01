package ec.edu.ista.springgc1.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.ista.springgc1.model.entity.Carrera;
import ec.edu.ista.springgc1.repository.CarreraRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;

@Service
public class CarreraServiceImp extends GenericServiceImpl<Carrera> {

    @Autowired
    private CarreraRepository carreraRepository;

    public Optional<Carrera> findByNombre(String nombre) {
        return carreraRepository.findByNombre(nombre);
    }
}
