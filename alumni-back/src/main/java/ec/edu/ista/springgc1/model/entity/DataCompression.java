package ec.edu.ista.springgc1.model.entity;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.*;

public class DataCompression {


    /**
     * Comprime los datos utilizando GZIP.
     *
     * @param data       Los datos a comprimir.
     * @param targetSize El tamaño deseado después de la compresión.
     * @return Los datos comprimidos.
     * @throws IOException Si ocurre un error durante la compresión.
     */
    public byte[] compress(byte[] data, int targetSize) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
             GZIPOutputStream gzipOutputStream = new GZIPOutputStream(outputStream)) {
            gzipOutputStream.write(data);
            gzipOutputStream.finish();
            byte[] compressedData = outputStream.toByteArray();
            System.out.println("Tamaño original de la foto: " + data.length + " bytes");
            System.out.println("Tamaño de la foto comprimida: " + compressedData.length + " bytes");

            if (Math.abs(compressedData.length - targetSize) <= 100) {
                System.out.println("Comprimido a aproximadamente " + targetSize + " bytes.");
            } else {
                System.out.println("No se pudo comprimir hasta alcanzar aproximadamente " + targetSize + " bytes");
            }

            byte[] decompressedData = decompress(compressedData); // Descomprimir los datos comprimidos
            System.out.println("Tamaño de la foto descomprimida: " + decompressedData.length + " bytes");

            return compressedData;
        }
    }

    /**
     * Descomprime los datos utilizando GZIP.
     *
     * @param data Los datos comprimidos.
     * @return Los datos descomprimidos.
     * @throws IOException Si ocurre un error durante la descompresión.
     */
    public byte[] decompress(byte[] data) throws IOException {
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(data);
             GZIPInputStream gzipInputStream = new GZIPInputStream(inputStream);
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[1024];
            int len;
            while ((len = gzipInputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, len);
            }
            return outputStream.toByteArray();
        }
    }

    public static byte[] compressFile(byte[] data) {
        Deflater deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4*1024];
        while (!deflater.finished()) {
            int size = deflater.deflate(tmp);
            outputStream.write(tmp, 0, size);
        }
        try {
            outputStream.close();
        } catch (Exception ignored) {
        }
        return outputStream.toByteArray();
    }



    public static byte[] decompressFile(byte[] data) {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4*1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(tmp);
                outputStream.write(tmp, 0, count);
            }
            outputStream.close();
        } catch (Exception ignored) {
        }
        return outputStream.toByteArray();
    }

    // Steve: PROBARLE CON ESTOS METODOS A VER SI ASI YA SE GUARDA CUALQUIER ARCHIVO EN BYTES SIN SUFRIR ALGUN CAMBIO.
    public static byte[] compressXML(byte[] data) throws IOException {
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        deflater.finish();
        byte[] buffer = new byte[1024];
        while (!deflater.finished()) {
            int count = deflater.deflate(buffer); // returns the generated code... index
            outputStream.write(buffer, 0, count);
        }
        outputStream.close();
        byte[] output = outputStream.toByteArray();
        return output;
    }

    public static byte[] decompressXML(byte[] data) throws IOException, DataFormatException {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        while (!inflater.finished()) {
            int count = inflater.inflate(buffer);
            outputStream.write(buffer, 0, count);
        }
        outputStream.close();
        byte[] output = outputStream.toByteArray();
        return output;
    }
 
}
