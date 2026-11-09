package com.pruebasopencode1.personas.controller;

import com.pruebasopencode1.personas.config.OpenApiConfig;
import com.pruebasopencode1.personas.dto.PersonaRequest;
import com.pruebasopencode1.personas.dto.PersonaResponse;
import com.pruebasopencode1.personas.service.PersonaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * API REST de gestión de personas de PruebasOpenCode1.
 */
@RestController
@RequestMapping("/api/v1/personas")
@Tag(name = "Personas", description = "Gestión de personas de PruebasOpenCode1")
@SecurityRequirement(name = OpenApiConfig.ESQUEMA_SEGURIDAD_BEARER)
public class PersonaController {

    private final PersonaService personaService;

    public PersonaController(PersonaService personaService) {
        this.personaService = personaService;
    }

    @GetMapping
    @Operation(summary = "Listar personas", description = "Devuelve todas las personas registradas.")
    public List<PersonaResponse> listar() {
        return personaService.listarTodas();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una persona", description = "Devuelve una persona por su identificador.")
    public PersonaResponse obtener(@PathVariable Long id) {
        return personaService.obtenerPorId(id);
    }

    @PostMapping
    @Operation(summary = "Crear una persona", description = "Crea una persona y devuelve el recurso creado.")
    public ResponseEntity<PersonaResponse> crear(@Valid @RequestBody PersonaRequest request) {
        PersonaResponse creada = personaService.crear(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(creada.id())
                .toUri();
        return ResponseEntity.created(location).body(creada);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una persona", description = "Modifica los datos de una persona existente.")
    public PersonaResponse actualizar(@PathVariable Long id,
                                      @Valid @RequestBody PersonaRequest request) {
        return personaService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar una persona", description = "Elimina una persona por su identificador.")
    public void eliminar(@PathVariable Long id) {
        personaService.eliminar(id);
    }

    /**
     * Elimina los datos actuales y vuelve a insertar los datos mock iniciales.
     */
    @PostMapping("/reset")
    @Operation(summary = "Restablecer datos mock",
            description = "Elimina todas las personas y vuelve a insertar los datos de prueba iniciales.")
    public List<PersonaResponse> restablecer() {
        return personaService.restablecerDatosMock();
    }
}
