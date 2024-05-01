package ec.edu.ista.springgc1.model.dto;

import lombok.Data;

@Data
public class RecoveryDTO {

	private String token;

	private String newPassword;
}
