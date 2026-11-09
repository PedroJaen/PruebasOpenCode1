package com.pruebasopencode1.personas.service;

import com.pruebasopencode1.personas.entity.Usuario;
import com.pruebasopencode1.personas.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Carga los usuarios de la base de datos para que Spring Security compruebe
 * la contraseña cifrada con BCrypt.
 */
@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Credenciales incorrectas"));

        String rol = usuario.getRol().replaceFirst("^ROLE_", "");
        return User.withUsername(usuario.getUsername())
                .password(usuario.getPassword())
                .roles(rol)
                .disabled(!usuario.isActivo())
                .build();
    }
}
