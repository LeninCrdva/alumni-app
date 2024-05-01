package ec.edu.ista.springgc1.service.impl;


import ec.edu.ista.springgc1.model.dto.MailRequest;
import ec.edu.ista.springgc1.model.dto.MailResponse;
import ec.edu.ista.springgc1.model.dto.UsuarioDTO;
import ec.edu.ista.springgc1.model.entity.*;
import ec.edu.ista.springgc1.service.bucket.S3Service;
import ec.edu.ista.springgc1.service.mail.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.EmpresaDTO;
import ec.edu.ista.springgc1.repository.CiudadRepository;
import ec.edu.ista.springgc1.repository.EmpresaRepository;
import ec.edu.ista.springgc1.repository.EmpresarioRepository;
import ec.edu.ista.springgc1.repository.SectorEmpresarialRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityExistsException;

@Service
public class EmpresaServiceImpl extends GenericServiceImpl<Empresa> implements Mapper<Empresa, EmpresaDTO> {

    @Value("${spring.mail.username}")
    private String from;
    @Autowired
    private CiudadRepository ciudadrepository;
    @Autowired
    private EmailService emailService;
    private boolean comprueba = false;
    @Autowired
    private EmpresaRepository empresarepository;
    @Autowired
    private EmpresarioRepository empresariorepository;
    @Autowired
    private S3Service s3Service;
    @Autowired
    private SectorEmpresarialRepository sectorrepository;

    @Override
    public Empresa mapToEntity(EmpresaDTO d) {
        Empresa em = new Empresa();
        Ciudad ci = ciudadrepository.findByNombre(d.getCiudad().getNombre())
                .orElseThrow(() -> new ResourceNotFoundException("ciudad", d.getCiudad().getNombre()));

        SectorEmpresarial emp = sectorrepository.findByNombre(d.getSectorEmpresarial().getNombre())
                .orElseThrow(() -> new ResourceNotFoundException("Sector empresarial", d.getCiudad().getNombre()));

        Empresario empresario = empresariorepository.findByUsuarioNombreUsuarioIgnoreCase(d.getEmpresario())
                .orElseThrow(() -> new ResourceNotFoundException("Empresario", String.valueOf(d.getEmpresario())));
        em.setId(d.getId());
        em.setCiudad(ci);
        em.setSectorEmpresarial(emp);
        em.setEmpresario(empresario);
        em.setArea(d.getArea());
        em.setNombre(d.getNombre());
        em.setRazonSocial(d.getRazonSocial());
        em.setRuc(d.getRuc());
        em.setSitioWeb(d.getSitioWeb());
        em.setTipoEmpresa(d.getTipoEmpresa());
        em.setUbicacion(d.getUbicacion());
        em.setEstado(d.isEstado());
        em.setRutaPdfRuc(d.getRutaPdfRuc());
        em.setUrlPdfRuc(d.getRutaPdfRuc().isEmpty() ? "" : s3Service.getObjectUrl(d.getRutaPdfRuc()));

        return em;
    }

    @Override
    public EmpresaDTO mapToDTO(Empresa e) {
        EmpresaDTO em1 = new EmpresaDTO();

        em1.setId(e.getId());
        em1.setArea(e.getArea());
        em1.setCiudad(e.getCiudad());
        em1.setEmpresario(e.getEmpresario().getUsuario().getNombreUsuario());
        em1.setNombre(e.getNombre());
        em1.setRazonSocial(e.getRazonSocial());
        em1.setRuc(e.getRuc());
        em1.setSitioWeb(e.getSitioWeb());
        em1.setTipoEmpresa(e.getTipoEmpresa());
        em1.setSectorEmpresarial(e.getSectorEmpresarial());
        em1.setUbicacion(e.getUbicacion());
        em1.setEstado(e.isEstado());
        em1.setRutaPdfRuc(e.getRutaPdfRuc());
        em1.setUrlPdfRuc(e.getRutaPdfRuc().isEmpty() ? "" : s3Service.getObjectUrl(e.getRutaPdfRuc()));

        return em1;
    }

    @Override
    public List findAll() {
        return empresarepository.findAll()
                .stream()
                .map(c -> mapToDTO(c))
                .collect(Collectors.toList());
    }

