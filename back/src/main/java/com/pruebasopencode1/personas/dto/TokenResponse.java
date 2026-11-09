package com.pruebasopencode1.personas.dto;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.time.Duration;
import java.time.Instant;

/**
 * Respuesta del login con el token Bearer de corta duración.
 *
 * <p>El token viaja únicamente al frontend y se guarda en memoria; no se
 * persiste en el navegador ni se incluye en la respuesta de consulta de
 * sesión.</p>
 */
public record TokenResponse(
        String token,
        String tipo,
        Instant expiraEn,
        long segundosRestantes,
        String usuario,
        String rol
) {

    public static TokenResponse de(String token, Instant expiraEn, Authentication autenticacion) {
        String rol = autenticacion.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");
        long segundos = Math.max(0, Duration.between(Instant.now(), expiraEn).toSeconds());
        return new TokenResponse(token, "Bearer", expiraEn, segundos,
                autenticacion.getName(), rol);
    }
}
