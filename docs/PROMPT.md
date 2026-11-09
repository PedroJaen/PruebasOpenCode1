# Prompt de reconstrucción de PruebasOpenCode1

> Pega este documento completo en un agente de programación (por ejemplo, OpenCode) para generar
> una aplicación equivalente al estado actual de PruebasOpenCode1. El resultado debe compilar,
> ejecutarse en local y superar todas las verificaciones descritas al final.

## 1. Rol y objetivo

Actúa como un equipo de desarrollo full stack. Crea desde cero una aplicación web denominada
**PruebasOpenCode1** para gestionar personas. La aplicación debe ser funcional, no una maqueta:
todos los datos se persisten en una base de datos real y el frontend consume exclusivamente una API
REST.

Trabaja de forma incremental, verifica cada bloque antes de continuar y no dejes implementaciones
simuladas. Al terminar, entrega también la documentación indicada.

## 2. Tecnologías obligatorias

No introduzcas tecnologías distintas sin autorización expresa. No utilices Angular.

- **Backend:** Java 21, Spring Boot, Spring Web, Spring Data JPA, Hibernate, Spring Security, H2 y
  Maven.
- **Frontend:** React, TypeScript y Vite.
- **Base de datos:** H2.
- **Comunicación:** API REST JSON versionada en `/api/v1` con autenticación por **token Bearer** de
  corta duración.
- **Errores:** RFC 9457 (`application/problem+json`).
- **Pruebas:** JUnit 5, Mockito, MockMvc, Spring Security Test, PIT (mutation testing), Node.js y
  Playwright Core.

Versiones de referencia del estado actual:

| Componente | Versión |
| --- | --- |
| Java | 21 |
| Spring Boot | 3.5.16 |
| H2 | 2.3 |
| Springdoc OpenAPI | 2.8.16 |
| Spring Security | 6.5 |
| PIT | 1.30.2 |
| React | 19.3 |
| TypeScript | 5.9 |
| Vite | 7.3 |
| React Router | 7.18 |

## 3. Estructura de directorios

```text
PruebasOpenCode1/
├── AGENTS.md
├── README.md
├── back/                  Aplicación Spring Boot
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   ├── .env.example
│   └── src/
│       ├── main/java/com/pruebasopencode1/personas/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── exception/
│       │   ├── mapper/
│       │   ├── repository/
│       │   ├── security/
│       │   └── service/
│       ├── main/resources/
│       │   ├── application.yml
│       │   ├── application-dev.yml
│       │   ├── application-pre.yml
│       │   └── application-prod.yml
│       └── test/java/com/pruebasopencode1/personas/
│           ├── controller/AuthControllerIntegrationTest.java
│           ├── controller/PersonaControllerIntegrationTest.java
│           └── service/PersonaServiceImplTest.java
├── front/                 SPA React + TypeScript + Vite
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env.example
│   ├── scripts/
│   │   ├── generar-documentacion.mjs
│   │   ├── verificar-ui.mjs
│   │   └── ...
│   └── src/
│       ├── api/
│       ├── components/
│       ├── content/
│       ├── hooks/
│       ├── pages/
│       ├── types/
│       ├── App.tsx
│       ├── main.tsx
│       ├── theme.ts
│       └── styles.css
├── docs/
│   ├── API.md
│   ├── ARQUITECTURA.md
│   ├── DESPLIEGUE.md
│   ├── EJECUCION.md
│   ├── MANUAL_USUARIO.md
│   ├── OPERACION.md
│   ├── PROMPT.md
│   ├── PRUEBAS.md
│   ├── SEGUIMIENTO.md
│   └── SEGURIDAD.md
└── scripts/
    └── verificar-integracion.mjs
```

## 4. Backend

### 4.1 Configuración Maven

