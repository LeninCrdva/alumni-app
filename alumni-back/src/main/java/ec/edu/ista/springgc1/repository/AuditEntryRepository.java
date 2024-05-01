package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.entity.audit.AuditEntry;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuditEntryRepository extends GenericRepository<AuditEntry> {
    Optional<List<AuditEntry>> findByUserNombreUsuarioIgnoreCase(String username);
    <Optional> AuditEntry findByResourceName(String resourceName);
}
