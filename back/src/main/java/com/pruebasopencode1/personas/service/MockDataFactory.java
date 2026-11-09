package com.pruebasopencode1.personas.service;

import com.pruebasopencode1.personas.entity.Persona;
import com.pruebasopencode1.personas.entity.Sexo;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Fuente única de los datos de prueba de PruebasOpenCode1. Se crea una lista
 * nueva en cada llamada para que el restablecimiento sea idempotente.
 */
@Component
public class MockDataFactory {

    public List<Persona> crearPersonasMock() {
        return List.of(
                new Persona("Lucía", "Fernández", Sexo.FEMENINO,
                        "Calle Mayor 12, 3ºB, Madrid", LocalDate.of(1991, 4, 18)),
                new Persona("Javier", "Morales", Sexo.MASCULINO,
                        "Avenida de la Constitución 45, Sevilla", LocalDate.of(1984, 9, 2)),
                new Persona("Marta", "Sánchez", Sexo.FEMENINO,
                        "Calle Gran Vía 8, 2ºA, Valencia", LocalDate.of(1996, 12, 11)),
                new Persona("Diego", "Ramírez", Sexo.MASCULINO,
                        "Paseo del Parque 23, Málaga", LocalDate.of(1973, 6, 27)),
                new Persona("Elena", "Navarro", Sexo.FEMENINO,
                        "Calle Uría 31, Oviedo", LocalDate.of(1988, 2, 14)),
                new Persona("Pablo", "Ortega", Sexo.MASCULINO,
                        "Avenida Diagonal 190, Barcelona", LocalDate.of(2001, 8, 5)),
                new Persona("Carmen", "Ruiz", Sexo.FEMENINO,
                        "Calle Larga 7, Zaragoza", LocalDate.of(1960, 11, 23)),
                new Persona("Andrés", "Gil", Sexo.MASCULINO,
                        "Calle Real 56, Santander", LocalDate.of(1979, 3, 30)),
                new Persona("Nuria", "Vidal", Sexo.FEMENINO,
                        "Plaza Mayor 4, Salamanca", LocalDate.of(1994, 7, 19)),
                new Persona("Sergio", "Castro", Sexo.MASCULINO,
                        "Calle del Sol 18, Murcia", LocalDate.of(1967, 1, 9))
        );
    }
}
