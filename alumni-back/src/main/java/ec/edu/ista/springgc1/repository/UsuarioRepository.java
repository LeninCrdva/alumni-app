package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.entity.Usuario;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UsuarioRepository extends GenericRepository<Usuario> {

    public Optional<Usuario> findBynombreUsuario(String username);
    public Optional<Usuario> findBynombreUsuarioAndClave(String username, String clave);
    public Boolean existsBynombreUsuario(String username);

    @Query("SELECT COALESCE(g.emailPersonal, e.email, a.email) FROM Usuario u LEFT JOIN Graduado g ON u.id = g.usuario.id LEFT JOIN Empresario e ON u.id = e.usuario.id LEFT JOIN Administrador a ON u.id = a.usuario.id WHERE u.nombreUsuario = :nombreUsuario")
    String findEmailByNombreUsuario(String nombreUsuario);
}