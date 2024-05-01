package ec.edu.ista.springgc1.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import ec.edu.ista.springgc1.exception.AppException;
import ec.edu.ista.springgc1.exception.ResourceNotFoundException;
import ec.edu.ista.springgc1.model.dto.GraduadoDTO;
import ec.edu.ista.springgc1.model.dto.TituloDTO;
import ec.edu.ista.springgc1.model.dto.UsuarioDTO;
import ec.edu.ista.springgc1.model.entity.Carrera;
import ec.edu.ista.springgc1.model.entity.Graduado;
import ec.edu.ista.springgc1.model.entity.Persona;
import ec.edu.ista.springgc1.model.entity.Rol;
import ec.edu.ista.springgc1.model.entity.Titulo;
import ec.edu.ista.springgc1.model.entity.Usuario;
import ec.edu.ista.springgc1.repository.CarreraRepository;
import ec.edu.ista.springgc1.repository.GraduadoRepository;
import ec.edu.ista.springgc1.repository.TituloRepository;
import ec.edu.ista.springgc1.repository.UsuarioRepository;
import ec.edu.ista.springgc1.service.generic.impl.GenericServiceImpl;
import ec.edu.ista.springgc1.service.map.Mapper;

@Service
public class TituloServiceImpl extends GenericServiceImpl<Titulo> implements Mapper<Titulo, TituloDTO> {

    private boolean includeGraduadoInfo = false;

    @Autowired
    private GraduadoRepository graduadoRepository;

    @Autowired
    private TituloRepository titulorepository;

    @Autowired
    private CarreraRepository carrerarepository;

    @Override
    public Titulo mapToEntity(TituloDTO d) {
        Titulo t = new Titulo();
    	Graduado graduado = graduadoRepository.findByUsuarioPersonaCedulaContaining(d.getCedula())
				.orElseThrow(() -> new ResourceNotFoundException("cedula", t.getGraduado()));
        Carrera c = carrerarepository.findByNombre(d.getNombreCarrera())
                .orElseThrow(() -> new ResourceNotFoundException("carrera:", d.getNombreCarrera()));
        t.setFechaEmision(d.getFechaEmision());
        t.setFechaRegistro(d.getFechaRegistro());
        t.setInstitucion(d.getInstitucion());
        t.setNivel(d.getNivel());
        t.setNombreTitulo(d.getNombreTitulo());
        t.setTipo(d.getTipo());
        t.setNumRegistro(d.getNumRegistro());
        t.setCarrera(c);
        t.setGraduado(graduado);

        return t;
    }

    @Override
    public TituloDTO mapToDTO(Titulo e) {
        TituloDTO d = new TituloDTO();
        d.setId(e.getId());
        d.setCedula(e.getGraduado().getUsuario().getPersona().getCedula());

        d.setFechaEmision(e.getFechaEmision());
        d.setFechaRegistro(e.getFechaRegistro());
        d.setInstitucion(e.getInstitucion());
        d.setNivel(e.getNivel());
        d.setNombreTitulo(e.getNombreTitulo());
        d.setNombreCarrera(e.getCarrera().getNombre());
        d.setNumRegistro(e.getNumRegistro());
        d.setTipo(e.getTipo());
        return d;
    }

    @Override
    public List<TituloDTO> findAll() {
        includeGraduadoInfo = true;
        List<TituloDTO> titulosDTO = titulorepository.findAll()
                .stream()
                .map(titulo -> mapToDTO(titulo))
                .collect(Collectors.toList());

        return titulosDTO;
    }

    public TituloDTO findByIdToDTO(Long id) {
        Titulo t = titulorepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("id", id));

        return mapToDTO(t);
    }

    public Titulo update(long id, TituloDTO e) {
        Titulo tituloFromDb = titulorepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("id", id));

        Graduado graduado = graduadoRepository.findByUsuarioPersonaCedulaContaining(e.getCedula())
				.orElseThrow(() -> new ResourceNotFoundException("cedula",tituloFromDb.getGraduado()));
        Carrera carrera = carrerarepository.findByNombre(e.getNombreCarrera())
                .orElseThrow(() -> new ResourceNotFoundException("carrera:", e.getNombreCarrera()));

        tituloFromDb.setGraduado(graduado);
        tituloFromDb.setCarrera(carrera);
        tituloFromDb.setFechaEmision(e.getFechaEmision());
        tituloFromDb.setFechaRegistro(e.getFechaRegistro());
        tituloFromDb.setInstitucion(e.getInstitucion());
        tituloFromDb.setNivel(e.getNivel());
        tituloFromDb.setNombreTitulo(e.getNombreTitulo());
        tituloFromDb.setNumRegistro(e.getNumRegistro());
        tituloFromDb.setTipo(e.getTipo());

        return titulorepository.save(tituloFromDb);
    }

    @Override
    public Titulo save(Object entity) {
        includeGraduadoInfo = false;
        return titulorepository.save(mapToEntity((TituloDTO) entity));
    }

    public Long counttitulo() {
        return titulorepository.count();
    }
    
    public Map<Persona.Sex, Integer> contarGraduadosPorSexo(String nombreCarrera) {
        List<Graduado> graduados = titulorepository.findAllGraduadosByNombreCarrera(nombreCarrera);

        Map<Persona.Sex, Integer> conteoPorSexo = new HashMap<>();
        conteoPorSexo.put(Persona.Sex.MASCULINO, 0);
        conteoPorSexo.put(Persona.Sex.FEMENINO, 0);
        conteoPorSexo.put(Persona.Sex.OTRO, 0);

        for (Graduado graduado : graduados) {
            Persona.Sex sexo = graduado.getUsuario().getPersona().getSexo();
            if (conteoPorSexo.containsKey(sexo)) {
                conteoPorSexo.put(sexo, conteoPorSexo.get(sexo) + 1);
            }
        }

        return conteoPorSexo;
    }
    
    public Map<String, Map<Persona.Sex, Long>> contarGraduadosPorSexoPorCarrera() {
        List<Object[]> results = titulorepository.contarGraduadosPorSexoPorCarrera();
        Map<String, Map<Persona.Sex, Long>> conteoPorCarrera = new HashMap<>();
        for (Object[] result : results) {
            String nombreCarrera = (String) result[0];
            Persona.Sex sexo = (Persona.Sex) result[1];
            Long cantidad = (Long) result[2];
            conteoPorCarrera.putIfAbsent(nombreCarrera, new HashMap<>());
            Map<Persona.Sex, Long> conteoPorSexo = conteoPorCarrera.get(nombreCarrera);
            conteoPorSexo.put(sexo, conteoPorSexo.getOrDefault(sexo, 0L) + cantidad);
        }

        return conteoPorCarrera;
    }

    public List<Object[]> findGraduadosByCarreraTitulo() {
        return titulorepository.findGraduadosByCarreraTitulo();
    }
}
