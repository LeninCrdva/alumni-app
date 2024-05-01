package ec.edu.ista.springgc1.model.entity.audit;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.model.entity.Usuario;
import ec.edu.ista.springgc1.model.enums.AuditActionType;
import ec.edu.ista.springgc1.view.View;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "audit_entry")
public class AuditEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(View.Public.class)
    private Long id;
    @NotNull
    @JsonView(View.Public.class)
    private LocalDateTime timeStamp;
    @NotNull
    @JsonView(View.Public.class)
    @Enumerated(EnumType.STRING)
    private AuditActionType actionType;
    @ManyToOne
    @JsonView(View.Public.class)
    @JoinColumn(name = "user_id", referencedColumnName = "id_usuario", nullable = false)
    private Usuario user;
    @NotBlank
    @JsonView(View.Public.class)
    private String resourceName;
    @Column(name = "action_details")
    @JsonView(View.Public.class)
    private String actionDetails;
    @Lob
    @Column(name = "old_value")
    @JsonView(View.Public.class)
    private String oldValue;
    @Lob
    @Column(name = "new_value")
    @JsonView(View.Public.class)
    private String newValue;
}
