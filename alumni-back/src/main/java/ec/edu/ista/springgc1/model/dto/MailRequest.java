package ec.edu.ista.springgc1.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class MailRequest {
	
	private String name;

	private String to;

	private String from;

	private String subject;

	private String caseEmail;

	public MailRequest(String from, String subject, String caseEmail) {
		this.from = from;
		this.subject = subject;
		this.caseEmail = caseEmail;
	}

	public MailRequest(String to, String from, String subject, String caseEmail) {
		this.to = to;
		this.from = from;
		this.subject = subject;
		this.caseEmail = caseEmail;
	}
}
