package com.pruebasopencode1.personas.service;

import com.pruebasopencode1.personas.dto.PersonaRequest;
import com.pruebasopencode1.personas.dto.PersonaResponse;
import com.pruebasopencode1.personas.entity.Persona;
import com.pruebasopencode1.personas.entity.Sexo;
import com.pruebasopencode1.personas.exception.PersonaNotFoundException;
import com.pruebasopencode1.personas.mapper.PersonaMapper;
import com.pruebasopencode1.personas.repository.PersonaRepository;
import com.pruebasopencode1.personas.service.impl.PersonaServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PersonaServiceImplTest {

    @Mock
    private PersonaRepository personaRepository;

    private MockDataFactory mockDataFactory;
    private PersonaServiceImpl personaService;

    @BeforeEach
    void setUp() {
        mockDataFactory = new MockDataFactory();
        personaService = new PersonaServiceImpl(personaRepository, mockDataFactory);
    }

    @Test
    void listarTodasDevuelveLasPersonasMapeadas() {
        when(personaRepository.findAllByOrderByApellidoAscNombreAsc())
                .thenReturn(List.of(crearPersona(1L, "Ana", "García"),
                        crearPersona(2L, "Luis", "Pérez")));

        List<PersonaResponse> resultado = personaService.listarTodas();

        assertThat(resultado).hasSize(2);
        assertThat(resultado.get(0).nombre()).isEqualTo("Ana");
        assertThat(resultado.get(1).nombre()).isEqualTo("Luis");
    }

    @Test
    void obtenerPorIdDevuelveLaPersona() {
        when(personaRepository.findById(1L)).thenReturn(Optional.of(crearPersona(1L, "Ana", "García")));

        PersonaResponse respuesta = personaService.obtenerPorId(1L);

        assertThat(respuesta.id()).isEqualTo(1L);
        assertThat(respuesta.nombre()).isEqualTo("Ana");
        assertThat(respuesta.apellido()).isEqualTo("García");
    }

    @Test
    void obtenerPorIdLanzaExcepcionSiNoExiste() {
        when(personaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> personaService.obtenerPorId(99L))
                .isInstanceOf(PersonaNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void crearGuardaLaPersonaYRecortaLosEspacios() {
        PersonaRequest request = new PersonaRequest("  Ana ", " García  ", Sexo.FEMENINO,
                " Calle Mayor 1 ", LocalDate.now().minusYears(30));
        when(personaRepository.save(any(Persona.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PersonaResponse respuesta = personaService.crear(request);

        assertThat(respuesta.nombre()).isEqualTo("Ana");
        assertThat(respuesta.apellido()).isEqualTo("García");
        assertThat(respuesta.direccion()).isEqualTo("Calle Mayor 1");
        assertThat(respuesta.edad()).isEqualTo(30);
        verify(personaRepository).save(any(Persona.class));
    }

    @Test
    void actualizarModificaLaPersonaExistente() {
        Persona existente = crearPersona(5L, "Ana", "García");
        when(personaRepository.findById(5L)).thenReturn(Optional.of(existente));
        when(personaRepository.save(existente)).thenReturn(existente);

        PersonaRequest request = new PersonaRequest("Marta", "López", Sexo.MASCULINO,
                "Avenida del Puerto 8", LocalDate.now().minusYears(41));

        PersonaResponse respuesta = personaService.actualizar(5L, request);

        assertThat(respuesta.nombre()).isEqualTo("Marta");
        assertThat(respuesta.apellido()).isEqualTo("López");
        assertThat(respuesta.sexo()).isEqualTo(Sexo.MASCULINO);
        assertThat(respuesta.edad()).isEqualTo(41);
        assertThat(existente.getDireccion()).isEqualTo("Avenida del Puerto 8");
    }

    @Test
    void laEdadTieneEnCuentaSiElCumpleanosTodaviaNoHaLlegado() {
        LocalDate cumpleanosManana = LocalDate.now().minusYears(30).plusDays(1);
        Persona persona = new Persona("Ana", "García", Sexo.FEMENINO,
                "Calle de prueba 1", cumpleanosManana);
        when(personaRepository.findById(1L)).thenReturn(Optional.of(persona));

        PersonaResponse respuesta = personaService.obtenerPorId(1L);

        assertThat(respuesta.edad()).isEqualTo(29);
    }

    @Test
    void actualizarLanzaExcepcionSiNoExiste() {
        when(personaRepository.findById(7L)).thenReturn(Optional.empty());

        PersonaRequest request = new PersonaRequest("Marta", "López", Sexo.FEMENINO,
                "Avenida del Puerto 8", LocalDate.now().minusYears(41));

        assertThatThrownBy(() -> personaService.actualizar(7L, request))
                .isInstanceOf(PersonaNotFoundException.class);

        verify(personaRepository, never()).save(any(Persona.class));
    }

    @Test
    void eliminarBorraLaPersonaExistente() {
        Persona existente = crearPersona(3L, "Ana", "García");
        when(personaRepository.findById(3L)).thenReturn(Optional.of(existente));

        personaService.eliminar(3L);

        verify(personaRepository).delete(existente);
    }

    @Test
    void eliminarLanzaExcepcionSiNoExiste() {
        when(personaRepository.findById(8L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> personaService.eliminar(8L))
                .isInstanceOf(PersonaNotFoundException.class);

        verify(personaRepository, never()).delete(any(Persona.class));
    }

    @Test
    void restablecerDatosMockEliminaTodoYReinsertaLosDiezRegistros() {
        when(personaRepository.findAllByOrderByApellidoAscNombreAsc())
                .thenReturn(mockDataFactory.crearPersonasMock());

        List<PersonaResponse> resultado = personaService.restablecerDatosMock();

        assertThat(resultado).hasSize(10);
        verify(personaRepository).deleteAllInBatch();
        verify(personaRepository).saveAll(anyList());
        verify(personaRepository).flush();
    }

    @Test
    void losDatosMockTienenTodasLasPropiedades() {
        List<Persona> personas = mockDataFactory.crearPersonasMock();

        assertThat(personas).hasSize(10);
        assertThat(personas).allSatisfy(persona -> {
            assertThat(persona.getNombre()).isNotBlank();
            assertThat(persona.getApellido()).isNotBlank();
            assertThat(PersonaMapper.toResponse(persona).edad()).isBetween(0, 120);
            assertThat(persona.getSexo()).isNotNull();
            assertThat(persona.getDireccion()).isNotBlank();
            assertThat(persona.getFechaNacimiento()).isNotNull();
        });
    }

    private Persona crearPersona(Long id, String nombre, String apellido) {
        Persona persona = new Persona(nombre, apellido, Sexo.FEMENINO,
                "Calle de prueba 1", LocalDate.now().minusYears(30));
        ReflectionTestUtils.setField(persona, "id", id);
        return persona;
    }
}