- Java 21 y `spring-boot-starter-parent` 3.5.16.
- Dependencias: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`,
  `spring-boot-starter-validation`, `spring-boot-starter-actuator`,
  `spring-boot-starter-security`, `springdoc-openapi-starter-webmvc-ui`, `h2`,
  `spring-boot-devtools` (opcional), `spring-boot-starter-test` y `spring-security-test`.
- Añade Maven Wrapper (`mvnw`, `mvnw.cmd`).
- Añade `maven-enforcer-plugin` para exigir Java 21.
- Añade `pitest-maven` 1.30.2 con `pitest-junit5-plugin` 1.2.3 como plugin **opcional**, sin
  enlazarlo a `clean verify`.

### 4.2 Entidad `Persona`

Tabla `personas` con:

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `id` | `Long` | Clave primaria generada. |
| `nombre` | `String` | Obligatorio, máximo 80 caracteres. |
| `apellido` | `String` | Obligatorio, máximo 80 caracteres. |
| `sexo` | `Sexo` | Enum `MASCULINO`, `FEMENINO`, `OTRO`; almacenado como texto. |
| `direccion` | `String` | Obligatoria, máximo 200 caracteres. |
| `fechaNacimiento` | `LocalDate` | Obligatoria y no futura. |
| `creadoEn` | `Instant` | `@CreatedDate`, columna `creado_en`, no actualizable. |
| `actualizadoEn` | `Instant` | `@LastModifiedDate`, columna `actualizado_en`. |
| `creadoPor` | `String` | `@CreatedBy`, columna `creado_por`, longitud 60. |
| `actualizadoPor` | `String` | `@LastModifiedBy`, columna `actualizado_por`, longitud 60. |

La entidad usa `@EntityListeners(AuditingEntityListener.class)`. La **edad no se almacena**: se
calcula en cada respuesta a partir de `fechaNacimiento` y la fecha actual, teniendo en cuenta si el
cumpleaños ya ha pasado. El DTO de respuesta incluye `id`, `nombre`, `apellido`, `edad`, `sexo`,
`direccion`, `fechaNacimiento`, `creadoEn`, `actualizadoEn`, `creadoPor` y `actualizadoPor`.

### 4.3 Capas y clases

- `PersonaController`: expone `/api/v1/personas` y devuelve códigos HTTP coherentes.
- `PersonaService` + `PersonaServiceImpl`: lógica de negocio transaccional.
- `PersonaRepository`: repositorio JPA con listado ordenado por apellido y nombre.
- `PersonaMapper`: conversión entre entidad y DTO, cálculo de edad y limpieza de espacios.
- `MockDataFactory`: fuente única de los 10 registros mock.
- `MockDataInitializer`: siembra datos al arrancar solo si la tabla está vacía.
- `MigracionEsquema`: elimina la columna heredada `edad` si existe en bases antiguas.
- `AuditoriaConfig`: activa `@EnableJpaAuditing` y resuelve el usuario desde `SecurityContext`
  (`sistema` si no hay autenticación).
- `GlobalExceptionHandler`: respuestas RFC 9457 (`ProblemDetail`) homogéneas.
- `TokenService` y `TokenAuthenticationFilter`: emisión, validación y revocación de tokens.
- `CorsConfig`, `OpenApiConfig` y `ConfiguracionDiagnostico`.

### 4.4 Endpoints

| Método | Ruta | Éxito | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/v1/personas` | `200` | Lista todas las personas. |
| `GET` | `/api/v1/personas/{id}` | `200` / `404` | Obtiene una persona. |
| `POST` | `/api/v1/personas` | `201` + `Location` | Crea una persona. |
| `PUT` | `/api/v1/personas/{id}` | `200` / `404` | Actualiza una persona. |
| `DELETE` | `/api/v1/personas/{id}` | `204` / `404` | Elimina una persona. |
| `POST` | `/api/v1/personas/reset` | `200` | Borra todo y reinserta los 10 mock. |
| `POST` | `/api/v1/auth/login` | `200` / `401` | Valida credenciales y emite un token Bearer. |
| `GET` | `/api/v1/auth/sesion` | `200` | Consulta el estado del token (`autenticado` puede ser `false`). |
| `POST` | `/api/v1/auth/logout` | `204` | Revoca el token actual. |

Salvo `/api/v1/auth/**`, todas las rutas `/api/**` requieren un token válido y devuelven `401` con
`ProblemDetail` si no lo hay.

Otros recursos:

- Salud: `GET /actuator/health`.
- OpenAPI: `GET /v3/api-docs`.
- Swagger UI: `GET /swagger-ui/index.html`.
- Consola H2: `GET /h2-console` (solo desarrollo).

### 4.5 Validación y errores

