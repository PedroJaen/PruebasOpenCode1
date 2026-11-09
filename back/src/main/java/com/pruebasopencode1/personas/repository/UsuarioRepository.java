package com.pruebasopencode1.personas.repository;

import com.pruebasopencode1.personas.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Acceso a los usuarios que pueden autenticarse en PruebasOpenCode1.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);
}
