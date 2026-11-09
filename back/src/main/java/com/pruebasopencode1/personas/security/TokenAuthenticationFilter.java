package com.pruebasopencode1.personas.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

/**
 * Lee la cabecera {@code Authorization: Bearer <token>} y, si el token es
 * válido, publica la autenticación en el contexto de seguridad de la petición.
 *
 * <p>La autenticación no se guarda en sesión: el filtro se ejecuta en cada
 * petición y la caducidad del token la decide {@link TokenService}.</p>
 */
@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    /** Atributo de petición con el instante de caducidad del token. */
    public static final String ATRIBUTO_EXPIRA_EN = "pruebasopencode1.token.expiraEn";

    private final TokenService tokenService;

    public TokenAuthenticationFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = TokenService.extraerBearer(request.getHeader(HttpHeaders.AUTHORIZATION));
        if (token != null) {
            tokenService.validar(token).ifPresent(activo -> {
                UsernamePasswordAuthenticationToken autenticacion =
                        new UsernamePasswordAuthenticationToken(
                                activo.usuario(),
                                null,
                                List.of(new SimpleGrantedAuthority(activo.rol())));
                SecurityContext contexto = SecurityContextHolder.createEmptyContext();
                contexto.setAuthentication(autenticacion);
                SecurityContextHolder.setContext(contexto);
                request.setAttribute(ATRIBUTO_EXPIRA_EN, activo.expiraEn());
            });
        }
        filterChain.doFilter(request, response);
    }

    /** Expone la caducidad asociada a la petición actual, si existe. */
    public static Instant expiracion(HttpServletRequest request) {
        return (Instant) request.getAttribute(ATRIBUTO_EXPIRA_EN);
    }
}
