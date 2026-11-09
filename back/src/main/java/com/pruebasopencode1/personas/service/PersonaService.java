package com.pruebasopencode1.personas.service;

import com.pruebasopencode1.personas.dto.PersonaRequest;
import com.pruebasopencode1.personas.dto.PersonaResponse;

import java.util.List;

/**
 * Operaciones de negocio sobre personas.
 */
public interface PersonaService {

    List<PersonaResponse> listarTodas();

    PersonaResponse obtenerPorId(Long id);

    PersonaResponse crear(PersonaRequest request);

    PersonaResponse actualizar(Long id, PersonaRequest request);

    void eliminar(Long id);

    /**
     * Elimina todas las personas y vuelve a insertar exclusivamente los datos
     * mock iniciales.
     */
    List<PersonaResponse> restablecerDatosMock();
}
