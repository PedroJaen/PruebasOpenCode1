package com.pruebasopencode1.personas.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Comprueba al arrancar que la configuración de la aplicación está presente.
 *
 * <p>Si un IDE compila el proyecto sin copiar {@code src/main/resources} al
 * classpath, Spring Boot arranca con valores por defecto (base de datos H2 en
 * memoria) y la aplicación no se comporta como se espera. Este componente
 * detecta esa situación y deja un aviso claro en el log.</p>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ConfiguracionDiagnostico implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ConfiguracionDiagnostico.class);

    private final Environment environment;

    public ConfiguracionDiagnostico(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        boolean perfilTest = Arrays.asList(environment.getActiveProfiles()).contains("test");
        boolean configuracionPresente = new ClassPathResource("application.yml").exists();

        if (!perfilTest && !configuracionPresente) {
            log.warn("""
                    No se ha encontrado application.yml en el classpath. Se está usando la \
                    configuración por defecto de Spring Boot (base de datos H2 en memoria) y los \
                    datos no se conservarán entre reinicios. En Eclipse, importa el proyecto como \
                    'Maven > Existing Maven Projects', ejecuta 'Maven > Update Project' y comprueba \
                    que existe target/classes/application.yml. También puedes compilar con \
                    'mvnw.cmd clean package' o arrancar con 'mvnw.cmd spring-boot:run'.""");
        }
    }
}
