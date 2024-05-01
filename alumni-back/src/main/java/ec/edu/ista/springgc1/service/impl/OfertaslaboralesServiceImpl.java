package ec.edu.ista.springgc1.service.impl;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import ec.edu.ista.springgc1.exception.AppException;
import ec.edu.ista.springgc1.model.dto.MailRequest;
import ec.edu.ista.springgc1.model.dto.PreviousDataForPdfDTO;
import ec.edu.ista.springgc1.model.entity.*;
import ec.edu.ista.springgc1.model.enums.EstadoOferta;
import ec.edu.ista.springgc1.model.enums.EstadoPostulacion;
import ec.edu.ista.springgc1.model.enums.ProcessingStatus;
import ec.edu.ista.springgc1.repository.*;
import ec.edu.ista.springgc1.service.bucket.S3Service;
import ec.edu.ista.springgc1.service.generatorpdf.ImageOptimizer;
import ec.edu.ista.springgc1.service.mail.EmailService;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.OfertasLaboralesDTO;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;
import org.springframework.util.StringUtils;

@Service
public class OfertaslaboralesServiceImpl extends GenericServiceImpl<OfertasLaborales> implements Mapper<OfertasLaborales, OfertasLaboralesDTO> {

    @Value("${spring.mail.username}")
    private String from;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private OfertaslaboralesRepository ofertasLaboralesRepository;

    @Autowired
    private ContratacionRepository contratacionRepository;

    @Autowired
    private EmpresaRepository empresarepository;

    @Autowired
    private GraduadoRepository graduadoRepository;

    @Autowired
    private PostulacionRepository postulacionRepository;

    @Autowired
    private PreviousDataForPdfService previousDataForPdfService;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ImageOptimizer imageOptimizer;
    
    @Autowired
    private TituloRepository tituloRepository;
    
    @Autowired
    private CarreraRepository carreraRepository;

    @Override
    public OfertasLaborales mapToEntity(OfertasLaboralesDTO dto) {
        OfertasLaborales ofertaLaboral = new OfertasLaborales();
        ofertaLaboral.setId(dto.getId());
        ofertaLaboral.setSalario(dto.getSalario());
        ofertaLaboral.setFechaCierre(dto.getFechaCierre());
        ofertaLaboral.setFechaApertura(dto.getFechaApertura());
        ofertaLaboral.setCargo(dto.getCargo());
        ofertaLaboral.setExperiencia(dto.getExperiencia());
        ofertaLaboral.setFechaPublicacion(dto.getFechaPublicacion());
        ofertaLaboral.setAreaConocimiento(dto.getAreaConocimiento());
        ofertaLaboral.setEstado(dto.getEstado());
        Empresa emp = empresarepository.findByNombre(dto.getNombreEmpresa())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa", dto.getNombreEmpresa()));

        ofertaLaboral.setEmpresa(emp);
        ofertaLaboral.setTipo(dto.getTipo());
        ofertaLaboral.setFotoPortada(dto.getFotoPortada());
        ofertaLaboral.setTiempo(dto.getTiempo());

        return ofertaLaboral;
    }

    @Override
    public OfertasLaboralesDTO mapToDTO(OfertasLaborales entity) {
        OfertasLaboralesDTO dto = new OfertasLaboralesDTO();
        dto.setId(entity.getId());
        dto.setSalario(entity.getSalario());
        dto.setFechaCierre(entity.getFechaCierre());
        dto.setFechaPublicacion(entity.getFechaPublicacion());
        dto.setCargo(entity.getCargo());
        dto.setExperiencia(entity.getExperiencia());
        dto.setFechaApertura(entity.getFechaApertura());
        dto.setAreaConocimiento(entity.getAreaConocimiento());
        dto.setEstado(entity.getEstado());
        dto.setNombreEmpresa(entity.getEmpresa().getNombre());
        dto.setTipo(entity.getTipo());
        dto.setFotoPortada(entity.getFotoPortada());
        dto.setTiempo(entity.getTiempo());

        return dto;
    }

