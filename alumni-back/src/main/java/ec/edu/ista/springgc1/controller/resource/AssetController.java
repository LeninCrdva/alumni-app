package ec.edu.ista.springgc1.controller.resource;

import ec.edu.ista.springgc1.model.vm.Asset;
import ec.edu.ista.springgc1.service.bucket.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PreFilter;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/assets")
public class AssetController {

    @Autowired
    private S3Service s3Service;

    @PreAuthorize("isAnonymous() or isAuthenticated()")
    @Operation(summary = "Subir archivo")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    Map<String, String> upload(@RequestParam MultipartFile multipartFile) {

        String key = s3Service.putObject(multipartFile);

        Map<String, String> result = new HashMap<>();
        result.put("key", key);
        result.put("url", s3Service.getObjectUrl(key));
        return result;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value = "/get-object", params = "key")
    ResponseEntity<ByteArrayResource> getObject(@RequestParam String key) {
        Asset asset = s3Service.getObject(key);
        ByteArrayResource resource = new ByteArrayResource(asset.getContent());
        return ResponseEntity
                .ok()
                .header("Content-Type", asset.getContentType())
                .contentLength(asset.getContent().length)
                .body(resource);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping(value = "/delete-object", params = "key")
    ResponseEntity<?> deleteObject(@RequestParam String key) {
        s3Service.deleteObject(key);
        return ResponseEntity.noContent().build();
    }

}
