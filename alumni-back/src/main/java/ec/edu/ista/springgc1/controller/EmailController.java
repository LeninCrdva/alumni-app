package ec.edu.ista.springgc1.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import ec.edu.ista.springgc1.model.entity.*;
import ec.edu.ista.springgc1.service.impl.AdministradorServiceImpl;
import ec.edu.ista.springgc1.service.impl.EmpresarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ec.edu.ista.springgc1.model.dto.GraduadoDTO;
import ec.edu.ista.springgc1.model.dto.MailRequest;
import ec.edu.ista.springgc1.model.dto.MailResponse;
import ec.edu.ista.springgc1.service.impl.GraduadoServiceImpl;
import ec.edu.ista.springgc1.service.impl.OfertaslaboralesServiceImpl;
import ec.edu.ista.springgc1.service.mail.EmailService;

@RestController
@RequestMapping("/mail")

public class EmailController {

    @Autowired
    private EmailService service;

    @Autowired
    private GraduadoServiceImpl graduadoService;

    @Autowired
    private AdministradorServiceImpl administradorService;

    @Autowired
    private EmpresarioServiceImpl empresarioService;

    @Autowired
    private OfertaslaboralesServiceImpl ofertaService;

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GRADUADO', 'EMPRESARIO')")
    @PostMapping("/sendingEmail")
    public ResponseEntity<?> sendEmail(@RequestBody MailRequest request) {
        Graduado graduado = graduadoService.findByEmail(request.getTo());
        OfertasLaborales oferta = ofertaService.findById(Long.parseLong(request.getName()));

        String fullName = getFullName(graduado.getUsuario());

        Map<String, Object> model = new HashMap<>();
        model.put("fullName", fullName);
        model.put("graduado", graduado);
        model.put("oferta", oferta);

        MailResponse response = service.sendEmail(request, model);

        if (response.getMessage().contains("Fallo al enviar email:")) {
            return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body(response);
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/recovery-password")
    public ResponseEntity<?> recoveryPassword(@RequestBody MailRequest request) {
        Graduado graduado = graduadoService.findByEmail(request.getTo());
        Empresario empresario = StringUtils.hasText(graduado.getEmailPersonal()) ? empresarioService.findByEmail(request.getTo()) : new Empresario();
        Administrador administrador = (!StringUtils.hasText(graduado.getEmailPersonal()) && !StringUtils.hasText(empresario.getEmail())) ? administradorService.findByEmail(request.getTo()) : new Administrador();

        if (StringUtils.hasText(graduado.getEmailPersonal())) {
            createResponse(graduado.getUsuario(), request);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else if (StringUtils.hasText(empresario.getEmail())) {
            createResponse(empresario.getUsuario(), request);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else if (StringUtils.hasText(administrador.getEmail())) {
            createResponse(administrador.getUsuario(), request);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    @PreAuthorize("denyAll()")
    @PostMapping("/send-list-businessman") // <-- This method is incomplete, don't consume in front.
    public ResponseEntity<?> sendListPostulates(@RequestBody MailRequest request) {
        List<Graduado> postulates = ofertaService.findGraduadosByOfertaId(Long.parseLong(request.getName()));
        Map<String, Object> model = new HashMap<>();

        model.put("postulates", postulates);

        Administrador administrador = administradorService.findByEmail(request.getTo());
        return createResponse(administrador.getUsuario(), request);
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/contact-us")
    public ResponseEntity<MailResponse> contactUs(@RequestBody MailRequest request) {

        Map<String, Object> model = new HashMap<>();
        model.put("fullName", request.getName());
        model.put("email", request.getFrom());
        model.put("message", request.getCaseEmail());

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(service.sendEmail(request, model));
    }

    private String getFullName(Usuario usuario) {

        return usuario.getPersona().getPrimerNombre()
                + " " + usuario.getPersona().getSegundoNombre()
                + " " + usuario.getPersona().getApellidoPaterno()
                + " " + usuario.getPersona().getApellidoMaterno();
    }

    private ResponseEntity<?> createResponse(Usuario usuario, MailRequest request) {
        Map<String, Object> model = new HashMap<>();
        model.put("fullName", getFullName(usuario));

        service.validateRequest(usuario);

        MailResponse response = service.sendRecoveryEmail(request, model);

        if (response.getMessage().contains("Fallo al enviar email:") ){
            return ResponseEntity.internalServerError().body(response);
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
