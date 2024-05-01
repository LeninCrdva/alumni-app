package ec.edu.ista.springgc1.service.scheduled;

import ec.edu.ista.springgc1.model.dto.MailRequest;
import ec.edu.ista.springgc1.model.dto.OfertasLaboralesDTO;
import ec.edu.ista.springgc1.model.entity.Postulacion;
import ec.edu.ista.springgc1.model.enums.EstadoOferta;
import ec.edu.ista.springgc1.model.enums.EstadoPostulacion;
import ec.edu.ista.springgc1.model.enums.ProcessingStatus;
import ec.edu.ista.springgc1.model.request.OfferProcessingStatus;
import ec.edu.ista.springgc1.repository.PostulacionRepository;
import ec.edu.ista.springgc1.repository.IOfferProcessingStatusRepository;
import ec.edu.ista.springgc1.service.impl.OfertaslaboralesServiceImpl;
import ec.edu.ista.springgc1.service.mail.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ScheduledTaskExecutor {

    @Value("${spring.mail.username}")
    private String from;

    private final OfertaslaboralesServiceImpl ofertaslaboralesService;

    private final PostulacionRepository postulacionRepository;

    private final EmailService emailService;

    private final IOfferProcessingStatusRepository offerProcessingStatusRepository;

    public ScheduledTaskExecutor(OfertaslaboralesServiceImpl ofertaslaboralesService, PostulacionRepository postulacionRepository, EmailService emailService, IOfferProcessingStatusRepository offerProcessingStatusRepository) {
        this.ofertaslaboralesService = ofertaslaboralesService;
        this.postulacionRepository = postulacionRepository;
        this.emailService = emailService;
        this.offerProcessingStatusRepository = offerProcessingStatusRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void executeTask() {
        System.out.println("Ejecutando tarea programada");

        List<OfertasLaboralesDTO> ofertas = ofertaslaboralesService.findOfertasLaboralesWithOutEstadoFinalizado()
                .stream()
                .filter(oferta -> oferta.getFechaCierre().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());

        List<OfferProcessingStatus> listOfferProcessingStatus = offerProcessingStatusRepository
                .findAllById(ofertas
                        .stream()
                        .map(OfertasLaboralesDTO::getId)
                        .collect(Collectors.toList())
                );

        ofertas
                .forEach(oferta -> {

                    OfferProcessingStatus offerProcessingStatus = listOfferProcessingStatus
                            .stream()
                            .filter(offer -> offer.getOfferId().equals(oferta.getId()))
                            .findFirst()
                            .orElse(new OfferProcessingStatus(oferta.getId(), "Offer closed, in selection"));

                    if (oferta.getFechaCierre().plusDays(3).isBefore(LocalDateTime.now())) {
                        oferta.setEstado(EstadoOferta.FINALIZADA);

                        List<Postulacion> postulaciones = postulacionRepository.findAllByOfertaLaboralId(oferta.getId())
                                .stream()
                                .filter(postulacion -> postulacion.getEstado().equals(EstadoPostulacion.APLICANDO))
                                .peek(postulacion -> postulacion.setEstado(EstadoPostulacion.RECHAZADO))
                                .collect(Collectors.toList());

                        postulacionRepository.saveAll(postulaciones);

                        offerProcessingStatus.setStatus(ProcessingStatus.PROCESSED);
                        offerProcessingStatus.setMessage("Offer closed");

                        if (!postulaciones.isEmpty()) {
                            System.out.println("Enviando correos de rechazo a " + postulaciones.size() + " postulantes");
                            enviarCorreosRechazo(oferta, postulaciones);
                        }

                    } else {
                        oferta.setEstado(EstadoOferta.EN_SELECCION);
                    }

                    OfferProcessingStatus objectSaveOrUpdate =  offerProcessingStatusRepository.save(offerProcessingStatus);

                    try {
                        ofertaslaboralesService.save(oferta, objectSaveOrUpdate.getStatus());
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });

        System.out.println("Tarea programada finalizada");
    }

    private void enviarCorreosRechazo(OfertasLaboralesDTO oferta, List<Postulacion> postulaciones) {
        Map<String, Object> model = new HashMap<>();
        model.put("oferta", oferta);

        String[] emails = postulaciones.stream()
                .filter(postulacion -> postulacion.getEstado().equals(EstadoPostulacion.RECHAZADO))
                .map(postulacion -> {
                    return postulacion.getGraduado().getEmailPersonal();
                })
                .toArray(String[]::new);

        String subject = "Postulación rechazada";
        String caseEmail = "reject-postulate";

        MailRequest mailRequest = new MailRequest(from, subject, caseEmail);

        emailService.sendEmail(mailRequest, model, emails);
    }
}