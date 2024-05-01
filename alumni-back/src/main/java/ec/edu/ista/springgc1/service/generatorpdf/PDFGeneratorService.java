package ec.edu.ista.springgc1.service.generatorpdf;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.pdf.PdfWriter;
import ec.edu.ista.springgc1.exception.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

@Service
public class PDFGeneratorService {

    private static final String TEMPLATE_PATH = "curriculum/cv-graduate.html";

    private static final String GRADUATE_TEMPLATE_PATH = "curriculum/email-list-postulants.html";

    @Autowired
    private ITemplateEngine templateEngine;

    public byte[] generatePDF(Map<String, Object> data) throws AppException, IOException {
        Context context = new Context();
        context.setVariables(data);

        return getBytes(context, TEMPLATE_PATH);
    }

    public byte[] generatePDFOfLisMap(Map<Long, Map<String, Object>> graduatesInfo) throws AppException, IOException {
        Context context = new Context();
        context.setVariable("graduates", graduatesInfo);

        return getBytes(context, GRADUATE_TEMPLATE_PATH);
    }

    private byte[] getBytes(Context context, String graduateTemplatePath) throws IOException {
        String processedHtml = templateEngine.process(graduateTemplatePath, context);

        ByteArrayOutputStream outputStream = null;
        PdfWriter writer = null;
        try {
            outputStream = new ByteArrayOutputStream();
            writer = new PdfWriter(outputStream);
            ConverterProperties properties = new ConverterProperties();
            HtmlConverter.convertToPdf(processedHtml, writer, properties);
        } finally {
            if (writer != null) {
                writer.close();
            }
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException ignored) {
                }
            }
        }

        return outputStream.toByteArray();
    }
}