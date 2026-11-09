package com.pruebasopencode1.personas.repository;

import com.pruebasopencode1.personas.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de acceso a datos de personas.
 */
@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {

    /**
     * Devuelve todas las personas ordenadas por apellido y nombre para que el
     * listado de la interfaz sea estable.
     */
    List<Persona> findAllByOrderByApellidoAscNombreAsc();
}
