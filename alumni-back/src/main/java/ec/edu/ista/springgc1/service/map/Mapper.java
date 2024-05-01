package ec.edu.ista.springgc1.service.map;

import java.io.Serializable;

public interface Mapper<E, D extends Serializable> {

    public E mapToEntity(D d);
    public D mapToDTO(E e);
}
