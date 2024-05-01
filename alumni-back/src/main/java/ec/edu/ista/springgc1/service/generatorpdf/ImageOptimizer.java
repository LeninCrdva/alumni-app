package ec.edu.ista.springgc1.service.generatorpdf;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class ImageOptimizer {

    public byte[] convertBase64ToBytes(String base64) {
        try {
            base64 = base64.substring(base64.indexOf(",") + 1);

            return Base64.getDecoder().decode(base64);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public String convertImageToBase64(byte[] imageBytes) {
        return Base64.getEncoder().encodeToString(imageBytes);
    }
}
