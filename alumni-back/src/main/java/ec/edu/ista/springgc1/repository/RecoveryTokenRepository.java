package ec.edu.ista.springgc1.repository;

import ec.edu.ista.springgc1.model.entity.RecoveryToken;
import ec.edu.ista.springgc1.repository.generic.GenericRepository;

import java.util.List;
import java.util.Optional;

public interface RecoveryTokenRepository extends GenericRepository<RecoveryToken>{
	Optional<RecoveryToken> findByToken(String token);

	List<RecoveryToken> findByUsuarioId(Long idUsuario);
}
