package ec.edu.ista.springgc1.security.jwt;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
public class JwtAuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private Long usuario_id;
    private String username;
    private Collection<? extends GrantedAuthority> authorities;

    public JwtAuthResponse(String accessToken, Long usuario_id, String username, Collection<? extends GrantedAuthority> authorities) {
        super();
        this.accessToken = accessToken;
        this.usuario_id = usuario_id;
        this.username = username;
        this.authorities = authorities;
    }
}
