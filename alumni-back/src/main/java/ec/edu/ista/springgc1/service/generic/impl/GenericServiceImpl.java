package ec.edu.ista.springgc1.service.generic.impl;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.entity.OfertasLaborales;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
import ec.edu.ista.springgc1.service.generic.GenericService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class GenericServiceImpl <T> implements GenericService {

    @Autowired
    protected GenericRepository<T> genericRepository;

    @Override
    @Transactional(readOnly = true)
    public List findAll() {
        return genericRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public T findById(long id) {
        return genericRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("id", id));
    }

    @Override
    @Transactional
    public T save(Object entity){
        return genericRepository.save((T)entity);
    }

    @Override
    @Transactional
    public void delete(long id){
        genericRepository.deleteById(id);
    }

    @Override
    @Transactional
    public long count() {
        return genericRepository.count();
    }

	

}