- Valida con Jakarta Validation en `PersonaRequest`.
- Devuelve `400` con un mapa `validaciones` por campo.
- Devuelve `404` con `ProblemDetail` para recursos inexistentes.
- Un enum o JSON inválido devuelve `400` con tipo `cuerpo-ilegible`.
- Una ruta desconocida devuelve `404`, nunca `500`.
- No expongas trazas ni mensajes internos en las respuestas.

Todos los errores son `application/problem+json` con `type`, `title`, `status`, `detail` e `instance`.
El prefijo de `type` es `https://pruebasopencode1.example/errors/` y los tipos son `no-autenticado`,
`credenciales`, `acceso-denegado`, `validacion`, `cuerpo-ilegible`, `no-encontrado`, `conflicto` y
`error-interno`.

### 4.6 Configuración, perfiles y datos

Usa perfiles `dev`, `test`, `pre` y `prod`, con `dev` como perfil por defecto. La configuración debe
permitir cambiar de entorno mediante variables sin tocar código:

- `SPRING_PROFILES_ACTIVE`.
- `SERVER_PORT` (por defecto `8080`).
- `DB_URL` (por defecto `jdbc:h2:file:./data/pruebasopencode1` en `dev`).
- `DB_USERNAME` y `DB_PASSWORD`.
- `JPA_DDL_AUTO` (por defecto `update`).
- `JPA_SHOW_SQL` (por defecto `false`).
- `H2_CONSOLE_ENABLED` (por defecto `true` en `dev`, `false` en `pre`/`prod`).
- `CORS_ALLOWED_ORIGINS` (por defecto `http://localhost:5173,http://127.0.0.1:5173` en `dev`).
- `SEED_MOCK_DATA` (por defecto `true` en `dev`, `false` en `pre`/`prod`).
- `APP_AUTH_USERNAME` (por defecto `demo` en `dev`), `APP_AUTH_PASSWORD` (por defecto `demo1234` en
  `dev`), `APP_AUTH_ROLE` (por defecto `USER`) y `APP_AUTH_TOKEN_TTL` (`15m` en `dev`/`test`, `10m`
  en `pre`, `5m` en `prod`).
- `SPRINGDOC_ENABLED` (`true` en `dev`/`test`, `false` en `pre`/`prod`).
- `LOG_LEVEL`.

En `pre` y `prod` no debe haber valores por defecto para secretos ni para CORS: deben inyectarse
desde el entorno. Incluye `back/.env.example` como plantilla y excluye los `.env` reales con
`.gitignore`.

El perfil `test` usa H2 en memoria, `create-drop`, sin consola y sin siembra automática.

Incluye exactamente estos 10 registros mock:

1. Lucía Fernández · FEMENINO · Calle Mayor 12, 3ºB, Madrid · 1991-04-18
2. Javier Morales · MASCULINO · Avenida de la Constitución 45, Sevilla · 1984-09-02
3. Marta Sánchez · FEMENINO · Calle Gran Vía 8, 2ºA, Valencia · 1996-12-11
4. Diego Ramírez · MASCULINO · Paseo del Parque 23, Málaga · 1973-06-27
5. Elena Navarro · FEMENINO · Calle Uría 31, Oviedo · 1988-02-14
6. Pablo Ortega · MASCULINO · Avenida Diagonal 190, Barcelona · 2001-08-05
7. Carmen Ruiz · FEMENINO · Calle Larga 7, Zaragoza · 1960-11-23
8. Andrés Gil · MASCULINO · Calle Real 56, Santander · 1979-03-30
9. Nuria Vidal · FEMENINO · Plaza Mayor 4, Salamanca · 1994-07-19
10. Sergio Castro · MASCULINO · Calle del Sol 18, Murcia · 1967-01-09

### 4.7 Seguridad, tokens y auditoría

La API debe estar protegida con **Spring Security** y autenticación real por **token Bearer de corta
duración**, sin formulario de login visible y **sin sesiones HTTP**:

- Entidad JPA `Usuario` (tabla `usuarios`): `id`, `username` único, `password` con hash BCrypt de 60
  caracteres, `rol`, `activo` y `fechaAlta`. La contraseña en claro nunca se persiste ni se devuelve.
- `UsuarioRepository`, `UsuarioDetailsService` y `SecurityConfig` con
  `DaoAuthenticationProvider` y `BCryptPasswordEncoder`.
- `UsuarioInitializer` crea o sincroniza el usuario configurado al arrancar, comparando la contraseña
  con `PasswordEncoder.matches()` y regenerando el hash cuando cambia.
