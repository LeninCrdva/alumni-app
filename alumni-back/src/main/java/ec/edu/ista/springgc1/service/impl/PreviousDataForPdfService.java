package ec.edu.ista.springgc1.service.impl;

import ec.edu.ista.springgc1.model.entity.*;
import ec.edu.ista.springgc1.repository.*;
import ec.edu.ista.springgc1.service.bucket.S3Service;
import ec.edu.ista.springgc1.service.generatorpdf.PDFGeneratorService;
import ec.edu.ista.springgc1.service.impl.GraduadoServiceImpl;
import ec.edu.ista.springgc1.service.impl.OfertaslaboralesServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PreviousDataForPdfService {

    @Autowired
    private CapacitacionRepository capacitacionRepository;

    @Autowired
    private ExperienciaRepository experienciaRepository;

    @Autowired
    private LogroRepository logroRepository;

    @Autowired
    private PostulacionRepository postulacionRepository;

    @Autowired
    private ReferenciaPersonalRepository referenciaPersonalRepository;

    @Autowired
    private ReferenciaProfesionalRepository referenciaProfesionalRepository;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private TituloRepository tituloRepository;

    @Autowired
    private PDFGeneratorService pdfGeneratorService;

    protected byte[] getPdf(Graduado graduado) throws IOException {
        return pdfGeneratorService.generatePDF(getPreviousRequestToGraduate(graduado));
    }

    protected byte[] getPdf(OfertasLaborales oferta) throws IOException {
        Map<Long, Map<String, Object>> data = getPreviousRequestToGraduates(oferta);

        return !data.isEmpty() ? pdfGeneratorService.generatePDFOfLisMap(data) : new byte[0];
    }

    protected String getFullName(Usuario usuario) {

        return usuario.getPersona().getPrimerNombre()
                + " " + usuario.getPersona().getSegundoNombre()
                + " " + usuario.getPersona().getApellidoPaterno()
                + " " + usuario.getPersona().getApellidoMaterno();
    }

    protected Map<Long, Map<String, Object>> getPreviousRequestToGraduates(OfertasLaborales ofertas) {
        Map<Long, Map<String, Object>> resultMap = new HashMap<>();

        List<Postulacion> postulaciones = postulacionRepository.findAllByOfertaLaboralIdAccepted(ofertas.getId());

        postulaciones.forEach(postulacion -> {
            Usuario usuario = postulacion.getGraduado().getUsuario();
            usuario.setUrlImagen(s3Service.getObjectUrl(postulacion.getGraduado().getUsuario().getRutaImagen()));
            postulacion.getGraduado().setUsuario(usuario);

            resultMap.put(postulacion.getGraduado().getId(), getPreviousRequestToGraduate(postulacion.getGraduado()));
        });

        return !resultMap.isEmpty() ? resultMap : new HashMap<>();
    }

    protected Map<String, Object> getPreviousRequestToGraduate(Graduado graduado) {
        String fullName = getFullName(graduado.getUsuario());
        List<Experiencia> experiencias = experienciaRepository.findAllByCedulaGraduado_Id(graduado.getId());
        List<Logro> logros = logroRepository.findAllByGraduadoId(graduado.getId());
        List<Capacitacion> capacitaciones = capacitacionRepository.findAllByGraduadoId(graduado.getId());
        List<Referencia_Personal> referencias = referenciaPersonalRepository.findAllByGraduadoId(graduado.getId());
        List<ReferenciaProfesional> referenciasProfesionales = referenciaProfesionalRepository.findAllByGraduadoId(graduado.getId());
        List<Titulo> titulos = tituloRepository.findAllByGraduadoId(graduado.getId());

        Map<String, Object> model = new HashMap<>();
        model.put("fullName", fullName);
        model.put("graduado", graduado);
        model.put("experiencias", experiencias);
        model.put("logros", logros);
        model.put("capacitaciones", capacitaciones);
        model.put("referencias", referencias);
        model.put("referenciasProfesionales", referenciasProfesionales);
        model.put("titulos", titulos);

        return model;
    }
}
