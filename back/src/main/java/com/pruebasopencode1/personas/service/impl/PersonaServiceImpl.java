package com.pruebasopencode1.personas.service.impl;

import com.pruebasopencode1.personas.dto.PersonaRequest;
import com.pruebasopencode1.personas.dto.PersonaResponse;
import com.pruebasopencode1.personas.entity.Persona;
import com.pruebasopencode1.personas.exception.PersonaNotFoundException;
import com.pruebasopencode1.personas.mapper.PersonaMapper;
import com.pruebasopencode1.personas.repository.PersonaRepository;
import com.pruebasopencode1.personas.service.MockDataFactory;
import com.pruebasopencode1.personas.service.PersonaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementación de la lógica de negocio de personas.
 */
@Service
@Transactional(readOnly = true)
public class PersonaServiceImpl implements PersonaService {

    private final PersonaRepository personaRepository;
    private final MockDataFactory mockDataFactory;

    public PersonaServiceImpl(PersonaRepository personaRepository, MockDataFactory mockDataFactory) {
        this.personaRepository = personaRepository;
        this.mockDataFactory = mockDataFactory;
    }

    @Override
    public List<PersonaResponse> listarTodas() {
        return personaRepository.findAllByOrderByApellidoAscNombreAsc()
                .stream()
                .map(PersonaMapper::toResponse)
                .toList();
    }

    @Override
    public PersonaResponse obtenerPorId(Long id) {
        return PersonaMapper.toResponse(buscarPersona(id));
    }

    @Override
    @Transactional
    public PersonaResponse crear(PersonaRequest request) {
        Persona persona = PersonaMapper.toEntity(request);
        return PersonaMapper.toResponse(personaRepository.save(persona));
    }

    @Override
    @Transactional
    public PersonaResponse actualizar(Long id, PersonaRequest request) {
        Persona persona = buscarPersona(id);
        PersonaMapper.updateEntity(persona, request);
        return PersonaMapper.toResponse(personaRepository.save(persona));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        personaRepository.delete(buscarPersona(id));
    }

    @Override
    @Transactional
    public List<PersonaResponse> restablecerDatosMock() {
        personaRepository.deleteAllInBatch();
        personaRepository.saveAll(mockDataFactory.crearPersonasMock());
        personaRepository.flush();
        return listarTodas();
    }

    private Persona buscarPersona(Long id) {
        return personaRepository.findById(id)
                .orElseThrow(() -> new PersonaNotFoundException(id));
    }
}