- `TokenService` genera tokens opacos de 32 bytes con `SecureRandom`, los guarda en memoria con su
  caducidad y permite validarlos y revocarlos.
- `TokenAuthenticationFilter` lee `Authorization: Bearer <token>` y publica la autenticación en el
  contexto de la petición. No se guarda nada en sesión.
- `SecurityConfig` usa `SessionCreationPolicy.STATELESS`, desactiva `formLogin`, `httpBasic` y el
  logout automático, y responde `401`/`403` con `ProblemDetail`.
- CORS con `allowCredentials(true)` por compatibilidad, cabecera `Authorization` permitida y
  `Location` expuesta.
- CSRF desactivado de forma consciente para esta SPA JSON: no se usan cookies de autenticación. Se
  documenta como decisión revisable antes de producción.
- El esquema OpenAPI declara `bearerAuth` como esquema de seguridad.

El **autologin transparente** del frontend debe:

1. Ejecutarse solo al entrar en `/personas`, no en la bienvenida ni en la documentación.
2. Consultar `GET /api/v1/auth/sesion` y, si no hay token vigente, llamar a
   `POST /api/v1/auth/login` con las credenciales fijas de demostración.
3. Reutilizar una promesa única para evitar logins duplicados con React StrictMode.
4. Guardar el token **solo en memoria** y enviarlo en `Authorization` con `credentials: 'omit'`.
5. Renovar el token 60 segundos antes de caducar y, si una llamada autenticada recibe `401`, renovar
   una sola vez y repetir la petición.
6. Emitir eventos de «sesión renovada» y «sesión caducada» que la interfaz muestra como avisos.
7. No mostrar nunca un formulario, un botón de login ni las credenciales al usuario.

Las credenciales fijas del frontend se configuran con `VITE_AUTH_USERNAME` y `VITE_AUTH_PASSWORD` y
deben coincidir con las del backend. Al viajar en el bundle del navegador no son un secreto: este
modelo es válido para la demo local y no para producción.

La **auditoría** se activa con `@EnableJpaAuditing`. `AuditorAware` toma el usuario del
`SecurityContext` y devuelve `sistema` si no hay autenticación. Los cuatro campos se exponen en
`PersonaResponse`.

## 5. Frontend

### 5.1 Base

- SPA con React, TypeScript y Vite.
- React Router para las rutas.
- Proxy de Vite `/api` hacia `http://localhost:8080`, configurable con `VITE_PROXY_TARGET`.
- Sin frameworks de UI externos: CSS propio, moderno, responsive y accesible.
- Servicios HTTP separados de los componentes.
- Datos de personas siempre desde la API; nunca como sustituto de la base de datos.
- Autologin transparente con las credenciales fijas de demostración, sin formulario visible.
- Todas las peticiones usan `credentials: 'omit'` y la cabecera `Authorization: Bearer`.
- `ErrorBoundary` envuelve la aplicación para mostrar una pantalla de recuperación si falla el
  renderizado.
- Tema claro, oscuro o `sistema`, persistido en `localStorage` con la clave `pruebasopencode1.tema`.
  Un script en `index.html` aplica el tema antes de montar React.

### 5.2 Rutas y navegación

- `/` — pantalla de bienvenida con presentación, funcionalidades y acceso a personas.
- `/personas` — gestión completa de personas.
- `/documentacion` — documentación viva del proyecto.
- `*` — página 404.

La cabecera incluye la marca, el subtítulo, un menú con **Inicio**, **Personas** y
**Documentación**, y un botón para alternar el tema. La ruta activa se resalta visualmente.

### 5.3 Gestión de personas

La pantalla `/personas` debe incluir:

- Autologin transparente al entrar: token real emitido sin mostrar credenciales.
- Listado con búsqueda en tiempo real por nombre, apellido o dirección.
- Estados de carga, error, vacío y sin coincidencias.
- Creación y edición mediante formulario modal con validaciones en español.
- Eliminación con diálogo de confirmación.
- Restablecimiento de datos mock con confirmación previa.
- Notificaciones de éxito y error accesibles.
- Avisos de sesión renovada o caducada.
- Edad mostrada calculada por el backend.

Validaciones del formulario: nombre, apellido y dirección obligatorios; sexo obligatorio; fecha de
nacimiento obligatoria y no futura; longitudes máximas alineadas con el backend.

