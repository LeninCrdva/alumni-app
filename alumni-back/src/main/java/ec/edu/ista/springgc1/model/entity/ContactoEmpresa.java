package ec.edu.ista.springgc1.model.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.annotations.ColumnTransformer;

@Data
@Entity
@Table(name = "contacto_empresa")
public class ContactoEmpresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cont_emp_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "emp_id")
    private Empresa empresa;

    @ColumnTransformer(write = "UPPER(?)")
    private String nombre;

    @ColumnTransformer(write = "UPPER(?)")
    private String cargo;

    @Pattern(regexp = "\\d+", message = "El teléfono debe contener solo dígitos.")
    @Size(min = 10, max = 10, message = "El teléfono debe tener exactamente 10 dígitos.")
    @Column(name = "telefono", nullable = false, length = 10)
    private String telefono;

    @Email(message = "Debe ser una dirección de correo electrónico válida.")
    @Column(name = "email_personal", nullable = false, length = 255, unique = true)
    private String email;
}
