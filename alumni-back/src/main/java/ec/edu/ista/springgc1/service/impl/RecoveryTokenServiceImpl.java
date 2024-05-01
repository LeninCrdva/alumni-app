package ec.edu.ista.springgc1.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.mail.config.RecoveryPasswordToken;
import ec.edu.ista.springgc1.model.entity.RecoveryToken;
import ec.edu.ista.springgc1.repository.RecoveryTokenRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;

@Service
public class RecoveryTokenServiceImpl extends GenericServiceImpl<RecoveryToken>{
	
	@Autowired
	private RecoveryTokenRepository tokenRepository;
	
	@Override
	public RecoveryToken save(Object entity) {
		return tokenRepository.save((RecoveryToken) entity);
	}
	
	public RecoveryToken findByToken(String token) {
        return tokenRepository.findByToken(token)
				.orElse(new RecoveryToken());
	}

	public List<RecoveryToken> findByUsuarioId(Long idUsuario) {
        return tokenRepository.findByUsuarioId(idUsuario);
	}
}
