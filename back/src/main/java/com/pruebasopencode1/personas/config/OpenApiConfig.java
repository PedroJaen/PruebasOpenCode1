package com.pruebasopencode1.personas.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de la documentación OpenAPI expuesta por springdoc.
 *
 * <p>Swagger UI queda disponible en {@code /swagger-ui/index.html} y el
 * documento OpenAPI en {@code /v3/api-docs}. El esquema de seguridad
 * {@code bearerAuth} representa el token de corta duración que emite
 * {@code POST /api/v1/auth/login}.</p>
 */
@Configuration
public class OpenApiConfig {

    public static final String ESQUEMA_SEGURIDAD_BEARER = "bearerAuth";

    @Bean
    public OpenAPI pruebasOpenCode1OpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PruebasOpenCode1 - API de personas")
                        .description("""
                                API REST v1 para la gestión de personas del proyecto PruebasOpenCode1.
                                Permite listar, consultar, crear, actualizar, eliminar y restablecer
                                los datos de prueba iniciales. Salvo los endpoints de autenticación,
                                todas las operaciones requieren un token Bearer emitido por
                                POST /api/v1/auth/login; el frontend lo obtiene mediante un autologin
                                transparente y lo renueva cuando caduca.""")
                        .version("1.0.0"))
                .components(new Components()
                        .addSecuritySchemes(ESQUEMA_SEGURIDAD_BEARER,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("opaque")
                                        .description("Token de acceso de corta duración emitido por "
                                                + "POST /api/v1/auth/login")));
    }
}
