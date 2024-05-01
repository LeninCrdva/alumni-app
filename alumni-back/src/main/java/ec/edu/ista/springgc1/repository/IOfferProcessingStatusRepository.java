package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.request.OfferProcessingStatus;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

import java.util.List;

public interface IOfferProcessingStatusRepository extends GenericRepository<OfferProcessingStatus> {
    List<OfferProcessingStatus> findAllByStatus(String status);

    List<OfferProcessingStatus> findAllById(Iterable<Long> ids);
}
