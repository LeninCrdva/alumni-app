package ec.edu.ista.springgc1.model.request;

import ec.edu.ista.springgc1.model.enums.ProcessingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfferProcessingStatus {

    @Id
    private Long offerId;

    @Enumerated(EnumType.STRING)
    private ProcessingStatus status;

    private String message;


    public OfferProcessingStatus(Long offerId, String message) {
        this.offerId = offerId;
        this.message = message;
    }

    @PrePersist
    public void prePersist() {
        status = ProcessingStatus.PENDING;
    }

    @PreUpdate
    public void preUpdate() {
        if (status == ProcessingStatus.PENDING) {
            status = ProcessingStatus.PROCESSED;
            message = "Offer closed and processed";
        }
    }
}
