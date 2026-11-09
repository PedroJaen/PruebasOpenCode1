package com.pruebasopencode1.personas.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Credenciales enviadas por el autologin del frontend.
 */
public record LoginRequest(

        @NotBlank(message = "El usuario es obligatorio")
        String usuario,

        @NotBlank(message = "La contraseña es obligatoria")
        String contrasena
) {
}
