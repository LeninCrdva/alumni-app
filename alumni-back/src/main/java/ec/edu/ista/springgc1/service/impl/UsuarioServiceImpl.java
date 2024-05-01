package ec.edu.ista.springgc1.service.impl;

import ec.edu.ista.springgc1.exception.AppException;
import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.*;
import ec.edu.ista.springgc1.model.entity.*;
import ec.edu.ista.springgc1.repository.AdministradorRepository;
import ec.edu.ista.springgc1.repository.PersonaRepository;
import ec.edu.ista.springgc1.repository.RolRepository;
import ec.edu.ista.springgc1.repository.UsuarioRepository;
import ec.edu.ista.springgc1.service.bucket.S3Service;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.mail.EmailService;
import ec.edu.ista.springgc1.service.map.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.services.kms.model.NotFoundException;
import org.springframework.util.ObjectUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl extends GenericServiceImpl<Usuario> implements Mapper<Usuario, UsuarioDTO> {

    @Value("${spring.mail.username}")
    private String from;

    @Autowired
    private AdministradorRepository adminRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private GraduadoServiceImpl graduadoService;

    @Autowired
    private EmpresaServiceImpl empresaService;

    @Autowired
    private EmpresarioServiceImpl empresarioService;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private S3Service s3Service;

    @Override
    public Usuario mapToEntity(UsuarioDTO usuarioDTO) {
        Usuario usuario = new Usuario();
        Rol rol = rolRepository.findByNombre(usuarioDTO.getRol())
                .orElseThrow(() -> new ResourceNotFoundException("nombre", usuarioDTO.getRol()));
        usuario.setId(usuarioDTO.getId());
        usuario.setNombreUsuario(usuarioDTO.getNombreUsuario());
        usuario.setClave(passwordEncoder.encode(usuarioDTO.getClave()));

        Persona p = personaRepository.findBycedula(usuarioDTO.getCedula())
                .orElseThrow(() -> new ResourceNotFoundException("cedula", usuarioDTO.getCedula()));

        usuario.setRutaImagen(usuarioDTO.getRutaImagen());
        usuario.setEstado(usuarioDTO.isEstado());
        usuario.setUrlImagen(usuarioDTO.getUrlImagen() == null ? null : s3Service.getObjectUrl(usuarioDTO.getRutaImagen()));
        usuario.setPersona(p);
        usuario.setRol(rol);

        return usuario;
    }

    @Override
    public UsuarioDTO mapToDTO(Usuario usuario) {
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setId(usuario.getId());
        usuarioDTO.setClave(usuario.getClave());
        usuarioDTO.setNombreUsuario(usuario.getNombreUsuario());
        usuarioDTO.setRutaImagen(usuario.getRutaImagen());
        usuarioDTO.setUrlImagen(s3Service.getObjectUrl(usuario.getRutaImagen()));

        usuarioDTO.setCedula(usuario.getPersona().getCedula());
        usuarioDTO.setEstado(usuario.getEstado());
        usuarioDTO.setRol(usuario.getRol().getNombre());
        return usuarioDTO;
    }

    @Override
    public List findAll() {
        return usuarioRepository.findAll().stream()
                .peek(u -> u.setUrlImagen(u.getRutaImagen() == null ? null : s3Service.getObjectUrl(u.getRutaImagen())))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Usuario findById(long id) {
        return usuarioRepository.findById(id).map(u -> {
            u.setUrlImagen(s3Service.getObjectUrl(u.getRutaImagen()));

            return u;
        }).orElseThrow(() -> new ResourceNotFoundException("id", id));
    }

    public UsuarioDTO findByIdToDTO(long id) {
        return mapToDTO(usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("id", id)));
    }

    public Usuario findByUsername(String username) {
        return usuarioRepository.findBynombreUsuario(username).orElseThrow(() -> new ResourceNotFoundException("usuario:", username));
    }

    public Usuario findByUsername2(String username) {
        return usuarioRepository.findBynombreUsuario(username)
                .map(u -> {
                    u.setUrlImagen(u.getRutaImagen() == null ? null : s3Service.getObjectUrl(u.getRutaImagen()));
                    return u;
                })
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con nombre de usuario: " + username));
    }

    public Usuario findByUsernameAndClave(String username, String clave) {
        return usuarioRepository.findBynombreUsuarioAndClave(username, clave).orElseThrow(() -> new ResourceNotFoundException("usario:", username));
    }

    public Usuario update(long id, UsuarioDTO usuarioDTO) {

        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", id));
        if (!usuario.getNombreUsuario().equalsIgnoreCase(usuarioDTO.getNombreUsuario()) && usuarioRepository.existsBynombreUsuario(usuarioDTO.getNombreUsuario())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El usuario ya se encuentra en otro registro");
        }
        Rol rol = rolRepository.findByNombre(usuarioDTO.getRol())
                .orElseThrow(() -> new ResourceNotFoundException("nombre:", usuarioDTO.getRol()));
        Persona p = personaRepository.findBycedula(usuarioDTO.getCedula())
                .orElseThrow(() -> new ResourceNotFoundException("cedula:", usuarioDTO.getCedula()));
        ;

        usuario.setNombreUsuario(usuarioDTO.getNombreUsuario());

        usuario.setUrlImagen(usuarioDTO.getUrlImagen());
        usuario.setRutaImagen(usuarioDTO.getRutaImagen());

        usuario.setEstado(usuarioDTO.isEstado());
        usuario.setPersona(p);
        usuario.setRol(rol);

        return usuarioRepository.save(usuario);
    }

    public Usuario updateSomeData(long id, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User NOT FOUND", id));
        usuario.setNombreUsuario(usuarioDTO.getNombreUsuario());
        usuario.setRol(rolRepository.findByNombre(usuarioDTO.getRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol NOT FOUND", usuarioDTO.getRol())));
        return usuarioRepository.save(usuario);
    }

    public Boolean updateState(long id, boolean state) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User NOT FOUND", id));
        usuario.setEstado(state);
        usuarioRepository.save(usuario);

        setModelAndMailRequest(usuario);

        return true;
    }

    public Usuario updatePhoto(long id, String ruta) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User NOT FOUND", id));
        usuario.setRutaImagen(ruta);
        usuario.setUrlImagen(s3Service.getObjectUrl(ruta));
        return usuarioRepository.save(usuario);
    }

    public void updatePassword(long id, String newPassword) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No encontrado el id: ", id));

        if (!newPassword.isEmpty()) {
            String code = passwordEncoder.encode(newPassword);
            usuario.setClave(code);
        }

        usuarioRepository.save(usuario);
    }

    @Override
    public Usuario save(Object entity) {
        return usuarioRepository.save(mapToEntity((UsuarioDTO) entity));
    }

    @Transactional
    public Boolean existsByUsername(String username) {
        return usuarioRepository.existsBynombreUsuario(username);
    }

    @Transactional
    public UsuarioDTO registerUserAndPerson(Persona persona, RegistroDTO usuarioDTO) {

        return extractAndSave(persona, usuarioDTO);
    }

    @Transactional
    public UsuarioDTO extractAndSave(Persona persona, RegistroDTO usuarioDTO) {
        UsuarioDTO user = new UsuarioDTO();
        user.setNombreUsuario(usuarioDTO.getNombreUsuario());
        user.setCedula(persona.getCedula());
        user.setClave(usuarioDTO.getClave());
        user.setRol(usuarioDTO.getRol());
        user.setEstado(usuarioDTO.isEstado());
        user.setRutaImagen(usuarioDTO.getRutaImagen());
        user.setUrlImagen(usuarioDTO.getUrlImagen());

        save(user);

        return user;
    }

    @Transactional
    public UsuarioDTO registerUserAndPerson(Persona persona, RegistroDTO usuarioDTO, EmpresaDTO empresa) {

        UsuarioDTO user = extractAndSave(persona, usuarioDTO);

        setModelAndEmailRegister(user, empresa, persona);

        return user;
    }

    @Transactional
    public void controlCase(Usuario usuario, EmpresarioDTO empresarioDTO, EmpresaDTO empresaDTO, GraduadoDTO graduadoDTO) {
        String role = usuario.getRol().getNombre();
        Graduado grad = null;
        Empresario empresario = null;
        switch (role) {
            case "GRADUADO":
                graduadoDTO.setUsuario(usuario.getNombreUsuario());
                grad = graduadoService.save(graduadoDTO);
                break;
            case "EMPRESARIO":
                empresario = saveEmpresario(usuario, empresarioDTO);
                if (!ObjectUtils.isEmpty(empresario) && empresaDTO.getEmpresario() != null) {
                    saveEmpresa(empresarioDTO, empresaDTO);
                }
                break;
            case "RESPONSABLE_CARRERA":
                break;
            default:
                throw new AppException(HttpStatus.BAD_REQUEST, "El rol ingresado no es válido");
        }

        String email = "";
        if (!ObjectUtils.isEmpty(grad)) {
            email = grad.getEmailPersonal();
        } else if (!ObjectUtils.isEmpty(empresario)){
            email = empresario.getEmail();
        }

        setModelAndEmailRegister(usuario, email);
    }

    public Empresario saveEmpresario(Usuario usuario, EmpresarioDTO empresarioDTO) {
        empresarioDTO.setUsuario(usuario.getNombreUsuario());
        return empresarioService.save(empresarioDTO);
    }

    public void saveEmpresa(EmpresarioDTO empresarioDTO, EmpresaDTO empresaDTO) {
        if (empresaDTO.getEmpresario() != null) {
            empresaDTO.setEmpresario(empresarioDTO.getUsuario());
            empresaService.save(empresaDTO);
        }
    }

    private void setModelAndMailRequest(Usuario user){
        Map<String, Object> model = new HashMap<>();

        Set<EmpresaDTO> empresas = empresaService.findByNombreUsuario(user.getNombreUsuario());

        String to = usuarioRepository.findEmailByNombreUsuario(user.getNombreUsuario());

        String fullName= getFullName(user.getPersona());

        MailRequest request = new MailRequest(fullName, to, from, "Notificación de cambio de estado de su cuenta", "alert-businessman-account");

        model.put("empresas", empresas);
        model.put("usuario", user);
        model.put("fullName", fullName);

        emailService.sendEmail(request, model);
    }

    private void setModelAndEmailRegister(Usuario usuario, String email){
        Map<String, Object> model = new HashMap<>();

        MailRequest request = new MailRequest(email, from, "¡Cuenta registrada!", "register-account");

        model.put("usuario", usuario);
        model.put("fullName", getFullName(usuario.getPersona()));

        emailService.sendEmail(request, model);
    }

    private void setModelAndEmailRegister(UsuarioDTO usuario, EmpresaDTO empresa, Persona persona){
        Map<String, Object> model = new HashMap<>();

        MailRequest request = new MailRequest(from, "Notificación de registro de nuevo empresario", "register-businessman");
        String[] emails = getEmailAdministrators();

        model.put("empresa", empresa);
        model.put("usuario", usuario);
        model.put("fullName", getFullName(persona));

        emailService.sendEmail(request, model, emails);
    }

    private String getFullName(Persona persona) {

        return persona.getPrimerNombre()
                + " " + persona.getSegundoNombre()
                + " " + persona.getApellidoPaterno()
                + " " + persona.getApellidoMaterno();
    }

    private String[] getEmailAdministrators(){
        return adminRepository.findAll().stream()
                .map(Administrador::getEmail)
                .toArray(String[]::new);
    }
}
