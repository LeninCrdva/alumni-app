package ec.edu.ista.springgc1.model.dto;

import ec.edu.ista.springgc1.model.entity.Persona;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

@Data
public class RegistroDTO implements Serializable {

    @NotEmpty
    private String cedula;

    @NotEmpty
    private String primerNombre;

    @NotEmpty
    private String segundoNombre;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaNacimiento;

    @NotEmpty
    private String telefono;

    @NotEmpty
    private String apellidoPaterno;

    @NotEmpty
    private String apellidoMaterno;

    @NotNull
    private Persona.Sex sexo;

    // Atributos de Usuario
    @NotEmpty
    private String nombreUsuario;

    @NotNull
    private String clave;

    @NotEmpty
    private String rol;

    @NotNull
    private boolean estado;

    private String rutaImagen;

    private String urlImagen;
}