    @Override
    public List<OfertasLaboralesDTO> findAll() {
        return ofertasLaboralesRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<OfertasLaboralesDTO> findOfertasLaboralesWithOutEstadoFinalizado() {
        return ofertasLaboralesRepository.findOfertasLaboralesWithOutEstadoFinalizado().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public OfertasLaborales save(Object entity) {
        OfertasLaborales ofertaLaboral = ofertasLaboralesRepository.save(mapToEntity((OfertasLaboralesDTO) entity));

        createRequestAndSendEmailWithPDF(ofertaLaboral);

        return ofertaLaboral;
    }

    public void save(Object entity, ProcessingStatus status) throws IOException {
        OfertasLaborales ofertaLaboral = ofertasLaboralesRepository.save(mapToEntity((OfertasLaboralesDTO) entity));

        if (status == ProcessingStatus.PROCESSED) {
            createRequestAndSendEmailWithPDF(ofertaLaboral);
            findByIdWithPdf(ofertaLaboral.getId());
        }
    }

    public OfertasLaboralesDTO update(Long id, OfertasLaboralesDTO updatedOfertaLaboralDTO) {
        OfertasLaborales existingOfertaLaboral = ofertasLaboralesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OfertaLaboral", String.valueOf(id)));

        if (existingOfertaLaboral.getEstado().equals(EstadoOferta.EN_EVALUACION)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No se puede actualizar una oferta laboral que está en proceso de evaluación");
        }

        if (existingOfertaLaboral.getEstado().equals(EstadoOferta.CANCELADA)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No se puede actualizar una oferta laboral que ha sido cancelada");
        }

        if (existingOfertaLaboral.getEstado().equals(EstadoOferta.FINALIZADA)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No se puede actualizar una oferta laboral que ha sido finalizada");
        }

        existingOfertaLaboral.setSalario(ObjectUtils.isEmpty(updatedOfertaLaboralDTO.getSalario()) ? existingOfertaLaboral.getSalario() : updatedOfertaLaboralDTO.getSalario());
        existingOfertaLaboral.setFechaCierre(ObjectUtils.isEmpty(updatedOfertaLaboralDTO.getFechaCierre()) ? existingOfertaLaboral.getFechaCierre() : updatedOfertaLaboralDTO.getFechaCierre());
        existingOfertaLaboral.setFechaApertura(ObjectUtils.isEmpty(updatedOfertaLaboralDTO.getFechaApertura()) ?  existingOfertaLaboral.getFechaApertura() : updatedOfertaLaboralDTO.getFechaApertura());
        existingOfertaLaboral.setCargo(updatedOfertaLaboralDTO.getCargo());
        existingOfertaLaboral.setExperiencia(updatedOfertaLaboralDTO.getExperiencia());
        existingOfertaLaboral.setAreaConocimiento(updatedOfertaLaboralDTO.getAreaConocimiento());
        existingOfertaLaboral.setFotoPortada(updatedOfertaLaboralDTO.getFotoPortada());
        existingOfertaLaboral.setTipo(updatedOfertaLaboralDTO.getTipo());
        existingOfertaLaboral.setTiempo(ObjectUtils.isEmpty(updatedOfertaLaboralDTO.getTiempo()) ? existingOfertaLaboral.getTiempo() : updatedOfertaLaboralDTO.getTiempo());
        Empresa empresa = empresarepository.findByNombre(updatedOfertaLaboralDTO.getNombreEmpresa()).orElseThrow(
                () -> new ResourceNotFoundException("Empresa", updatedOfertaLaboralDTO.getNombreEmpresa()));

        existingOfertaLaboral.setEmpresa(empresa);

        return mapToDTO(ofertasLaboralesRepository.save(existingOfertaLaboral));
    }

    public OfertasLaboralesDTO actualizarEstadoOferta(Long id, String estado) {
        OfertasLaborales existingOfertaLaboral = ofertasLaboralesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OfertaLaboral", String.valueOf(id)));

        try {
            existingOfertaLaboral.setEstado(EstadoOferta.valueOf(estado));

            createRequestAndSendEmailWithPDF(existingOfertaLaboral);
        } catch (IllegalArgumentException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Estado de oferta laboral no válido: " + estado);
        }

        return mapToDTO(ofertasLaboralesRepository.save(existingOfertaLaboral));
    }

    public OfertasLaboralesDTO findByIdToDTO(Long id) {
        OfertasLaborales ofertaLaboral = ofertasLaboralesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OfertaLaboral", String.valueOf(id)));

        return mapToDTO(ofertaLaboral);
    }

    public void delete(Long id) {
        ofertasLaboralesRepository.deleteById(id);
    }

    public List<OfertasLaboralesDTO> findByNombreUsuario(String nombreUsuario) {
        List<Postulacion> postulacions = postulacionRepository.findAllByGraduadoUsuarioNombreUsuario(nombreUsuario);
        List<OfertasLaborales> referencias = new ArrayList<>();
        for (Postulacion postulacion : postulacions) {
            referencias.add(postulacion.getOfertaLaboral());
        }
        return referencias.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<Map.Entry<String, Long>> calcularPostulacionesPorDia() {

        return postulacionRepository.countPostulacionesPorDia().stream()
                .map(t -> new AbstractMap.SimpleEntry<>((String) t.get(0), (Long) t.get(1)))
                .collect(Collectors.toList());
    }

    public List<OfertasLaboralesDTO> findEmpresarioByNombreUsuario(String nombreUsuario) {
        List<OfertasLaborales> referencias = ofertasLaboralesRepository.buscarOfertasPorNombreUsuario(nombreUsuario);
        return referencias.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public Map<String, Long> getCargosConOfertas() {
        List<OfertasLaboralesDTO> ofertasLaboralesDTOList = findAll();

        return ofertasLaboralesDTOList.stream()
                .collect(Collectors.groupingBy(
                        oferta -> StringUtils.hasText(oferta.getCargo()) ?  oferta.getCargo().toLowerCase().trim(): "Sin cargo especificado por estilo",
                        Collectors.counting()
                ));
    }

    public List<Graduado> findGraduadosByOfertaId(Long ofertaId) {
        List<Postulacion> postulantes = postulacionRepository.findAllByOfertaLaboralId(ofertaId);

        return postulantes
                .stream()
                .map(Postulacion::getGraduado)
                .collect(Collectors.toList())
                .stream()
                .peek(g -> {
                    g.getUsuario()
                            .setUrlImagen(s3Service.getObjectUrl(g.getUsuario().getRutaImagen()));
                    g.setUrlPdf(s3Service.getObjectUrl(g.getRutaPdf()));
                }).collect(Collectors.toList());
    }

    public List<Graduado> findGraduadosConPostulacionActivaByOfertaId(Long ofertaId) {
        List<Postulacion> postulantes = postulacionRepository.findAllByOfertaLaboralId(ofertaId);

        return postulantes
                .stream()
                .filter(postulacion -> postulacion.getEstado().equals(EstadoPostulacion.APLICANDO))
                .map(Postulacion::getGraduado)
                .filter(Objects::nonNull)
                .collect(Collectors.toList())
                .stream()
                .peek(g -> {
                    if (g != null) {
                        g.getUsuario()
                                .setUrlImagen(s3Service.getObjectUrl(g.getUsuario().getRutaImagen()));
                        g.setUrlPdf(s3Service.getObjectUrl(g.getRutaPdf()));
                    }
                })
                .collect(Collectors.toList());
    }

    public List<Graduado> findGraduadosConPostulacionCanceladaByOfertaId(Long ofertaId) {
        List<Postulacion> postulantes = postulacionRepository.findAllByOfertaLaboralId(ofertaId);

        return postulantes
                .stream()
                .filter(postulacion -> postulacion.getEstado().equals(EstadoPostulacion.CANCELADA_POR_GRADUADO) || postulacion.getEstado().equals(EstadoPostulacion.CANCELADA_POR_ADMINISTRADOR))
                .map(Postulacion::getGraduado)
                .filter(Objects::nonNull)
                .collect(Collectors.toList())
                .stream()
                .peek(g -> {
                    if (g != null) {
                        g.getUsuario()
                                .setUrlImagen(s3Service.getObjectUrl(g.getUsuario().getRutaImagen()));
                        g.setUrlPdf(s3Service.getObjectUrl(g.getRutaPdf()));
                    }
                })
                .collect(Collectors.toList());
    }

    public List<Graduado> findGraduadosSeleccionadosByOfertaId(Long ofertaId) {
        List<Postulacion> postulantes = postulacionRepository.findAllByOfertaLaboralId(ofertaId);

        return postulantes
                .stream()
                .filter(postulacion -> postulacion.getEstado().equals(EstadoPostulacion.ACEPTADO))
                .map(Postulacion::getGraduado)
                .filter(Objects::nonNull)
                .collect(Collectors.toList())
                .stream()
                .peek(g -> {
                    if (g != null) {
                        g.getUsuario()
                                .setUrlImagen(s3Service.getObjectUrl(g.getUsuario().getRutaImagen()));
                        g.setUrlPdf(s3Service.getObjectUrl(g.getRutaPdf()));
                    }
                })
                .collect(Collectors.toList());
    }

    public List<Graduado> findGraduadosRechazadosByOfertaId(Long ofertaId) {
        List<Postulacion> postulantes = postulacionRepository.findAllByOfertaLaboralId(ofertaId);

        return postulantes
                .stream()
                .filter(postulacion -> postulacion.getEstado().equals(EstadoPostulacion.RECHAZADO))
                .map(Postulacion::getGraduado)
                .filter(Objects::nonNull)
                .collect(Collectors.toList())
                .stream()
                .peek(g -> {
                    if (g != null) {
                        g.getUsuario()
                                .setUrlImagen(s3Service.getObjectUrl(g.getUsuario().getRutaImagen()));
                        g.setUrlPdf(s3Service.getObjectUrl(g.getRutaPdf()));
                    }
                })
                .collect(Collectors.toList());
    }

    public PreviousDataForPdfDTO findByIdWithPdf(Long idOfertaLaboral) throws IOException {
        OfertasLaborales ofertaLaboral = ofertasLaboralesRepository.findById(idOfertaLaboral)
                .orElseThrow(() -> new ResourceNotFoundException("OfertaLaboral", String.valueOf(idOfertaLaboral)));

        byte[] pdf = previousDataForPdfService.getPdf(ofertaLaboral);

        if (pdf.length == 0) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No se puede generar el PDF de la oferta laboral: " + idOfertaLaboral + ", no hay graduados postulados");
        }

        createRequestAndSendEmailWithPDFToBusinessman(ofertaLaboral, pdf);

        return new PreviousDataForPdfDTO(ofertaLaboral, pdf);
    }

    public List<OfertasLaborales> findOfertasByNombreEmpresa(String nombreEmpresa) {
        return ofertasLaboralesRepository.findOfertasByNombreEmpresa(nombreEmpresa);
    }

    @Deprecated
    @Modifying
    @Transactional
    public Contratacion seleccionarContratados(Long ofertaId, List<Long> graduadosIds) { // Do not use this method
        OfertasLaborales ofertaLaboral = ofertasLaboralesRepository.findById(ofertaId)
                .orElseThrow(() -> new ResourceNotFoundException("OfertaLaboral", String.valueOf(ofertaId)));

        List<Graduado> graduadosSeleccionados = graduadoRepository.findAllById(graduadosIds);

        Contratacion contratacion = new Contratacion();
        contratacion.setOfertaLaboral(ofertaLaboral);
        contratacion.setGraduados(graduadosSeleccionados);

        return contratacionRepository.save(contratacion);
    }

    @Deprecated
    public List<Contratacion> getContratacionesPorOfertaLaboral(Long ofertaLaboralId) { // Do not use this method
        return contratacionRepository.findByOfertaLaboralId(ofertaLaboralId);
    }

    public List<OfertasLaboralesDTO> getOfertasSinPostulacion(Long id) {
        Graduado graduado = graduadoRepository.findByUsuarioId(id).orElseThrow(() -> new ResourceNotFoundException("Graduado no encontrado con el id de usuario: ", String.valueOf(id)));

        return ofertasLaboralesRepository.findOfertasWithOutPostulacionByGraduadoId(graduado.getId()).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private MailRequest createMailRequest(String subject, String mailCase) {
        return new MailRequest(from, subject, mailCase);
    }

    private MailRequest createMailRequest(String subject, String mailCase, String to) {
        return new MailRequest(to, from, subject, mailCase);
    }

    private void createRequestAndSendEmailWithPDF(OfertasLaborales oferta) {
        Map<String, Object> model = new HashMap<>();
        String[] emails;

        if (oferta.getEstado().equals(EstadoOferta.EN_EVALUACION)) {
            List<Administrador> administradores = administradorRepository.findAll();
            emails = administradores.stream().map(Administrador::getEmail).toArray(String[]::new);
        } else {
            List<Graduado> graduado = graduadoRepository.findAll();
            emails = graduado.stream().map(Graduado::getEmailPersonal).toArray(String[]::new);
        }

        byte[] imageBytes = StringUtils.hasText(oferta.getFotoPortada()) ? imageOptimizer.convertBase64ToBytes(oferta.getFotoPortada()) : new byte[0];

        model.put("oferta", oferta);
        model.put("fotoPortada", imageBytes);
        model.put("estado", oferta.getEstado().name());

        String subject = getMailSubject(oferta.getEstado().name());
        String mailCase = oferta.getEstado().equals(EstadoOferta.EN_CONVOCATORIA) ? "new-offer" : oferta.getEstado().equals(EstadoOferta.CANCELADA) ? "offer-canceled" : oferta.getEstado().equals(EstadoOferta.FINALIZADA) ? "offer-finished" : oferta.getEstado().equals(EstadoOferta.REACTIVADA) ? "offer-reactivated" : oferta.getEstado().equals(EstadoOferta.EN_SELECCION) ? "offer-selection" : "offer-revision";

        MailRequest request = createMailRequest(subject, mailCase);

        emailService.sendEmailWithPDF(request, model, emails);
    }

    private void createRequestAndSendEmailWithPDFToBusinessman(OfertasLaborales oferta, byte[] pdf) {
        Map<String, Object> model = new HashMap<>();
        byte[] imageBytes = StringUtils.hasText(oferta.getFotoPortada()) ? imageOptimizer.convertBase64ToBytes(oferta.getFotoPortada()) : new byte[0];

        model.put("oferta", oferta);
        model.put("fotoPortada", imageBytes);

        String subject = getMailSubject(oferta.getEstado().name());
        String mailCase = oferta.getEstado().equals(EstadoOferta.EN_CONVOCATORIA) ? "new-offer" : oferta.getEstado().equals(EstadoOferta.CANCELADA) ? "offer-canceled" : oferta.getEstado().equals(EstadoOferta.FINALIZADA) ? "list-postulates" : oferta.getEstado().equals(EstadoOferta.REACTIVADA) ? "offer-reactivated" : "offer-selection";

        MailRequest request = createMailRequest(subject, mailCase, oferta.getEmpresa().getEmpresario().getEmail());

        emailService.sendEmailWithPDFToBusinessman(request, model, pdf);
    }

    private String getMailSubject(String estado) {
        if (estado.equals(EstadoOferta.EN_CONVOCATORIA.name())) {
            return "¡Nuevo oferta laboral disponible!";
        } else if (estado.equals(EstadoOferta.CANCELADA.name())) {
            return "Oferta laboral cancelada";
        } else if (estado.equals(EstadoOferta.FINALIZADA.name())) {
            return "Oferta laboral finalizada";
        } else if (estado.equals(EstadoOferta.REACTIVADA.name())) {
            return "Oferta laboral reactivada";
        } else if (estado.equals(EstadoOferta.EN_SELECCION.name())) {
            return "Oferta laboral en selección";
        } else {
            return "Oferta laboral en revisión";
        }
    }
    //Reportes
    

public List<Map<String, Object>> obtenerReportePostulacionesYAceptadosPorOfertaYCargo() {
    // Obtener todas las ofertas laborales
    List<OfertasLaborales> todasLasOfertas = ofertasLaboralesRepository.findAll();

    // Lista para almacenar el reporte en formato de mapa
    List<Map<String, Object>> reporte = new ArrayList<>();

    // Procesar cada oferta laboral para generar el reporte
    for (OfertasLaborales oferta : todasLasOfertas) {
        String cargoOferta = oferta.getCargo();

        // Obtener las postulaciones aceptadas para esta oferta laboral
        List<Postulacion> postulacionesAceptadas = postulacionRepository.findAllByOfertaLaboralId(oferta.getId())
                .stream()
                .filter(postulacion -> postulacion.getEstado() == EstadoPostulacion.ACEPTADO)
                .collect(Collectors.toList());

        // Obtener los graduados con postulaciones activas para esta oferta laboral
        List<Graduado> graduadosPostulantesActivos = findGraduadosConPostulacionActivaByOfertaId(oferta.getId());

        // Contar el número de postulantes aceptados y activos para esta oferta laboral y cargo
        int cantidadPostulantesAceptados = postulacionesAceptadas.size();
        int cantidadPostulantesActivos = graduadosPostulantesActivos.size();

        // Crear un mapa para almacenar la información del reporte
        Map<String, Object> lineaReporte = new HashMap<>();
        lineaReporte.put("ofertaLaboralId", oferta.getId());
        lineaReporte.put("cargo", cargoOferta);
        lineaReporte.put("postulantesAceptados", cantidadPostulantesAceptados);
        lineaReporte.put("postulantesActivos", cantidadPostulantesActivos);

        
        reporte.add(lineaReporte);
    }

    return reporte;
    }
    //Reporte por empresa
public List<Map<String, Object>> contarPostulacionesActivasYSeleccionadasPorEmpresa() {
    List<Empresa> empresasActivas = empresarepository.findAllByEstadoTrue();

    return empresasActivas.stream().map(empresa -> {
        Long idEmpresa = empresa.getId();
        String nombreEmpresa = empresa.getNombre();

        // Obtener postulaciones activas por empresa
        List<Postulacion> postulacionesActivas = empresarepository.findAllByOfertaLaboralEmpresaId(idEmpresa)
                .stream()
                .filter(postulacion -> postulacion.getEstado() == EstadoPostulacion.APLICANDO)
                .collect(Collectors.toList());

        int cantidadPostulacionesActivas = postulacionesActivas.size();

        // Obtener postulaciones seleccionadas por empresa
        List<Postulacion> postulacionesSeleccionadas = empresarepository.findAllByOfertaLaboralEmpresaId(idEmpresa)
                .stream()
                .filter(postulacion -> postulacion.getEstado() == EstadoPostulacion.ACEPTADO)
                .collect(Collectors.toList());

        int cantidadPostulacionesSeleccionadas = postulacionesSeleccionadas.size();

        Map<String, Object> reporteEmpresa = new HashMap<>();
        reporteEmpresa.put("nombreEmpresa", nombreEmpresa);
        reporteEmpresa.put("cantidadPostulacionesActivas", cantidadPostulacionesActivas);
        reporteEmpresa.put("cantidadPostulacionesSeleccionadas", cantidadPostulacionesSeleccionadas);

        return reporteEmpresa;
    }).collect(Collectors.toList());
}

	//Reporte por carrera 
	public List<Map<String, Object>> contarPostulantesActivosYSeleccionadosPorCarrera() {
		List<Carrera> carreras = carreraRepository.findAll();

		List<Map<String, Object>> resultados = new ArrayList<>();

		for (Carrera carrera : carreras) {
			String nombreCarrera = carrera.getNombre();

			List<Graduado> graduados = tituloRepository.findDistinctGraduadosByNombreCarrera(nombreCarrera);

			int postulantesActivos = 0;
			int postulantesSeleccionados = 0;

			for (Graduado graduado : graduados) {
				Long graduadoId = graduado.getId();

				// Contar postulaciones activas por graduado y carrera
				List<Postulacion> postulacionesActivas = postulacionRepository
						.findDistinctByGraduadoIdAndCarreraAndEstado(graduadoId, nombreCarrera, EstadoPostulacion.APLICANDO);
				postulantesActivos += postulacionesActivas.size();

				// Contar postulaciones seleccionadas por graduado y carrera
				int postulacionesSeleccionadas = postulacionRepository.countDistinctByGraduadoIdAndCarreraAndEstado(graduadoId,
						nombreCarrera, EstadoPostulacion.ACEPTADO);
				postulantesSeleccionados += postulacionesSeleccionadas;
			}

			// Crear mapa para esta carrera con los resultados
			Map<String, Object> resultadoCarrera = new HashMap<>();
			resultadoCarrera.put("nombreCarrera", nombreCarrera);
			resultadoCarrera.put("postulantesActivos", postulantesActivos);
			resultadoCarrera.put("postulantesSeleccionados", postulantesSeleccionados);

			// Agregar resultado al listado final
			resultados.add(resultadoCarrera);
		}

		return resultados;
	}

}