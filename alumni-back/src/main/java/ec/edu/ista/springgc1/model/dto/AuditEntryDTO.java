package ec.edu.ista.springgc1.model.dto;

import ec.edu.ista.springgc1.model.enums.AuditActionType;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class AuditEntryDTO implements Serializable {
    private Long id;
    @DateTimeFormat(pattern = "YYYY-MM-dd HH:mm:ss")
    private LocalDateTime timeStamp;
    private AuditActionType actionType;
    private Long userId;
    private String resourceName;
    private String actionDetails;
    private String oldValue;
    private String newValue;
}
