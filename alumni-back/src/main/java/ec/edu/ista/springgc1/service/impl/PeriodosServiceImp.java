package ec.edu.ista.springgc1.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.ista.springgc1.model.entity.Periodo;
import ec.edu.ista.springgc1.repository.PeriodoRepository;

import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;

@Service
public class PeriodosServiceImp extends GenericServiceImpl<Periodo> {

    @Autowired
    private PeriodoRepository peridoRepository;

    public Optional<Periodo> findByNombre(String nombre) {
        return peridoRepository.findByNombre(nombre);
    }
}
