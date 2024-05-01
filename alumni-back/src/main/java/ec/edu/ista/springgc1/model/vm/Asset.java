package ec.edu.ista.springgc1.model.vm;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Asset {
    private byte[] content;
    private String contentType;
}
