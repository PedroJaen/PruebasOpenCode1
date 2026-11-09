package com.pruebasopencode1.personas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pruebasopencode1.personas.dto.PersonaRequest;
import com.pruebasopencode1.personas.entity.Persona;
import com.pruebasopencode1.personas.entity.Sexo;
import com.pruebasopencode1.personas.repository.PersonaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(username = "demo", roles = "USER")
class PersonaControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PersonaRepository personaRepository;

    @BeforeEach
    void limpiarBaseDeDatos() {
        personaRepository.deleteAll();
    }

    @Test
    void listarDevuelveListaVaciaInicialmente() throws Exception {
        mockMvc.perform(get("/api/v1/personas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void crearDevuelve201ConLocationYLosDatosGuardados() throws Exception {
        PersonaRequest request = new PersonaRequest("Ana", "García", Sexo.FEMENINO,
                "Calle Mayor 1, Madrid", LocalDate.now().minusYears(30));

        mockMvc.perform(post("/api/v1/personas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists(HttpHeaders.LOCATION))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.nombre").value("Ana"))
                .andExpect(jsonPath("$.apellido").value("García"))
                .andExpect(jsonPath("$.edad").value(30))
                .andExpect(jsonPath("$.sexo").value("FEMENINO"))
                .andExpect(jsonPath("$.direccion").value("Calle Mayor 1, Madrid"))
                .andExpect(jsonPath("$.fechaNacimiento").value(LocalDate.now().minusYears(30).toString()))
                .andExpect(jsonPath("$.creadoEn").exists())
                .andExpect(jsonPath("$.actualizadoEn").exists())
                .andExpect(jsonPath("$.creadoPor").value("demo"))
                .andExpect(jsonPath("$.actualizadoPor").value("demo"));

        assertThat(personaRepository.count()).isEqualTo(1);
        Persona creada = personaRepository.findAll().getFirst();
        assertThat(creada.getCreadoEn()).isNotNull();
        assertThat(creada.getActualizadoEn()).isNotNull();
        assertThat(creada.getCreadoPor()).isEqualTo("demo");
        assertThat(creada.getActualizadoPor()).isEqualTo("demo");
    }

    @Test
    void obtenerPorIdDevuelveLaPersona() throws Exception {
        Persona guardada = personaRepository.save(crearPersona("Luis", "Pérez"));

        mockMvc.perform(get("/api/v1/personas/{id}", guardada.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(guardada.getId()))
                .andExpect(jsonPath("$.nombre").value("Luis"))
                .andExpect(jsonPath("$.apellido").value("Pérez"));
    }

    @Test
    void obtenerPorIdInexistenteDevuelve404() throws Exception {
        mockMvc.perform(get("/api/v1/personas/{id}", 999))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.title").value("Recurso no encontrado"))
                .andExpect(jsonPath("$.detail", containsString("999")))
                .andExpect(jsonPath("$.instance").value("/api/v1/personas/999"))
                .andExpect(jsonPath("$.type", containsString("no-encontrado")));
    }

    @Test
    void crearConDatosInvalidosDevuelve400ConValidaciones() throws Exception {
        String cuerpo = """
                {
                  "nombre": "",
                  "apellido": "",
                  "sexo": null,
                  "direccion": "",
                  "fechaNacimiento": "2999-01-01"
                }
                """;

        mockMvc.perform(post("/api/v1/personas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cuerpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.title").value("Datos no válidos"))
                .andExpect(jsonPath("$.validaciones.nombre").value("El nombre es obligatorio"))
                .andExpect(jsonPath("$.validaciones.apellido").value("El apellido es obligatorio"))
                .andExpect(jsonPath("$.validaciones.sexo").value("El sexo es obligatorio"))
                .andExpect(jsonPath("$.validaciones.direccion").value("La dirección es obligatoria"))
                .andExpect(jsonPath("$.validaciones.fechaNacimiento").value("La fecha de nacimiento no puede ser futura"));

        assertThat(personaRepository.count()).isZero();
    }

    @Test
    void crearConSexoInvalidoDevuelve400() throws Exception {
        String cuerpo = """
                {
                  "nombre": "Ana",
                  "apellido": "García",
                  "sexo": "DESCONOCIDO",
                  "direccion": "Calle Mayor 1",
                  "fechaNacimiento": "1995-05-20"
                }
                """;

        mockMvc.perform(post("/api/v1/personas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cuerpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detail", containsString("cuerpo de la petición")));
    }

    @Test
    void actualizarModificaLaPersona() throws Exception {
        Persona guardada = personaRepository.save(crearPersona("Luis", "Pérez"));
        PersonaRequest request = new PersonaRequest("Luis", "Pérez Gómez", Sexo.MASCULINO,
                "Avenida Nueva 22, Toledo", LocalDate.now().minusYears(45));

        mockMvc.perform(put("/api/v1/personas/{id}", guardada.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.apellido").value("Pérez Gómez"))
                .andExpect(jsonPath("$.edad").value(45))
                .andExpect(jsonPath("$.direccion").value("Avenida Nueva 22, Toledo"));

        Persona actualizada = personaRepository.findById(guardada.getId()).orElseThrow();
        assertThat(actualizada.getApellido()).isEqualTo("Pérez Gómez");
        assertThat(actualizada.getFechaNacimiento()).isEqualTo(LocalDate.now().minusYears(45));
        assertThat(actualizada.getActualizadoPor()).isEqualTo("demo");
        assertThat(actualizada.getActualizadoEn()).isNotNull();
    }

    @Test
    void actualizarInexistenteDevuelve404() throws Exception {
        PersonaRequest request = new PersonaRequest("Luis", "Pérez", Sexo.MASCULINO,
                "Avenida Nueva 22", LocalDate.now().minusYears(45));

        mockMvc.perform(put("/api/v1/personas/{id}", 1234)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void eliminarDevuelve204YBorraLaPersona() throws Exception {
        Persona guardada = personaRepository.save(crearPersona("Luis", "Pérez"));

        mockMvc.perform(delete("/api/v1/personas/{id}", guardada.getId()))
                .andExpect(status().isNoContent());

        assertThat(personaRepository.existsById(guardada.getId())).isFalse();
    }

    @Test
    void eliminarInexistenteDevuelve404() throws Exception {
        mockMvc.perform(delete("/api/v1/personas/{id}", 777))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail", containsString("777")));
    }

    @Test
    void resetEliminaLosDatosActualesYReinsertaSoloLosMock() throws Exception {
        personaRepository.save(crearPersona("Persona", "Personalizada"));

        mockMvc.perform(post("/api/v1/personas/reset"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(10)))
                .andExpect(jsonPath("$[0].nombre").exists())
                .andExpect(jsonPath("$[0].creadoPor").value("demo"))
                .andExpect(jsonPath("$[0].creadoEn").exists());

        assertThat(personaRepository.count()).isEqualTo(10);
        assertThat(personaRepository.findAll())
                .noneMatch(persona -> "Persona".equals(persona.getNombre()));
    }

    @Test
    void elPreflightCorsPermiteElOrigenDelFrontend() throws Exception {
        mockMvc.perform(options("/api/v1/personas")
                        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }

    @Test
    void swaggerExponeLaDocumentacionOpenApiYLaInterfaz() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.title").value("PruebasOpenCode1 - API de personas"))
                .andExpect(jsonPath("$.paths['/api/v1/personas']").exists())
                .andExpect(jsonPath("$.paths['/api/v1/personas/{id}']").exists())
                .andExpect(jsonPath("$.paths['/api/v1/personas/reset']").exists())
                .andExpect(jsonPath("$.components.securitySchemes.bearerAuth.type").value("http"))
                .andExpect(jsonPath("$.components.securitySchemes.bearerAuth.scheme").value("bearer"));

        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk());
    }

    @Test
    void unaRutaDesconocidaDevuelve404EnLugarDe500() throws Exception {
        mockMvc.perform(get("/api/v1/ruta-inexistente"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("El recurso solicitado no existe."));
    }

    private Persona crearPersona(String nombre, String apellido) {
        return new Persona(nombre, apellido, Sexo.MASCULINO,
                "Calle de prueba 1", LocalDate.now().minusYears(40));
    }
}
