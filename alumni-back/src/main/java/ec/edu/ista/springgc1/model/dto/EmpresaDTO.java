package ec.edu.ista.springgc1.model.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fasterxml.jackson.annotation.JsonView;
import ec.edu.ista.springgc1.model.entity.Ciudad;
import ec.edu.ista.springgc1.model.entity.Empresario;
import ec.edu.ista.springgc1.model.entity.SectorEmpresarial;
import ec.edu.ista.springgc1.view.View;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDTO implements Serializable {

    @JsonView(View.Public.class)
    private Long id;

    @JsonView(View.Public.class)
    private String empresario;

    @JsonView(View.Public.class)
    private Ciudad ciudad;

    @JsonView(View.Public.class)
    private SectorEmpresarial sectorEmpresarial;

    @JsonView(View.Public.class)
    private String ruc;

    @JsonView(View.Public.class)
    private String nombre;

    @JsonView(View.Public.class)
    private String tipoEmpresa;

    @JsonView(View.Public.class)
    private String razonSocial;

    @JsonView(View.Public.class)
    private String area;

    @JsonView(View.Public.class)
    private String sitioWeb;

    @JsonView(View.Public.class)
    private String ubicacion;

    @JsonView(View.Public.class)
    private boolean estado;

    @JsonView(View.Public.class)
    private String rutaPdfRuc;

    @JsonView(View.Public.class)
    private String urlPdfRuc;
}
