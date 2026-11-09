package com.pruebasopencode1.personas.config;

import com.pruebasopencode1.personas.entity.Usuario;
import com.pruebasopencode1.personas.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Crea el usuario fijo del autologin si no existe y mantiene su contraseña
 * cifrada alineada con la configuración. La contraseña en claro solo se usa
 * para generar el hash BCrypt y nunca se persiste.
 */
@Component
public class UsuarioInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(UsuarioInitializer.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;
    private final String rol;

    public UsuarioInitializer(UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder,
                              @Value("${app.auth.username:demo}") String username,
                              @Value("${app.auth.password:demo1234}") String password,
                              @Value("${app.auth.role:USER}") String rol) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
        this.rol = rol.replaceFirst("^ROLE_", "");
    }

    @Override
    public void run(ApplicationArguments args) {
        usuarioRepository.findByUsername(username).ifPresentOrElse(usuario -> {
            if (!passwordEncoder.matches(password, usuario.getPassword())) {
                usuario.setPassword(passwordEncoder.encode(password));
                usuario.setRol(rol);
                usuarioRepository.save(usuario);
                log.info("Contraseña cifrada del usuario '{}' actualizada desde la configuración.", username);
            } else {
                log.info("El usuario de autologin '{}' ya existe con la contraseña configurada.", username);
            }
        }, () -> {
            usuarioRepository.save(new Usuario(username, passwordEncoder.encode(password), rol));
            log.info("Creado el usuario de autologin '{}' con contraseña cifrada BCrypt.", username);
        });
    }
}
