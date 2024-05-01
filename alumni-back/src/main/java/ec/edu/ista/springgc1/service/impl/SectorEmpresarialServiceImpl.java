package ec.edu.ista.springgc1.service.impl;

import ec.edu.ista.springgc1.model.entity.SectorEmpresarial;
import ec.edu.ista.springgc1.repository.SectorEmpresarialRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SectorEmpresarialServiceImpl extends GenericServiceImpl<SectorEmpresarial> {

    @Autowired
    private SectorEmpresarialRepository sectorEmpresarialRepository;

    public Optional<SectorEmpresarial> findByNombre(String nombre){
        return sectorEmpresarialRepository.findByNombre(nombre);
    }
}
