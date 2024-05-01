package ec.edu.ista.springgc1.runner;

import ec.edu.ista.springgc1.model.entity.Rol;
import ec.edu.ista.springgc1.repository.RolRepository;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class CommandRunner implements org.springframework.boot.CommandLineRunner {

    private final RolRepository rolRepository;

    public CommandRunner(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @Override
    public void run(String... args) {
        List<Rol> roles = Arrays.asList(
                new Rol("ADMINISTRADOR", "ROL DE ADMINISTRADOR"),
                new Rol("GRADUADO", "ROL DE GRADUADO"),
                new Rol("EMPRESARIO", "ROL DE EMPRESARIO"),
                new Rol("RESPONSABLE_CARRERA", "ROL DE RESPONSABLE DE CARRERA, UNICAMENTE PUEDE OBSERVAR Y DESCARGAR INFORMACION")
        );

        for (Rol rol : roles) {
            if (!rolRepository.findByNombre(rol.getNombre()).isPresent()) {
                rolRepository.save(rol);
            }
        }
    }
}
