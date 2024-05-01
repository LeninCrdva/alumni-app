package ec.edu.ista.springgc1.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Data
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    private String fieldName;
    private Object fieldValue;

    public ResourceNotFoundException(String fieldName, Object fieldValue) {
        super(String.format("No se ha encontado registro con %s : '%s'", fieldName, fieldValue));
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}
