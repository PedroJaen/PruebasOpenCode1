package com.pruebasopencode1.personas.dto;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.time.Instant;

/**
 * Estado de la sesión autenticada por token. Nunca incluye la contraseña ni
 * el propio token: el token solo se devuelve en el login.
 */
public record SesionResponse(boolean autenticado, String usuario, String rol, Instant expiraEn) {

    /** Estado devuelto cuando no hay ningún token válido. */
    public static SesionResponse anonima() {
        return new SesionResponse(false, null, null, null);
    }

    public static SesionResponse de(Authentication autenticacion, Instant expiraEn) {
        String rol = autenticacion.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");
        return new SesionResponse(true, autenticacion.getName(), rol, expiraEn);
    }
}
