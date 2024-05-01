package ec.edu.ista.springgc1.model.dto;

import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.model.entity.OfertasLaborales;
import ec.edu.ista.springgc1.model.enums.EstadoPostulacion;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Data
public class PostulacionDto implements Serializable {

    private Long id;

    private Long graduado;

    private Long ofertaLaboral;

    private EstadoPostulacion estado;
}
