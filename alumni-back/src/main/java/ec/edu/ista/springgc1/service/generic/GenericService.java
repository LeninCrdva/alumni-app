package ec.edu.ista.springgc1.service.generic;

import java.util.List;

public interface GenericService<T> {
    List<T> findAll();
    T findById(long id);
    T save(T entity);
    void delete(long id);
    long count();
}