### 5.4 Documentación viva

La página `/documentacion` debe contener, como mínimo, estas secciones:

1. **Prompt de reconstrucción:** contenido de `docs/PROMPT.md`, con botón para copiarlo.
2. **Documentación general:** todos los documentos de `docs/` y el `README.md`, navegables por
   pestañas y renderizados como Markdown.
3. **AGENTS.md:** contenido íntegro de las reglas del proyecto.
4. **Resultados de pruebas:** una tabla por cada tipo de prueba, generada a partir de las fuentes
   reales siempre que sea posible:
   - pruebas unitarias del backend,
   - pruebas de integración del backend,
   - integración de extremo a extremo,
   - interfaz con navegador real,
   - mutation testing de PIT,
   - compilación y tipos del frontend.

La página no debe duplicar manualmente el contenido de los documentos. Un script de generación
(`front/scripts/generar-documentacion.mjs`) debe leer `AGENTS.md`, `docs/*.md`, los tests de Java, los
scripts de verificación y los informes de PIT/Surefire para producir
`front/src/content/documentacion.generated.ts`. El script se ejecuta antes de `npm run dev` y de
`npm run build`, de modo que la página refleje siempre el último estado. Las tablas deben mostrar el
nombre de cada prueba, su detalle técnico y su resultado.

## 6. Pruebas y calidad

### 6.1 Backend

Implementa al menos estas 11 pruebas unitarias en `PersonaServiceImplTest` con Mockito:

- Listado de todas las personas mapeadas.
- Obtención por identificador.
- Error al obtener un identificador inexistente.
- Creación con recorte de espacios y edad calculada.
- Actualización de una persona existente, incluido el sexo.
- Edad correcta cuando el cumpleaños aún no ha llegado.
- Error al actualizar una persona inexistente.
- Eliminación de una persona existente.
- Error al eliminar una persona inexistente.
- Reset que borra todo y reinserta los 10 mock.
- Propiedades completas de los datos mock.

Implementa al menos estas 14 pruebas de integración en `PersonaControllerIntegrationTest` con
MockMvc y H2 en memoria (autenticadas con `@WithMockUser(username = "demo", roles = "USER")`):

- Listado inicial vacío.
- Creación con `201`, `Location` y datos guardados.
- Obtención por identificador.
- `404` al obtener un identificador inexistente.
- `400` con validaciones por campo.
- `400` con sexo inválido.
- Actualización persistente.
- `404` al actualizar un identificador inexistente.
- Eliminación con `204`.
- `404` al eliminar un identificador inexistente.
- Reset con exactamente 10 registros.
- Preflight CORS para el origen del frontend.
- Swagger UI y OpenAPI disponibles.
- Ruta desconocida devuelve `404`.

Implementa además estas 9 pruebas de seguridad en `AuthControllerIntegrationTest`:

- Sin token, `GET /api/v1/personas` devuelve `401` con `ProblemDetail` y la ruta solicitada.
- Un login válido emite un token Bearer con expiración.
- El token válido permite acceder a personas.
- Credenciales incorrectas devuelven `401` sin revelar si el usuario existe.
- Un token inválido devuelve `401`.
- La contraseña almacenada es un hash BCrypt de 60 caracteres y `matches()` lo confirma.
- El logout revoca el token y las peticiones posteriores devuelven `401`.
- `GET /api/v1/auth/sesion` con token devuelve usuario, rol y expiración.
- `GET /api/v1/auth/sesion` sin token devuelve `200` con `autenticado: false`.

### 6.2 Mutation testing

Configura PIT para mutar solo `PersonaServiceImpl` y `PersonaMapper`, ejecutando solo
`PersonaServiceImplTest`. Umbrales: 90 % de mutaciones detectadas y 90 % de cobertura de líneas. La
ejecución debe ser rápida (unos segundos) y no formar parte de `clean verify`. Comando:

```powershell
cd back
$env:JAVA_HOME = "C:\ruta\al\jdk-21"
.\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage
```

`test-compile` es obligatorio para no reutilizar clases de prueba obsoletas. El informe se genera en
`back/target/pit-reports/index.html`.

### 6.3 Integración y interfaz

- `scripts/verificar-integracion.mjs`: 18 comprobaciones a través del proxy de Vite (`401` sin token,
  autologin, salud, CORS, listado, reset, creación, consulta, edición, validaciones, auditoría,
  eliminación, logout con revocación y reset final). Debe conservar el token en memoria.
