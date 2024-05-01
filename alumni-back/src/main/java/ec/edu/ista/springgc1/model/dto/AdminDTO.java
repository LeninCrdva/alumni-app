package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.view.View;
import lombok.Data;

@Data
public class AdminDTO implements Serializable {

    @JsonView(View.Public.class)
    private Long id;

    @JsonView(View.Public.class)
    @NotEmpty
    private String usuario;

    @JsonView(View.Public.class)
    @NotNull
    private boolean estado;

    @JsonView(View.Public.class)
    @NotEmpty
    private String cargo;

    @JsonView(View.Public.class)
    @NotEmpty
    private String email;
}