    @Override
    public Empresa findById(long id) {
        return empresarepository.findById(id)
                .map(c -> mapToEntity(mapToDTO(c)))
                .orElseThrow(() -> new ResourceNotFoundException("Empresa", String.valueOf(id)));
    }

    @Override
    public Empresa save(Object entity) {
        comprueba = true;
        try {
            return empresarepository.save(mapToEntity((EmpresaDTO) entity));
        } finally {
            comprueba = false;
        }
    }

    @Transactional
    public Boolean existsBynombre(String name) {
        return empresarepository.existsByNombreIgnoreCase(name);
    }

    public EmpresaDTO update(Long id, EmpresaDTO updatedEmpresaDTO) {
        Empresa existingEmpresa = empresarepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa", String.valueOf(id)));

        String nuevoNombre = updatedEmpresaDTO.getNombre();
        if (!existingEmpresa.getNombre().equals(nuevoNombre) && existsBynombre(nuevoNombre)) {
            throw new EntityExistsException("Ya existe una empresa con el mismo nombre.");
        }

        existingEmpresa.setNombre(updatedEmpresaDTO.getNombre());
        existingEmpresa.setArea(updatedEmpresaDTO.getArea());
        existingEmpresa.setEstado(updatedEmpresaDTO.isEstado());
        existingEmpresa.setSitioWeb(updatedEmpresaDTO.getSitioWeb());
        existingEmpresa.setRazonSocial(updatedEmpresaDTO.getRazonSocial());
        existingEmpresa.setTipoEmpresa(updatedEmpresaDTO.getTipoEmpresa());
        existingEmpresa.setUbicacion(updatedEmpresaDTO.getUbicacion());
        SectorEmpresarial sectorEmpresarial = sectorrepository.findByNombre(updatedEmpresaDTO.getSectorEmpresarial().getNombre())
                .orElseThrow(() -> new ResourceNotFoundException("Sector empresarial", updatedEmpresaDTO.getSectorEmpresarial().getNombre()));
        existingEmpresa.setSectorEmpresarial(sectorEmpresarial);
        Ciudad ciudad = ciudadrepository.findByNombre(updatedEmpresaDTO.getCiudad().getNombre())
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad", updatedEmpresaDTO.getCiudad().getNombre()));
        existingEmpresa.setCiudad(ciudad);

        setModelAndMailRequest(existingEmpresa.getEmpresario(), updatedEmpresaDTO);

        return mapToDTO(empresarepository.save(existingEmpresa));
    }

    private MailResponse setModelAndMailRequest(Empresario empresario, EmpresaDTO empresa){
        Map<String, Object> model = new HashMap<>();
        String fullName = getFullName(empresario.getUsuario());
        String to = empresario.getEmail();

        MailRequest request = new MailRequest(fullName, to, "noreply@tecazuay.edu.ec", "Notificación de cambio de estado de su empresa registrada", "alert-company");

        model.put("empresa", empresa);
        model.put("fullName", fullName);

        return emailService.sendEmail(request, model);
    }

    @Transactional
    public EmpresaDTO updatePdfRuc(Long id, String rutaPdfRuc) {
        Empresa empresa = empresarepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa", String.valueOf(id)));
        empresa.setRutaPdfRuc(rutaPdfRuc);
        return mapToDTO(empresarepository.save(empresa));
    }

    public void delete(Long id) {
        empresarepository.deleteById(id);
    }

    public Set<EmpresaDTO> findByNombreUsuario(String nombreUsuario) {
        Set<Empresa> empresas = empresarepository.findByNombreUsuario(nombreUsuario);
        return empresas.stream().map(this::mapToDTO).collect(Collectors.toSet());
    }

    public Set<EmpresaDTO> findEmpresasSinOfertaLaboral() {
        List<Empresa> empresasSinOferta = empresarepository.findEmpresasSinOfertas();
        return empresasSinOferta.stream().map(this::mapToDTO).collect(Collectors.toSet());
    }

    @Transactional
    public boolean existByRuc(String ruc) {
        return empresarepository.existsByRuc(ruc);
    }

    private String getFullName(Usuario usuario) {
        return usuario.getPersona().getPrimerNombre()
                + " " + usuario.getPersona().getSegundoNombre()
                + " " + usuario.getPersona().getApellidoPaterno()
                + " " + usuario.getPersona().getApellidoMaterno();
    }
}
