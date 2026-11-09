package com.pruebasopencode1.personas.config;

import com.pruebasopencode1.personas.repository.PersonaRepository;
import com.pruebasopencode1.personas.service.PersonaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Siembra los datos mock al arrancar únicamente cuando la base de datos está
 * vacía. Así se conservan los cambios entre reinicios y el restablecimiento
 * sigue siendo una acción explícita del usuario.
 */
@Component
@ConditionalOnProperty(name = "app.mock-data.seed-on-startup", havingValue = "true", matchIfMissing = true)
public class MockDataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(MockDataInitializer.class);

    private final PersonaRepository personaRepository;
    private final PersonaService personaService;

    public MockDataInitializer(PersonaRepository personaRepository, PersonaService personaService) {
        this.personaRepository = personaRepository;
        this.personaService = personaService;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (personaRepository.count() == 0) {
            int total = personaService.restablecerDatosMock().size();
            log.info("Base de datos vacía: se han insertado {} personas de prueba.", total);
        } else {
            log.info("La base de datos ya contiene datos; no se siembran los datos mock.");
        }
    }
}
