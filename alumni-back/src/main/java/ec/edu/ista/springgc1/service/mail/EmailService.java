package ec.edu.ista.springgc1.service.mail;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.mail.util.ByteArrayDataSource;

import ec.edu.ista.springgc1.exception.AppException;
import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.model.entity.Survey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import ec.edu.ista.springgc1.mail.config.RecoveryPasswordToken;
import ec.edu.ista.springgc1.model.dto.MailRequest;
import ec.edu.ista.springgc1.model.dto.MailResponse;
import ec.edu.ista.springgc1.model.entity.RecoveryToken;
import ec.edu.ista.springgc1.model.entity.Usuario;
import ec.edu.ista.springgc1.service.impl.AdministradorServiceImpl;
import ec.edu.ista.springgc1.service.impl.GraduadoServiceImpl;
import ec.edu.ista.springgc1.service.impl.RecoveryTokenServiceImpl;
import org.springframework.util.StringUtils;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender sender;

    @Autowired
    private ITemplateEngine templateEngine;

    @Autowired
    private RecoveryTokenServiceImpl tokenService;

    @Autowired
    private GraduadoServiceImpl graduadoService;

    @Autowired
    private AdministradorServiceImpl graduAdministradorServiceImpl;

    @Autowired
    private RecoveryPasswordToken tokenPasswordRecovery;

    @Value("${angular.recovery.url}")
    private String RECOVERY_URL;

    public MailResponse sendEmail(MailRequest request, Map<String, Object> model) {
        MailResponse response = new MailResponse();
        MimeMessage message = sender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            getHtml(request, model, response, message, helper);
        } catch (MessagingException | IOException e) {
            response.setMessage("Fallo al enviar email: " + e.getMessage());
            response.setStatus(Boolean.FALSE);
        }

        return response;
    }

    public void sendEmail(MailRequest request, Map<String, Object> model, String[] emails) {
        MimeMessage message = sender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            getHtml(request, model, emails, message, helper);
        } catch (MessagingException | IOException e) {
            System.out.println(("Fallo al enviar email: " + e.getMessage()));
        }
    }

    public void sendEmail(MailRequest request, Survey survey, String state) {
        Map<String, Object> model = new HashMap<>();

        model.put("survey", survey);
        model.put("state", state);

        MimeMessage message = sender.createMimeMessage();

        List<Graduado> graduados = graduadoService.findAllGraduados();

        model.put("graduados", graduados.stream().map(Graduado::getEmailPersonal).toArray(String[]::new));

        String[] emails = graduados.stream()
                .map(Graduado::getEmailPersonal)
                .toArray(String[]::new);

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            getHtml(request, model, emails, message, helper);
        } catch (MessagingException | IOException e) {
            System.out.println(("Fallo al enviar email: " + e.getMessage()));
        }
    }

    public MailResponse sendEmailWithPDF(MailRequest request, Map<String, Object> model, byte[] pdfBytes) {
        MailResponse response = new MailResponse();
        MimeMessage message = sender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            if (StringUtils.hasText(request.getCaseEmail()) && request.getCaseEmail().equals("cv-graduate")) {
                Graduado graduado = model.get("graduado") != null ? (Graduado) model.get("graduado") : null;
                ByteArrayDataSource dataSource = new ByteArrayDataSource(pdfBytes, "application/pdf");
                String docName = "curriculum_" + graduado.getUsuario().getPersona().getCedula() + ".pdf";
                helper.addAttachment(docName, dataSource);
            }

            getHtml(request, model, response, message, helper);
        } catch (MessagingException | IOException e) {
            response.setMessage("Fallo al enviar email: " + e.getMessage());
            response.setStatus(Boolean.FALSE);
        }

        return response;
    }

    public void sendEmailWithPDFToBusinessman(MailRequest request, Map<String, Object> model, byte[] pdfBytes) {
        MailResponse response = new MailResponse();
        MimeMessage message = sender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            if (StringUtils.hasText(request.getCaseEmail()) && request.getCaseEmail().equals("list-postulates")) {
                ByteArrayDataSource dataSource = new ByteArrayDataSource(pdfBytes, "application/pdf");
                String docName = "curriculum_list.pdf";
                helper.addAttachment(docName, dataSource);
            }

            getHtml(request, model, response, message, helper);
        } catch (MessagingException | IOException e) {
            response.setMessage("Fallo al enviar email: " + e.getMessage());
            response.setStatus(Boolean.FALSE);
        }
    }

    public void sendEmailWithPDF(MailRequest request, Map<String, Object> model, String[] emails) {
        MailResponse response = new MailResponse();
        MimeMessage message = sender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            byte[] imgBytes = (byte[]) model.get("fotoPortada");

            if (imgBytes.length > 0) {
                ByteArrayDataSource dataSource = new ByteArrayDataSource(imgBytes, "image/png");
                String docName = "Oferta Imagen.png";
                helper.addAttachment(docName, dataSource);
            }

            getHtml(request, model, emails, message, helper);
        } catch (MessagingException | IOException e) {
            response.setMessage("Fallo al enviar email: " + e.getMessage());
            response.setStatus(Boolean.FALSE);
        }
    }

    public MailResponse sendRecoveryEmail(MailRequest request, Map<String, Object> model) {
        MailResponse response = new MailResponse();
        MimeMessage message = sender.createMimeMessage();
        RecoveryToken token = generateRecoveryToken(request.getTo());
        String activationUrl = RECOVERY_URL + "?reset_token=" + token.getToken();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            model.put("URL", activationUrl);

            getHtml(request, model, response, message, helper);

        } catch (MessagingException | IOException e) {
            response.setMessage("Fallo al enviar email: " + e.getMessage());
            response.setStatus(Boolean.FALSE);
        }

        return response;
    }

    public void validateRequest(Usuario usuario) {

        List<RecoveryToken> recoveryToken = tokenService.findByUsuarioId(usuario.getId());

        recoveryToken.stream().filter(RecoveryToken::getActive)
                .filter(token -> token.getExpiration().compareTo(new Date()) > 0)
                .findAny()
                .ifPresent(token -> {
                    throw new AppException(HttpStatus.CONFLICT, "El usuario ya contiene un token de recuperación activo");
                });
    }

    private void getHtml(MailRequest request, Map<String, Object> model, MailResponse response, MimeMessage message, MimeMessageHelper helper) throws IOException, MessagingException {
        Context context = new Context();
        context.setVariables(model);

        String html = templateEngine.process(getTemplate(request.getCaseEmail()), context);

        helper.setTo(request.getTo());
        helper.setText(html, true);
        helper.setSubject(request.getSubject());
        helper.setFrom(request.getFrom());
        sender.send(message);

        response.setMessage("Email enviado a: " + request.getTo());
        response.setStatus(Boolean.TRUE);
    }

    private void getHtml(MailRequest request, Map<String, Object> model, String[] emails, MimeMessage message, MimeMessageHelper helper) throws IOException, MessagingException {
        Context context = new Context();
        context.setVariables(model);

        String html = templateEngine.process(getTemplate(request.getCaseEmail()), context);

        helper.setTo(emails);
        helper.setText(html, true);
        helper.setSubject(request.getSubject());
        helper.setFrom(request.getFrom());
        sender.send(message);
    }

    private static String getTemplate(String emailCase) {
        String t;

        switch (emailCase) {
            case "postulate":
                t = "graduate/email-template-postulate";
                break;
            case "remove-postulate":
                t = "graduate/email-template-remove-postulate";
                break;
            case "accept-postulate":
                t = "graduate/email-template-accept-postulate";
                break;
            case "reset-password":
                t = "graduate/email-template-recovery-email";
                break;
            case "list-postulates":
                t = "businessman/email-template-list-postulates";
                break;
            case "cv-graduate":
                t = "businessman/email-template-alert-postulate";
                break;
            case "offer-revision":
            case "new-offer":
                t = "businessman/email-template-alert-offer";
                break;
            case "new-company":
                t = "businessman/email-template-warning-register";
                break;
            case "offer-finished":
            case "offer-canceled":
                t = "businessman/email-template-alert-cancel-or-finish-offer";
                break;
            case "reject-postulate":
                t = "graduate/email-template-rejected-postulate";
                break;
            case "offer-selection":
                t = "graduate/email-template-select-postulate";
                break;
            case "survey-desactivated":
            case "survey-activated":
                t = "graduate/email-template-alert-survey";
                break;
            case "alert-businessman-account":
                t = "businessman/email-template-activated-desactivated-account";
                break;
            case "alert-company":
                t = "businessman/email-template-activated-desactivated-company";
                break;
            case "register-businessman":
                t = "businessman/email-template-alert-new-businessman";
                break;
            case "register-account":
                t = "account/email-template-register-account";
                break;
            default:
                t = "graduate/email-template-contact-us";
                break;
        }

        return t;
    }

    private RecoveryToken generateRecoveryToken(String email) {
        String tokenValue = tokenPasswordRecovery.generateToken();
        RecoveryToken recoveryToken = new RecoveryToken();
        Usuario usuario = graduadoService.findByEmail(email).getUsuario();
        Date expirationDate = tokenPasswordRecovery.calculateExpirationDate();

        if (usuario != null && !usuario.getNombreUsuario().isEmpty()) {
            recoveryToken.setUsuario(usuario);
        } else {
            usuario = graduAdministradorServiceImpl.findByEmail(email).getUsuario();
            recoveryToken.setUsuario(usuario);
        }

        recoveryToken.setToken(tokenValue);
        recoveryToken.setExpiration(expirationDate);

        return tokenService.save(recoveryToken);
    }
}
