package com.pruebasopencode1.personas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pruebasopencode1.personas.entity.Usuario;
import com.pruebasopencode1.personas.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifica el autologin real con tokens Bearer de corta duración, las
 * credenciales de la base de datos y la protección de la API de personas.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    private static final String USUARIO = "demo";
    private static final String CONTRASENA = "demo1234";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void sinTokenLaApiDePersonasDevuelve401ProblemDetail() throws Exception {
        mockMvc.perform(get("/api/v1/personas"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.title").value("No autenticado"))
                .andExpect(jsonPath("$.detail", containsString("iniciar sesión")))
                .andExpect(jsonPath("$.instance").value("/api/v1/personas"))
                .andExpect(jsonPath("$.type", containsString("no-autenticado")));
    }

    @Test
    void loginValidoEmiteUnTokenBearerConExpiracion() throws Exception {
        TokenApi token = loginValido();

        assertThat(token.token()).isNotBlank();
        assertThat(token.tipo()).isEqualTo("Bearer");
        assertThat(token.usuario()).isEqualTo(USUARIO);
        assertThat(token.rol()).isEqualTo("ROLE_USER");
        assertThat(token.expiraEn()).isNotNull();
        assertThat(token.segundosRestantes()).isGreaterThan(0);
    }

    @Test
    void elTokenValidoPermiteAccederALaApiDePersonas() throws Exception {
        TokenApi token = loginValido();

        mockMvc.perform(get("/api/v1/personas")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void loginConCredencialesInvalidasDevuelve401ProblemDetail() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"usuario": "demo", "contrasena": "incorrecta"}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.title").value("Credenciales incorrectas"))
                .andExpect(jsonPath("$.detail").value("Usuario o contraseña incorrectos."))
                .andExpect(jsonPath("$.instance").value("/api/v1/auth/login"));
    }

    @Test
    void unTokenInvalidoDevuelve401() throws Exception {
        mockMvc.perform(get("/api/v1/personas")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer token-que-no-existe"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void laContrasenaSeGuardaCifradaEnLaBaseDeDatos() {
        Usuario usuario = usuarioRepository.findByUsername(USUARIO).orElseThrow();

        assertThat(usuario.getPassword())
                .isNotEqualTo(CONTRASENA)
                .startsWith("$2")
                .hasSize(60);
        assertThat(passwordEncoder.matches(CONTRASENA, usuario.getPassword())).isTrue();
    }

    @Test
    void logoutRevocaElToken() throws Exception {
        TokenApi token = loginValido();

        mockMvc.perform(post("/api/v1/auth/logout")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token.token()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/personas")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token.token()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void consultarSesionConTokenDevuelveUsuarioRolYExpiracion() throws Exception {
        TokenApi token = loginValido();

        mockMvc.perform(get("/api/v1/auth/sesion")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.autenticado").value(true))
                .andExpect(jsonPath("$.usuario").value(USUARIO))
                .andExpect(jsonPath("$.rol").value("ROLE_USER"))
                .andExpect(jsonPath("$.expiraEn").exists());
    }

    @Test
    void consultarSesionSinTokenDevuelveEstadoAnonimo() throws Exception {
        mockMvc.perform(get("/api/v1/auth/sesion"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.autenticado").value(false))
                .andExpect(jsonPath("$.usuario").value(nullValue()));
    }

    /** Realiza el login con las credenciales fijas y devuelve el token emitido. */
    private TokenApi loginValido() throws Exception {
        MvcResult resultado = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new Credenciales(USUARIO, CONTRASENA))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuario").value(USUARIO))
                .andExpect(jsonPath("$.rol").value("ROLE_USER"))
                .andExpect(jsonPath("$.segundosRestantes", greaterThan(0)))
                .andReturn();

        return objectMapper.readValue(resultado.getResponse().getContentAsString(), TokenApi.class);
    }

    /** Cuerpo JSON de credenciales para las pruebas. */
    private record Credenciales(String usuario, String contrasena) {
    }

    /** Respuesta del login usada por las pruebas. */
    private record TokenApi(String token, String tipo, String expiraEn,
                            long segundosRestantes, String usuario, String rol) {
    }
}
