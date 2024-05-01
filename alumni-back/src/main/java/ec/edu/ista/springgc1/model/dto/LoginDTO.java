package ec.edu.ista.springgc1.model.dto;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Data
public class LoginDTO implements Serializable {

    @NotEmpty
    private String username;

    @NotEmpty
    private String password;
}
