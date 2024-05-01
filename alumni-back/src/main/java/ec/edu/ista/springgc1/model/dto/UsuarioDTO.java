package ec.edu.ista.springgc1.model.dto;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.view.View;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import java.io.Serializable;

@Data
public class UsuarioDTO implements Serializable {

    @JsonView(View.Public.class)
    private Long id;

    @JsonView(View.Public.class)
    @NotEmpty
    private String nombreUsuario;

    @NotNull
    private String clave;

    @JsonView(View.Public.class)
    @NotNull
    private String cedula;

    @JsonView(View.Public.class)
    @NotEmpty
    private String rol;

    @JsonView(View.Public.class)
    @NotNull
    private boolean estado;

    private String rutaImagen;

    @JsonView(View.Public.class)
    private String urlImagen;
}
