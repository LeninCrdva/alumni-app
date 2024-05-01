package ec.edu.ista.springgc1.model.entity;

import lombok.Data;

import javax.persistence.*;

import org.hibernate.annotations.ColumnTransformer;

import com.fasterxml.jackson.annotation.JsonView;

import ec.edu.ista.springgc1.view.View;

@Data
@Entity
@Table(name = "empresa")
public class Empresa {

    @Id
    @Column(name = "id_empresa")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(View.Public.class)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_empre", referencedColumnName = "id_empre")
    @JsonView(View.Public.class)
    private Empresario empresario;

    @JsonView({View.Public.class, View.Postulacion.class})
    @ManyToOne
    @JoinColumn(name = "id_ciudad", referencedColumnName = "id_ciudad")
    private Ciudad ciudad;

    @ManyToOne
    @JoinColumn(name = "sec_emp_id", referencedColumnName = "sec_emp_id")
    @JsonView(View.Public.class)
    private SectorEmpresarial sectorEmpresarial;

    @Column(name = "RUC")
    @JsonView(View.Public.class)
    private String ruc;

    @JsonView({View.Public.class, View.Postulacion.class})
    @ColumnTransformer(write = "UPPER(?)")
    @Column(name = "nombre_empresa", unique = true)
    private String nombre;

    @ColumnTransformer(write = "UPPER(?)")
    @Column(name = "tipo_empresa")
    @JsonView(View.Public.class)
    private String tipoEmpresa;

    @ColumnTransformer(write = "UPPER(?)")
    @Column(name = "razon_social")
    @JsonView(View.Public.class)
    private String razonSocial;

    @ColumnTransformer(write = "UPPER(?)")
    @JsonView(View.Public.class)
    private String area;

    @ColumnTransformer(write = "UPPER(?)")
    @JsonView(View.Public.class)
    private String ubicacion;

    @Column(name = "sitio_web")
    @ColumnTransformer(write = "UPPER(?)")
    @JsonView(View.Public.class)
    private String sitioWeb;

    @JsonView(View.Public.class)
    private boolean estado;

    @JsonView(View.Public.class)
    private String rutaPdfRuc;

    @JsonView(View.Public.class)
    @Transient
    private String urlPdfRuc;
}
