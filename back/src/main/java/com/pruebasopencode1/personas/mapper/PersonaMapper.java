package com.pruebasopencode1.personas.mapper;

import com.pruebasopencode1.personas.dto.PersonaRequest;
import com.pruebasopencode1.personas.dto.PersonaResponse;
import com.pruebasopencode1.personas.entity.Persona;

import java.time.LocalDate;
import java.time.Period;

/**
 * Conversión entre la entidad JPA y los DTO de la API.
 */
public final class PersonaMapper {

    private PersonaMapper() {
    }

    public static Persona toEntity(PersonaRequest request) {
        return new Persona(
                limpiar(request.nombre()),
                limpiar(request.apellido()),
                request.sexo(),
                limpiar(request.direccion()),
                request.fechaNacimiento()
        );
    }

    public static void updateEntity(Persona persona, PersonaRequest request) {
        persona.setNombre(limpiar(request.nombre()));
        persona.setApellido(limpiar(request.apellido()));
        persona.setSexo(request.sexo());
        persona.setDireccion(limpiar(request.direccion()));
        persona.setFechaNacimiento(request.fechaNacimiento());
    }

    public static PersonaResponse toResponse(Persona persona) {
        return new PersonaResponse(
                persona.getId(),
                persona.getNombre(),
                persona.getApellido(),
                calcularEdad(persona.getFechaNacimiento()),
                persona.getSexo(),
                persona.getDireccion(),
                persona.getFechaNacimiento(),
                persona.getCreadoEn(),
                persona.getActualizadoEn(),
                persona.getCreadoPor(),
                persona.getActualizadoPor()
        );
    }

    /**
     * Calcula la edad a partir de la fecha de nacimiento y la fecha actual.
     * No se almacena en la base de datos.
     */
    public static int calcularEdad(LocalDate fechaNacimiento) {
        return Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }

    private static String limpiar(String valor) {
        return valor == null ? null : valor.trim();
    }
}
