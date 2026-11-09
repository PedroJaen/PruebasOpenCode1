package com.pruebasopencode1.personas.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pruebasopencode1.personas.security.TokenAuthenticationFilter;
import com.pruebasopencode1.personas.service.UsuarioDetailsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;

/**
 * Seguridad de PruebasOpenCode1 basada en tokens Bearer de corta duración.
 *
 * <p>El frontend realiza un autologin transparente contra
 * {@code POST /api/v1/auth/login}; el backend valida la contraseña cifrada y
 * emite un token opaco. Cada petición a la API viaja con
 * {@code Authorization: Bearer <token>}, sin sesión HTTP ni cookie. Al
 * caducar el token, el frontend lo renueva de forma transparente.</p>
 *
 * <p>La API es consumida por una SPA mediante peticiones JSON y CORS
 * restringido. Se desactiva CSRF porque no se usan cookies de autenticación:
 * un token Bearer no se envía automáticamente por el navegador. Esta decisión
 * está documentada en {@code docs/SEGURIDAD.md}.</p>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String BASE_TIPOS_ERROR = "https://pruebasopencode1.example/errors/";

    private static final String MENSAJE_NO_AUTENTICADO =
            "Debes iniciar sesión para acceder a este recurso.";
    private static final String MENSAJE_PROHIBIDO =
            "No tienes permisos para realizar esta operación.";

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UsuarioDetailsService usuarioDetailsService,
                                                              PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider proveedor = new DaoAuthenticationProvider(usuarioDetailsService);
        proveedor.setPasswordEncoder(passwordEncoder);
        return proveedor;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuracion)
            throws Exception {
        return configuracion.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   ObjectMapper objectMapper,
                                                   TokenAuthenticationFilter tokenAuthenticationFilter)
            throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(autorizacion -> autorizacion
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/actuator/health",
                                "/actuator/health/**",
                                "/actuator/info",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/h2-console/**",
                                "/error")
                        .permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .exceptionHandling(excepciones -> excepciones
                        .authenticationEntryPoint((request, response, excepcion) ->
                                escribirProblema(response, objectMapper, request,
                                        HttpStatus.UNAUTHORIZED, "No autenticado",
                                        MENSAJE_NO_AUTENTICADO, "no-autenticado"))
                        .accessDeniedHandler((request, response, excepcion) ->
                                escribirProblema(response, objectMapper, request,
                                        HttpStatus.FORBIDDEN, "Acceso denegado",
                                        MENSAJE_PROHIBIDO, "acceso-denegado")))
                .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable);

        return http.build();
    }

    private void escribirProblema(HttpServletResponse response, ObjectMapper objectMapper,
                                  HttpServletRequest request, HttpStatus estado,
                                  String titulo, String detalle, String tipo)
            throws IOException {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(estado, detalle);
        problema.setTitle(titulo);
        problema.setType(URI.create(BASE_TIPOS_ERROR + tipo));
        problema.setInstance(URI.create(request.getRequestURI()));

        response.setStatus(estado.value());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), problema);
    }
}
