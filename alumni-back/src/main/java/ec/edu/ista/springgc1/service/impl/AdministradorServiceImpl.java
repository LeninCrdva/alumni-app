package ec.edu.ista.springgc1.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.AdminDTO;
import ec.edu.ista.springgc1.model.entity.Administrador;
import ec.edu.ista.springgc1.model.entity.Usuario;
import ec.edu.ista.springgc1.repository.AdministradorRepository;
import ec.edu.ista.springgc1.repository.UsuarioRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdministradorServiceImpl extends GenericServiceImpl<Administrador> implements Mapper<Administrador, AdminDTO> {

    @Autowired
    private AdministradorRepository adminrepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Administrador mapToEntity(AdminDTO adminDTO) {
        Administrador admin = new Administrador();

        Usuario usuario = usuarioRepository.findBynombreUsuario(adminDTO.getUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("usuario", adminDTO.getUsuario()));

        admin.setId(adminDTO.getId());
        admin.setUsuario(usuario);
        admin.setEstado(adminDTO.isEstado());
        admin.setEmail(adminDTO.getEmail());
        admin.setCargo(adminDTO.getCargo());


        return admin;
    }

    @Override
    public AdminDTO mapToDTO(Administrador admin) {
        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setId(admin.getId());
        adminDTO.setUsuario(admin.getUsuario().getNombreUsuario());
        adminDTO.setEstado(admin.isEstado());
        adminDTO.setEmail(admin.getEmail());
        adminDTO.setCargo(admin.getCargo());
        return adminDTO;
    }

    @Override
    public List findAll() {
        return adminrepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public AdminDTO findByIdToDTO(Long id) {
        Administrador admin = adminrepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("id", id));

        return mapToDTO(admin);
    }


    public AdminDTO findByUsuario(Long id_usuario) {

        Administrador adminw = adminrepository.findByUsuarioId(id_usuario)
                .orElseThrow(() -> new ResourceNotFoundException("id_usuario", id_usuario));

        return mapToDTO(adminw);
    }


    @Override
    public Administrador save(Object entity) {

        return adminrepository.save(mapToEntity((AdminDTO) entity));
    }

    public List<Administrador> findAllAdministradores() {
        return adminrepository.findAll();
    }

    public Administrador findByEmail(String email) {

        return adminrepository.findByEmail(email)
                .orElse(new Administrador());
    }

    @Transactional
    public Boolean existsByEmail(String email) {
        return adminrepository.existsByEmailIgnoreCase(email);
    }
}
