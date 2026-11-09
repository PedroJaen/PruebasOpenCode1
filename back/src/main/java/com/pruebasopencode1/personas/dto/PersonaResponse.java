package com.pruebasopencode1.personas.dto;

import com.pruebasopencode1.personas.entity.Sexo;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Representación de una persona devuelta por la API.
 *
 * <p>La edad se calcula desde la fecha de nacimiento y no se almacena. Los
 * cuatro últimos campos son la auditoría básica de la entidad.</p>
 */
public record PersonaResponse(
        Long id,
        String nombre,
        String apellido,
        Integer edad,
        Sexo sexo,
        String direccion,
        LocalDate fechaNacimiento,
        Instant creadoEn,
        Instant actualizadoEn,
        String creadoPor,
        String actualizadoPor
) {
}
