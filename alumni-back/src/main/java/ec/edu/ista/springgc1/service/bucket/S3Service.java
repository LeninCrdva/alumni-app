package ec.edu.ista.springgc1.service.bucket;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import ec.edu.ista.springgc1.model.vm.Asset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    @Value("${cloud.aws.s3.bucket}")
    private String BUCKET;

    @Autowired
    private AmazonS3 s3Client; //cliente de conexión con nuestro bucket

    //Enviar Objeto al Bucket
    public String putObject(MultipartFile multipartFile) {
        /*
         * 🧧
         * 1. Obtenemos la extensión del archivo
         * 2. Llave de acceso al objeto almacenado en el bucket
         * 3. Obtenemos la metadata de nuestro archivo
         * 4. Indicamos el tipo de archivo al extraerlo de nuestro archivo
         * */
        String extension = StringUtils.getFilenameExtension(multipartFile.getOriginalFilename());
        String key = String.format("%s.%s", UUID.randomUUID(), extension);

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(multipartFile.getContentType());

        /*
         * 5. Enviamos el objeto a S3 mediante InputStream
         * */
        try {
            PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET, key, multipartFile.getInputStream(), objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead);
            s3Client.putObject(putObjectRequest);
            return key;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    //Obtener objecto desde el bucket
    public Asset getObject(String key) {
        /*
         *
         * 1. Traemos el objeto del bucket
         * 2. Obtenemos la metadata de dicho objeto
         * 3. Lo deserealizamos mediante un InputStream
         * 4. Almacenamos los bytes que contiene
         * 5. Enviamos a un objeto el contenito en bytes y el tipo de contenido
         * */
        S3Object s3Object = s3Client.getObject(BUCKET, key);
        ObjectMetadata metadata = s3Object.getObjectMetadata();

        try {
            S3ObjectInputStream inputStream = s3Object.getObjectContent();
            byte[] bytes = IOUtils.toByteArray(inputStream);
            return new Asset(bytes, metadata.getContentType());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // Eliminar un objeto
    public void deleteObject(String key) {
        s3Client.deleteObject(BUCKET, key);
    }

    // URL para los objetos de manera pública
    public String getObjectUrl(String key) {
        return String.format("https://%s.s3.amazonaws.com/%s", BUCKET, key);
    }
}
