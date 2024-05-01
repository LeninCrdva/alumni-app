package ec.edu.ista.springgc1.model.request;

import ec.edu.ista.springgc1.model.dto.EmpresaDTO;
import ec.edu.ista.springgc1.model.dto.EmpresarioDTO;
import ec.edu.ista.springgc1.model.dto.GraduadoDTO;
import ec.edu.ista.springgc1.model.dto.RegistroDTO;
import ec.edu.ista.springgc1.model.entity.Empresa;
import ec.edu.ista.springgc1.model.entity.Empresario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestBody {
    @Valid
    private RegistroDTO usuarioDTO;
    private EmpresaDTO empresaDTO;
    private GraduadoDTO graduadoDTO;
    private EmpresarioDTO empresarioDTO;
}
