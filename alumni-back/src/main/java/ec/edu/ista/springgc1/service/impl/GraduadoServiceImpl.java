package ec.edu.ista.springgc1.service.impl;


import ec.edu.ista.springgc1.model.entity.*;
import ec.edu.ista.springgc1.repository.CiudadRepository;
import ec.edu.ista.springgc1.repository.GraduadoRepository;
import ec.edu.ista.springgc1.repository.PostulacionRepository;
import ec.edu.ista.springgc1.repository.UsuarioRepository;
import ec.edu.ista.springgc1.service.bucket.S3Service;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.*;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GraduadoServiceImpl extends GenericServiceImpl<Graduado> implements Mapper<Graduado, GraduadoDTO> {

    @Autowired
    private GraduadoRepository graduadoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CiudadRepository ciudadRepository;

    @Autowired
    private PostulacionRepository postulacionRepository;

    @Autowired
    private PreviousDataForPdfService previousDataForPdfService;

    @Autowired
    private S3Service s3Service;

    @Override
    public Graduado mapToEntity(GraduadoDTO estudianteDTO) {
        Graduado estudiante = new Graduado();

        Usuario usuario = usuarioRepository.findBynombreUsuario(estudianteDTO.getUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("usuario", estudianteDTO.getUsuario()));

        Ciudad ciudad = ciudadRepository.findByNombre(estudianteDTO.getCiudad())
                .orElseThrow(() -> new ResourceNotFoundException("ciudad", estudianteDTO.getCiudad()));

        estudiante.setId(estudianteDTO.getId());
        estudiante.setUsuario(usuario);
        estudiante.setCiudad(ciudad);
        estudiante.setAnioGraduacion(estudianteDTO.getAnioGraduacion());
        estudiante.setEmailPersonal(estudianteDTO.getEmailPersonal());
        estudiante.setEstadoCivil(estudianteDTO.getEstadoCivil());
        estudiante.setRutaPdf(estudianteDTO.getRutaPdf());
        estudiante.setUrlPdf(
                estudianteDTO.getRutaPdf() == null ? null : s3Service.getObjectUrl(estudianteDTO.getRutaPdf()));

        return estudiante;
    }

    @Override
    public GraduadoDTO mapToDTO(Graduado estudiante) {
        GraduadoDTO estudianteDTO = new GraduadoDTO();

        estudianteDTO.setId(estudiante.getId());
        estudianteDTO.setUsuario(estudiante.getUsuario().getNombreUsuario());
        estudianteDTO.setCiudad(estudiante.getCiudad().getNombre());
        estudianteDTO.setAnioGraduacion(estudiante.getAnioGraduacion());
        estudianteDTO.setEmailPersonal(estudiante.getEmailPersonal());
        estudianteDTO.setEstadoCivil(estudiante.getEstadoCivil());
        estudianteDTO.setRutaPdf(estudiante.getRutaPdf());
        estudianteDTO.setUrlPdf(estudiante.getRutaPdf() == null ? null : s3Service.getObjectUrl(estudiante.getRutaPdf()));

        return estudianteDTO;
    }

    @Override
    public List findAll() {
        return graduadoRepository.findAll().stream()
                .peek(e -> e.setUrlPdf(e.getRutaPdf() == null ? null : s3Service.getObjectUrl(e.getRutaPdf())))
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    public PreviousDataForPdfDTO findByIdWithPdf(Long id) {
        return graduadoRepository.findById(id)
                .map(estudiante -> {
                    Usuario userFromGrad = estudiante.getUsuario();
                    userFromGrad.setUrlImagen(s3Service.getObjectUrl(userFromGrad.getRutaImagen()));
                    byte[] pdf;
                    try {
                        pdf = previousDataForPdfService.getPdf(estudiante);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                    return new PreviousDataForPdfDTO(estudiante, pdf);
                })
                .orElseThrow(() -> new ResourceNotFoundException("id", id));
    }

    public GraduadoDTO findByIdToDTO(Long id) {
        Graduado estudiante = graduadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("id", id));

        return mapToDTO(estudiante);
    }

    public GraduadoDTO findByUsuario(long id_usuario) {

        Graduado estudiante = graduadoRepository.findByUsuarioId(id_usuario)
                .map(e -> {
                    e.setUrlPdf(e.getRutaPdf() == null ? null : s3Service.getObjectUrl(e.getRutaPdf()));
                    return e;
                }).orElseThrow(() -> new ResourceNotFoundException("id_usuario", id_usuario));

        return mapToDTO(estudiante);
    }

  /*  public List<Graduado> findAllGraduadosNotIn(Long id) {
        return setUrlForGraduados(graduadoRepository.findByUsuarioIdNot(id));
    }*/
    public List<Graduado> findAllGraduadosNotIn(Long id) {
        List<Graduado> graduados = graduadoRepository.findByUsuarioIdNot(id);

        
        graduados.forEach(graduado -> {
        	String rutaPdf=graduado.getRutaPdf();
             graduado.getUsuario().setClave(null);
           
            if (rutaPdf != null && !rutaPdf.isEmpty()) {
                
                String urlPdf = s3Service.getObjectUrl(rutaPdf); 
                graduado.setUrlPdf(urlPdf); 
            }
            String rutaImagen = graduado.getUsuario().getRutaImagen();
            if (rutaImagen != null && !rutaImagen.isEmpty()) {
              
                String urlImagen = s3Service.getObjectUrl(rutaImagen); 
                graduado.getUsuario().setUrlImagen(urlImagen); 
            }
        });

        return graduados;
    }

    private List<Graduado> setUrlForGraduados(List<Graduado> graduados) {
        return graduados.stream().peek(e -> e.setUrlPdf(e.getRutaPdf() == null ? null : s3Service.getObjectUrl(e.getRutaPdf()))).collect(Collectors.toList());
    }

    public Graduado findByIdUsuario(long id_usuario) {
        return graduadoRepository.findByUsuarioId(id_usuario)
                .map(e -> {
                    e.setUrlPdf(e.getRutaPdf() == null ? null : s3Service.getObjectUrl(e.getRutaPdf()));
                    return e;
                })
                .orElseThrow(() -> new ResourceNotFoundException("id_usuario", id_usuario));
    }

    public GraduadoDTO findDTOByUserId(long id_usuario) {
        Graduado graduado = graduadoRepository.findByUsuarioId(id_usuario)
                .orElseThrow(() -> new ResourceNotFoundException("id_usuario", id_usuario));
        return mapToDTO(graduado);
    }

    public Graduado findByUsuarioPersonaCedulaContaining(String cedula) {
        return graduadoRepository.findByUsuarioPersonaCedulaContaining(cedula)
                .orElseThrow(() -> new ResourceNotFoundException("cedula", cedula));
    }

    public List<OfertasLaborales> findByUsuarioNombreUsuario(String username) {
        List<Postulacion> postulacion = postulacionRepository.findAllByGraduadoUsuarioNombreUsuario(username);

        return postulacion.stream()
                .map(Postulacion::getOfertaLaboral)
                .collect(Collectors.toList());
    }

    public boolean existsByEmailPersonalIgnoreCase(String email) {
        return graduadoRepository.existsByEmailPersonalIgnoreCase(email);
    }

    @Transactional
    public GraduadoDTO updateBasicData(Long id, GraduadoDTO estudianteDTO) {
        Graduado graduadoFromDb = graduadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Graduado", id));

        graduadoFromDb.setUsuario(usuarioRepository.findBynombreUsuario(estudianteDTO.getUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", estudianteDTO.getUsuario())));

        graduadoFromDb.setAnioGraduacion(estudianteDTO.getAnioGraduacion());
        graduadoFromDb.setCiudad(ciudadRepository.findByNombre(estudianteDTO.getCiudad())
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad", estudianteDTO.getCiudad())));

        graduadoFromDb.setEmailPersonal(estudianteDTO.getEmailPersonal());
        graduadoFromDb.setEstadoCivil(estudianteDTO.getEstadoCivil());

        return mapToDTO(graduadoRepository.save(graduadoFromDb));
    }

    @Override
    public Graduado save(Object entity) {
        return graduadoRepository.save(mapToEntity((GraduadoDTO) entity));
    }

    public GraduadoDTO update(Long id, GraduadoDTO estudianteDTO) {
        Graduado graduadoFromDb = graduadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Graduado", id));

        graduadoFromDb.setUsuario(usuarioRepository.findBynombreUsuario(estudianteDTO.getUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", estudianteDTO.getUsuario())));

        graduadoFromDb.setAnioGraduacion(estudianteDTO.getAnioGraduacion());
        graduadoFromDb.setCiudad(ciudadRepository.findByNombre(estudianteDTO.getCiudad())
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad", estudianteDTO.getCiudad())));

        graduadoFromDb.setEmailPersonal(estudianteDTO.getEmailPersonal());
        graduadoFromDb.setEstadoCivil(estudianteDTO.getEstadoCivil());
        graduadoFromDb.setRutaPdf(estudianteDTO.getRutaPdf());
        graduadoFromDb.setUrlPdf(estudianteDTO.getUrlPdf());

        return mapToDTO(graduadoRepository.save(graduadoFromDb));
    }

    public Graduado findByEmail(String email) {
        return graduadoRepository.findByEmailPersonal(email)
                .orElse(new Graduado());
    }

    public Long countEstudiantes() {
        return graduadoRepository.count();
    }

    public List<Graduado> findGRaduadoWithOutOfertas() {
        return graduadoRepository.findAllGraduadosWithoutOfertas();
    }

    public List<Graduado> findAllGraduados() {
        return graduadoRepository.findAll().stream()
                .peek(e -> e.setUrlPdf(e.getRutaPdf() == null ? null : s3Service.getObjectUrl(e.getRutaPdf())))
                .collect(Collectors.toList());
    }

    public Map<String, Object> countBySex() {
        Map<String, Object> countSex = new LinkedHashMap<>();

        countSex.put("masculino", graduadoRepository.countAllByUsuarioPersonaSexo(Persona.Sex.MASCULINO));
        countSex.put("femenino", graduadoRepository.countAllByUsuarioPersonaSexo(Persona.Sex.FEMENINO));
        countSex.put("otro", graduadoRepository.countAllByUsuarioPersonaSexo(Persona.Sex.OTRO));

        return countSex;
    }

    public List<Graduado> findGraduadosWithOfertas() {
        return graduadoRepository.findAllGraduadosWithOfertas();
    }

    public List<Graduado> findGraduadosSinExperiencia() {
        return graduadoRepository.findAllGraduadosSinExperiencia();
    }
}
