package ec.edu.ista.springgc1.service.impl;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.AuditEntryDTO;
import ec.edu.ista.springgc1.model.entity.audit.AuditEntry;
import ec.edu.ista.springgc1.repository.AuditEntryRepository;
import ec.edu.ista.springgc1.repository.UsuarioRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditEntryServiceImp extends GenericServiceImpl<AuditEntry> implements Mapper<AuditEntry, AuditEntryDTO> {

    private final AuditEntryRepository auditEntryRepository;
    private final UsuarioRepository usuarioRepository;

    public AuditEntryServiceImp(AuditEntryRepository auditEntryRepository, UsuarioRepository usuarioRepository) {
        this.auditEntryRepository = auditEntryRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public AuditEntry mapToEntity(AuditEntryDTO auditEntryDTO) {
        AuditEntry auditEntry = new AuditEntry();
        auditEntry.setId(auditEntryDTO.getId());

        auditEntry.setUser(usuarioRepository
                .findById(auditEntryDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found", auditEntryDTO.getUserId())));

        auditEntry.setResourceName(auditEntryDTO.getResourceName());
        auditEntry.setTimeStamp(auditEntryDTO.getTimeStamp());
        auditEntry.setActionType(auditEntryDTO.getActionType());
        auditEntry.setActionDetails(auditEntryDTO.getActionDetails());
        auditEntry.setOldValue(auditEntryDTO.getOldValue());
        auditEntry.setNewValue(auditEntryDTO.getNewValue());
        return auditEntry;
    }

    @Override
    public AuditEntryDTO mapToDTO(AuditEntry auditEntry) {
        AuditEntryDTO auditEntryDTO = new AuditEntryDTO();
        auditEntryDTO.setId(auditEntry.getId());
        auditEntryDTO.setUserId(auditEntry.getUser().getId());
        auditEntryDTO.setResourceName(auditEntry.getResourceName());
        auditEntryDTO.setTimeStamp(auditEntry.getTimeStamp());
        auditEntryDTO.setActionType(auditEntry.getActionType());
        auditEntryDTO.setActionDetails(auditEntry.getActionDetails());
        auditEntryDTO.setOldValue(auditEntry.getOldValue());
        auditEntryDTO.setNewValue(auditEntry.getNewValue());
        return auditEntryDTO;
    }

    @Override
    public List<AuditEntryDTO> findAll() {
        return auditEntryRepository.findAll()
                .stream().map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AuditEntry save(Object entity) {
        return auditEntryRepository.save(mapToEntity((AuditEntryDTO) entity));
    }

    public AuditEntryDTO findByIdToDTO(long id) {
        return mapToDTO(auditEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AuditEntry not found", id)));
    }

}
