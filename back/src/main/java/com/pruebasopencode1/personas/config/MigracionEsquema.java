package com.pruebasopencode1.personas.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Migración ligera del esquema para bases de datos H2 creadas con versiones
 * anteriores de PruebasOpenCode1.
 *
 * <p>La edad ya no se almacena: se calcula a partir de la fecha de nacimiento.
 * Al actualizar una instalación existente, Hibernate deja la columna antigua
 * {@code edad} en la tabla {@code personas}, y como era obligatoria impediría
 * insertar nuevas personas. Este componente la elimina si todavía existe.</p>
 *
 * <p>Se ejecuta antes que {@code MockDataInitializer}, de modo que la siembra
 * inicial también funciona con un esquema antiguo vacío.</p>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MigracionEsquema implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(MigracionEsquema.class);

    private static final String CONSULTAR_COLUMNA_EDAD = """
            SELECT COUNT(*)
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE LOWER(TABLE_NAME) = 'personas'
              AND LOWER(COLUMN_NAME) = 'edad'
            """;

    private final JdbcTemplate jdbcTemplate;

    public MigracionEsquema(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        Integer columnas = jdbcTemplate.queryForObject(CONSULTAR_COLUMNA_EDAD, Integer.class);

        if (columnas != null && columnas > 0) {
            jdbcTemplate.execute("ALTER TABLE personas DROP COLUMN edad");
            log.info("Migración aplicada: se ha eliminado la columna 'edad'. "
                    + "La edad se calcula ahora desde la fecha de nacimiento.");
        }
    }
}
