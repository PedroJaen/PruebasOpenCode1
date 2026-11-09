package com.pruebasopencode1.personas.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Traduce las excepciones de la aplicación a respuestas RFC 9457
 * ({@code application/problem+json}) con {@code type}, {@code title},
 * {@code status}, {@code detail} e {@code instance}.
 *
 * <p>Los errores de validación añaden la propiedad {@code validaciones} con un
 * mensaje por campo, que el frontend usa para señalar los campos del
 * formulario.</p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String BASE_TIPOS_ERROR = "https://pruebasopencode1.example/errors/";

    @ExceptionHandler(PersonaNotFoundException.class)
    public ResponseEntity<ProblemDetail> manejarNoEncontrada(PersonaNotFoundException ex,
                                                             HttpServletRequest request) {
        return responder(problema(HttpStatus.NOT_FOUND, "Recurso no encontrado",
                ex.getMessage(), request, "no-encontrado", null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> manejarValidacion(MethodArgumentNotValidException ex,
                                                           HttpServletRequest request) {
        Map<String, String> validaciones = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            validaciones.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return responder(problema(HttpStatus.BAD_REQUEST, "Datos no válidos",
                "Los datos enviados no son válidos. Revise los campos indicados.",
                request, "validacion", validaciones));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ProblemDetail> manejarRestricciones(ConstraintViolationException ex,
                                                             HttpServletRequest request) {
        Map<String, String> validaciones = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(violation ->
                validaciones.put(violation.getPropertyPath().toString(), violation.getMessage()));
        return responder(problema(HttpStatus.BAD_REQUEST, "Datos no válidos",
                "Los datos enviados no son válidos. Revise los campos indicados.",
                request, "validacion", validaciones));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ProblemDetail> manejarCuerpoIlegible(HttpMessageNotReadableException ex,
                                                               HttpServletRequest request) {
        return responder(problema(HttpStatus.BAD_REQUEST, "Petición no válida",
                "El cuerpo de la petición no es válido. Compruebe el formato de los datos "
                        + "(por ejemplo, el sexo y la fecha).",
                request, "cuerpo-ilegible", null));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ProblemDetail> manejarIntegridad(DataIntegrityViolationException ex,
                                                           HttpServletRequest request) {
        log.warn("Conflicto de integridad de datos: {}", ex.getMostSpecificCause().getMessage());
        return responder(problema(HttpStatus.CONFLICT, "Conflicto de datos",
                "La operación entra en conflicto con los datos existentes.",
                request, "conflicto", null));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ProblemDetail> manejarAutenticacion(AuthenticationException ex,
                                                              HttpServletRequest request) {
        // No se revela si el fallo ha sido por usuario inexistente o por contraseña.
        return responder(problema(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas",
                "Usuario o contraseña incorrectos.",
                request, "credenciales", null));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ProblemDetail> manejarRecursoNoEncontrado(NoResourceFoundException ex,
                                                                    HttpServletRequest request) {
        return responder(problema(HttpStatus.NOT_FOUND, "Recurso no encontrado",
                "El recurso solicitado no existe.",
                request, "no-encontrado", null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> manejarErrorInesperado(Exception ex, HttpServletRequest request) {
        log.error("Error no controlado en la API", ex);
        return responder(problema(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno",
                "Se ha producido un error interno. Inténtelo de nuevo más tarde.",
                request, "error-interno", null));
    }

    private ProblemDetail problema(HttpStatus estado, String titulo, String detalle,
                                   HttpServletRequest request, String tipo,
                                   Map<String, String> validaciones) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(estado, detalle);
        problema.setTitle(titulo);
        problema.setType(URI.create(BASE_TIPOS_ERROR + tipo));
        problema.setInstance(URI.create(request.getRequestURI()));
        if (validaciones != null) {
            problema.setProperty("validaciones", validaciones);
        }
        return problema;
    }

    private ResponseEntity<ProblemDetail> responder(ProblemDetail problema) {
        return ResponseEntity.status(problema.getStatus()).body(problema);
    }
}
