package com.pruebasopencode1.personas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * Activa la auditoría JPA de PruebasOpenCode1.
 *
 * <p>Las fechas de creación y modificación se rellenan automáticamente. El
 * usuario se toma del contexto de Spring Security; si no hay una petición
 * autenticada (por ejemplo, durante la siembra inicial de datos) se registra
 * {@code sistema}.</p>
 */
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class AuditoriaConfig {

    public static final String USUARIO_SISTEMA = "sistema";

    @Bean
    public AuditorAware<String> auditorAware() {
        return () -> {
            Authentication autenticacion = SecurityContextHolder.getContext().getAuthentication();
            if (autenticacion == null
                    || !autenticacion.isAuthenticated()
                    || autenticacion instanceof AnonymousAuthenticationToken) {
                return Optional.of(USUARIO_SISTEMA);
            }
            return Optional.of(autenticacion.getName());
        };
    }
}
