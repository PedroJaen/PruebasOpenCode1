package com.pruebasopencode1.personas.exception;

/**
 * Se lanza cuando se solicita una persona que no existe.
 */
public class PersonaNotFoundException extends RuntimeException {

    private final Long id;

    public PersonaNotFoundException(Long id) {
        super("No existe ninguna persona con el identificador " + id + ".");
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
