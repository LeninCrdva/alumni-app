package ec.edu.ista.springgc1.security;

import ec.edu.ista.springgc1.model.entity.Rol;
import ec.edu.ista.springgc1.model.entity.Usuario;
import ec.edu.ista.springgc1.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findBynombreUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("No se ha encontrado el username " + username ));

        return new User(usuario.getNombreUsuario(),usuario.getClave(),mapRoles(usuario.getRol()));
    }

    private Collection<? extends GrantedAuthority> mapRoles(Rol rol){
        return Collections.singleton(new SimpleGrantedAuthority(rol.getNombre()));
    }
}
