package ec.edu.ista.springgc1.security.jwt;

import ec.edu.ista.springgc1.exception.AppException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app.jwt-expiration-milliseconds}")
    private long jwtExpirationInMs;

    public String generateToken(Authentication authentication, Map<String, Object> extraClaims) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expirationDate = new Date(currentDate.getTime() + jwtExpirationInMs);

        JwtBuilder jwtBuilder = Jwts.builder()

                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expirationDate);

        for ( Map.Entry<String, Object> entry : extraClaims.entrySet() ) {
            jwtBuilder.claim(entry.getKey(), entry.getValue());
        }

        return jwtBuilder
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .compact();
    }

    public String getUsernameOfJWT(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecret.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(jwtSecret.getBytes()).build().parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Firma JWT no válida");
        } catch (MalformedJwtException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Token JWT no válida");
        } catch (ExpiredJwtException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Token JWT caducado");
        } catch (UnsupportedJwtException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Token JWT no compatible");
        } catch (IllegalArgumentException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "La cadena claims JWT está vacía");
        }
    }


}
