package com.pruebasopencode1.personas.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Emite y valida tokens Bearer opacos de corta duración.
 *
 * <p>PruebasOpenCode1 es una aplicación de demostración local. En lugar de
 * introducir una dependencia JWT, los tokens se generan con
 * {@link SecureRandom} y se guardan en memoria junto con su caducidad. El
 * servidor no crea sesiones HTTP: cada petición se autentica con la cabecera
 * {@code Authorization: Bearer <token>}.</p>
 *
 * <p>Al reiniciar el backend los tokens en memoria se pierden y el frontend
 * vuelve a autenticarse de forma transparente. Esa característica es
 * deliberada y está documentada en {@code docs/SEGURIDAD.md}.</p>
 */
@Service
public class TokenService {

    private static final String PREFIJO_BEARER = "Bearer ";
    private static final SecureRandom ALEATORIO = new SecureRandom();

    private final ConcurrentMap<String, TokenActivo> tokens = new ConcurrentHashMap<>();
    private final Duration vigencia;

    public TokenService(@Value("${app.auth.token-ttl:15m}") Duration vigencia) {
        this.vigencia = vigencia;
    }

    /** Genera un token nuevo para la autenticación indicada. */
    public TokenGenerado generar(Authentication autenticacion) {
        byte[] bytes = new byte[32];
        ALEATORIO.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        Instant expiraEn = Instant.now().plus(vigencia);
        tokens.put(token, new TokenActivo(autenticacion.getName(), rol(autenticacion), expiraEn));
        return new TokenGenerado(token, expiraEn);
    }

    /** Devuelve el token activo o vacío si no existe o ha caducado. */
    public Optional<TokenActivo> validar(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        TokenActivo activo = tokens.get(token);
        if (activo == null) {
            return Optional.empty();
        }
        if (!activo.expiraEn().isAfter(Instant.now())) {
            tokens.remove(token);
            return Optional.empty();
        }
        return Optional.of(activo);
    }

    /** Invalida un token (logout). */
    public void revocar(String token) {
        if (token != null) {
            tokens.remove(token);
        }
    }

    /**
     * Extrae el token de una cabecera {@code Authorization}. Devuelve
     * {@code null} si la cabecera no usa el esquema Bearer.
     */
    public static String extraerBearer(String cabecera) {
        if (cabecera == null || !cabecera.regionMatches(true, 0, PREFIJO_BEARER, 0, PREFIJO_BEARER.length())) {
            return null;
        }
        String token = cabecera.substring(PREFIJO_BEARER.length()).trim();
        return token.isEmpty() ? null : token;
    }

    private static String rol(Authentication autenticacion) {
        return autenticacion.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");
    }

    /** Datos del token recién emitido. */
    public record TokenGenerado(String token, Instant expiraEn) {
    }

    /** Datos asociados a un token válido. */
    public record TokenActivo(String usuario, String rol, Instant expiraEn) {
    }
}
