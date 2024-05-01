package ec.edu.ista.springgc1.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class AppException extends RuntimeException{

    private HttpStatus status;
    private String message;
}