- `front/scripts/verificar-ui.mjs`: 14 comprobaciones con Chrome o Edge del sistema mediante
  `playwright-core`, sin descargar navegadores. Debe validar bienvenida, autologin transparente,
  listado, búsqueda, creación, edición, eliminación, confirmaciones, reset, validaciones, tema oscuro,
  documentación y consola sin errores. El autologin se detecta como petición real y no debe mostrar
  campos ni acciones de inicio de sesión.
- Ejecutar primero la suite de integración y después la de interfaz: ambas hacen reset y no deben
  correr en paralelo.

## 7. Documentación obligatoria

Mantén actualizados, en español y con el nombre PruebasOpenCode1:

- `README.md`: presentación, tecnologías, estructura, inicio rápido, comandos y mapa documental.
- `AGENTS.md`: reglas de trabajo del proyecto.
- `docs/ARQUITECTURA.md`: capas, estructura, decisiones y preparación de despliegues.
- `docs/SEGURIDAD.md`: autologin, tokens Bearer, BCrypt, perfiles, secretos y límites del modelo.
- `docs/API.md`: contrato REST versionado, ejemplos, errores RFC 9457 y códigos de estado.
- `docs/EJECUCION.md`: requisitos, perfiles, arranque, pruebas, variables de entorno y resolución de
  problemas.
- `docs/PRUEBAS.md`: estrategia, alcance de cada suite, comandos y resultados esperados.
- `docs/MANUAL_USUARIO.md`: guía de uso de la interfaz, incluido el tema.
- `docs/OPERACION.md`: configuración, H2, copias, mantenimiento y diagnóstico.
- `docs/DESPLIEGUE.md`: diseño previsto para Docker, Kubernetes y entornos PRE/PRO, sin implementar
  despliegues reales.
- `docs/SEGUIMIENTO.md`: fases, tareas realizadas, resultados, incidencias y próximos pasos.
- `docs/PROMPT.md`: este prompt.

Cada cambio funcional o de pruebas debe actualizar la documentación afectada y, como la página
`/documentacion` se genera a partir de ella, regenerar el contenido del frontend.

## 8. Ejecución local

El proyecto debe poder ejecutarse en local de forma independiente:

- Backend desde Eclipse o por consola.
- Frontend desde Visual Studio Code o por consola.

Comandos de referencia:

```powershell
# Backend
cd back
$env:SPRING_PROFILES_ACTIVE = "dev"
.\mvnw.cmd spring-boot:run

# Frontend
cd front
npm install
npm run dev
```

## 9. Criterios de aceptación

No consideres la tarea terminada hasta comprobar que:

- `back\mvnw.cmd -B clean verify` termina con **BUILD SUCCESS** y 34 pruebas sin fallos (11 unitarias
  + 14 de integración de personas + 9 de autenticación).
- PIT detecta al menos el 90 % de las mutaciones y cubre al menos el 90 % de las líneas mutadas.
- `front\npm run build` compila TypeScript y genera `dist/`.
- `node scripts\verificar-integracion.mjs` supera las 18 comprobaciones, incluido el `401` sin token,
  el autologin, la auditoría y la revocación tras el logout.
- `front\npm run test:ui` supera las 14 comprobaciones sin errores de consola.
- La API de personas devuelve `401` sin token; el autologin obtiene un token real y la contraseña
  está cifrada con BCrypt en H2.
- Los errores usan `application/problem+json` con `type`, `title`, `status`, `detail` e `instance`.
- La entidad `Persona` registra auditoría de creación y modificación.
- El usuario no ve ningún formulario ni credencial en la interfaz.
- El tema claro/oscuro funciona y persiste, y un error de renderizado muestra el `ErrorBoundary`.
- Los perfiles `dev`, `test`, `pre` y `prod` arrancan con configuración externalizada y sin secretos
  versionados.
- La página `/documentacion` muestra el prompt, la documentación (incluida `SEGURIDAD.md`),
  `AGENTS.md` y las tablas de resultados, y se actualiza al regenerar el contenido.
- No quedan datos simulados, secretos ni valores específicos de un entorno en el código.

Informa al final de los cambios realizados, las pruebas ejecutadas y cualquier problema encontrado.
