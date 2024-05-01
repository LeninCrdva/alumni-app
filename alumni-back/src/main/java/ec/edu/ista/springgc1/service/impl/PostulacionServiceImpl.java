package ec.edu.ista.springgc1.service.impl;

import ec.edu.ista.springgc1.exception.AppException;
import ec.edu.ista.springgc1.model.dto.MailRequest;
import ec.edu.ista.springgc1.model.dto.PostulacionDto;
import ec.edu.ista.springgc1.model.entity.*;
import ec.edu.ista.springgc1.model.enums.EstadoOferta;
import ec.edu.ista.springgc1.model.enums.EstadoPostulacion;
import ec.edu.ista.springgc1.repository.*;
import ec.edu.ista.springgc1.service.bucket.S3Service;
import ec.edu.ista.springgc1.service.generatorpdf.PDFGeneratorService;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.mail.EmailService;
import ec.edu.ista.springgc1.service.map.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PostulacionServiceImpl extends GenericServiceImpl<Postulacion> implements Mapper<Postulacion, PostulacionDto> {

    @Value("${spring.mail.username}")
    private String from;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PostulacionRepository postulacionRepository;

    @Autowired
    private GraduadoServiceImpl graduadoService;

    @Autowired
    private OfertaslaboralesServiceImpl ofertasLaboralesService;

    @Autowired
    private PDFGeneratorService pdfGeneratorService;

    @Autowired
    private PreviousDataForPdfService previousDataForPdfService;

    @Autowired
    private S3Service s3Service;

    public Integer countPostulacionByFechaPostulacionIsStartingWithOrderBy(LocalDateTime fechaPostulacion) {
        return postulacionRepository.countPostulacionByFechaPostulacionIsStartingWith(fechaPostulacion);
    }

    public List<Postulacion> findGraduadosByOfertaLaboralId(Long ofertaLaboralId) {
        return postulacionRepository.findAllByOfertaLaboralId(ofertaLaboralId);
    }

    public List<Postulacion> findOfertasLaboralesByGraduadoId(Long graduadoId) {
        return postulacionRepository.findAllByGraduadoUsuarioId(graduadoId);
    }

    public List<Postulacion> findGraduadosSinPostulacion() {
        return postulacionRepository.findGraduadosSinPostulacion();
    }

    public Postulacion savePostulacion(PostulacionDto postulacionDto) throws IOException {
        Postulacion postulacion = mapToEntity(postulacionDto);
        Usuario usuario = postulacion.getGraduado().getUsuario();
        usuario.setUrlImagen(s3Service.getObjectUrl(usuario.getRutaImagen()));

        Graduado graduado = postulacion.getGraduado();
        graduado.setUsuario(usuario);

        Map<String, Object> model = previousDataForPdfService.getPreviousRequestToGraduate(graduado);

        if (((List<?>) model.get("titulos")).isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No se puede postular sin tener al menos un título registrado.");
        }

        if (((List<?>) model.get("referencias")).isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No se puede postular sin tener al menos una referencia personal registrada.");
        }

        if (((List<?>) model.get("referenciasProfesionales")).isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No se puede postular sin tener al menos una referencia profesional registrada.");
        }

        if (postulacion.getOfertaLaboral().getEstado().equals(EstadoOferta.FINALIZADA) || postulacion.getOfertaLaboral().getFechaCierre().isBefore(LocalDateTime.now())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No se puede postular a una oferta laboral ya finalizada.");
        }

        if (postulacion.getOfertaLaboral().getEstado().equals(EstadoOferta.CANCELADA) || postulacion.getOfertaLaboral().getFechaCierre().isBefore(LocalDateTime.now())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No se puede postular a una oferta laboral que ha sido cancelada.");
        }

        if (postulacion.getOfertaLaboral().getEstado().equals(EstadoOferta.EN_SELECCION) || postulacion.getOfertaLaboral().getFechaCierre().isBefore(LocalDateTime.now())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No se puede postular a una oferta laboral que ya ha finalizado su proceso de convocatoria.");
        }

        byte[] pdfBytes = getAllDateForCurriculum(model);

        sendEmailWithPDF(postulacion, pdfBytes);

        sendEmailWithOutPDF(postulacion);

        return postulacionRepository.save(postulacion);
    }

    public Postulacion updateEstado(Long id, PostulacionDto postulacionDto) {
        Postulacion postulacion = postulacionRepository.findById(id).get();
        postulacion.setEstado(postulacionDto.getEstado());

        sendEmailWithOutPDF(postulacion);

        return postulacionRepository.save(postulacion);
    }

    public void seleccionarPostulantes(Long idOferta, List<Long> postulantes) {
        List<Postulacion> postulacion = postulacionRepository.findAllByOfertaLaboralId(idOferta)
                .stream()
                .filter(p -> postulantes.contains(p.getGraduado().getId()))
                .peek(p -> {
                    p.setEstado(EstadoPostulacion.ACEPTADO);
                    sendEmailWithOutPDF(p);
                })
                .collect(Collectors.toList());

        postulacionRepository.saveAll(postulacion);
    }

    public List<Postulacion> findAllByGraduadoUsuarioNombreUsuario(String username){
        return postulacionRepository.findAllByGraduadoUsuarioNombreUsuario(username);
    }

    @Override
    public Postulacion mapToEntity(PostulacionDto postulacionDto) {
        Postulacion postulacion = new Postulacion();
        Graduado graduado = graduadoService.findByIdUsuario(postulacionDto.getGraduado());
        OfertasLaborales ofertaLaboral = ofertasLaboralesService.findById(postulacionDto.getOfertaLaboral());

        postulacion.setId(postulacionDto.getId());
        postulacion.setGraduado(graduado);
        postulacion.setOfertaLaboral(ofertaLaboral);
        postulacion.setEstado(postulacionDto.getEstado());

        return postulacion;
    }

    @Override
    public PostulacionDto mapToDTO(Postulacion postulacion) {
        PostulacionDto postulacionDto = new PostulacionDto();

        postulacionDto.setId(postulacion.getId());
        postulacionDto.setGraduado(postulacion.getGraduado().getId());
        postulacionDto.setOfertaLaboral(postulacion.getOfertaLaboral().getId());
        postulacionDto.setEstado(postulacion.getEstado());

        return postulacionDto;
    }

    private byte[] getAllDateForCurriculum(Map<String, Object> model) throws IOException {

        return pdfGeneratorService.generatePDF(model);
    }

    private void sendEmailWithPDF(Postulacion postulacion, byte[] pdfBytes) {
        Map<String, Object> model = new HashMap<>();

        createRequestAndSendEmailWithPDF(postulacion, model, pdfBytes);
    }

    private void sendEmailWithOutPDF(Postulacion postulacion) {
        Map<String, Object> model = new HashMap<>();

        createRequestAndSendEmailWithOutPDF(postulacion, model);
    }

    private void createRequestAndSendEmailWithPDF(Postulacion postulacion, Map<String, Object> model, byte[] pdfBytes) {
        Graduado graduado = postulacion.getGraduado();
        OfertasLaborales oferta = postulacion.getOfertaLaboral();

        String fullName = previousDataForPdfService.getFullName(oferta.getEmpresa().getEmpresario().getUsuario());
        String fullNameGraduado = previousDataForPdfService.getFullName(graduado.getUsuario());

        model.put("fullName", fullName);
        model.put("fullNameGraduate", fullNameGraduado);
        model.put("url", graduado.getUsuario().getRutaImagen());
        model.put("graduado", graduado);
        model.put("oferta", oferta);

        String email = oferta.getEmpresa().getEmpresario().getEmail();
        String mailCase = "cv-graduate";

        MailRequest request = createMailRequest(email, fullName, mailCase);

        emailService.sendEmailWithPDF(request, model, pdfBytes);
    }

    private void createRequestAndSendEmailWithOutPDF(Postulacion postulacion, Map<String, Object> model) {
        Graduado graduado = postulacion.getGraduado();
        OfertasLaborales oferta = postulacion.getOfertaLaboral();

        String fullName = previousDataForPdfService.getFullName(graduado.getUsuario());

        model.put("fullName", fullName);
        model.put("graduado", graduado);
        model.put("oferta", oferta);

        String mailCase = getMailCase(postulacion.getEstado().name());

        MailRequest request = createMailRequest(graduado.getEmailPersonal(), fullName, mailCase);

        emailService.sendEmail(request, model);
    }

    private MailRequest createMailRequest(String email, String fullName, String mailCase) {
        return new MailRequest(fullName, email, from, getSubject(mailCase), mailCase);
    }

    private String getSubject(String mailCase) {
        switch (mailCase) {
            case "postulate":
                return "¡Haz realizado una postulación!";
            case "remove-postulate":
                return "¡Tu postulación se ha cancelado!";
            case "cv-graduate":
                return "¡Ha recibido un interesado en la oferta laboral!";
            case "accept-postulate":
                return "¡Tu postulación ha sido aceptada!";
            default:
                return "¡Not have a case!";
        }
    }

    private String getMailCase(String mailCase) {
        switch (mailCase) {
            case "APLICANDO":
                return "postulate";
            case "CANCELADA_POR_GRADUADO":
            case "CANCELADA_POR_ADMINISTRADOR":
                return "remove-postulate";
            case "ACEPTADO":
                return "accept-postulate";
            default:
                return "¡Not have a case!";
        }
    }
}
