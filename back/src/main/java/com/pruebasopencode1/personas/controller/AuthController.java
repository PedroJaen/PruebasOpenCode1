package com.pruebasopencode1.personas.controller;

import com.pruebasopencode1.personas.dto.LoginRequest;
import com.pruebasopencode1.personas.dto.SesionResponse;
import com.pruebasopencode1.personas.dto.TokenResponse;
import com.pruebasopencode1.personas.security.TokenAuthenticationFilter;
import com.pruebasopencode1.personas.security.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Autenticación de PruebasOpenCode1.
 *
 * <p>El login valida las credenciales y devuelve un token Bearer de corta
 * duración. No se crea ninguna sesión HTTP ni cookie: el frontend conserva el
 * token en memoria y lo envía en la cabecera {@code Authorization}. El
 * autologin transparente de la SPA usa este mismo endpoint.</p>
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación", description = "Autologin, consulta de sesión y logout con tokens Bearer")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authenticationManager,
                          TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión",
            description = "Valida el usuario y la contraseña y emite un token Bearer de corta duración.")
    public TokenResponse login(@Valid @RequestBody LoginRequest datos) {
        Authentication autenticacion = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(datos.usuario(), datos.contrasena()));
        TokenService.TokenGenerado generado = tokenService.generar(autenticacion);
        return TokenResponse.de(generado.token(), generado.expiraEn(), autenticacion);
    }

    @GetMapping("/sesion")
    @Operation(summary = "Consultar la sesión",
            description = "Devuelve el estado de la sesión; si no hay token válido, "
                    + "responde 200 con autenticado=false.")
    public ResponseEntity<SesionResponse> sesion(Authentication autenticacion,
                                                 HttpServletRequest request) {
        if (autenticacion == null
                || !autenticacion.isAuthenticated()
                || autenticacion instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.ok(SesionResponse.anonima());
        }
        return ResponseEntity.ok(
                SesionResponse.de(autenticacion, TokenAuthenticationFilter.expiracion(request)));
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Cerrar sesión", description = "Invalida el token Bearer actual.")
    public void logout(HttpServletRequest request) {
        tokenService.revocar(TokenService.extraerBearer(request.getHeader(HttpHeaders.AUTHORIZATION)));
        SecurityContextHolder.clearContext();
    }
}
