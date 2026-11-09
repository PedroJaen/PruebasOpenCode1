/* Archivo generado automáticamente por front/scripts/generar-documentacion.mjs.
 * No editar a mano: ejecuta `npm run docs` o `npm run build` para actualizarlo. */

export interface DocumentoGenerado {
  id: string
  titulo: string
  archivo: string
  resumen: string
  markdown: string
}

export interface GrupoResultados {
  id: string
  titulo: string
  descripcion: string
  comando: string
  fecha: string
  resumen: string
  columnas: string[]
  filas: string[][]
}

export const GENERADO_EL = "2026-11-09"

export const AGENTS: DocumentoGenerado = {
  id: "agents",
  titulo: "AGENTS.md - Proyecto PruebasOpenCode1",
  archivo: "AGENTS.md",
  resumen: "Reglas de trabajo y requisitos del proyecto.",
  markdown: `
# AGENTS.md - Proyecto PruebasOpenCode1

## 1. Objetivo del proyecto

Desarrollar una aplicación web completa denominada PruebasOpenCode1 para gestionar personas.

El proyecto servirá como entorno de pruebas para evaluar las capacidades de desarrollo autónomo de agentes de programación mediante OpenCode.

La aplicación estará formada por:

- Backend: Java 21 y Spring Boot.
- Frontend: React, TypeScript y Vite.
- Base de datos: H2.
- Comunicación entre frontend y backend mediante API REST.

## 2. Normas generales

- Leer y respetar las instrucciones del AGENTS.md global del usuario.
- Respetar también las instrucciones de este archivo.
- No introducir tecnologías diferentes de las especificadas sin autorización.
- No utilizar Angular.
- No realizar cambios innecesarios fuera del alcance solicitado.
- Mantener el código limpio, modular, mantenible y documentado.
- No dejar implementaciones simuladas cuando se haya solicitado funcionalidad real.
- No dar por terminada una tarea sin verificar su funcionamiento.
- Utilizar las herramientas disponibles en OpenCode para leer, crear, modificar y comprobar archivos.
- No asumir que una operación se ha realizado correctamente sin verificar su resultado.

## 3. Estructura del proyecto

La raíz del proyecto es PruebasOpenCode1.

Organizar el proyecto en los siguientes directorios:

- /back: aplicación backend.
- /front: aplicación frontend.
- /docs: documentación general.
- /deploy: imágenes Docker, Docker Compose y manifiestos Kubernetes (Kustomize) para PRE y PRO.
- /scripts: verificaciones de integración y de preparación de despliegue.

## 4. Backend

Tecnologías obligatorias:

- Java 21.
- Spring Boot.
- Spring Web.
- Spring Data JPA.
- Hibernate.
- H2.
- Maven.

Requisitos:

- Implementar una API REST.
- Utilizar una arquitectura por capas: Controller, Service y Repository.
- Separar entidades JPA de los DTO utilizados en la API.
- Implementar operaciones CRUD completas.
- Aplicar validaciones en los datos recibidos.
- Gestionar adecuadamente los errores y devolver respuestas HTTP coherentes.
- Configurar CORS para permitir la comunicación con el frontend.
- Utilizar H2 como base de datos.
- Configurar la creación automática del esquema de base de datos.
- Incluir datos iniciales de prueba (mock data).
- Permitir consultar la consola H2 durante el desarrollo.
- Mantener una configuración sencilla para ejecutar localmente.

### Entidad Persona

La aplicación gestionará personas con los siguientes atributos:

- id: identificador único.
- nombre.
- apellido.
- edad: calculada a partir de fechaNacimiento y la fecha actual; no se almacena en la tabla.
- sexo.
- direccion.
- fechaNacimiento.

### Operaciones

Implementar:

- Obtener todas las personas.
- Obtener una persona por su identificador.
- Crear una persona.
- Modificar una persona.
- Eliminar una persona.
- Restablecer los datos de prueba iniciales.

La operación de restablecimiento deberá eliminar los datos existentes y volver a insertar exclusivamente los datos mock iniciales.

## 5. Frontend

Tecnologías obligatorias:

- React.
- TypeScript.
- Vite.

Requisitos:

- Aplicación SPA.
- Interfaz clara, moderna y sencilla.
- Código organizado por componentes.
- Separación de servicios de comunicación HTTP.
- Consumir exclusivamente la API REST del backend para gestionar los datos.
- Gestionar los estados de carga y los errores.
- Mostrar mensajes de confirmación y error cuando corresponda.
- Utilizar formularios con validaciones.
- No almacenar los datos de personas como sustituto de la base de datos del backend.

### Vistas

Implementar:

1. Pantalla de bienvenida.
   - Presentación de PruebasOpenCode1.
   - Acceso a la gestión de personas.

2. Gestión de personas.
   - Listado de personas.
   - Crear persona.
   - Editar persona.
   - Eliminar persona.
   - Restablecer datos mock.

El botón de restablecimiento deberá solicitar confirmación antes de ejecutarse.

3. Documentación viva.
   - Prompt completo para reconstruir la aplicación en su estado actual.
   - Contenido de \`AGENTS.md\` y de la documentación general del proyecto.
   - Una tabla de resultados por cada tipo de prueba.
   - El contenido debe generarse desde las fuentes reales y actualizarse automáticamente cuando estas cambien.

## 6. Pruebas y calidad

- Verificar que el backend compila.
- Verificar que el frontend compila.
- Implementar pruebas unitarias razonables para la lógica de negocio.
- Comprobar las operaciones CRUD.
- Comprobar la integración entre frontend y backend.
- No considerar una funcionalidad terminada si no se ha podido verificar.

## 7. Ejecución local

El proyecto debe poder ejecutarse localmente de forma independiente:

- Backend desde Eclipse.
- Frontend desde Visual Studio Code.

Documentar los comandos necesarios para instalar dependencias y ejecutar ambas aplicaciones.

## 8. Despliegue en Docker y Kubernetes

La aplicación debe poder compilarse y desplegarse en dos entornos sin modificar el código fuente:

- **PRE**: preproducción.
- **PRO**: producción.

Mediante:

- Docker y Docker Compose.
- Kubernetes con Kustomize (base común y overlays \`pre\`/\`pro\`).
- Perfiles de Spring y variables de entorno.

Requisitos:

- Mantener las tecnologías obligatorias del proyecto (H2 incluida); no introducir otras sin autorización.
- Dos imágenes independientes: backend JRE 21 sin root y frontend Nginx sin privilegios.
- Configuración externalizada: perfil, base de datos, CORS, secretos y TTL del token por entorno.
- Secretos fuera del repositorio; nunca versionar \`.env\`, contraseñas ni certificados reales.
- H2 sobre volumen persistente, una sola réplica de backend y estrategia \`Recreate\`.
- Sondas de salud reales: Actuator en el backend y \`/healthz\` en el frontend.
- Validar los manifiestos sin necesidad de clúster con \`node scripts/verificar-despliegue.mjs\`.
- Documentar las limitaciones conocidas (H2, tokens en memoria, autologin de demostración).

No se debe afirmar que existe un despliegue real en PRE o PRO si no se ha ejecutado sobre un clúster
y verificado.

## 9. Documentación y seguimiento

Mantener actualizados:

- /docs/SEGUIMIENTO.md: tareas realizadas, pendientes, incidencias y decisiones.
- /docs/ARQUITECTURA.md: estructura y decisiones arquitectónicas.
- /docs/EJECUCION.md: instrucciones para ejecutar el proyecto.
- /docs/API.md: documentación de los endpoints.
- /docs/PROMPT.md: prompt de reconstrucción de la aplicación.
- /docs/PRUEBAS.md: estrategia, suites y resultados esperados.
- /docs/DESPLIEGUE.md: imágenes, Compose, Kubernetes y diferencias PRE/PRO.
- /deploy/README.md: guía rápida de construcción y despliegue.

La página \`/documentacion\` del frontend se genera a partir de \`AGENTS.md\`, \`docs/*.md\`, los tests y los
informes de pruebas. No duplicar su contenido a mano: tras cambiar cualquier fuente, ejecutar
\`npm run docs\` (o \`npm run build\`) en \`/front\` para que la página refleje el último estado.

Utilizar siempre PruebasOpenCode1 como nombre del proyecto en la documentación.

## 10. Forma de trabajar

- Analizar primero los requisitos y la estructura existente.
- Elaborar un plan antes de comenzar.
- Dividir el trabajo en tareas pequeñas y verificables.
- Implementar progresivamente.
- Verificar cada bloque antes de continuar.
- Actualizar el seguimiento después de cada bloque significativo.
- No ocultar errores ni asumir que una operación ha funcionado si no se ha comprobado.
- Informar de los cambios realizados, las pruebas ejecutadas y los problemas encontrados.
`,
}

export const PROMPT: DocumentoGenerado = {
  id: "prompt",
  titulo: "Prompt de reconstrucción de PruebasOpenCode1",
  archivo: "docs/PROMPT.md",
  resumen: "Instrucciones completas para reconstruir la aplicación en su estado actual.",
  markdown: `# Prompt de reconstrucción de PruebasOpenCode1

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
- **Comunicación:** API REST JSON versionada en \`/api/v1\` con autenticación por **token Bearer** de
  corta duración.
- **Errores:** RFC 9457 (\`application/problem+json\`).
- **Pruebas:** JUnit 5, Mockito, MockMvc, Spring Security Test, PIT (mutation testing), Node.js y
  Playwright Core.
- **Despliegue:** Docker, Docker Compose, Kubernetes, Kustomize y Nginx sin privilegios.

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

\`\`\`text
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
├── deploy/
│   ├── README.md
│   ├── docker/
│   │   ├── back.Dockerfile
│   │   ├── front.Dockerfile
│   │   ├── nginx.conf
│   │   ├── docker-compose.yml
│   │   ├── .env.pre.example / .env.pro.example
│   │   └── construir.ps1 / levantar.ps1 / parar.ps1
│   └── k8s/
│       ├── base/               Recursos comunes
│       └── overlays/pre|pro/   Namespace, ConfigMap, Ingress, TLS, HPA y PDB
├── scripts/
│   ├── verificar-integracion.mjs
│   └── verificar-despliegue.mjs
└── .dockerignore
\`\`\`

## 4. Backend

### 4.1 Configuración Maven

- Java 21 y \`spring-boot-starter-parent\` 3.5.16.
- Dependencias: \`spring-boot-starter-web\`, \`spring-boot-starter-data-jpa\`,
  \`spring-boot-starter-validation\`, \`spring-boot-starter-actuator\`,
  \`spring-boot-starter-security\`, \`springdoc-openapi-starter-webmvc-ui\`, \`h2\`,
  \`spring-boot-devtools\` (opcional), \`spring-boot-starter-test\` y \`spring-security-test\`.
- Añade Maven Wrapper (\`mvnw\`, \`mvnw.cmd\`).
- Añade \`maven-enforcer-plugin\` para exigir Java 21.
- Añade \`pitest-maven\` 1.30.2 con \`pitest-junit5-plugin\` 1.2.3 como plugin **opcional**, sin
  enlazarlo a \`clean verify\`.

### 4.2 Entidad \`Persona\`

Tabla \`personas\` con:

| Campo | Tipo | Reglas |
| --- | --- | --- |
| \`id\` | \`Long\` | Clave primaria generada. |
| \`nombre\` | \`String\` | Obligatorio, máximo 80 caracteres. |
| \`apellido\` | \`String\` | Obligatorio, máximo 80 caracteres. |
| \`sexo\` | \`Sexo\` | Enum \`MASCULINO\`, \`FEMENINO\`, \`OTRO\`; almacenado como texto. |
| \`direccion\` | \`String\` | Obligatoria, máximo 200 caracteres. |
| \`fechaNacimiento\` | \`LocalDate\` | Obligatoria y no futura. |
| \`creadoEn\` | \`Instant\` | \`@CreatedDate\`, columna \`creado_en\`, no actualizable. |
| \`actualizadoEn\` | \`Instant\` | \`@LastModifiedDate\`, columna \`actualizado_en\`. |
| \`creadoPor\` | \`String\` | \`@CreatedBy\`, columna \`creado_por\`, longitud 60. |
| \`actualizadoPor\` | \`String\` | \`@LastModifiedBy\`, columna \`actualizado_por\`, longitud 60. |

La entidad usa \`@EntityListeners(AuditingEntityListener.class)\`. La **edad no se almacena**: se
calcula en cada respuesta a partir de \`fechaNacimiento\` y la fecha actual, teniendo en cuenta si el
cumpleaños ya ha pasado. El DTO de respuesta incluye \`id\`, \`nombre\`, \`apellido\`, \`edad\`, \`sexo\`,
\`direccion\`, \`fechaNacimiento\`, \`creadoEn\`, \`actualizadoEn\`, \`creadoPor\` y \`actualizadoPor\`.

### 4.3 Capas y clases

- \`PersonaController\`: expone \`/api/v1/personas\` y devuelve códigos HTTP coherentes.
- \`PersonaService\` + \`PersonaServiceImpl\`: lógica de negocio transaccional.
- \`PersonaRepository\`: repositorio JPA con listado ordenado por apellido y nombre.
- \`PersonaMapper\`: conversión entre entidad y DTO, cálculo de edad y limpieza de espacios.
- \`MockDataFactory\`: fuente única de los 10 registros mock.
- \`MockDataInitializer\`: siembra datos al arrancar solo si la tabla está vacía.
- \`MigracionEsquema\`: elimina la columna heredada \`edad\` si existe en bases antiguas.
- \`AuditoriaConfig\`: activa \`@EnableJpaAuditing\` y resuelve el usuario desde \`SecurityContext\`
  (\`sistema\` si no hay autenticación).
- \`GlobalExceptionHandler\`: respuestas RFC 9457 (\`ProblemDetail\`) homogéneas.
- \`TokenService\` y \`TokenAuthenticationFilter\`: emisión, validación y revocación de tokens.
- \`CorsConfig\`, \`OpenApiConfig\` y \`ConfiguracionDiagnostico\`.

### 4.4 Endpoints

| Método | Ruta | Éxito | Descripción |
| --- | --- | --- | --- |
| \`GET\` | \`/api/v1/personas\` | \`200\` | Lista todas las personas. |
| \`GET\` | \`/api/v1/personas/{id}\` | \`200\` / \`404\` | Obtiene una persona. |
| \`POST\` | \`/api/v1/personas\` | \`201\` + \`Location\` | Crea una persona. |
| \`PUT\` | \`/api/v1/personas/{id}\` | \`200\` / \`404\` | Actualiza una persona. |
| \`DELETE\` | \`/api/v1/personas/{id}\` | \`204\` / \`404\` | Elimina una persona. |
| \`POST\` | \`/api/v1/personas/reset\` | \`200\` | Borra todo y reinserta los 10 mock. |
| \`POST\` | \`/api/v1/auth/login\` | \`200\` / \`401\` | Valida credenciales y emite un token Bearer. |
| \`GET\` | \`/api/v1/auth/sesion\` | \`200\` | Consulta el estado del token (\`autenticado\` puede ser \`false\`). |
| \`POST\` | \`/api/v1/auth/logout\` | \`204\` | Revoca el token actual. |

Salvo \`/api/v1/auth/**\`, todas las rutas \`/api/**\` requieren un token válido y devuelven \`401\` con
\`ProblemDetail\` si no lo hay.

Otros recursos:

- Salud: \`GET /actuator/health\`.
- OpenAPI: \`GET /v3/api-docs\`.
- Swagger UI: \`GET /swagger-ui/index.html\`.
- Consola H2: \`GET /h2-console\` (solo desarrollo).

### 4.5 Validación y errores

- Valida con Jakarta Validation en \`PersonaRequest\`.
- Devuelve \`400\` con un mapa \`validaciones\` por campo.
- Devuelve \`404\` con \`ProblemDetail\` para recursos inexistentes.
- Un enum o JSON inválido devuelve \`400\` con tipo \`cuerpo-ilegible\`.
- Una ruta desconocida devuelve \`404\`, nunca \`500\`.
- No expongas trazas ni mensajes internos en las respuestas.

Todos los errores son \`application/problem+json\` con \`type\`, \`title\`, \`status\`, \`detail\` e \`instance\`.
El prefijo de \`type\` es \`https://pruebasopencode1.example/errors/\` y los tipos son \`no-autenticado\`,
\`credenciales\`, \`acceso-denegado\`, \`validacion\`, \`cuerpo-ilegible\`, \`no-encontrado\`, \`conflicto\` y
\`error-interno\`.

### 4.6 Configuración, perfiles y datos

Usa perfiles \`dev\`, \`test\`, \`pre\` y \`prod\`, con \`dev\` como perfil por defecto. La configuración debe
permitir cambiar de entorno mediante variables sin tocar código:

- \`SPRING_PROFILES_ACTIVE\`.
- \`SERVER_PORT\` (por defecto \`8080\`).
- \`DB_URL\` (por defecto \`jdbc:h2:file:./data/pruebasopencode1\` en \`dev\`).
- \`DB_USERNAME\` y \`DB_PASSWORD\`.
- \`JPA_DDL_AUTO\` (por defecto \`update\`).
- \`JPA_SHOW_SQL\` (por defecto \`false\`).
- \`H2_CONSOLE_ENABLED\` (por defecto \`true\` en \`dev\`, \`pre\` y \`prod\`).
- \`H2_CONSOLE_ALLOW_OTHERS\` (por defecto \`false\`; Docker/Kubernetes lo ponen a \`true\`).
- \`CORS_ALLOWED_ORIGINS\` (por defecto \`http://localhost:5173,http://127.0.0.1:5173\` en \`dev\`).
- \`SEED_MOCK_DATA\` (por defecto \`true\` en \`dev\`, \`pre\` y \`prod\`).
- \`APP_AUTH_USERNAME\` (por defecto \`demo\` en \`dev\`), \`APP_AUTH_PASSWORD\` (por defecto \`demo1234\` en
  \`dev\`), \`APP_AUTH_ROLE\` (por defecto \`USER\`) y \`APP_AUTH_TOKEN_TTL\` (\`15m\` en \`dev\`/\`test\`, \`10m\`
  en \`pre\`, \`5m\` en \`prod\`).
- \`SPRINGDOC_ENABLED\` (\`true\` en \`dev\`/\`test\`/\`pre\`/\`prod\`).
- \`LOG_LEVEL\`.

En \`pre\` y \`prod\` no debe haber valores por defecto para secretos ni para CORS: deben inyectarse
desde el entorno. Incluye \`back/.env.example\` como plantilla y excluye los \`.env\` reales con
\`.gitignore\`.

El perfil \`test\` usa H2 en memoria, \`create-drop\`, sin consola y sin siembra automática.

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

- Entidad JPA \`Usuario\` (tabla \`usuarios\`): \`id\`, \`username\` único, \`password\` con hash BCrypt de 60
  caracteres, \`rol\`, \`activo\` y \`fechaAlta\`. La contraseña en claro nunca se persiste ni se devuelve.
- \`UsuarioRepository\`, \`UsuarioDetailsService\` y \`SecurityConfig\` con
  \`DaoAuthenticationProvider\` y \`BCryptPasswordEncoder\`.
- \`UsuarioInitializer\` crea o sincroniza el usuario configurado al arrancar, comparando la contraseña
  con \`PasswordEncoder.matches()\` y regenerando el hash cuando cambia.
- \`TokenService\` genera tokens opacos de 32 bytes con \`SecureRandom\`, los guarda en memoria con su
  caducidad y permite validarlos y revocarlos.
- \`TokenAuthenticationFilter\` lee \`Authorization: Bearer <token>\` y publica la autenticación en el
  contexto de la petición. No se guarda nada en sesión.
- \`SecurityConfig\` usa \`SessionCreationPolicy.STATELESS\`, desactiva \`formLogin\`, \`httpBasic\` y el
  logout automático, y responde \`401\`/\`403\` con \`ProblemDetail\`.
- CORS con \`allowCredentials(true)\` por compatibilidad, cabecera \`Authorization\` permitida y
  \`Location\` expuesta.
- CSRF desactivado de forma consciente para esta SPA JSON: no se usan cookies de autenticación. Se
  documenta como decisión revisable antes de producción.
- El esquema OpenAPI declara \`bearerAuth\` como esquema de seguridad.

El **autologin transparente** del frontend debe:

1. Ejecutarse solo al entrar en \`/personas\`, no en la bienvenida ni en la documentación.
2. Consultar \`GET /api/v1/auth/sesion\` y, si no hay token vigente, llamar a
   \`POST /api/v1/auth/login\` con las credenciales fijas de demostración.
3. Reutilizar una promesa única para evitar logins duplicados con React StrictMode.
4. Guardar el token **solo en memoria** y enviarlo en \`Authorization\` con \`credentials: 'omit'\`.
5. Renovar el token 60 segundos antes de caducar y, si una llamada autenticada recibe \`401\`, renovar
   una sola vez y repetir la petición.
6. Emitir eventos de «sesión renovada» y «sesión caducada» que la interfaz muestra como avisos.
7. No mostrar nunca un formulario, un botón de login ni las credenciales al usuario.

Las credenciales fijas del frontend se configuran con \`VITE_AUTH_USERNAME\` y \`VITE_AUTH_PASSWORD\` y
deben coincidir con las del backend. Al viajar en el bundle del navegador no son un secreto: este
modelo es válido para la demo local y no para producción.

La **auditoría** se activa con \`@EnableJpaAuditing\`. \`AuditorAware\` toma el usuario del
\`SecurityContext\` y devuelve \`sistema\` si no hay autenticación. Los cuatro campos se exponen en
\`PersonaResponse\`.

## 5. Frontend

### 5.1 Base

- SPA con React, TypeScript y Vite.
- React Router para las rutas.
- Proxy de Vite \`/api\` hacia \`http://localhost:8080\`, configurable con \`VITE_PROXY_TARGET\`.
- Sin frameworks de UI externos: CSS propio, moderno, responsive y accesible.
- Servicios HTTP separados de los componentes.
- Datos de personas siempre desde la API; nunca como sustituto de la base de datos.
- Autologin transparente con las credenciales fijas de demostración, sin formulario visible.
- Todas las peticiones usan \`credentials: 'omit'\` y la cabecera \`Authorization: Bearer\`.
- \`ErrorBoundary\` envuelve la aplicación para mostrar una pantalla de recuperación si falla el
  renderizado.
- Tema claro, oscuro o \`sistema\`, persistido en \`localStorage\` con la clave \`pruebasopencode1.tema\`.
  Un script en \`index.html\` aplica el tema antes de montar React.

### 5.2 Rutas y navegación

- \`/\` — pantalla de bienvenida con presentación, funcionalidades y acceso a personas.
- \`/personas\` — gestión completa de personas.
- \`/documentacion\` — documentación viva del proyecto.
- \`*\` — página 404.

La cabecera incluye la marca, el subtítulo, un menú con **Inicio**, **Personas** y
**Documentación**, y un botón para alternar el tema. La ruta activa se resalta visualmente.

### 5.3 Gestión de personas

La pantalla \`/personas\` debe incluir:

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

La página \`/documentacion\` debe contener, como mínimo, estas secciones:

1. **Prompt de reconstrucción:** contenido de \`docs/PROMPT.md\`, con botón para copiarlo.
2. **Documentación general:** todos los documentos de \`docs/\` y el \`README.md\`, navegables por
   pestañas y renderizados como Markdown.
3. **AGENTS.md:** contenido íntegro de las reglas del proyecto.
4. **Resultados de pruebas:** una tabla por cada tipo de prueba, generada a partir de las fuentes
   reales siempre que sea posible:
   - pruebas unitarias del backend,
   - pruebas de integración del backend,
   - integración de extremo a extremo,
   - interfaz con navegador real,
   - mutation testing de PIT,
   - compilación y tipos del frontend,
   - verificación de despliegue Docker/Kubernetes.

La página no debe duplicar manualmente el contenido de los documentos. Un script de generación
(\`front/scripts/generar-documentacion.mjs\`) debe leer \`AGENTS.md\`, \`docs/*.md\`, los tests de Java, los
scripts de verificación y los informes de PIT/Surefire para producir
\`front/src/content/documentacion.generated.ts\`. El script se ejecuta antes de \`npm run dev\` y de
\`npm run build\`, de modo que la página refleje siempre el último estado. Las tablas deben mostrar el
nombre de cada prueba, su detalle técnico y su resultado.

## 6. Pruebas y calidad

### 6.1 Backend

Implementa al menos estas 11 pruebas unitarias en \`PersonaServiceImplTest\` con Mockito:

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

Implementa al menos estas 14 pruebas de integración en \`PersonaControllerIntegrationTest\` con
MockMvc y H2 en memoria (autenticadas con \`@WithMockUser(username = "demo", roles = "USER")\`):

- Listado inicial vacío.
- Creación con \`201\`, \`Location\` y datos guardados.
- Obtención por identificador.
- \`404\` al obtener un identificador inexistente.
- \`400\` con validaciones por campo.
- \`400\` con sexo inválido.
- Actualización persistente.
- \`404\` al actualizar un identificador inexistente.
- Eliminación con \`204\`.
- \`404\` al eliminar un identificador inexistente.
- Reset con exactamente 10 registros.
- Preflight CORS para el origen del frontend.
- Swagger UI y OpenAPI disponibles.
- Ruta desconocida devuelve \`404\`.

Implementa además estas 9 pruebas de seguridad en \`AuthControllerIntegrationTest\`:

- Sin token, \`GET /api/v1/personas\` devuelve \`401\` con \`ProblemDetail\` y la ruta solicitada.
- Un login válido emite un token Bearer con expiración.
- El token válido permite acceder a personas.
- Credenciales incorrectas devuelven \`401\` sin revelar si el usuario existe.
- Un token inválido devuelve \`401\`.
- La contraseña almacenada es un hash BCrypt de 60 caracteres y \`matches()\` lo confirma.
- El logout revoca el token y las peticiones posteriores devuelven \`401\`.
- \`GET /api/v1/auth/sesion\` con token devuelve usuario, rol y expiración.
- \`GET /api/v1/auth/sesion\` sin token devuelve \`200\` con \`autenticado: false\`.

### 6.2 Mutation testing

Configura PIT para mutar solo \`PersonaServiceImpl\` y \`PersonaMapper\`, ejecutando solo
\`PersonaServiceImplTest\`. Umbrales: 90 % de mutaciones detectadas y 90 % de cobertura de líneas. La
ejecución debe ser rápida (unos segundos) y no formar parte de \`clean verify\`. Comando:

\`\`\`powershell
cd back
$env:JAVA_HOME = "C:\\ruta\\al\\jdk-21"
.\\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage
\`\`\`

\`test-compile\` es obligatorio para no reutilizar clases de prueba obsoletas. El informe se genera en
\`back/target/pit-reports/index.html\`.

### 6.3 Integración y interfaz

- \`scripts/verificar-integracion.mjs\`: 18 comprobaciones a través del proxy de Vite (\`401\` sin token,
  autologin, salud, CORS, listado, reset, creación, consulta, edición, validaciones, auditoría,
  eliminación, logout con revocación y reset final). Debe conservar el token en memoria.
- \`front/scripts/verificar-ui.mjs\`: 14 comprobaciones con Chrome o Edge del sistema mediante
  \`playwright-core\`, sin descargar navegadores. Debe validar bienvenida, autologin transparente,
  listado, búsqueda, creación, edición, eliminación, confirmaciones, reset, validaciones, tema oscuro,
  documentación y consola sin errores. El autologin se detecta como petición real y no debe mostrar
  campos ni acciones de inicio de sesión.
- Ejecutar primero la suite de integración y después la de interfaz: ambas hacen reset y no deben
  correr en paralelo.

### 6.4 Despliegue

Implementa Docker y Kubernetes para PRE y PRO:

- \`deploy/docker/back.Dockerfile\`: multi-stage con Maven y JDK 21, y runtime \`eclipse-temurin:21-jre\`
  con usuario sin privilegios (UID/GID 10001).
- \`deploy/docker/front.Dockerfile\`: multi-stage con Node y Vite, y runtime
  \`nginxinc/nginx-unprivileged\` en el puerto 8080.
- \`deploy/docker/nginx.conf\`: fallback de SPA, proxy \`/api/\` a \`http://back:8080\`, \`/healthz\`,
  proxies de \`/h2-console\`, \`/swagger-ui\`, \`/v3/api-docs\` y \`/actuator\`, cabeceras de seguridad y
  caché de assets con hash.
- \`deploy/docker/docker-compose.yml\` parametrizado por \`deploy/docker/.env.<entorno>\`:
  - PRE: frontend \`8088\`, API directa \`8081\`, perfil \`pre\`, TTL \`10m\`.
  - PRO: frontend \`8098\`, API directa \`8091\`, perfil \`prod\`, TTL \`5m\`.
  - Mismo comportamiento que local: \`SEED_MOCK_DATA=true\`, consola H2, Swagger y reset disponibles.
  - Cada entorno usa su propio proyecto, red y volumen H2.
- \`deploy/docker/construir.ps1\`: construye backend y frontend para un entorno leyendo
  \`deploy/docker/.env.<entorno>\` y permite publicar en un registro con \`-Registro\`. Documenta también
  los comandos \`docker build\` directos, el contexto en la raíz del repositorio, cuándo reconstruir
  cada imagen y los problemas frecuentes.
- \`deploy/k8s/base\`: ConfigMap, PVC, Deployments, Services e Ingress comunes.
- \`deploy/k8s/overlays/pre\`: namespace \`pruebasopencode1-pre\`, perfil \`pre\`, host y TLS de PRE.
- \`deploy/k8s/overlays/pro\`: namespace \`pruebasopencode1-pro\`, perfil \`prod\`, 2 réplicas de frontend,
  HPA (2–4 al 70 % de CPU), PDB y TLS de PRO.
- Backend con 1 réplica, \`Recreate\`, usuario 10001, root FS de solo lectura, \`/tmp\` efímero, sondas
  \`liveness\`/\`readiness\` y \`drop: ALL\`.
- Secretos fuera de las kustomizations; se crean con \`kubectl create secret\`.
- \`scripts/verificar-despliegue.mjs\`: valida Dockerfiles, Nginx, \`.dockerignore\`, Compose y Kustomize
  sin necesitar un clúster. Debe superar **43/43 comprobaciones** y generar
  \`deploy/verificacion-despliegue.json\` para la página \`/documentacion\`.
- \`front/package.json\` expone \`npm run test:deploy\`.

No se debe afirmar que hay un despliegue real si no se ha aplicado sobre un clúster y comprobado.

## 7. Documentación obligatoria

Mantén actualizados, en español y con el nombre PruebasOpenCode1:

- \`README.md\`: presentación, tecnologías, estructura, inicio rápido, comandos y mapa documental.
- \`AGENTS.md\`: reglas de trabajo del proyecto.
- \`docs/ARQUITECTURA.md\`: capas, estructura, decisiones y preparación de despliegues.
- \`docs/SEGURIDAD.md\`: autologin, tokens Bearer, BCrypt, perfiles, secretos y límites del modelo.
- \`docs/API.md\`: contrato REST versionado, ejemplos, errores RFC 9457 y códigos de estado.
- \`docs/EJECUCION.md\`: requisitos, perfiles, arranque, pruebas, variables de entorno y resolución de
  problemas.
- \`docs/PRUEBAS.md\`: estrategia, alcance de cada suite, comandos y resultados esperados.
- \`docs/MANUAL_USUARIO.md\`: guía de uso de la interfaz, incluido el tema.
- \`docs/OPERACION.md\`: configuración, H2, copias, mantenimiento, diagnóstico y operación en Docker.
- \`docs/DESPLIEGUE.md\`: imágenes, Docker Compose, Kubernetes y diferencias PRE/PRO implementados y
  verificados; limitaciones de H2, tokens y autologin.
- \`deploy/README.md\`: guía rápida de construcción y despliegue.
- \`docs/SEGUIMIENTO.md\`: fases, tareas realizadas, resultados, incidencias y próximos pasos.
- \`docs/PROMPT.md\`: este prompt.

Cada cambio funcional o de pruebas debe actualizar la documentación afectada y, como la página
\`/documentacion\` se genera a partir de ella, regenerar el contenido del frontend.

## 8. Ejecución local

El proyecto debe poder ejecutarse en local de forma independiente:

- Backend desde Eclipse o por consola.
- Frontend desde Visual Studio Code o por consola.

Comandos de referencia:

\`\`\`powershell
# Backend
cd back
$env:SPRING_PROFILES_ACTIVE = "dev"
.\\mvnw.cmd spring-boot:run

# Frontend
cd front
npm install
npm run dev
\`\`\`

## 9. Criterios de aceptación

No consideres la tarea terminada hasta comprobar que:

- \`back\\mvnw.cmd -B clean verify\` termina con **BUILD SUCCESS** y 34 pruebas sin fallos (11 unitarias
  + 14 de integración de personas + 9 de autenticación).
- PIT detecta al menos el 90 % de las mutaciones y cubre al menos el 90 % de las líneas mutadas.
- \`front\\npm run build\` compila TypeScript y genera \`dist/\`.
- \`node scripts\\verificar-integracion.mjs\` supera las 18 comprobaciones, incluido el \`401\` sin token,
  el autologin, la auditoría y la revocación tras el logout.
- \`front\\npm run test:ui\` supera las 14 comprobaciones sin errores de consola.
- La verificación de despliegue supera las **43 comprobaciones** (\`node scripts\\verificar-despliegue.mjs\`).
- Docker Compose arranca PRE y PRO con contenedores \`healthy\`, login, CRUD y persistencia H2.
- Kustomize renderiza ambos overlays con su namespace, perfil e imágenes, sin secretos versionados.
- La API de personas devuelve \`401\` sin token; el autologin obtiene un token real y la contraseña
  está cifrada con BCrypt en H2.
- Los errores usan \`application/problem+json\` con \`type\`, \`title\`, \`status\`, \`detail\` e \`instance\`.
- La entidad \`Persona\` registra auditoría de creación y modificación.
- El usuario no ve ningún formulario ni credencial en la interfaz.
- El tema claro/oscuro funciona y persiste, y un error de renderizado muestra el \`ErrorBoundary\`.
- Los perfiles \`dev\`, \`test\`, \`pre\` y \`prod\` arrancan con configuración externalizada y sin secretos
  versionados.
- La página \`/documentacion\` muestra el prompt, la documentación (incluida \`SEGURIDAD.md\`),
  \`AGENTS.md\` y las 7 tablas de resultados, y se actualiza al regenerar el contenido.
- No quedan datos simulados, secretos ni valores específicos de un entorno en el código.

Informa al final de los cambios realizados, las pruebas ejecutadas y cualquier problema encontrado.
`,
}

export const DOCUMENTOS: DocumentoGenerado[] = [
  {
    id: "readme",
    titulo: "PruebasOpenCode1",
    archivo: "README.md",
    resumen: "Presentación del proyecto, inicio rápido y mapa de la documentación.",
    markdown: `# PruebasOpenCode1

Aplicación web full stack para la **gestión de personas**, desarrollada como entorno de pruebas de
desarrollo autónomo con OpenCode.

El proyecto conecta una interfaz moderna en React con una API REST real en Spring Boot y una base de
datos H2. No utiliza datos simulados en el navegador: todas las operaciones se persisten en el
backend.

## Funcionalidades

- Pantalla de bienvenida con presentación del proyecto.
- Listado de personas con búsqueda por nombre, apellido, dirección o sexo.
- Creación de personas con formulario validado.
- Edición de personas con carga de datos existentes.
- Eliminación con diálogo de confirmación.
- Restablecimiento de los 10 datos mock iniciales con confirmación.
- Estados de carga, error, lista vacía y búsqueda sin resultados.
- Notificaciones de éxito y error, y avisos de sesión renovada/caducada.
- Backend con validaciones, DTO, errores **RFC 9457** y CORS configurable.
- API versionada en \`/api/v1\` con autologin transparente mediante **tokens Bearer** de corta duración.
- Contraseña del usuario cifrada con **BCrypt** en H2.
- **Auditoría JPA** de creación y modificación (quién y cuándo).
- Edad calculada automáticamente desde la fecha de nacimiento; no se almacena en la base de datos.
- Tema claro, oscuro o \`sistema\`, persistido en el navegador.
- \`ErrorBoundary\` de React para errores de renderizado.
- Perfiles \`dev\`, \`test\`, \`pre\` y \`prod\` con configuración externalizada y secretos fuera del repositorio.
- Datos iniciales de prueba y consola H2 para desarrollo.
- Migración automática de bases de datos creadas con versiones anteriores.
- Diseño responsive, accesible y completamente en español.

## Tecnologías

| Ámbito | Tecnología |
| --- | --- |
| Backend | Java 21, Spring Boot 3.5.16, Spring Web, Spring Data JPA, Hibernate 6.6, H2 2.3, Spring Security, Maven |
| Frontend | React 19.3, TypeScript 5.9, Vite 7.3, React Router 7.18 |
| Pruebas | JUnit 5, Mockito, MockMvc, Spring Security Test, PIT, Node.js, Playwright Core |
| Despliegue | Docker, Docker Compose, Kubernetes, Kustomize, Nginx |
| Documentación | Markdown |

## Estructura

\`\`\`text
PruebasOpenCode1/
├── back/       API REST en Spring Boot
├── front/      SPA en React + TypeScript + Vite
├── docs/       Documentación general, prompt de reconstrucción y seguimiento
├── deploy/     Dockerfiles, Compose y manifiestos Kustomize PRE/PRO
├── scripts/    Verificación de integración y de despliegue
└── AGENTS.md   Reglas del proyecto
\`\`\`

## Inicio rápido

### Requisitos

- JDK 21.
- Node.js 20.19+ (probado con Node 24).
- No es necesario instalar Maven: se incluye Maven Wrapper.

### 1. Backend

\`\`\`powershell
cd back
.\\mvnw.cmd spring-boot:run
\`\`\`

- API: \`http://localhost:8080/api/v1/personas\`
- Salud: \`http://localhost:8080/actuator/health\`
- Swagger UI: \`http://localhost:8080/swagger-ui/index.html\`
- Consola H2 (solo \`dev\`): \`http://localhost:8080/h2-console\`
  - JDBC URL: \`jdbc:h2:file:./data/pruebasopencode1\`
  - Usuario: \`sa\`
  - Contraseña: vacía

El backend arranca con el perfil \`dev\` por defecto. Se puede seleccionar otro perfil con
\`SPRING_PROFILES_ACTIVE\` (\`dev\`, \`test\`, \`pre\`, \`prod\`). Las variables de entorno de referencia están
en \`back/.env.example\`; los ficheros \`.env\` reales no se versionan.

### 2. Frontend

En otra terminal:

\`\`\`powershell
cd front
npm install
npm run dev
\`\`\`

Abrir \`http://localhost:5173\`.

- \`/\` — bienvenida y acceso a la gestión.
- \`/personas\` — listado, creación, edición, eliminación y reset. El autologin se ejecuta de forma
  transparente la primera vez que se entra.
- \`/documentacion\` — prompt de reconstrucción, documentación, \`AGENTS.md\` y tablas de resultados.

> En Windows, si PowerShell bloquea \`npm.ps1\`, usar \`npm.cmd\`.

## Compilación y pruebas

\`\`\`powershell
# Backend: compilación + 34 pruebas
cd back
.\\mvnw.cmd clean verify

# Mutation testing opcional (servicio y mapper)
.\\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage

# Frontend: tipos + build de producción
cd ..\\front
npm run build

# Regenerar la página /documentacion desde las fuentes
npm run docs

# Con ambos servidores arrancados:
# 18 comprobaciones de integración a través del proxy de Vite
cd ..
node scripts\\verificar-integracion.mjs

# 14 comprobaciones de interfaz en navegador real (requiere backend y frontend)
cd front
npm run test:ui
\`\`\`

> Ejecutar la suite de integración **antes** que la de interfaz: ambas restablecen los datos mock y no
> deben ejecutarse en paralelo.

Resultados de la última verificación: **BUILD SUCCESS**, 34 pruebas de backend (11 unitarias, 14 de
integración de personas y 9 de autenticación), 18 comprobaciones de integración y 14 de interfaz, sin
errores en consola. PIT detecta **21/21 mutaciones (100 %)** en el servicio y el mapper. El detalle
está en [\`docs/SEGUIMIENTO.md\`](docs/SEGUIMIENTO.md) y la estrategia de pruebas en
[\`docs/PRUEBAS.md\`](docs/PRUEBAS.md).

## Docker y Kubernetes (PRE/PRO)

El proyecto incluye imágenes y manifiestos listos para PRE y PRO. Ambos entornos replican el
comportamiento local: H2 persistente, 10 datos mock, reset, consola H2, Swagger y CRUD.

\`\`\`powershell
# Construir imágenes de PRE
Copy-Item deploy\\docker\\.env.pre.example deploy\\docker\\.env.pre
.\\deploy\\docker\\construir.ps1 -Entorno pre

# Arrancar PRE: front http://localhost:8088 · API directa http://localhost:8081
.\\deploy\\docker\\levantar.ps1 -Entorno pre -Reconstruir

# PRO: front http://localhost:8098 · API directa http://localhost:8091
Copy-Item deploy\\docker\\.env.pro.example deploy\\docker\\.env.pro
.\\deploy\\docker\\levantar.ps1 -Entorno pro -Reconstruir
\`\`\`

La construcción paso a paso, los comandos \`docker build\` directos, la publicación en un registro y
los problemas frecuentes están en
[\`docs/DESPLIEGUE.md\`](docs/DESPLIEGUE.md#43-construcción-de-las-imágenes) y
[\`deploy/README.md\`](deploy/README.md).

Kubernetes:

\`\`\`powershell
kubectl apply -f deploy/k8s/overlays/pre/namespace.yaml
kubectl -n pruebasopencode1-pre create secret generic pruebasopencode1-secrets \`
  --from-literal=DB_USERNAME=sa --from-literal=DB_PASSWORD='...' \`
  --from-literal=APP_AUTH_USERNAME='...' --from-literal=APP_AUTH_PASSWORD='...'
kubectl apply -k deploy/k8s/overlays/pre
\`\`\`

La validación sin clúster se ejecuta con \`node scripts\\verificar-despliegue.mjs\` (**43/43**). La guía
completa, las diferencias PRE/PRO y las limitaciones de H2 y de los tokens están en
[\`docs/DESPLIEGUE.md\`](docs/DESPLIEGUE.md) y [\`deploy/README.md\`](deploy/README.md).

## Documentación

- [Prompt de reconstrucción](docs/PROMPT.md): instrucciones completas para recrear la aplicación.
- [Seguimiento del proyecto](docs/SEGUIMIENTO.md): plan, resultados, decisiones e incidencias.
- [Arquitectura](docs/ARQUITECTURA.md): estructura, capas, modelo de datos y decisiones técnicas.
- [Seguridad](docs/SEGURIDAD.md): autologin transparente, tokens Bearer, BCrypt y límites del modelo.
- [Ejecución local](docs/EJECUCION.md): requisitos, arranque desde Eclipse/VS Code y problemas frecuentes.
- [API REST](docs/API.md): endpoints \`/api/v1\`, contratos, errores RFC 9457 y ejemplos.
- [Pruebas](docs/PRUEBAS.md): estrategia, suites, mutation testing, comandos y resultados esperados.
- [Manual de usuario](docs/MANUAL_USUARIO.md): uso de la interfaz, tema y avisos de sesión.
- [Operación](docs/OPERACION.md): configuración, H2, copias, migración, logs y diagnóstico.
- [Despliegue](docs/DESPLIEGUE.md): Docker Compose y Kubernetes con overlays PRE/PRO verificados.

La ruta \`/documentacion\` del frontend reúne el prompt, estos documentos, \`AGENTS.md\` y una tabla por
tipo de prueba. Su contenido se genera con \`npm run docs\` desde las fuentes reales, por lo que no debe
editarse a mano.

## Configuración

El backend se configura por variables de entorno con valores por defecto para desarrollo
(\`SERVER_PORT\`, \`DB_URL\`, \`CORS_ALLOWED_ORIGINS\`, \`SEED_MOCK_DATA\`, \`H2_CONSOLE_ENABLED\`,
\`SPRINGDOC_ENABLED\`, \`APP_AUTH_USERNAME\`,
\`APP_AUTH_PASSWORD\`, \`APP_AUTH_TOKEN_TTL\`, etc.). En \`pre\` y \`prod\` los secretos no tienen valor por
defecto y deben inyectarse desde el entorno. El frontend usa \`VITE_API_BASE_URL\`,
\`VITE_PROXY_TARGET\`, \`VITE_AUTH_USERNAME\` y \`VITE_AUTH_PASSWORD\`; hay un ejemplo en
\`front/.env.example\`.

## Notas

- La base de datos H2 se guarda en \`back/data/\` al arrancar desde esa carpeta.
- La edad no se guarda en la tabla \`personas\`: se calcula desde \`fechaNacimiento\` y la fecha actual.
- Al arrancar, el backend elimina automáticamente la antigua columna \`edad\` si existe. No hace falta
  borrar \`back/data\` al actualizar desde una versión anterior.
- Las filas creadas antes de la auditoría conservan sus campos de auditoría a \`null\`; las nuevas y las
  del reset se rellenan automáticamente.
- El restablecimiento de datos mock restablece el contenido, no la secuencia de identificadores.
- Las credenciales del autologin son fijas y de demostración (\`demo\` / \`demo1234\`); no son aptas para
  producción. El token se guarda solo en memoria y el backend es sin estado. El detalle del modelo
  está en [\`docs/SEGURIDAD.md\`](docs/SEGURIDAD.md).
- Las imágenes Docker y los manifiestos de Kubernetes para PRE y PRO están implementados y validados.
  No se ha desplegado en un clúster real; H2 exige una sola réplica de backend y volumen persistente.
  Véase [\`docs/DESPLIEGUE.md\`](docs/DESPLIEGUE.md).
`,
  },
  {
    id: "arquitectura",
    titulo: "Arquitectura de PruebasOpenCode1",
    archivo: "docs/ARQUITECTURA.md",
    resumen: "Capas, estructura, decisiones técnicas y preparación de despliegues.",
    markdown: `# Arquitectura de PruebasOpenCode1

> Documento actualizado el 2026-11-09.

## 1. Visión general

PruebasOpenCode1 es una aplicación web full stack para la gestión de personas. Está formada por
dos aplicaciones independientes que se comunican mediante una API REST versionada:

- **Backend** (\`/back\`): Java 21, Spring Boot 3.5, Spring Data JPA, Hibernate, H2, Maven,
  Spring Security con tokens Bearer y springdoc-openapi (Swagger UI).
- **Frontend** (\`/front\`): React 19, TypeScript, Vite y React Router.
- **Documentación** (\`/docs\`): arquitectura, seguridad, API, ejecución, pruebas, manual de usuario,
  operación, despliegue y seguimiento.

\`\`\`text
┌──────────────────────────┐        HTTP/JSON         ┌──────────────────────────┐
│  Frontend React (5173)   │  ──────────────────────▶ │  API REST Spring (8080)  │
│  React + TypeScript      │  ◀────────────────────── │  Controller/Service/Repo │
│  Vite (proxy /api/v1)    │   CORS + Bearer token    │  DTO + Validación        │
│  Autologin transparente  │                          │  Spring Security + BCrypt│
│  Tema claro/oscuro       │                          │  JPA Auditing            │
└──────────────────────────┘                          └────────────┬─────────────┘
                                                                   │ JPA / Hibernate
                                                                   ▼
                                                          ┌──────────────────────┐
                                                          │   H2 (fichero local) │
                                                          │ personas y usuarios  │
                                                          └──────────────────────┘
\`\`\`

En desarrollo, Vite publica el frontend en \`http://localhost:5173\` y redirige las peticiones
\`/api/**\` al backend en \`http://localhost:8080\`. El backend también acepta peticiones directas del
origen del frontend mediante CORS configurable.

## 2. Estructura del repositorio

\`\`\`text
PruebasOpenCode1/
├── AGENTS.md
├── README.md
├── .editorconfig
├── .gitignore
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
├── scripts/
│   ├── verificar-integracion.mjs
│   └── verificar-despliegue.mjs
├── deploy/
│   ├── docker/          # Dockerfiles, Nginx y Docker Compose
│   └── k8s/             # Kustomize base + overlays PRE/PRO
├── back/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── .env.example
│   ├── .mvn/wrapper/maven-wrapper.properties
│   └── src/
│       ├── main/
│       │   ├── java/com/pruebasopencode1/personas/
│       │   │   ├── PruebasOpenCode1Application.java
│       │   │   ├── config/
│       │   │   │   ├── AuditoriaConfig.java
│       │   │   │   ├── ConfiguracionDiagnostico.java
│       │   │   │   ├── CorsConfig.java
│       │   │   │   ├── MigracionEsquema.java
│       │   │   │   ├── MockDataInitializer.java
│       │   │   │   ├── OpenApiConfig.java
│       │   │   │   ├── SecurityConfig.java
│       │   │   │   └── UsuarioInitializer.java
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java
│       │   │   │   └── PersonaController.java
│       │   │   ├── dto/
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── PersonaRequest.java
│       │   │   │   ├── PersonaResponse.java
│       │   │   │   ├── SesionResponse.java
│       │   │   │   └── TokenResponse.java
│       │   │   ├── entity/
│       │   │   │   ├── Persona.java
│       │   │   │   ├── Sexo.java
│       │   │   │   └── Usuario.java
│       │   │   ├── exception/
│       │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   └── PersonaNotFoundException.java
│       │   │   ├── mapper/
│       │   │   │   └── PersonaMapper.java
│       │   │   ├── repository/
│       │   │   │   ├── PersonaRepository.java
│       │   │   │   └── UsuarioRepository.java
│       │   │   ├── security/
│       │   │   │   ├── TokenAuthenticationFilter.java
│       │   │   │   └── TokenService.java
│       │   │   └── service/
│       │   │       ├── MockDataFactory.java
│       │   │       ├── PersonaService.java
│       │   │       ├── UsuarioDetailsService.java
│       │   │       └── impl/
│       │   │           └── PersonaServiceImpl.java
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-dev.yml
│       │       ├── application-pre.yml
│       │       └── application-prod.yml
│       └── test/
│           ├── java/com/pruebasopencode1/personas/
│           │   ├── controller/AuthControllerIntegrationTest.java
│           │   ├── controller/PersonaControllerIntegrationTest.java
│           │   └── service/PersonaServiceImplTest.java
│           └── resources/application-test.yml
└── front/
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── .env.example
    ├── public/favicon.svg
    ├── scripts/
    │   ├── generar-documentacion.mjs
    │   └── verificar-ui.mjs
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── theme.ts
        ├── styles.css
        ├── vite-env.d.ts
        ├── api/
        │   ├── auth.ts
        │   ├── client.ts
        │   └── personas.ts
        ├── components/
        │   ├── ConfirmDialog.tsx
        │   ├── ErrorBoundary.tsx
        │   ├── Footer.tsx
        │   ├── Header.tsx
        │   ├── Icono.tsx
        │   ├── Markdown.tsx
        │   ├── Modal.tsx
        │   ├── Notificacion.tsx
        │   ├── PersonaForm.tsx
        │   └── PersonaTable.tsx
        ├── content/
        │   └── documentacion.generated.ts
        ├── hooks/
        │   ├── useNotificacion.ts
        │   ├── usePersonas.ts
        │   └── useTema.ts
        ├── pages/
        │   ├── DocumentacionPage.tsx
        │   ├── InicioPage.tsx
        │   ├── NoEncontradaPage.tsx
        │   └── PersonasPage.tsx
        └── types/
            └── persona.ts
\`\`\`

## 3. Backend

### 3.1 Arquitectura por capas

| Capa | Clases | Responsabilidad |
| --- | --- | --- |
| Controller | \`PersonaController\`, \`AuthController\` | Expone los endpoints REST, valida la entrada y construye las respuestas HTTP. |
| Service | \`PersonaService\`, \`PersonaServiceImpl\`, \`UsuarioDetailsService\` | Lógica de negocio, transacciones y carga de usuarios para Spring Security. |
| Repository | \`PersonaRepository\`, \`UsuarioRepository\` | Acceso a datos mediante Spring Data JPA. |
| Entity | \`Persona\`, \`Sexo\`, \`Usuario\` | Modelo persistente JPA. |
| DTO | \`PersonaRequest\`, \`PersonaResponse\`, \`LoginRequest\`, \`SesionResponse\`, \`TokenResponse\` | Contratos de entrada/salida, separados de las entidades. |
| Mapper | \`PersonaMapper\` | Conversión entidad ↔ DTO, cálculo de edad y normalización de textos. |
| Security | \`TokenService\`, \`TokenAuthenticationFilter\` | Emisión, validación y revocación de tokens Bearer opacos. |
| Config | \`AuditoriaConfig\`, \`CorsConfig\`, \`MockDataInitializer\`, \`MigracionEsquema\`, \`ConfiguracionDiagnostico\`, \`OpenApiConfig\`, \`SecurityConfig\`, \`UsuarioInitializer\` | Auditoría JPA, CORS, siembra, migración, aviso de configuración, OpenAPI, seguridad sin estado y usuario del autologin. |
| Exception | \`GlobalExceptionHandler\`, \`PersonaNotFoundException\` | Traducción de errores a \`ProblemDetail\` RFC 9457, incluidos \`401\` y \`403\`. |

Flujo de una petición de escritura:

\`\`\`text
POST /api/v1/personas
  → TokenAuthenticationFilter valida Authorization: Bearer
  → PersonaController (@Valid)
  → PersonaService.crear()
  → PersonaMapper.toEntity()
  → PersonaRepository.save()
  → JPA Auditing rellena creadoEn/actualizadoEn/creadoPor/actualizadoPor
  → Hibernate / H2
  → PersonaMapper.toResponse()
  → 201 Created + Location + JSON
\`\`\`

### 3.2 Modelo de datos

Tabla \`personas\`:

| Campo | Tipo Java | Columna | Restricciones |
| --- | --- | --- | --- |
| \`id\` | \`Long\` | \`id\` | Clave primaria, autoincremental (\`IDENTITY\`). |
| \`nombre\` | \`String\` | \`nombre\` | Obligatorio, máximo 80 caracteres. |
| \`apellido\` | \`String\` | \`apellido\` | Obligatorio, máximo 80 caracteres. |
| \`sexo\` | \`Sexo\` | \`sexo\` | Obligatorio, almacenado como texto. |
| \`direccion\` | \`String\` | \`direccion\` | Obligatorio, máximo 200 caracteres. |
| \`fechaNacimiento\` | \`LocalDate\` | \`fecha_nacimiento\` | Obligatorio, no puede ser futura. |
| \`creadoEn\` | \`Instant\` | \`creado_en\` | \`@CreatedDate\`, solo en creación. |
| \`actualizadoEn\` | \`Instant\` | \`actualizado_en\` | \`@LastModifiedDate\`. |
| \`creadoPor\` | \`String\` | \`creado_por\` | \`@CreatedBy\`, solo en creación. |
| \`actualizadoPor\` | \`String\` | \`actualizado_por\` | \`@LastModifiedBy\`. |

Valores de \`Sexo\`: \`MASCULINO\`, \`FEMENINO\`, \`OTRO\`.

La edad **no se almacena**. \`PersonaResponse\` incluye \`edad\`, pero \`PersonaMapper\` la calcula en cada
respuesta con \`Period.between(fechaNacimiento, LocalDate.now())\`, de modo que siempre refleja la fecha
actual y no puede quedar desincronizada. Por eso \`PersonaRequest\` no acepta \`edad\`.

\`MigracionEsquema\` elimina al arrancar la columna \`edad\` de bases H2 creadas con versiones anteriores.
Así una instalación existente se actualiza sin borrar \`back/data\`.

### 3.3 Persistencia y configuración

- H2 en modo fichero: \`jdbc:h2:file:./data/pruebasopencode1\` en \`dev\`.
- Esquema creado/actualizado automáticamente con \`spring.jpa.hibernate.ddl-auto=update\`.
- Consola H2 disponible en \`/h2-console\` solo en desarrollo.
- Perfil \`test\`: H2 en memoria, \`create-drop\`, sin consola y sin siembra automática.
- Perfiles \`dev\`, \`test\`, \`pre\` y \`prod\` como ficheros \`application-<perfil>.yml\`.
- Todos los parámetros relevantes se leen de variables de entorno con valores por defecto en local
  (puerto, URL de base de datos, credenciales, CORS, nivel de log, siembra, autenticación y TTL del
  token). En \`pre\` y \`prod\` los secretos no tienen valor por defecto.
- Los datos mock viven en una única fuente (\`MockDataFactory\`) y se insertan al arrancar solo si la
  tabla está vacía. El endpoint de reset elimina todo y vuelve a insertar esa misma lista.
- La tabla \`usuarios\` la mantiene \`UsuarioInitializer\`; la contraseña se guarda con BCrypt y los
  tokens se emiten con una vigencia configurable (\`APP_AUTH_TOKEN_TTL\`).

### 3.4 Gestión de errores

\`GlobalExceptionHandler\` devuelve un \`ProblemDetail\` RFC 9457 con \`type\`, \`title\`, \`status\`, \`detail\`
e \`instance\`. Las validaciones añaden la propiedad \`validaciones\`:

\`\`\`json
{
  "type": "https://pruebasopencode1.example/errors/validacion",
  "title": "Datos no válidos",
  "status": 400,
  "detail": "Los datos enviados no son válidos. Revise los campos indicados.",
  "instance": "/api/v1/personas",
  "validaciones": {
    "nombre": "El nombre es obligatorio"
  }
}
\`\`\`

| Situación | Código | \`type\` |
| --- | --- | --- |
| Recurso inexistente | 404 | \`no-encontrado\` |
| Validación de campos | 400 | \`validacion\` |
| JSON mal formado, enum o fecha inválidos | 400 | \`cuerpo-ilegible\` |
| Sin token o token inválido | 401 | \`no-autenticado\` |
| Credenciales incorrectas | 401 | \`credenciales\` |
| Token sin permisos | 403 | \`acceso-denegado\` |
| Conflicto de integridad | 409 | \`conflicto\` |
| Error inesperado | 500 | \`error-interno\` |

### 3.5 CORS

La propiedad \`app.cors.allowed-origins\` (variable \`CORS_ALLOWED_ORIGINS\`) contiene una lista
separada por comas. Por defecto permite \`http://localhost:5173\` y \`http://127.0.0.1:5173\`.
Se aplica a \`/api/**\` con métodos \`GET\`, \`POST\`, \`PUT\`, \`DELETE\` y \`OPTIONS\`, cabeceras abiertas
(incluida \`Authorization\`), exposición de \`Location\` y \`allowCredentials(true)\` por compatibilidad.

### 3.6 Datos iniciales

Se incluyen 10 personas de ejemplo con todos los campos cubiertos. Al arrancar:

- Si la tabla está vacía, se insertan los datos mock.
- Si ya existen datos, se conservan.
- \`POST /api/v1/personas/reset\` elimina todas las filas y reinserta exactamente esos 10 registros.

### 3.7 Seguridad, tokens y auditoría

La API de personas está protegida con Spring Security y **tokens Bearer de corta duración**. El
backend es **sin estado**: no crea \`HttpSession\` ni cookie \`JSESSIONID\`. El frontend ejecuta un
autologin transparente la primera vez que se entra en \`/personas\`:

1. \`GET /api/v1/auth/sesion\` comprueba si el token en memoria sigue vigente.
2. Si no lo está, \`POST /api/v1/auth/login\` valida las credenciales fijas.
3. El backend genera 32 bytes con \`SecureRandom\` y devuelve un token opaco con su caducidad.
4. El frontend guarda el token **solo en memoria** y lo envía en \`Authorization: Bearer\`.
5. \`TokenAuthenticationFilter\` valida el token en cada petición.
6. Si el token caduca o el backend se reinicia, un \`401\` dispara una renovación transparente.

| Elemento | Implementación |
| --- | --- |
| Vigencia | \`15m\` en \`dev\`/\`test\`, \`10m\` en \`pre\`, \`5m\` en \`prod\` (\`APP_AUTH_TOKEN_TTL\`). |
| Almacenamiento | Mapa en memoria del backend; se pierde al reiniciar. |
| Renovación | El frontend renueva 60 s antes de caducar y reintenta una vez tras \`401\`. |
| Logout | \`POST /api/v1/auth/logout\` elimina el token del servidor. |
| Contraseña | BCrypt en la tabla \`usuarios\`. |
| Auditoría | \`@EnableJpaAuditing\`; usuario del \`SecurityContext\` o \`sistema\`. |

Tabla \`usuarios\`:

| Campo | Tipo Java | Columna | Restricciones |
| --- | --- | --- | --- |
| \`id\` | \`Long\` | \`id\` | Clave primaria autoincremental. |
| \`username\` | \`String\` | \`username\` | Obligatorio, único, máximo 60 caracteres. |
| \`password\` | \`String\` | \`password_hash\` | Hash BCrypt de 60 caracteres. |
| \`rol\` | \`String\` | \`rol\` | Obligatorio; por defecto \`USER\`. |
| \`activo\` | \`boolean\` | \`activo\` | Permite deshabilitar la cuenta. |
| \`fechaAlta\` | \`LocalDateTime\` | \`fecha_alta\` | Fecha de creación. |

\`UsuarioInitializer\` crea el usuario configurado con BCrypt al arrancar y mantiene el hash alineado
con \`APP_AUTH_PASSWORD\`. La contraseña en claro nunca se persiste. \`SecurityConfig\` publica
\`/api/v1/auth/**\`, Actuator, Swagger y la consola H2; el resto de \`/api/**\` exige un token válido y
responde \`401\`/\`403\` con \`ProblemDetail\`.

El modelo es válido para la demo local, no para producción: las credenciales fijas viajan en el
bundle del navegador y CSRF está desactivado porque no se usan cookies de autenticación. El detalle
completo está en [\`SEGURIDAD.md\`](SEGURIDAD.md).

## 4. Frontend

### 4.1 Organización

| Elemento | Responsabilidad |
| --- | --- |
| \`App.tsx\` | Rutas (\`/\`, \`/personas\`, \`/documentacion\`, \`*\`), cabecera, contenido y pie. |
| \`main.tsx\` | Monta React dentro de \`ErrorBoundary\` y aplica el tema inicial. |
| \`theme.ts\` y \`hooks/useTema.ts\` | Preferencia claro/oscuro/sistema y persistencia en \`localStorage\`. |
| \`pages/InicioPage.tsx\` | Pantalla de bienvenida con presentación y acceso a la gestión. |
| \`pages/PersonasPage.tsx\` | Estado de la pantalla, búsqueda, modales, avisos de sesión y notificaciones. |
| \`pages/DocumentacionPage.tsx\` | Documentación viva: prompt, documentos, \`AGENTS.md\` y resultados. |
| \`components/ErrorBoundary.tsx\` | Pantalla de recuperación ante errores de renderizado. |
| \`components/Markdown.tsx\` | Renderizador Markdown propio, sin dependencias externas. |
| \`content/documentacion.generated.ts\` | Contenido generado desde las fuentes del repositorio. |
| \`scripts/generar-documentacion.mjs\` | Generador que lee documentos, tests e informes de pruebas. |
| \`components/PersonaTable.tsx\` | Tabla responsive, avatares, insignias y acciones. |
| \`components/PersonaForm.tsx\` | Formulario modal de creación/edición con validación. |
| \`components/ConfirmDialog.tsx\` | Confirmación reutilizable para borrado y reset. |
| \`components/Modal.tsx\` | Modal accesible con cierre por Escape y bloqueo de scroll. |
| \`hooks/usePersonas.ts\` | Carga y mutaciones contra la API; única fuente de verdad remota. |
| \`hooks/useNotificacion.ts\` | Toasts de éxito y error con autocierre. |
| \`api/auth.ts\` | Autologin transparente, token en memoria, renovación, logout y eventos de sesión. |
| \`api/client.ts\` | \`fetch\` centralizado, cabecera Bearer, \`ProblemDetail\` y reintento único tras \`401\`. |
| \`api/personas.ts\` | Contrato de endpoints de personas. |
| \`types/persona.ts\` | Tipos, etiquetas, formateo de fechas y ordenación. |
| \`styles.css\` | Sistema visual propio, responsive, accesible y con tema oscuro. |

### 4.2 Comunicación con la API

- URL base por defecto: \`/api/v1\` (proxy de Vite en desarrollo).
- Configurable en producción con \`VITE_API_BASE_URL\`.
- El proxy de desarrollo se puede redirigir con \`VITE_PROXY_TARGET\`.
- Antes de cargar personas, \`usePersonas\` llama a \`asegurarSesion()\`: consulta \`/auth/sesion\` y, si
  no hay token vigente, hace \`POST /auth/login\` con las credenciales de demostración. Es transparente
  para el usuario.
- Todas las peticiones usan \`credentials: 'omit'\` y la cabecera \`Authorization: Bearer <token>\`; si
  una llamada autenticada recibe \`401\`, se renueva el token una vez y se repite.
- No se usan datos simulados ni almacenamiento local como sustituto del backend. La lista que se
  muestra proviene de \`GET /api/v1/personas\` y todas las mutaciones se confirman contra la API.
- \`ApiError\` (clase del cliente) conserva el código HTTP, el \`title\`, el \`detail\`, el \`type\` y las
  validaciones por campo de una respuesta \`application/problem+json\`.

### 4.3 Estados de interfaz

- **Carga**: indicador animado en la tabla y contador «Cargando…».
- **Error de carga**: aviso con mensaje y botón «Reintentar».
- **Lista vacía**: estado específico con acción para crear la primera persona.
- **Búsqueda sin resultados**: mensaje diferenciado.
- **Operaciones**: botones deshabilitados mientras se guarda, elimina o restablece.
- **Confirmaciones**: borrado y reset requieren confirmación explícita.
- **Feedback**: notificaciones de éxito/error y validaciones en español.
- **Sesión**: avisos de «sesión renovada» y «sesión caducada» sin interrumpir el flujo.
- **Errores de renderizado**: \`ErrorBoundary\` muestra una pantalla de recuperación en lugar de una
  página en blanco.

### 4.4 Diseño, tema y accesibilidad

- Interfaz íntegramente en español.
- Diseño responsive con puntos de corte en 960, 720 y 460 px.
- Tema claro, oscuro o \`sistema\`; se guarda en \`localStorage\` con la clave \`pruebasopencode1.tema\`.
- Un script en \`index.html\` aplica el tema antes de montar React para evitar parpadeos.
- Navegación por teclado, \`focus-visible\`, etiquetas asociadas, \`aria-invalid\`,
  \`aria-describedby\`, diálogos \`role="dialog"\` y enlace «Saltar al contenido».
- Soporte de \`prefers-reduced-motion\` y \`prefers-color-scheme\`.
- Sin dependencias de UI externas: sistema visual propio basado en variables CSS.

### 4.5 Documentación viva

La ruta \`/documentacion\` centraliza el conocimiento del proyecto dentro de la propia aplicación:

| Sección | Origen |
| --- | --- |
| Prompt de reconstrucción | \`docs/PROMPT.md\` |
| Documentación general | \`README.md\` y \`docs/*.md\` |
| Reglas del proyecto | \`AGENTS.md\` |
| Resultados de pruebas | Tests de Java, Surefire, scripts E2E/UI y PIT |

\`front/scripts/generar-documentacion.mjs\` lee esas fuentes y escribe
\`front/src/content/documentacion.generated.ts\`. El resultado se renderiza con \`Markdown.tsx\`, un
intérprete ligero que soporta títulos, listas, tablas, código, citas, enlaces y formato en línea sin
añadir dependencias. Los enlaces internos entre documentos abren la pestaña correspondiente.

Los hooks \`predev\` y \`prebuild\` ejecutan \`npm run docs\`, por lo que la página no puede quedar
desincronizada de las fuentes al arrancar o compilar. Cada tabla de resultados se genera por tipo de
prueba y marca las comprobaciones con el último resultado registrado.

## 5. Decisiones arquitectónicas

| Decisión | Motivo |
| --- | --- |
| Separar entidad y DTO | Evita exponer el modelo JPA y permite contratos estables y validados. |
| Mapper explícito sin Lombok | Menos dependencias, código transparente y compatible con cualquier IDE. |
| H2 en fichero en desarrollo | Los datos sobreviven a reinicios y se puede probar el reset; los tests usan memoria. |
| Mutation testing opcional con PIT | Detecta pruebas que pasan sin verificar realmente la lógica, sin añadir tiempo a \`clean verify\`. |
| \`POST /api/v1/personas/reset\` | Operación explícita, idempotente y separada del CRUD. |
| Versionado \`/api/v1\` | Permite evolucionar el contrato sin romper clientes existentes. |
| CORS configurable por entorno | Permite cambiar orígenes sin recompilar. |
| Proxy \`/api\` en Vite | Evita CORS en desarrollo y simplifica la configuración del cliente. |
| Configuración por perfiles y variables de entorno | Permite Docker/Kubernetes y entornos PRE/PRO sin tocar código. |
| Dos imágenes Docker independientes | Backend JRE y frontend Nginx con ciclos de vida y escalado separados. |
| Kustomize base + overlays PRE/PRO | Evita duplicar manifiestos y hace explícitas las diferencias de entorno. |
| H2 sobre PVC y una réplica de backend | H2 en fichero no admite concurrencia de varias instancias; se documenta la limitación. |
| Seguridad con tokens Bearer opacos | Autenticación real sin estado, revocación explícita y sin dependencia JWT. |
| Token en memoria del frontend | No se persiste en el navegador; recargar provoca un nuevo autologin transparente. |
| Contraseña con BCrypt en H2 | Demuestra un almacenamiento realista de credenciales y evita guardar texto plano. |
| Autologin transparente con promesa única | Cumple el requisito de no mostrar login y evita duplicados con React StrictMode. |
| Errores RFC 9457 (\`ProblemDetail\`) | Contrato estándar, mantenible y fácil de consumir por el frontend. |
| Auditoría JPA básica | Registra quién y cuándo creó o modificó cada persona. |
| CSRF desactivado en la demo | No hay cookies de autenticación; se documenta y se revisará si cambia el modelo. |
| CSS propio con tema oscuro | Interfaz ligera, moderna y sin dependencias innecesarias. |
| \`ErrorBoundary\` en React | Evita que un error de renderizado deje la aplicación en blanco. |
| Actuator con sondas de salud | Alimenta las sondas de Kubernetes y la monitorización. |

## 6. Calidad y pruebas

- **Backend**: 11 pruebas unitarias del servicio + 14 de integración de personas + 9 de autenticación
  = **34 pruebas**. Se ejecutan con Maven Wrapper. Cubren CRUD, reset, validaciones, errores RFC 9457,
  CORS, Swagger, rutas inexistentes, tokens, logout y contraseña BCrypt.
- **Frontend**: comprobación de tipos y build de producción con Vite.
- **Integración**: script Node que recorre el flujo completo a través del proxy de Vite, incluido el
  \`401\` sin token, el autologin, la auditoría y la revocación tras el logout (**18 comprobaciones**).
- **Interfaz**: script con navegador real (Chrome/Edge mediante \`playwright-core\`) que valida
  bienvenida, autologin transparente, listado, búsqueda, creación, edición, borrado, reset,
  validaciones, tema oscuro y consola sin errores (**14 comprobaciones**).
- **Mutación**: PIT 1.30.2 sobre \`PersonaServiceImpl\` y \`PersonaMapper\`, con 21 mutaciones y umbral
  mínimo del 90 %. Es opcional y se ejecuta fuera de \`clean verify\`.
- **Documentación**: la página \`/documentacion\` se regenera con \`npm run docs\` y se valida con el
  build de tipos. Una verificación funcional comprueba sus secciones, pestañas, tablas y consola.
- **Despliegue**: \`scripts/verificar-despliegue.mjs\` valida Dockerfiles, Nginx, Compose PRE/PRO y los
  overlays Kustomize (**43 comprobaciones**, sin clúster).

La estrategia detallada está en [\`PRUEBAS.md\`](PRUEBAS.md) y los resultados se registran en
[\`SEGUIMIENTO.md\`](SEGUIMIENTO.md).

## 7. Docker y Kubernetes

La aplicación se puede ejecutar en Docker y Kubernetes sin cambiar el código:

- **Imágenes**: \`deploy/docker/back.Dockerfile\` (Maven + JRE 21 sin root) y
  \`deploy/docker/front.Dockerfile\` (Node + Nginx sin privilegios).
- **Compose**: \`deploy/docker/docker-compose.yml\` con un proyecto, red, volumen y puertos por entorno.
- **Kubernetes**: base común en \`deploy/k8s/base\` y overlays \`pre\`/\`pro\` con namespace, perfil,
  ConfigMap, Ingress, TLS y recursos de escalado.
- **Configuración**: el perfil, la base de datos, CORS y los secretos se inyectan por entorno; la
  imagen del backend es la misma en PRE y PRO.
- **Paridad con local**: PRE y PRO siembran los 10 datos mock, permiten reset y exponen consola H2 y
  Swagger; Nginx publica también \`/h2-console\`, \`/swagger-ui\`, \`/v3/api-docs\` y \`/actuator\`.
- **Salud**: Actuator expone \`liveness\` y \`readiness\`; Nginx expone \`/healthz\`.
- **Persistencia**: H2 sobre un PVC, una sola réplica de backend y estrategia \`Recreate\`.

El procedimiento completo está en [\`DESPLIEGUE.md\`](DESPLIEGUE.md) y en \`deploy/README.md\`. No se ha
desplegado en un clúster real porque el entorno de verificación no tenía contexto de Kubernetes.
`,
  },
  {
    id: "seguridad",
    titulo: "Seguridad de PruebasOpenCode1",
    archivo: "docs/SEGURIDAD.md",
    resumen: "Autologin transparente, tokens Bearer, contraseña cifrada y límites del modelo.",
    markdown: `# Seguridad de PruebasOpenCode1

> Documento actualizado el 2026-11-09.

## 1. Objetivo

PruebasOpenCode1 es una aplicación de demostración, pero sus llamadas a la API no son simuladas: el
backend valida credenciales reales, guarda la contraseña cifrada en H2 y protege los recursos con
**tokens Bearer de corta duración** gestionados por Spring Security.

Para no añadir fricción al usuario, el frontend realiza un **autologin transparente** la primera vez
que se accede a la gestión de personas. No hay pantalla de login ni se muestran credenciales: el
usuario ve directamente el listado y todas las peticiones viajan autenticadas con la cabecera
\`Authorization: Bearer <token>\`.

Este modelo es deliberadamente simple y **no es apto para producción**: las credenciales fijas del
autologin forman parte del bundle del navegador. Los límites y la hoja de ruta de endurecimiento se
describen en el apartado 8.

## 2. Piezas del modelo de seguridad

| Pieza | Tecnología | Responsabilidad |
| --- | --- | --- |
| Backend | Spring Boot 3.5 + Spring Security | Filtro de seguridad, autenticación y autorización. |
| Almacén de usuarios | JPA + Hibernate + H2 | Tabla \`usuarios\` con la contraseña cifrada. |
| Cifrado | BCrypt (\`BCryptPasswordEncoder\`) | Hash adaptativo con sal aleatoria por contraseña. |
| Token | \`TokenService\` + \`TokenAuthenticationFilter\` | Emite y valida tokens opacos en memoria con caducidad. |
| Frontend | React + TypeScript + Vite | Autologin transparente, token en memoria y renovación. |
| Contrato de autologin | \`POST /api/v1/auth/login\` | Valida credenciales y emite el token Bearer. |
| Formato de error | RFC 9457 (\`ProblemDetail\`) | Respuestas \`application/problem+json\` homogéneas. |
| Auditoría | Spring Data JPA Auditing | Registra usuario e instante de creación/modificación. |

## 3. Flujo de autologin y renovación

\`\`\`text
Primera visita a /personas
  → React monta usePersonas
  → asegurarSesion()
  → ¿hay token vigente en memoria? (margen de 60 s antes de caducar)
      ├─ sí → lo reutiliza
      └─ no → POST /api/v1/auth/login
                  → AuthenticationManager
                  → UsuarioDetailsService (tabla usuarios)
                  → BCryptPasswordEncoder.matches()
                  → TokenService genera 32 bytes aleatorios (SecureRandom)
                  → TokenResponse { token, tipo: "Bearer", expiraEn, ... }
  → GET /api/v1/personas con Authorization: Bearer <token>
  → TokenAuthenticationFilter valida el token y publica la autenticación
  → si el backend responde 401 (token caducado o reinicio del backend):
      → renovarSesion() una sola vez y repetir la petición original
\`\`\`

Características del flujo:

- Se ejecuta **solo** al entrar en la sección de personas; la pantalla de bienvenida y la
  documentación no crean token.
- Una **promesa única** (\`front/src/api/auth.ts\`) evita duplicar el login cuando React StrictMode
  ejecuta el efecto dos veces.
- El token se guarda **únicamente en memoria**. No se escribe en \`localStorage\`, \`sessionStorage\` ni
  cookies: recargar la pestaña o cerrarla obliga a un nuevo autologin transparente.
- El token se renueva automáticamente **60 segundos antes** de su caducidad. Si la renovación falla,
  la siguiente petición lo intenta de nuevo.
- El cliente HTTP renueva la sesión una sola vez tras un \`401\` y repite la petición original. Las
  rutas \`/auth/**\` nunca se reintentan para evitar bucles de credenciales incorrectas.
- La interfaz muestra avisos discretos de **«sesión renovada»** y **«sesión caducada»** sin
  interrumpir al usuario ni pedirle que vuelva a iniciar sesión.
- El usuario nunca ve un formulario, un botón de login ni las credenciales.

### 3.1 Por qué tokens Bearer y no cookies de sesión

La versión anterior usaba \`HttpSession\` y la cookie \`JSESSIONID\`. Se migró a tokens Bearer por estas
razones:

- **Estado fuera del navegador**: el token no se envía automáticamente en cada petición del navegador,
  lo que reduce la superficie de ataques CSRF.
- **Revocación explícita**: \`POST /api/v1/auth/logout\` elimina el token del servidor; no depende de la
  caducidad de una sesión.
- **Caducidad corta y renovación controlada**: 15 minutos en \`dev\`, 10 en \`pre\` y 5 en \`prod\`
  (configurable con \`APP_AUTH_TOKEN_TTL\`).
- **Contrato explícito**: \`Authorization: Bearer\` es visible en Swagger UI y en los ejemplos de la API.

Contrapartidas asumidas (documentadas para no ocultarlas):

- El token se pierde al **reiniciar el backend**, porque se guarda en memoria. El frontend lo detecta
  con un \`401\` y vuelve a autenticarse de forma transparente.
- No hay estado de sesión ni lista de dispositivos conectados.
- No se implementa JWT ni firma criptográfica: son tokens opacos de un único backend.
- El logout solo revoca el token del dispositivo actual.
- En una arquitectura con varias réplicas haría falta una memoria compartida (Redis) o JWT firmados.

### 3.2 Eventos de sesión en la interfaz

\`front/src/api/auth.ts\` expone \`suscribirEventosSesion()\`. \`PersonasPage\` se suscribe y muestra:

| Evento | Cuándo se emite | Mensaje |
| --- | --- | --- |
| \`sesion-renovada\` | Tras un \`401\`, el autologin obtiene un token nuevo. | «Sesión renovada automáticamente». |
| \`sesion-caducada\` | La renovación falla (backend caído o credenciales inválidas). | «La sesión ha caducado. Vuelve a intentarlo». |

Los avisos usan el mismo sistema de notificaciones que el resto de operaciones y no bloquean la
interfaz.

## 4. Backend

### 4.1 Entidad \`Usuario\`

Tabla \`usuarios\`:

| Campo | Tipo Java | Columna | Restricciones |
| --- | --- | --- | --- |
| \`id\` | \`Long\` | \`id\` | Clave primaria autoincremental. |
| \`username\` | \`String\` | \`username\` | Obligatorio, único, máximo 60 caracteres. |
| \`password\` | \`String\` | \`password_hash\` | Obligatorio, hash BCrypt de 60 caracteres. |
| \`rol\` | \`String\` | \`rol\` | Obligatorio; por defecto \`USER\`. |
| \`activo\` | \`boolean\` | \`activo\` | Permite deshabilitar la cuenta. |
| \`fechaAlta\` | \`LocalDateTime\` | \`fecha_alta\` | Fecha de creación. |

La contraseña en claro nunca se persiste ni se devuelve en ninguna respuesta. \`SesionResponse\` solo
expone \`autenticado\`, \`usuario\`, \`rol\` y \`expiraEn\`.

### 4.2 Siembra y sincronización del usuario

\`UsuarioInitializer\` se ejecuta al arrancar:

1. Busca el usuario configurado en la base de datos.
2. Si no existe, lo crea con \`passwordEncoder.encode(contraseña)\`.
3. Si existe y la contraseña configurada ya no coincide, regenera el hash y actualiza el rol.
4. Si coincide, conserva el hash existente.

Así la base de datos es la fuente real de autenticación y la contraseña siempre está cifrada, incluso
tras cambiar las variables de entorno.

### 4.3 Configuración de Spring Security

\`SecurityConfig\` define:

- Autenticación **sin estado**: \`SessionCreationPolicy.STATELESS\`.
- \`DaoAuthenticationProvider\` respaldado por \`UsuarioDetailsService\` y BCrypt.
- \`TokenAuthenticationFilter\` antes de \`UsernamePasswordAuthenticationFilter\`.
- Respuestas \`401\` y \`403\` en formato RFC 9457 (\`ProblemDetail\`), no \`ApiError\`.
- \`formLogin\`, \`httpBasic\` y el logout automático de Spring desactivados: el contrato lo controla
  \`AuthController\`.
- CSRF desactivado porque **no se usan cookies de autenticación** (véase el apartado 7).
- CORS con \`allowCredentials(true)\` y cabecera \`Authorization\` permitida. Aunque el token no viaja en
  cookies, se mantiene la configuración para no romper clientes y preflight existentes.

Rutas públicas:

- \`/api/v1/auth/**\`
- \`/actuator/health\`, \`/actuator/health/**\`, \`/actuator/info\`
- \`/v3/api-docs/**\`, \`/swagger-ui/**\`, \`/swagger-ui.html\`
- \`/h2-console/**\` (solo desarrollo)
- \`/error\`

El resto de \`/api/**\` requiere un token válido.

### 4.4 Endpoints de autenticación

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| \`POST\` | \`/api/v1/auth/login\` | Valida credenciales y emite el token. | \`200\` con \`TokenResponse\`. |
| \`GET\` | \`/api/v1/auth/sesion\` | Consulta el estado del token. | \`200\` con \`SesionResponse\`. |
| \`POST\` | \`/api/v1/auth/logout\` | Revoca el token actual. | \`204\`. |

Cuerpo del login:

\`\`\`json
{
  "usuario": "demo",
  "contrasena": "demo1234"
}
\`\`\`

Respuesta:

\`\`\`json
{
  "token": "Q2xhdmUtb3BhY2EtZGUtMzItYnl0ZXM...",
  "tipo": "Bearer",
  "expiraEn": "2026-11-09T16:15:00Z",
  "segundosRestantes": 900,
  "usuario": "demo",
  "rol": "ROLE_USER"
}
\`\`\`

\`GET /api/v1/auth/sesion\` devuelve \`autenticado\`, \`usuario\`, \`rol\` y \`expiraEn\`. Sin token válido
responde \`200\` con \`{"autenticado": false, "usuario": null, "rol": null, "expiraEn": null}\` para que
el sondeo previo al autologin no genere errores de red en la consola.

Credenciales incorrectas devuelven \`401\` con el mensaje genérico
\`Usuario o contraseña incorrectos.\` para no revelar si el usuario existe. El formato es
\`application/problem+json\`.

### 4.5 Auditoría básica

\`AuditoriaConfig\` activa \`@EnableJpaAuditing\`. La entidad \`Persona\` guarda cuatro campos adicionales:

| Campo | Columna | Origen |
| --- | --- | --- |
| \`creadoEn\` | \`creado_en\` | \`@CreatedDate\`; instante de creación. |
| \`actualizadoEn\` | \`actualizado_en\` | \`@LastModifiedDate\`; instante de la última modificación. |
| \`creadoPor\` | \`creado_por\` | \`@CreatedBy\`; usuario autenticado o \`sistema\`. |
| \`actualizadoPor\` | \`actualizado_por\` | \`@LastModifiedBy\`; usuario autenticado o \`sistema\`. |

El usuario se toma del \`SecurityContext\`. Durante la siembra inicial o el reset sin petición
autenticada se registra \`sistema\`. Los cuatro campos se incluyen en \`PersonaResponse\`.

> Los registros creados antes de activar la auditoría pueden tener estos campos a \`null\`; los nuevos y
> los del reset siempre se rellenan.

## 5. Configuración

### 5.1 Backend

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| \`APP_AUTH_USERNAME\` | \`demo\` | Usuario del autologin. |
| \`APP_AUTH_PASSWORD\` | \`demo1234\` | Contraseña en claro usada solo para generar el hash. |
| \`APP_AUTH_ROLE\` | \`USER\` | Rol asignado al usuario. |
| \`APP_AUTH_TOKEN_TTL\` | \`15m\` (\`dev\`/\`test\`), \`10m\` (\`pre\`), \`5m\` (\`prod\`) | Vigencia del token Bearer. |
| \`CORS_ALLOWED_ORIGINS\` | \`http://localhost:5173,http://127.0.0.1:5173\` | Orígenes permitidos. |
| \`SPRING_PROFILES_ACTIVE\` | \`dev\` | Perfil activo: \`dev\`, \`test\`, \`pre\` o \`prod\`. |

En los perfiles \`pre\` y \`prod\` **no hay valores por defecto** para \`APP_AUTH_USERNAME\`,
\`APP_AUTH_PASSWORD\`, \`DB_USERNAME\`, \`DB_PASSWORD\` ni \`CORS_ALLOWED_ORIGINS\`: el entorno debe
inyectarlos. Esto evita arrastrar secretos de demostración a entornos superiores.

### 5.2 Frontend

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| \`VITE_AUTH_USERNAME\` | \`demo\` | Usuario enviado por el autologin. |
| \`VITE_AUTH_PASSWORD\` | \`demo1234\` | Contraseña enviada por el autologin. |
| \`VITE_API_BASE_URL\` | \`/api/v1\` | URL base de la API. |

Deben coincidir con las variables del backend. Al compilarse dentro del bundle no son secretos: son
valores de demostración.

### 5.3 Externalización de secretos

- El repositorio no contiene \`.env\` reales; solo \`back/.env.example\` como plantilla.
- \`.gitignore\` excluye \`back/.env\`, \`back/.env.*\`, \`front/.env\` y \`front/.env.*\`, pero conserva los
  \`.env.example\`.
- En \`pre\`/\`prod\` los secretos se inyectan desde el entorno o desde un gestor de secretos.
- El frontend solo contiene credenciales de demostración; en un despliegue real no debe incluir
  contraseñas.

## 6. Frontend

| Archivo | Responsabilidad |
| --- | --- |
| \`src/api/auth.ts\` | Autologin, token en memoria, renovación, logout y eventos de sesión. |
| \`src/api/client.ts\` | Cabecera \`Authorization\`, error RFC 9457 y reintento único tras \`401\`. |
| \`src/hooks/usePersonas.ts\` | Llama a \`asegurarSesion()\` antes de cargar el listado. |
| \`src/pages/PersonasPage.tsx\` | Avisos de sesión renovada o caducada. |
| \`src/theme.ts\` y \`src/hooks/useTema.ts\` | Preferencia de tema claro/oscuro/sistema. |
| \`src/components/ErrorBoundary.tsx\` | Recuperación ante errores de renderizado. |
| \`src/vite-env.d.ts\` | Tipado de las variables de entorno de autenticación. |
| \`front/.env.example\` | Documentación de las variables del autologin. |

El cliente HTTP usa \`credentials: 'omit'\`: el token viaja en la cabecera y no se envían cookies.

## 7. Decisiones y límites

### CSRF desactivado

La API se consume como SPA JSON con CORS restringido y no existen formularios HTML servidos por el
backend. Además, el token se envía en \`Authorization: Bearer\`, no en una cookie que el navegador
adjunte automáticamente. Se desactiva CSRF de forma consciente:

- Si se volviera a usar una cookie de autenticación, debería activarse un token CSRF.
- Si se añadieran formularios HTML, también sería necesario.
- La decisión se revisará si cambia el modelo de autenticación.

### Credenciales fijas en el cliente

El autologin transparente exige que el navegador conozca las credenciales. Por tanto:

- No protegen frente a un usuario que inspeccione el bundle.
- Solo son aceptables en local o en una demo controlada.
- En producción cada usuario debería autenticarse con su propia cuenta y el frontend no debería
  contener contraseñas.

### Token en memoria

Guardar el token solo en memoria evita persistencia en el navegador, pero tiene consecuencias:

- Recargar la pestaña provoca un nuevo autologin.
- Varias pestañas no comparten token.
- Reiniciar el backend invalida todos los tokens activos.

Se aceptan porque el objetivo es una demo local con autologin transparente.

### Otros límites

- Por defecto, la consola H2 y Swagger están activos también en PRE/PRO para igualar el
  comportamiento local. En un entorno expuesto deben desactivarse y limitar la consola a la red
  interna.
- No hay bloqueo por intentos fallidos, rotación de contraseña ni auditoría de accesos.
- No se usan HTTPS ni certificados por defecto en local.
- La auditoría cubre personas, no inicios de sesión ni cambios de configuración.

## 8. Endurecimiento futuro

1. Sustituir las credenciales fijas por un proveedor de identidad o login individual.
2. Servir todo por HTTPS.
3. Mantener CSRF desactivado mientras no haya cookies de autenticación; activarlo si se reintroducen.
4. Desactivar H2 Console y Swagger en un PRE/PRO expuesto: definir \`H2_CONSOLE_ENABLED=false\`,
   \`H2_CONSOLE_ALLOW_OTHERS=false\` y \`SPRINGDOC_ENABLED=false\`.
5. Añadir limitación de intentos, auditoría de accesos y políticas de contraseña.
6. Externalizar los secretos en un gestor de secretos, nunca en el repositorio.
7. Para varias réplicas, compartir tokens en Redis o adoptar JWT firmados con rotación de claves.

## 9. Verificación

La seguridad se comprueba en tres niveles:

- **Integración backend** (\`AuthControllerIntegrationTest\`, 9 pruebas): \`401\` sin token, login válido,
  token con expiración, acceso con token, credenciales inválidas, token inválido, contraseña BCrypt en
  base de datos, logout que revoca el token y consulta de sesión con y sin token.
- **Integración de extremo a extremo**: el script comprueba el \`401\` sin token, el login, la consulta
  de sesión, la auditoría y la revocación tras el logout.
- **Interfaz real**: el script detecta la petición de autologin, exige \`200\` y comprueba que no se
  muestra ningún campo de contraseña ni la acción de iniciar sesión.

Los resultados se registran en [\`PRUEBAS.md\`](PRUEBAS.md) y [\`SEGUIMIENTO.md\`](SEGUIMIENTO.md).

## 10. Documentación relacionada

- [\`ARQUITECTURA.md\`](ARQUITECTURA.md): capas y decisiones técnicas.
- [\`API.md\`](API.md): contrato REST, incluidos los endpoints de autenticación.
- [\`EJECUCION.md\`](EJECUCION.md): variables de entorno y arranque local.
- [\`PRUEBAS.md\`](PRUEBAS.md): suites y resultados.
- [\`OPERACION.md\`](OPERACION.md): base de datos y diagnóstico.
`,
  },
  {
    id: "api",
    titulo: "API REST de PruebasOpenCode1",
    archivo: "docs/API.md",
    resumen: "Contrato REST /api/v1, errores RFC 9457, ejemplos y códigos de estado.",
    markdown: `# API REST de PruebasOpenCode1

> Documento actualizado el 2026-11-09.

## 1. Información general

| Aspecto | Valor |
| --- | --- |
| URL base local | \`http://localhost:8080/api/v1\` |
| Formato de datos | JSON (\`application/json; charset=UTF-8\`) |
| Formato de errores | RFC 9457 (\`application/problem+json\`) |
| Autenticación | Token Bearer de corta duración emitido por \`POST /api/v1/auth/login\`. |
| Cabecera de autenticación | \`Authorization: Bearer <token>\` |
| Origen permitido por defecto | \`http://localhost:5173\`, \`http://127.0.0.1:5173\` |
| Salud | \`GET http://localhost:8080/actuator/health\` |
| Consola H2 | \`http://localhost:8080/h2-console\` (solo \`dev\`) |
| Swagger UI | \`http://localhost:8080/swagger-ui/index.html\` |
| OpenAPI JSON | \`http://localhost:8080/v3/api-docs\` |

La API está versionada en la ruta \`/api/v1\`. El frontend en desarrollo consume
\`http://localhost:5173/api/v1\`, que Vite redirige al backend. En producción la URL base se configura
con \`VITE_API_BASE_URL\`.

Salvo los endpoints de \`/api/v1/auth/**\`, todas las rutas \`/api/**\` requieren un token válido. Sin
token, o con un token caducado o revocado, el backend devuelve \`401\` con un \`ProblemDetail\`.

## 2. Modelo \`Persona\`

### 2.1 Respuesta

\`\`\`json
{
  "id": 1,
  "nombre": "Lucía",
  "apellido": "Fernández",
  "edad": 35,
  "sexo": "FEMENINO",
  "direccion": "Calle Mayor 12, 3ºB, Madrid",
  "fechaNacimiento": "1991-04-18",
  "creadoEn": "2026-11-09T15:12:03.451Z",
  "actualizadoEn": "2026-11-09T15:12:03.451Z",
  "creadoPor": "demo",
  "actualizadoPor": "demo"
}
\`\`\`

### 2.2 Campos

| Campo | Tipo | Obligatorio en entrada | Reglas |
| --- | --- | --- | --- |
| \`id\` | entero | No | Generado por la base de datos. Solo aparece en respuestas. |
| \`nombre\` | texto | Sí | No vacío, máximo 80 caracteres. |
| \`apellido\` | texto | Sí | No vacío, máximo 80 caracteres. |
| \`edad\` | entero | No | Calculado desde \`fechaNacimiento\` y la fecha actual. No se almacena. |
| \`sexo\` | texto | Sí | \`MASCULINO\`, \`FEMENINO\` u \`OTRO\`. |
| \`direccion\` | texto | Sí | No vacía, máximo 200 caracteres. |
| \`fechaNacimiento\` | fecha \`yyyy-MM-dd\` | Sí | No puede ser futura. |
| \`creadoEn\` | instante ISO 8601 | No | Auditoría: instante de creación. |
| \`actualizadoEn\` | instante ISO 8601 | No | Auditoría: instante de la última modificación. |
| \`creadoPor\` | texto | No | Auditoría: usuario autenticado o \`sistema\`. |
| \`actualizadoPor\` | texto | No | Auditoría: usuario autenticado o \`sistema\`. |

Los textos se recortan (eliminan espacios al principio y al final) antes de guardarse.

La \`edad\` no forma parte del cuerpo de entrada: el backend la calcula en cada respuesta a partir de
\`fechaNacimiento\` y de la fecha actual, por lo que se mantiene actualizada automáticamente.

Los cuatro campos de auditoría los rellena Spring Data JPA. Pueden ser \`null\` en registros creados
antes de activar la auditoría; los registros nuevos y los del reset siempre se rellenan.

## 3. Endpoints

| Método | Ruta | Descripción | Éxito |
| --- | --- | --- | --- |
| \`GET\` | \`/api/v1/personas\` | Lista todas las personas ordenadas por apellido y nombre. | \`200 OK\` |
| \`GET\` | \`/api/v1/personas/{id}\` | Obtiene una persona por identificador. | \`200 OK\` |
| \`POST\` | \`/api/v1/personas\` | Crea una persona. | \`201 Created\` |
| \`PUT\` | \`/api/v1/personas/{id}\` | Modifica todos los datos de una persona. | \`200 OK\` |
| \`DELETE\` | \`/api/v1/personas/{id}\` | Elimina una persona. | \`204 No Content\` |
| \`POST\` | \`/api/v1/personas/reset\` | Elimina todo y reinserta los 10 datos mock iniciales. | \`200 OK\` |
| \`POST\` | \`/api/v1/auth/login\` | Valida las credenciales y emite un token Bearer. | \`200 OK\` |
| \`GET\` | \`/api/v1/auth/sesion\` | Consulta el estado del token actual. | \`200 OK\` |
| \`POST\` | \`/api/v1/auth/logout\` | Revoca el token actual. | \`204 No Content\` |

### 3.1 Listar personas

\`\`\`http
GET /api/v1/personas
Authorization: Bearer <token>
\`\`\`

Respuesta \`200 OK\`:

\`\`\`json
[
  {
    "id": 10,
    "nombre": "Sergio",
    "apellido": "Castro",
    "edad": 59,
    "sexo": "MASCULINO",
    "direccion": "Calle del Sol 18, Murcia",
    "fechaNacimiento": "1967-01-09",
    "creadoEn": "2026-11-09T15:12:03.451Z",
    "actualizadoEn": "2026-11-09T15:12:03.451Z",
    "creadoPor": "sistema",
    "actualizadoPor": "sistema"
  }
]
\`\`\`

Si no hay datos, devuelve \`[]\` con \`200 OK\`.

### 3.2 Obtener una persona

\`\`\`http
GET /api/v1/personas/1
Authorization: Bearer <token>
\`\`\`

Respuesta \`200 OK\`: objeto \`Persona\`.

Si no existe, \`404 Not Found\` con:

\`\`\`json
{
  "type": "https://pruebasopencode1.example/errors/no-encontrado",
  "title": "Recurso no encontrado",
  "status": 404,
  "detail": "No existe ninguna persona con el identificador 1.",
  "instance": "/api/v1/personas/1"
}
\`\`\`

### 3.3 Crear una persona

\`\`\`http
POST /api/v1/personas
Content-Type: application/json
Authorization: Bearer <token>
\`\`\`

Cuerpo:

\`\`\`json
{
  "nombre": "Ana",
  "apellido": "García",
  "sexo": "FEMENINO",
  "direccion": "Calle Mayor 1, Madrid",
  "fechaNacimiento": "1995-05-20"
}
\`\`\`

Respuesta \`201 Created\`:

- Cabecera \`Location: http://localhost:8080/api/v1/personas/{id}\`
- Cuerpo con la persona creada (incluye \`id\` y auditoría).

### 3.4 Modificar una persona

\`\`\`http
PUT /api/v1/personas/5
Content-Type: application/json
Authorization: Bearer <token>
\`\`\`

Cuerpo: mismos campos que en la creación (sin \`id\`).

Respuesta \`200 OK\` con la persona actualizada. Si el identificador no existe, \`404 Not Found\`.

### 3.5 Eliminar una persona

\`\`\`http
DELETE /api/v1/personas/5
Authorization: Bearer <token>
\`\`\`

Respuesta \`204 No Content\`, sin cuerpo. Si no existe, \`404 Not Found\`.

### 3.6 Restablecer datos mock

\`\`\`http
POST /api/v1/personas/reset
Authorization: Bearer <token>
\`\`\`

Sin cuerpo. Elimina todas las personas actuales y vuelve a insertar exactamente los 10 registros de
ejemplo. Devuelve \`200 OK\` con el listado resultante.

> Nota: el reset restablece el **contenido**, no la secuencia de identificadores. Es posible que los
> nuevos registros mock reciban identificadores distintos a los de un arranque inicial. La API no
> garantiza valores de \`id\` concretos.

### 3.7 Autenticación

El frontend ejecuta un autologin transparente con credenciales fijas de demostración.

\`\`\`http
POST /api/v1/auth/login
Content-Type: application/json
\`\`\`

\`\`\`json
{
  "usuario": "demo",
  "contrasena": "demo1234"
}
\`\`\`

Respuesta \`200 OK\`:

\`\`\`json
{
  "token": "Q2xhdmUtb3BhY2EtZGUtMzItYnl0ZXM...",
  "tipo": "Bearer",
  "expiraEn": "2026-11-09T16:15:00Z",
  "segundosRestantes": 900,
  "usuario": "demo",
  "rol": "ROLE_USER"
}
\`\`\`

El token es un valor opaco de 32 bytes aleatorios, no un JWT. Se guarda en memoria del backend junto
con su caducidad y el frontend lo conserva solo en memoria.

Credenciales incorrectas devuelven \`401\` con:

\`\`\`json
{
  "type": "https://pruebasopencode1.example/errors/credenciales",
  "title": "Credenciales incorrectas",
  "status": 401,
  "detail": "Usuario o contraseña incorrectos.",
  "instance": "/api/v1/auth/login"
}
\`\`\`

La contraseña se almacena cifrada con BCrypt en la tabla \`usuarios\`; nunca se devuelve.

\`\`\`http
GET /api/v1/auth/sesion
Authorization: Bearer <token>
\`\`\`

Devuelve \`200\` con \`autenticado\`, \`usuario\`, \`rol\` y \`expiraEn\`. Si no hay token válido, devuelve
\`200\` con \`{"autenticado": false, "usuario": null, "rol": null, "expiraEn": null}\`. Este endpoint
nunca responde \`401\`, para que el sondeo previo al autologin no genere errores de red en la consola
del navegador.

\`\`\`http
POST /api/v1/auth/logout
Authorization: Bearer <token>
\`\`\`

Revoca el token y devuelve \`204\`. A partir de ese momento el mismo token devuelve \`401\`. Los detalles
del modelo están en [\`SEGURIDAD.md\`](SEGURIDAD.md).

## 4. Errores RFC 9457

Todos los errores usan el formato \`application/problem+json\` definido por la RFC 9457:

| Campo | Descripción |
| --- | --- |
| \`type\` | URI que identifica el tipo de problema. |
| \`title\` | Título corto y legible. |
| \`status\` | Código HTTP. |
| \`detail\` | Explicación específica del problema. |
| \`instance\` | Ruta de la petición que provocó el error. |
| \`validaciones\` | Solo en errores de validación: mapa \`campo → mensaje\`. |

Tipos de error disponibles:

| \`type\` | Código | Situación |
| --- | --- | --- |
| \`.../errors/no-autenticado\` | \`401\` | Falta el token o no es válido. |
| \`.../errors/credenciales\` | \`401\` | Usuario o contraseña incorrectos. |
| \`.../errors/acceso-denegado\` | \`403\` | El usuario no tiene permisos. |
| \`.../errors/validacion\` | \`400\` | Validación de campos. |
| \`.../errors/cuerpo-ilegible\` | \`400\` | JSON mal formado, enum o fecha inválidos. |
| \`.../errors/no-encontrado\` | \`404\` | Persona o ruta inexistente. |
| \`.../errors/conflicto\` | \`409\` | Conflicto de integridad de datos. |
| \`.../errors/error-interno\` | \`500\` | Error interno no controlado. |

El prefijo \`type\` es \`https://pruebasopencode1.example/errors/\`.

### 4.1 Validaciones

Si la validación falla, se devuelve \`400 Bad Request\` con el detalle por campo:

\`\`\`json
{
  "type": "https://pruebasopencode1.example/errors/validacion",
  "title": "Datos no válidos",
  "status": 400,
  "detail": "Los datos enviados no son válidos. Revise los campos indicados.",
  "instance": "/api/v1/personas",
  "validaciones": {
    "nombre": "El nombre es obligatorio",
    "apellido": "El apellido es obligatorio",
    "sexo": "El sexo es obligatorio",
    "direccion": "La dirección es obligatoria",
    "fechaNacimiento": "La fecha de nacimiento no puede ser futura"
  }
}
\`\`\`

| Campo | Mensajes |
| --- | --- |
| \`nombre\` | \`El nombre es obligatorio\` · \`El nombre no puede superar los 80 caracteres\` |
| \`apellido\` | \`El apellido es obligatorio\` · \`El apellido no puede superar los 80 caracteres\` |
| \`sexo\` | \`El sexo es obligatorio\` |
| \`direccion\` | \`La dirección es obligatoria\` · \`La dirección no puede superar los 200 caracteres\` |
| \`fechaNacimiento\` | \`La fecha de nacimiento es obligatoria\` · \`La fecha de nacimiento no puede ser futura\` |

La edad no se valida como entrada porque no se recibe; se calcula siempre en el servidor.

Un JSON mal formado, un \`sexo\` desconocido o una fecha con formato incorrecto devuelven \`400\` con el
tipo \`cuerpo-ilegible\`:

\`\`\`json
{
  "type": "https://pruebasopencode1.example/errors/cuerpo-ilegible",
  "title": "Petición no válida",
  "status": 400,
  "detail": "El cuerpo de la petición no es válido. Compruebe el formato de los datos (por ejemplo, el sexo y la fecha).",
  "instance": "/api/v1/personas"
}
\`\`\`

## 5. Códigos de estado

| Código | Situación |
| --- | --- |
| \`200\` | Consulta, modificación, reset o login correctos. |
| \`201\` | Persona creada; incluye \`Location\`. |
| \`204\` | Persona eliminada o logout correcto; sin cuerpo. |
| \`400\` | Datos inválidos, JSON mal formado, enum o fecha incorrectos. |
| \`401\` | Sin token, token inválido o credenciales incorrectas. |
| \`403\` | Token válido sin permisos para la operación. |
| \`404\` | Persona no encontrada o ruta inexistente. |
| \`409\` | Conflicto de integridad de datos. |
| \`500\` | Error interno no controlado. |

## 6. CORS

El backend permite por defecto los orígenes:

- \`http://localhost:5173\`
- \`http://127.0.0.1:5173\`

Métodos permitidos: \`GET\`, \`POST\`, \`PUT\`, \`DELETE\`, \`OPTIONS\`. Cabeceras permitidas: todas, incluida
\`Authorization\`. Se expone la cabecera \`Location\` para que el cliente pueda leerla. Se mantiene
\`allowCredentials(true)\` por compatibilidad, aunque el token viaja en la cabecera y el cliente usa
\`credentials: 'omit'\`.

Se configura con \`CORS_ALLOWED_ORIGINS\` (lista separada por comas) sin modificar código.

## 7. Ejemplos de uso

### PowerShell

\`\`\`powershell
# Autologin y guardado del token
$credenciales = @{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/v1/auth/login \`
  -ContentType "application/json" -Body $credenciales
$cabecera = @{ Authorization = "Bearer $($login.token)" }

# Listar
Invoke-RestMethod http://localhost:8080/api/v1/personas -Headers $cabecera

# Obtener
Invoke-RestMethod http://localhost:8080/api/v1/personas/1 -Headers $cabecera

# Crear
$cuerpo = @{
  nombre = "Ana"
  apellido = "García"
  sexo = "FEMENINO"
  direccion = "Calle Mayor 1, Madrid"
  fechaNacimiento = "1995-05-20"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/v1/personas \`
  -ContentType "application/json" -Body $cuerpo -Headers $cabecera

# Modificar
Invoke-RestMethod -Method Put -Uri http://localhost:8080/api/v1/personas/1 \`
  -ContentType "application/json" -Body $cuerpo -Headers $cabecera

# Eliminar
Invoke-RestMethod -Method Delete http://localhost:8080/api/v1/personas/1 -Headers $cabecera

# Restablecer
Invoke-RestMethod -Method Post http://localhost:8080/api/v1/personas/reset -Headers $cabecera
\`\`\`

### cURL

\`\`\`bash
# Autologin y extracción del token
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"usuario":"demo","contrasena":"demo1234"}' | jq -r .token)

curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/personas

curl -H "Authorization: Bearer $TOKEN" -X POST http://localhost:8080/api/v1/personas \\
  -H "Content-Type: application/json" \\
  -d '{"nombre":"Ana","apellido":"García","sexo":"FEMENINO","direccion":"Calle Mayor 1, Madrid","fechaNacimiento":"1995-05-20"}'

curl -H "Authorization: Bearer $TOKEN" -X DELETE http://localhost:8080/api/v1/personas/1

curl -H "Authorization: Bearer $TOKEN" -X POST http://localhost:8080/api/v1/personas/reset
\`\`\`

## 8. Actuator

| Endpoint | Descripción |
| --- | --- |
| \`GET /actuator/health\` | Estado general. |
| \`GET /actuator/health/liveness\` | Sonda de vida (preparada para Kubernetes). |
| \`GET /actuator/health/readiness\` | Sonda de disponibilidad. |
| \`GET /actuator/info\` | Información de la aplicación. |

\`\`\`powershell
Invoke-RestMethod http://localhost:8080/actuator/health
\`\`\`

\`\`\`json
{
  "status": "UP",
  "groups": ["liveness", "readiness"]
}
\`\`\`

## 9. Documentación interactiva (Swagger UI)

La API se documenta automáticamente con **springdoc-openapi 2.8.16**. Con el backend arrancado:

| Recurso | URL |
| --- | --- |
| Swagger UI | \`http://localhost:8080/swagger-ui/index.html\` |
| Redirección corta | \`http://localhost:8080/swagger-ui.html\` |
| Documento OpenAPI 3 (JSON) | \`http://localhost:8080/v3/api-docs\` |

Swagger UI muestra todos los grupos y operaciones detectados en los controladores:

- \`POST /api/v1/auth/login\`
- \`GET /api/v1/auth/sesion\`
- \`POST /api/v1/auth/logout\`
- \`GET /api/v1/personas\`
- \`GET /api/v1/personas/{id}\`
- \`POST /api/v1/personas\`
- \`PUT /api/v1/personas/{id}\`
- \`DELETE /api/v1/personas/{id}\`
- \`POST /api/v1/personas/reset\`

El esquema de seguridad \`bearerAuth\` representa el token Bearer y aparece documentado en el OpenAPI.
Para probar una operación desde el navegador:

1. Abrir \`http://localhost:8080/swagger-ui/index.html\`.
2. Ejecutar \`POST /api/v1/auth/login\` con las credenciales de demostración y copiar el \`token\`.
3. Pulsar **Authorize** e introducir el token en el esquema \`bearerAuth\`.
4. Desplegar el endpoint deseado y pulsar **Try it out**.
5. Rellenar los parámetros o el cuerpo JSON y pulsar **Execute**.

La documentación se genera a partir del código, por lo que no hay que mantenerla a mano: los cambios
en \`PersonaController\` y en los DTO se reflejan automáticamente. El título, la descripción y el
esquema \`bearerAuth\` se definen en \`OpenApiConfig\`; las rutas y el orden de operaciones se configuran
en \`application.yml\` bajo la clave \`springdoc\`.

> Swagger y \`/v3/api-docs\` están activos por defecto en \`dev\`, \`pre\` y \`prod\` para igualar el
> comportamiento local. Se pueden desactivar con \`SPRINGDOC_ENABLED=false\` antes de exponer un entorno
> real. En Docker/Kubernetes también se puede acceder por el puerto del frontend, que actúa como proxy.

## 10. Documentación relacionada

- [\`SEGURIDAD.md\`](SEGURIDAD.md): autologin, tokens Bearer, BCrypt y límites del modelo.
- [\`PRUEBAS.md\`](PRUEBAS.md): comandos y alcance de las pruebas de la API.
- [\`OPERACION.md\`](OPERACION.md): configuración, H2 y diagnóstico.
- [\`MANUAL_USUARIO.md\`](MANUAL_USUARIO.md): uso de la interfaz que consume esta API.
- [\`ARQUITECTURA.md\`](ARQUITECTURA.md): capas y modelo de datos.
`,
  },
  {
    id: "ejecucion",
    titulo: "Ejecución de PruebasOpenCode1",
    archivo: "docs/EJECUCION.md",
    resumen: "Requisitos, arranque local, pruebas y variables de entorno.",
    markdown: `# Ejecución de PruebasOpenCode1

> Documento actualizado el 2026-11-09.

## 1. Requisitos previos

| Herramienta | Versión recomendada | Comprobación |
| --- | --- | --- |
| JDK | **21** (obligatorio) | \`java -version\` |
| Maven | No es necesario instalarlo: se usa Maven Wrapper | \`.\\mvnw.cmd -v\` |
| Node.js | 20.19+ o 22.12+ (probado con 24) | \`node -v\` |
| npm | Incluido con Node.js | \`npm -v\` |
| Eclipse | 2024-06 o superior, con soporte Java 21 | — |
| Visual Studio Code | Cualquier versión reciente | — |
| Chrome o Edge | Para la prueba automática de interfaz | — |
| Docker Desktop / Docker Engine | 28 o superior, con Compose v2 | \`docker --version\` |
| kubectl | 1.32 o superior (incluye Kustomize) | \`kubectl version --client\` |

> En el entorno de verificación se utilizó Temurin JDK 21.0.13 y Maven 3.9.16 (gestionado por el
> wrapper). El proyecto no depende de esas rutas concretas.

## 2. Backend (\`/back\`)

### 2.1 Compilar y probar

Windows PowerShell:

\`\`\`powershell
cd D:\\PruebasOpenCode1\\back
.\\mvnw.cmd clean verify
\`\`\`

Linux/macOS:

\`\`\`bash
cd PruebasOpenCode1/back
chmod +x mvnw
./mvnw clean verify
\`\`\`

El primer arranque descarga Maven y las dependencias. El resultado esperado es \`BUILD SUCCESS\` con
**34 pruebas** superadas (11 unitarias, 14 de integración de personas y 9 de autenticación) y el
artefacto \`target/pruebasopencode1-back.jar\`.

### 2.2 Perfiles

El backend usa \`dev\` cuando no se indica perfil. Los perfiles disponibles son:

| Perfil | Uso | Base de datos | Consola H2 | Swagger | TTL del token |
| --- | --- | --- | --- | --- | --- |
| \`dev\` | Desarrollo local (por defecto). | H2 en fichero. | Sí | Sí | \`15m\` |
| \`test\` | Pruebas automatizadas. | H2 en memoria, \`create-drop\`. | No | Sí | \`15m\` |
| \`pre\` | Preproducción simulada. | H2 en \`./data/pre\`, configurable. | Sí | Sí | \`10m\` |
| \`prod\` | Producción simulada. | H2 en \`./data/prod\`, configurable. | Sí | Sí | \`5m\` |

Se selecciona con \`SPRING_PROFILES_ACTIVE\`:

\`\`\`powershell
$env:SPRING_PROFILES_ACTIVE = "dev"
.\\mvnw.cmd spring-boot:run
\`\`\`

En \`pre\` y \`prod\` las variables sensibles (\`APP_AUTH_USERNAME\`, \`APP_AUTH_PASSWORD\`, \`DB_USERNAME\`,
\`DB_PASSWORD\`, \`CORS_ALLOWED_ORIGINS\`) no tienen valores por defecto: el entorno debe inyectarlas.
La plantilla de variables está en \`back/.env.example\`.

### 2.3 Arrancar

Opción A, con Maven Wrapper:

\`\`\`powershell
cd D:\\PruebasOpenCode1\\back
.\\mvnw.cmd spring-boot:run
\`\`\`

Opción B, con el JAR empaquetado:

\`\`\`powershell
cd D:\\PruebasOpenCode1\\back
.\\mvnw.cmd clean package
java -jar target\\pruebasopencode1-back.jar
\`\`\`

El backend queda disponible en:

- API: \`http://localhost:8080/api/v1/personas\`
- Salud: \`http://localhost:8080/actuator/health\`
- Consola H2: \`http://localhost:8080/h2-console\` (\`dev\`, \`pre\` y \`prod\`; desactivable con
  \`H2_CONSOLE_ENABLED=false\`)
- Swagger UI: \`http://localhost:8080/swagger-ui/index.html\` (\`dev\`, \`pre\` y \`prod\`; desactivable con
  \`SPRINGDOC_ENABLED=false\`)
- OpenAPI JSON: \`http://localhost:8080/v3/api-docs\` (misma condición que Swagger UI)

Swagger UI permite consultar y probar todos los endpoints desde el navegador (**Authorize** con el
token y **Try it out**). No requiere ninguna herramienta adicional: se genera automáticamente a
partir del código del backend.

Credenciales H2 por defecto en \`dev\`:

| Parámetro | Valor |
| --- | --- |
| JDBC URL | \`jdbc:h2:file:./data/pruebasopencode1\` |
| Usuario | \`sa\` |
| Contraseña | *(vacía)* |

La ruta \`./data/...\` es relativa al directorio desde el que se arranca el backend. Si se arranca
desde \`back\`, los ficheros quedan en \`back/data/\`.

> Actualización desde una versión anterior: al arrancar, \`MigracionEsquema\` elimina automáticamente
> la antigua columna \`edad\` de \`personas\`. No es necesario borrar \`back/data\`: la edad pasa a
> calcularse desde \`fechaNacimiento\`. Los registros antiguos pueden tener vacíos los campos de
> auditoría; los nuevos se rellenan automáticamente.

### 2.4 Importar en Eclipse

1. Abrir Eclipse con un JDK 21 configurado
   (\`Window > Preferences > Java > Installed JREs\`).
2. \`File > Import... > Maven > Existing Maven Projects\`.
3. Seleccionar la carpeta \`D:\\PruebasOpenCode1\\back\` y finalizar.
4. Esperar a que Eclipse descargue las dependencias de Maven.
5. Ejecutar \`com.pruebasopencode1.personas.PruebasOpenCode1Application\` con
   \`Run As > Java Application\`.

No se requiere ninguna configuración adicional ni plugin de Lombok. Si Eclipse usa Java 17, el
\`maven-enforcer-plugin\` detendrá la compilación con un mensaje claro indicando que se necesita
Java 21.

> **Importante:** el proyecto debe importarse como **Maven > Existing Maven Projects**, no como
> «Existing Projects into Workspace». Si se importa como proyecto Java genérico, Eclipse compila las
> clases pero no copia \`src/main/resources/*.yml\` a \`target/classes\`. En ese caso Spring Boot arranca
> con una base de datos H2 en memoria y falla al resolver propiedades como
> \`app.cors.allowed-origins\`.
>
> Para corregirlo:
>
> 1. Ejecutar \`Maven > Update Project...\` (o \`Alt+F5\`) sobre el proyecto \`pruebasopencode1-back\`.
> 2. Comprobar que existe \`D:\\PruebasOpenCode1\\back\\target\\classes\\application.yml\`.
> 3. Si no existe, ejecutar desde la terminal \`.\\mvnw.cmd clean package\` y volver a arrancar.
>
> Como alternativa, arrancar con \`.\\mvnw.cmd spring-boot:run\`, que siempre usa los recursos del
> proyecto. Al arrancar, la aplicación deja un aviso en el log si detecta que falta
> \`application.yml\`.

### 2.5 Datos de prueba

Al arrancar con la base de datos vacía se insertan 10 personas de ejemplo. Para recuperarlas en
cualquier momento:

- Desde la interfaz: botón **Restablecer datos mock** (pide confirmación).
- Desde la API (con un token válido):

\`\`\`powershell
$login = Invoke-RestMethod -Method Post http://localhost:8080/api/v1/auth/login \`
  -ContentType "application/json" \`
  -Body (@{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json)
Invoke-RestMethod -Method Post http://localhost:8080/api/v1/personas/reset \`
  -Headers @{ Authorization = "Bearer $($login.token)" }
\`\`\`

Para empezar desde cero, detener el backend y eliminar la carpeta \`back/data\`.

## 3. Frontend (\`/front\`)

### 3.1 Instalar y arrancar

\`\`\`powershell
cd D:\\PruebasOpenCode1\\front
npm install
npm run dev
\`\`\`

La aplicación queda en \`http://localhost:5173\`.

> Si PowerShell bloquea \`npm.ps1\` por la política de ejecución de scripts, usar \`npm.cmd\`:
> \`npm.cmd install\` y \`npm.cmd run dev\`.

El servidor de Vite redirige \`/api\` a \`http://localhost:8080\`. El backend debe estar en marcha para
que la pantalla de personas cargue datos. El frontend hace el autologin de forma transparente y
guarda el token solo en memoria.

La ruta \`http://localhost:5173/documentacion\` muestra la documentación viva del proyecto. No necesita
backend: su contenido se genera antes de arrancar Vite.

> \`npm run dev\` ejecuta automáticamente \`npm run docs\` (hook \`predev\`) para regenerar la página con el
> último contenido de \`AGENTS.md\`, \`docs/*.md\` y los informes de pruebas.

### 3.2 Abrir en Visual Studio Code

1. \`File > Open Folder...\` y seleccionar \`D:\\PruebasOpenCode1\\front\`.
2. Abrir la terminal integrada y ejecutar \`npm install\` y \`npm run dev\`.
3. Abrir \`http://localhost:5173\` en el navegador.

Extensiones recomendadas (opcionales): ESLint, Prettier y la extensión oficial de TypeScript. El
proyecto no requiere configuración adicional de VS Code.

### 3.3 Compilar para producción

\`\`\`powershell
npm run build
npm run preview
\`\`\`

- \`npm run build\` ejecuta la comprobación de tipos (\`tsc --noEmit\`) y genera \`dist/\`.
- \`npm run preview\` sirve el resultado en \`http://localhost:4173\` (sin proxy \`/api\`).
- En producción hay que definir \`VITE_API_BASE_URL\` antes de compilar, por ejemplo:
  \`https://api.pre.pruebasopencode1.example.com/api/v1\`.

### 3.4 Documentación viva

\`\`\`powershell
npm run docs
\`\`\`

Genera \`src/content/documentacion.generated.ts\` desde las fuentes reales:

- \`AGENTS.md\` y \`docs/*.md\` (incluido \`docs/PROMPT.md\`).
- Los tests de Java y los informes Surefire de \`back/target/surefire-reports\`.
- Las comprobaciones de \`scripts/verificar-integracion.mjs\` y \`front/scripts/verificar-ui.mjs\`.
- Los informes de PIT (\`back/target/pit-reports\`) o, si no existen, las cifras documentadas.

El hook \`prebuild\` también lo ejecuta, de modo que la página \`/documentacion\` del build siempre refleja
el estado actual. El archivo generado no debe editarse a mano.

### 3.5 Docker Compose y Kubernetes

La guía completa está en [\`DESPLIEGUE.md\`](DESPLIEGUE.md) y en \`deploy/README.md\`.

\`\`\`powershell
# Construir imágenes de PRE
Copy-Item deploy\\docker\\.env.pre.example deploy\\docker\\.env.pre
.\\deploy\\docker\\construir.ps1 -Entorno pre

# Arrancar PRE (front 8088, API directa 8081)
.\\deploy\\docker\\levantar.ps1 -Entorno pre -Reconstruir

# Detener
.\\deploy\\docker\\parar.ps1 -Entorno pre
\`\`\`

Para PRO se usa \`.env.pro\` y los puertos 8098/8091. Ambos entornos pueden ejecutarse a la vez.

> Si PowerShell bloquea los scripts (política de ejecución), se pueden lanzar con
> \`powershell -ExecutionPolicy Bypass -File .\\deploy\\docker\\levantar.ps1 -Entorno pre\` o ejecutar
> directamente \`docker compose --env-file deploy\\docker\\.env.pre -f deploy\\docker\\docker-compose.yml up -d\`.

Kubernetes:

\`\`\`powershell
kubectl apply -f deploy/k8s/overlays/pre/namespace.yaml
kubectl -n pruebasopencode1-pre create secret generic pruebasopencode1-secrets \`
  --from-literal=DB_USERNAME=sa \`
  --from-literal=DB_PASSWORD='...' \`
  --from-literal=APP_AUTH_USERNAME='...' \`
  --from-literal=APP_AUTH_PASSWORD='...'
kubectl apply -k deploy/k8s/overlays/pre
kubectl -n pruebasopencode1-pre rollout status deployment/back
\`\`\`

Antes de aplicar en un clúster real hay que publicar las imágenes en un registro, ajustar el
\`Ingress\`, el TLS y la \`StorageClass\`. La verificación sin clúster se ejecuta con:

\`\`\`powershell
node scripts\\verificar-despliegue.mjs
\`\`\`

## 4. Pruebas y verificación

La estrategia completa, el alcance de cada suite y los resultados esperados están en
[\`PRUEBAS.md\`](PRUEBAS.md).

### 4.1 Backend

\`\`\`powershell
cd D:\\PruebasOpenCode1\\back
.\\mvnw.cmd clean verify
\`\`\`

Incluye:

- \`PersonaServiceImplTest\`: 11 pruebas unitarias de la lógica de negocio.
- \`PersonaControllerIntegrationTest\`: 14 pruebas de integración (CRUD, reset, validaciones, 404,
  CORS, Swagger y auditoría).
- \`AuthControllerIntegrationTest\`: 9 pruebas de autenticación (401 sin token, login, token con
  expiración, acceso con token, credenciales inválidas, token inválido, contraseña BCrypt en H2,
  logout que revoca el token y consulta de sesión con y sin token).

### 4.2 Frontend

\`\`\`powershell
cd D:\\PruebasOpenCode1\\front
npm run typecheck
npm run build
\`\`\`

### 4.3 Integración completa

Con backend y frontend arrancados, desde la raíz:

\`\`\`powershell
node scripts\\verificar-integracion.mjs
\`\`\`

Comprueba a través del proxy de Vite: \`401\` sin token, autologin, salud, CORS, listado, reset,
creación, consulta, edición, validaciones, auditoría, eliminación, logout con revocación y reset final
(**18 comprobaciones**).

> Ejecutar esta suite **antes** que la de interfaz. Ambas hacen reset de datos y no deben correr en
> paralelo.

### 4.4 Prueba de interfaz con navegador real

Con backend y frontend arrancados, y después de la suite de integración:

\`\`\`powershell
cd D:\\PruebasOpenCode1\\front
npm run test:ui
\`\`\`

Usa Chrome o Edge instalado en el sistema mediante \`playwright-core\`, sin descargar navegadores.
Valida bienvenida, autologin transparente, listado, búsqueda, creación, edición, eliminación,
confirmaciones, reset, validaciones, persistencia del tema oscuro y consola sin errores
(**14 comprobaciones**). Si el navegador está en una ruta no estándar:

\`\`\`powershell
$env:CHROME_PATH = "C:\\ruta\\a\\chrome.exe"
npm run test:ui
\`\`\`

### 4.5 Mutation testing

Opcional, fuera de \`clean verify\` para no alargar el ciclo normal:

\`\`\`powershell
cd D:\\PruebasOpenCode1\\back
.\\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage
\`\`\`

Analiza \`PersonaServiceImpl\` y \`PersonaMapper\` con las pruebas unitarias del servicio. El resultado
esperado es \`BUILD SUCCESS\` con **21/21 mutaciones detectadas**. El informe HTML queda en
\`back/target/pit-reports/index.html\`. La configuración y los umbrales del 90 % están en \`pom.xml\`.
Incluir \`test-compile\` evita analizar clases de prueba obsoletas.

### 4.6 Despliegue

\`\`\`powershell
node scripts\\verificar-despliegue.mjs
\`\`\`

Valida los Dockerfiles, Nginx, Docker Compose PRE/PRO y los overlays Kustomize. No necesita el motor
de Docker arrancado ni un clúster. El resultado esperado es **43/43 comprobaciones** y el informe
\`deploy/verificacion-despliegue.json\`.

### 4.7 Construir las imágenes Docker

Requisitos: Docker Desktop o Docker Engine con Compose v2. No hace falta JDK ni Node en el host.
Ejecutar desde la raíz del repositorio.

\`\`\`powershell
# 1. Preparar la configuración de cada entorno y cambiar los secretos
Copy-Item deploy\\docker\\.env.pre.example deploy\\docker\\.env.pre
Copy-Item deploy\\docker\\.env.pro.example deploy\\docker\\.env.pro

# 2. Construir las cuatro etiquetas
powershell -ExecutionPolicy Bypass -File .\\deploy\\docker\\construir.ps1 -Entorno pre
powershell -ExecutionPolicy Bypass -File .\\deploy\\docker\\construir.ps1 -Entorno pro

# 3. Comprobar las imágenes
docker images --filter "reference=pruebasopencode1-*"
\`\`\`

Construcción directa sin los scripts:

\`\`\`powershell
docker build -f deploy/docker/back.Dockerfile -t pruebasopencode1-back:pre .

docker build -f deploy/docker/front.Dockerfile \`
  --build-arg VITE_API_BASE_URL=/api/v1 \`
  --build-arg VITE_AUTH_USERNAME=demo \`
  --build-arg VITE_AUTH_PASSWORD=demo1234 \`
  -t pruebasopencode1-front:pre .
\`\`\`

El contexto siempre es \`.\` (raíz del repositorio). Para PRO se repiten los comandos con \`:pro\` y los
valores de \`.env.pro\`. La guía completa, la publicación en un registro y los problemas frecuentes
están en [\`DESPLIEGUE.md\`](DESPLIEGUE.md#43-construcción-de-las-imágenes).

## 5. Variables de entorno

### 5.1 Backend

| Variable | Valor por defecto | Descripción |
| --- | --- | --- |
| \`SPRING_PROFILES_ACTIVE\` | \`dev\` | Perfil activo: \`dev\`, \`test\`, \`pre\` o \`prod\`. |
| \`SERVER_PORT\` | \`8080\` | Puerto HTTP. |
| \`DB_URL\` | \`jdbc:h2:file:./data/pruebasopencode1\` (\`dev\`) | URL JDBC de H2. |
| \`DB_USERNAME\` | \`sa\` (\`dev\`/\`test\`) | Usuario de la base de datos. Obligatorio en \`pre\`/\`prod\`. |
| \`DB_PASSWORD\` | *(vacía)* (\`dev\`/\`test\`) | Contraseña de la base de datos. Obligatoria en \`pre\`/\`prod\`. |
| \`JPA_DDL_AUTO\` | \`update\` | Estrategia de creación del esquema. |
| \`JPA_SHOW_SQL\` | \`false\` | Muestra SQL en los logs. |
| \`H2_CONSOLE_ENABLED\` | \`true\` (\`dev\`/\`pre\`/\`prod\`) | Activa la consola H2. |
| \`H2_CONSOLE_ALLOW_OTHERS\` | \`false\` | Permite la consola H2 desde otra IP. En Docker/Kubernetes se define \`true\`. |
| \`CORS_ALLOWED_ORIGINS\` | \`http://localhost:5173,http://127.0.0.1:5173\` (\`dev\`/\`test\`) | Orígenes permitidos. Obligatorio en \`pre\`/\`prod\`. |
| \`SEED_MOCK_DATA\` | \`true\` (\`dev\`/\`pre\`/\`prod\`) | Siembra inicial si la base de datos está vacía. |
| \`APP_AUTH_USERNAME\` | \`demo\` (\`dev\`/\`test\`) | Usuario del autologin. Obligatorio en \`pre\`/\`prod\`. |
| \`APP_AUTH_PASSWORD\` | \`demo1234\` (\`dev\`/\`test\`) | Contraseña usada para generar el hash BCrypt. Obligatoria en \`pre\`/\`prod\`. |
| \`APP_AUTH_ROLE\` | \`USER\` | Rol asignado al usuario. |
| \`APP_AUTH_TOKEN_TTL\` | \`15m\` (\`dev\`/\`test\`), \`10m\` (\`pre\`), \`5m\` (\`prod\`) | Vigencia del token Bearer. |
| \`SPRINGDOC_ENABLED\` | \`true\` (\`dev\`/\`test\`/\`pre\`/\`prod\`) | Activa Swagger UI y \`/v3/api-docs\`. |
| \`LOG_LEVEL\` | \`INFO\` (\`dev\`), \`WARN\` (\`pre\`/\`prod\`) | Nivel de log del paquete de la aplicación. |

Ejemplo:

\`\`\`powershell
$env:SERVER_PORT = "9090"
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173"
$env:APP_AUTH_TOKEN_TTL = "20m"
.\\mvnw.cmd spring-boot:run
\`\`\`

La plantilla completa está en \`back/.env.example\`. Los ficheros \`.env\` reales están excluidos por
\`.gitignore\`.

### 5.2 Frontend

| Variable | Valor por defecto | Descripción |
| --- | --- | --- |
| \`VITE_API_BASE_URL\` | \`/api/v1\` | URL base de la API usada por el cliente. |
| \`VITE_PROXY_TARGET\` | \`http://localhost:8080\` | Destino del proxy de desarrollo. |
| \`VITE_AUTH_USERNAME\` | \`demo\` | Usuario del autologin transparente. |
| \`VITE_AUTH_PASSWORD\` | \`demo1234\` | Contraseña del autologin transparente. |

Ejemplo para usar otro puerto de backend:

\`\`\`powershell
$env:VITE_PROXY_TARGET = "http://localhost:9090"
npm run dev
\`\`\`

Las variables del frontend se leen en tiempo de compilación; hay que reiniciar Vite tras cambiarlas.
El fichero \`front/.env.example\` documenta los valores disponibles.

## 6. Comprobaciones rápidas

\`\`\`powershell
# Salud del backend (público)
Invoke-RestMethod http://localhost:8080/actuator/health

# Autologin: guarda el token en $login
$credenciales = @{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/v1/auth/login \`
  -ContentType "application/json" -Body $credenciales
$cabecera = @{ Authorization = "Bearer $($login.token)" }

# Listado de personas (autenticado)
Invoke-RestMethod http://localhost:8080/api/v1/personas -Headers $cabecera

# Documento OpenAPI (debe incluir las rutas /api/v1/personas)
Invoke-RestMethod http://localhost:8080/v3/api-docs

# Abrir Swagger UI en el navegador
Start-Process http://localhost:8080/swagger-ui/index.html

# Crear una persona
$cuerpo = @{
  nombre = "Ana"
  apellido = "García"
  sexo = "FEMENINO"
  direccion = "Calle Mayor 1, Madrid"
  fechaNacimiento = "1995-05-20"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/v1/personas \`
  -ContentType "application/json" -Body $cuerpo -Headers $cabecera

# Restablecer datos mock
Invoke-RestMethod -Method Post http://localhost:8080/api/v1/personas/reset -Headers $cabecera
\`\`\`

Sin el paso de autologin, las rutas \`/api/**\` distintas de \`/api/v1/auth/**\` devuelven \`401\`. El
frontend hace ese login de forma transparente al entrar en \`/personas\`.

## 7. Problemas frecuentes

| Problema | Causa / solución |
| --- | --- |
| \`release version 21 not supported\` | Eclipse o Maven usan Java 17. Configurar un JDK 21 y \`JAVA_HOME\`. |
| \`Could not resolve placeholder 'app.cors.allowed-origins'\` | Eclipse no copió \`src/main/resources\` al classpath. Importar como proyecto Maven, ejecutar \`Maven > Update Project\` y comprobar \`target/classes/application.yml\`; si falta, \`.\\mvnw.cmd clean package\`. |
| Al arrancar aparece H2 en memoria (\`jdbc:h2:mem:...\`) | Misma causa: falta \`application.yml\` en el classpath. Seguir los pasos anteriores o usar \`.\\mvnw.cmd spring-boot:run\`. |
| \`Port 8080 was already in use\` | Cambiar \`SERVER_PORT\` o detener el proceso que ocupa el puerto. |
| \`Port 5173 is in use\` | Vite usa \`strictPort\`; detener el proceso anterior o cambiar el puerto en \`vite.config.ts\`. |
| El frontend muestra «No se pudo conectar» | El backend no está arrancado o el proxy apunta a otro puerto. |
| La API devuelve \`401\` al probarla a mano | Falta el token: ejecutar \`POST /api/v1/auth/login\` y enviar \`Authorization: Bearer <token>\`. |
| El autologin falla con \`401\` | \`VITE_AUTH_USERNAME\` / \`VITE_AUTH_PASSWORD\` no coinciden con \`APP_AUTH_USERNAME\` / \`APP_AUTH_PASSWORD\`. |
| La sesión caduca continuamente | Revisar \`APP_AUTH_TOKEN_TTL\`; el frontend renueva 60 s antes de la caducidad. |
| Error de CORS | Añadir el origen del frontend a \`CORS_ALLOWED_ORIGINS\`. |
| \`Database may be already in use\` (H2) | Solo un proceso puede usar el fichero H2; cerrar la otra instancia. |
| La consola H2 no carga | Verificar \`H2_CONSOLE_ENABLED=true\`. En Docker/Kubernetes añadir \`H2_CONSOLE_ALLOW_OTHERS=true\`, porque la petición no llega desde \`127.0.0.1\`. |
| \`npm.ps1 cannot be loaded\` | Usar \`npm.cmd\` o ajustar la política de ejecución de PowerShell. |
| La prueba UI no encuentra el navegador | Definir \`CHROME_PATH\` con la ruta de Chrome o Edge. |
| Las suites E2E/UI fallan con \`409\` o \`500\` | No ejecutarlas en paralelo: ambas hacen reset. Ejecutar integración y después UI. |
| Se quieren borrar todos los datos | Detener el backend y eliminar \`back/data\`. |

## 8. Documentación relacionada

- [\`PROMPT.md\`](PROMPT.md): prompt de reconstrucción de la aplicación.
- [\`PRUEBAS.md\`](PRUEBAS.md): estrategia y comandos de prueba.
- [\`SEGURIDAD.md\`](SEGURIDAD.md): autologin, tokens Bearer y contraseña cifrada.
- [\`MANUAL_USUARIO.md\`](MANUAL_USUARIO.md): uso de la interfaz.
- [\`OPERACION.md\`](OPERACION.md): configuración, H2, copias, migración y diagnóstico.
- [\`API.md\`](API.md): endpoints y contratos.
- [\`DESPLIEGUE.md\`](DESPLIEGUE.md): preparación para PRE y PRO.
`,
  },
  {
    id: "pruebas",
    titulo: "Pruebas de PruebasOpenCode1",
    archivo: "docs/PRUEBAS.md",
    resumen: "Estrategia de pruebas, alcance de cada suite y resultados esperados.",
    markdown: `# Pruebas de PruebasOpenCode1

> Documento actualizado el 2026-11-09. Resultados funcionales de la última ejecución: 2026-11-09.

## 1. Objetivo

Este documento describe la estrategia de pruebas del proyecto, qué cubre cada suite, cómo ejecutarla
y qué resultados se consideran correctos.

Las pruebas verifican el comportamiento local de la aplicación. No sustituyen a la monitorización ni
a las pruebas de carga o seguridad de un entorno real.

## 2. Estrategia

| Nivel | Herramienta | Cantidad | Alcance |
| --- | --- | --- | --- |
| Unitarias de backend | JUnit 5 + Mockito | 11 pruebas | Lógica de negocio de \`PersonaServiceImpl\`: CRUD, reset, errores y cálculo de edad. |
| Integración de backend | Spring Boot Test + MockMvc + H2 en memoria | 14 pruebas | API REST de personas: CRUD, validaciones, errores RFC 9457, CORS, Swagger, rutas inexistentes y auditoría. |
| Seguridad de backend | Spring Boot Test + MockMvc + BCrypt | 9 pruebas | Tokens Bearer, login, expiración, logout, revocación y contraseña cifrada. |
| Tipos y build de frontend | TypeScript + Vite | 2 comprobaciones | Contrato de tipos y compilación de producción. |
| Integración de extremo a extremo | Node.js + \`fetch\` a través del proxy de Vite | 18 comprobaciones | Flujo real frontend → proxy → autologin → API → H2 → auditoría. |
| Interfaz con navegador | Playwright Core + Chrome/Edge del sistema | 14 comprobaciones | Pantallas, autologin transparente, formularios, confirmaciones, notificaciones, tema oscuro y consola del navegador. |
| Mutación de backend | PIT 1.30.2 + JUnit 5 | 21 mutaciones | Servicio y mapper: CRUD, cálculo de edad, limpieza de datos y actualización. |
| Despliegue | Docker, Docker Compose y Kustomize | 43 comprobaciones | Dockerfiles, Nginx, Compose PRE/PRO y overlays Kubernetes, sin clúster. |
| Migración de esquema | Verificación manual con H2 antigua | — | Retirada de la columna heredada \`edad\` y funcionamiento posterior del CRUD. |

Total de pruebas de backend en \`clean verify\`: **34** (11 unitarias + 14 de integración de personas +
9 de autenticación).

## 3. Requisitos

- JDK 21 en \`JAVA_HOME\`.
- Node.js 20.19+ (probado con Node 24).
- Backend y frontend arrancados para las suites de integración y de interfaz.
- Chrome o Edge instalado para \`npm run test:ui\`.
- Docker CLI y Compose v2 para validar la configuración de despliegue.
- kubectl 1.32+ (con Kustomize) para renderizar los overlays; no hace falta un clúster.

En PowerShell, si \`npm.ps1\` está bloqueado, usar \`npm.cmd\`.

## 4. Comandos

### 4.1 Backend

\`\`\`powershell
cd D:\\PruebasOpenCode1\\back
$env:JAVA_HOME = "C:\\ruta\\al\\jdk-21"
.\\mvnw.cmd -B clean verify
\`\`\`

El comando compila, ejecuta las **34 pruebas** y genera \`target/pruebasopencode1-back.jar\`.

### 4.2 Frontend

\`\`\`powershell
cd D:\\PruebasOpenCode1\\front
npm.cmd run typecheck
npm.cmd run build
\`\`\`

\`build\` ejecuta \`tsc --noEmit\` y genera \`dist/\`.

### 4.3 Integración de la API

Con el backend en \`8080\` y el frontend en \`5173\`:

\`\`\`powershell
cd D:\\PruebasOpenCode1
node scripts\\verificar-integracion.mjs
\`\`\`

Rutas y destinos configurables:

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| \`API_BASE_URL\` | \`http://127.0.0.1:5173/api/v1\` | API consumida por el script. |
| \`FRONT_URL\` | \`http://127.0.0.1:5173\` | Frontend que sirve la SPA. |
| \`BACK_URL\` | \`http://localhost:8080\` | Backend para salud y CORS. |

Ejemplo con un backend en otro puerto:

\`\`\`powershell
$env:BACK_URL = "http://localhost:9090"
node scripts\\verificar-integracion.mjs
\`\`\`

> Ejecutar esta suite antes que la de interfaz. Ambas restablecen los datos mock y no deben ejecutarse
> en paralelo.

### 4.4 Interfaz con navegador real

Con backend y frontend arrancados, y después de la suite de integración:

\`\`\`powershell
cd D:\\PruebasOpenCode1\\front
npm.cmd run test:ui
\`\`\`

Si el navegador está en una ruta no estándar:

\`\`\`powershell
$env:CHROME_PATH = "C:\\ruta\\a\\chrome.exe"
npm.cmd run test:ui
\`\`\`

### 4.5 Mutation testing

PIT se ejecuta de forma opcional, fuera de \`clean verify\`, para no alargar el ciclo normal:

\`\`\`powershell
cd D:\\PruebasOpenCode1\\back
$env:JAVA_HOME = "C:\\ruta\\al\\jdk-21"
.\\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage
\`\`\`

\`test-compile\` es necesario: si se lanza solo el goal de PIT, reutiliza las clases de prueba ya
compiladas y puede analizar una versión antigua de los tests.

El informe HTML queda en \`back/target/pit-reports/index.html\` y el XML en
\`back/target/pit-reports/mutations.xml\`. La configuración está en \`back/pom.xml\` y aplica estos
umbrales: **90 % de mutaciones detectadas** y **90 % de cobertura de líneas** de las clases mutadas.

### 4.6 Despliegue

\`\`\`powershell
cd D:\\PruebasOpenCode1
node scripts\\verificar-despliegue.mjs
\`\`\`

Valida sin clúster:

- Existencia de Dockerfiles, Nginx, Compose y overlays.
- Backend multi-stage, JRE 21 y usuario no root.
- Frontend multi-stage, Nginx sin privilegios y build de Vite.
- Fallback de SPA, proxy \`/api\` y \`/healthz\` de Nginx.
- Exclusiones de \`.dockerignore\` (secretos, dependencias y artefactos).
- \`docker compose config\` para PRE y PRO.
- Renderizado Kustomize de ambos overlays, perfiles, imágenes, PVC, Ingress, HPA y PDB.
- Ausencia de secretos reales entre los recursos renderizados.

Genera \`deploy/verificacion-despliegue.json\`, que alimenta la tabla de despliegue de
\`/documentacion\`.

## 5. Qué cubre cada suite

### 5.1 Pruebas unitarias del servicio

\`PersonaServiceImplTest\` comprueba:

- Listado y consulta por identificador.
- Creación con recorte de espacios.
- Actualización de una persona existente y error si no existe.
- Eliminación y error si no existe.
- Restablecimiento de los 10 registros mock.
- Cálculo de la edad desde \`fechaNacimiento\`.
- Edad correcta cuando el cumpleaños todavía no ha llegado.

### 5.2 Pruebas de integración de la API de personas

\`PersonaControllerIntegrationTest\` comprueba:

- \`POST\` devuelve \`201\`, cabecera \`Location\` y datos normalizados.
- Listado inicial vacío en el perfil de test.
- \`GET\` por identificador y \`404\` con \`ProblemDetail\` para identificadores inexistentes.
- \`PUT\` persiste los cambios y devuelve \`200\`.
- \`DELETE\` devuelve \`204\` y \`404\` si la persona no existe.
- Reset con exactamente 10 registros mock.
- Validaciones \`400\` por campo con la propiedad \`validaciones\`.
- Sexo desconocido y fechas no válidas según las reglas de validación.
- Auditoría: \`creadoPor\`/\`actualizadoPor\` reflejan el usuario autenticado.
- CORS para el origen del frontend y cabecera \`Authorization\`.
- Swagger UI y \`/v3/api-docs\`.
- Ruta inexistente devuelve \`404\` y no \`500\`.

Los tests de personas usan \`@WithMockUser(username = "demo", roles = "USER")\` y comprueban la
auditoría con el usuario \`demo\`.

### 5.3 Pruebas de autenticación

\`AuthControllerIntegrationTest\` comprueba:

- Sin token, \`GET /api/v1/personas\` devuelve \`401\` con \`ProblemDetail\` y la ruta solicitada.
- Un login válido emite un token Bearer con expiración y datos del usuario.
- El token válido permite acceder a la API de personas.
- Credenciales incorrectas devuelven \`401\` sin revelar si el usuario existe.
- Un token inválido o manipulado devuelve \`401\`.
- La contraseña almacenada es un hash BCrypt de 60 caracteres y \`matches()\` lo confirma.
- El logout revoca el token y las peticiones posteriores devuelven \`401\`.
- \`GET /api/v1/auth/sesion\` con token devuelve usuario, rol y expiración.
- \`GET /api/v1/auth/sesion\` sin token devuelve \`200\` con \`autenticado: false\`.

### 5.4 Script de integración

\`scripts/verificar-integracion.mjs\` recorre 18 comprobaciones:

1. La SPA se sirve correctamente.
2. El backend responde \`UP\` en Actuator.
3. El preflight CORS permite el origen del frontend y la cabecera \`Authorization\`.
4. Sin token, \`GET /api/v1/personas\` devuelve \`401\` con \`ProblemDetail\`.
5. El autologin emite el token y \`/api/v1/auth/sesion\` lo confirma.
6. El reset deja exactamente 10 personas.
7. El listado completo es correcto e incluye la auditoría.
8. La creación devuelve \`201\`, \`Location\`, la edad calculada y la auditoría.
9. El listado refleja la nueva persona.
10. La consulta por identificador devuelve la persona creada.
11. Un identificador inexistente devuelve \`404\` con \`ProblemDetail\`.
12. La modificación persiste los cambios y actualiza la auditoría.
13. Los datos inválidos devuelven \`400\` con validaciones por campo.
14. Un sexo no permitido devuelve \`400\`.
15. La eliminación devuelve \`204\`.
16. Eliminar un identificador inexistente devuelve \`404\`.
17. El reset final vuelve a dejar 10 registros mock.
18. El logout revoca el token y la API vuelve a devolver \`401\`.

El script realiza el login, conserva el token en memoria, restablece los datos al empezar y, si falla,
intenta limpiar la persona creada.

### 5.5 Prueba de interfaz

\`front/scripts/verificar-ui.mjs\` valida 14 comprobaciones:

1. Pantalla de bienvenida y acceso a personas.
2. El autologin se ejecuta con \`200\` al entrar en personas, sin formulario ni credenciales visibles.
3. Listado con las 10 personas servidas por la API.
4. Búsqueda con resultados en tiempo real.
5. Estado específico cuando no hay coincidencias.
6. Creación desde el formulario y edad calculada en la tabla.
7. Edición con persistencia.
8. Eliminación con confirmación.
9. Reset con confirmación.
10. Validaciones del formulario en español.
11. Cierre del modal sin guardar.
12. El tema oscuro se aplica y guarda la preferencia.
13. El tema oscuro persiste tras recargar la página.
14. La consola del navegador no contiene errores.

La página \`/documentacion\` se comprueba aparte, tal y como se describe en el apartado 5.7.

### 5.6 Mutation testing

PIT modifica el bytecode de \`PersonaServiceImpl\` y \`PersonaMapper\` para comprobar si las pruebas
detectan los cambios. Se ejecutan las pruebas unitarias del servicio, que cubren también el mapper de
forma indirecta.

Alcance actual:

- 21 mutaciones generadas y **21 detectadas**.
- Cobertura de líneas de las clases mutadas: **48/50 (96 %)**.
- Umbral configurado: 90 % de mutaciones y 90 % de cobertura de líneas.

No se mutan controladores, entidades, configuración ni pruebas de integración: el objetivo es vigilar
la lógica con ramas y cálculos propios sin disparar el tiempo de ejecución.

### 5.7 Página de documentación

La ruta \`/documentacion\` se verifica con un navegador real (Chrome/Edge headless) sobre la aplicación
servida por Vite. La comprobación cubre:

1. La ruta responde y la opción «Documentación» aparece activa en el menú.
2. Existen las secciones de resumen, prompt, documentación, \`AGENTS.md\` y resultados.
3. El prompt se renderiza como Markdown y \`AGENTS.md\` conserva sus reglas.
4. Las 10 pestañas de documentación cambian de documento.
5. Hay 7 tablas de resultados (unitarias, integración backend, E2E, interfaz, mutación, frontend y
   despliegue).
6. El botón de copiar prompt responde y el índice lateral navega.
7. Los enlaces internos entre documentos son interactivos.
8. La consola del navegador no contiene errores.

La documentación general incluye \`SEGURIDAD.md\`, por lo que la página explica también el autologin,
los tokens Bearer y el almacenamiento cifrado de credenciales.

La comprobación más reciente (2026-11-09) se ejecutó con Chrome headless después de \`npm run build\`:
confirmó las secciones de resultados, las tablas generadas y la ausencia de errores en consola.

### 5.8 Verificación de despliegue

La suite de despliegue comprueba la preparación para PRE y PRO sin necesidad de un clúster:

1. Los Dockerfiles, Nginx, Compose y overlays existen en las rutas esperadas.
2. El backend usa multi-stage, JRE 21 y un usuario sin privilegios.
3. El frontend usa multi-stage, Nginx sin privilegios y \`npm run build\`.
4. Nginx aplica fallback de SPA, proxy \`/api\` y sonda \`/healthz\`.
5. \`.dockerignore\` excluye secretos, dependencias, builds y datos H2.
6. \`docker compose config\` es válido para PRE y PRO.
7. Kustomize renderiza los namespaces, ConfigMaps, Deployments, Services, PVC e Ingress.
8. PRE usa perfil \`pre\` y PRO \`prod\`, con imágenes \`:pre\` y \`:pro\`.
9. PRO incluye HPA y PDB; el backend mantiene una réplica y \`Recreate\`.
10. Los overlays no incluyen secretos reales.

## 6. Datos de prueba

- El perfil \`test\` usa H2 en memoria, \`create-drop\`, sin consola y sin siembra automática.
- El entorno local usa H2 en fichero y siembra 10 personas mock solo si la tabla está vacía.
- La tabla \`usuarios\` se crea o sincroniza al arrancar con la contraseña BCrypt configurada.
- Los scripts de integración y de interfaz llaman al endpoint de reset, por lo que no dependen del
  estado previo de la base de datos local.
- El reset restablece el contenido de personas, no la secuencia de identificadores ni la tabla de
  usuarios.
- Los registros antiguos pueden tener vacíos los campos de auditoría; los nuevos y los del reset se
  rellenan con el usuario autenticado o con \`sistema\`.

## 7. Resultados esperados

Resultados de la última verificación funcional (2026-11-09):

| Comprobación | Resultado |
| --- | --- |
| \`mvnw clean verify\` | **BUILD SUCCESS** · 34 pruebas, 0 fallos |
| \`npm run build\` | Correcto · \`dist/\` generado y tipos validados |
| \`verificar-integracion.mjs\` | **18/18 comprobaciones** |
| \`verificar-ui.mjs\` | **14/14 comprobaciones**, sin errores de consola |
| \`pitest:mutationCoverage\` | **BUILD SUCCESS** · 21/21 mutaciones, 100 % de detección y 48/50 (96 %) de cobertura |
| \`verificar-despliegue.mjs\` | **43/43 comprobaciones** |
| Docker Compose PRE y PRO | 4 imágenes construidas; contenedores \`healthy\`, login, CRUD, \`401\`, datos mock, reset, consola H2, Swagger y persistencia H2 |
| Página \`/documentacion\` | Correcta · 5 secciones, 10 documentos, 7 tablas y consola sin errores |
| Migración de esquema heredado | Columna \`edad\` eliminada; CRUD y edades correctos |

## 8. Cómo añadir pruebas

- **Lógica de negocio:** añadir un caso en \`PersonaServiceImplTest\` con Mockito. Mantener las
  aserciones sobre el DTO de respuesta, no sobre detalles internos.
- **API:** añadir un caso en \`PersonaControllerIntegrationTest\` con \`MockMvc\` y el perfil \`test\`.
  Verificar siempre el código HTTP, el contenido \`ProblemDetail\` y, si aplica, la auditoría.
- **Seguridad:** añadir casos en \`AuthControllerIntegrationTest\`. Hacer login real con
  \`MockMvc\` para obtener el token y enviarlo en \`Authorization\`; comprobar siempre el \`401\` sin token
  y la revocación tras el logout.
- **Flujo completo:** ampliar \`scripts/verificar-integracion.mjs\` con una comprobación nueva y
  actualizar el contador y la documentación.
- **Interfaz:** ampliar \`front/scripts/verificar-ui.mjs\` usando roles y etiquetas accesibles. Evitar
  selectores frágiles basados en posición o clases internas.
- **Mutación:** al añadir o cambiar lógica del servicio o del mapper, ejecutar PIT. Si aparece una
  mutación superviviente, añadir la aserción que la detecte; no bajar los umbrales sin justificarlo.
- **Documentación:** si cambian \`AGENTS.md\`, \`docs/*.md\`, los tests o los scripts de verificación,
  ejecutar \`npm run docs\` en \`/front\` y comprobar \`/documentacion\`.
- Tras cambiar el número de pruebas, actualizar \`README.md\`, \`docs/EJECUCION.md\`, este documento y
  \`docs/SEGUIMIENTO.md\`.

## 9. Limitaciones y siguientes pasos

- No hay pruebas unitarias de componentes React; se cubren con el build de tipos y la prueba E2E.
- No se mide la cobertura global del proyecto ni se exige un umbral fuera de las clases mutadas.
- PIT solo analiza \`PersonaServiceImpl\` y \`PersonaMapper\`; controladores, entidades, seguridad,
  configuración y pruebas de integración quedan fuera de la mutación.
- No hay integración continua configurada; los comandos están preparados para ejecutarse en CI.
- La migración de esquema se verificó manualmente con una H2 antigua; se podría automatizar con un
  test específico.
- Las pruebas de seguridad cubren autenticación, tokens y revocación, pero no bloqueo por intentos,
  auditoría de accesos, CSRF ni análisis de vulnerabilidades.
- No hay pruebas de carga ni de estrés.
- Las suites E2E y UI deben ejecutarse secuencialmente porque ambas restablecen los datos.

## 10. Problemas frecuentes

| Problema | Solución |
| --- | --- |
| \`Port 8080 was already in use\` | Detener el proceso que ocupa el puerto o cambiar \`SERVER_PORT\`. |
| \`Port 5173 is in use\` | Vite usa \`strictPort\`; detener el proceso anterior o cambiar el puerto en \`vite.config.ts\`. |
| El script de integración no conecta | Comprobar que backend y frontend están arrancados y que \`API_BASE_URL\`, \`FRONT_URL\` y \`BACK_URL\` apuntan a los puertos correctos. |
| La API devuelve \`401\` en la suite | Revisar que el login se completó y que el token se envía en \`Authorization: Bearer\`. |
| No se encuentra Chrome ni Edge | Definir \`CHROME_PATH\` con la ruta del navegador. |
| \`Database may be already in use\` | Solo un proceso puede usar el fichero H2; cerrar la otra instancia. |
| PIT no tiene en cuenta una prueba nueva | Se lanzó solo el goal de PIT; ejecutar antes \`test-compile\`. |
| \`/documentacion\` muestra contenido antiguo | Ejecutar \`npm run docs\` en \`/front\` o reiniciar \`npm run dev\`/\`npm run build\`, que lo hacen automáticamente. |
| La prueba UI modifica datos locales | El script hace reset al final; si se interrumpe, ejecutar \`POST /api/v1/personas/reset\` con un token válido. |
| Las suites E2E y UI fallan al ejecutarse juntas | Ejecutarlas en secuencia: primero integración y después UI. |
`,
  },
  {
    id: "manual_usuario",
    titulo: "Manual de usuario de PruebasOpenCode1",
    archivo: "docs/MANUAL_USUARIO.md",
    resumen: "Guía paso a paso para usar la interfaz.",
    markdown: `# Manual de usuario de PruebasOpenCode1

> Documento actualizado el 2026-11-09.

## 1. Qué es PruebasOpenCode1

PruebasOpenCode1 es una aplicación web para gestionar un listado de personas. Permite consultar,
buscar, crear, editar y eliminar personas, así como restablecer los datos de ejemplo.

La aplicación es de uso local y utiliza un autologin transparente: al entrar en la gestión de personas
el frontend obtiene un **token de acceso de corta duración** con un usuario de demostración, sin
mostrar ningún formulario de acceso. Las credenciales son fijas y no deben considerarse seguras para
producción.

## 2. Acceso

Con el backend y el frontend arrancados, abrir:

\`\`\`text
http://localhost:5173
\`\`\`

Si el frontend se ha compilado para otro entorno, usar la URL correspondiente.

La primera vez que se abre la gestión de personas, el frontend autentica la sesión de forma
transparente. El usuario no ve credenciales ni un formulario de login: el listado aparece directamente.
El token se conserva solo en memoria mientras la pestaña está abierta y se renueva automáticamente
antes de caducar. Si el backend se reinicia, la aplicación vuelve a autenticarse sin intervención del
usuario.

## 3. Pantalla de bienvenida

La pantalla inicial presenta PruebasOpenCode1 y da acceso a la gestión de personas.

- Pulsar **Gestionar personas** para abrir el listado.
- La cabecera permite volver a la pantalla de bienvenida.

## 4. Gestión de personas

### 4.1 Listado

La tabla muestra estas columnas:

| Columna | Contenido |
| --- | --- |
| Persona | Nombre completo, iniciales e identificador. |
| Edad | Edad calculada automáticamente desde la fecha de nacimiento. |
| Sexo | Femenino, Masculino u Otro. |
| Dirección | Dirección postal. |
| Nacimiento | Fecha de nacimiento en formato \`dd/mm/aaaa\`. |
| Acciones | Botones para editar y eliminar. |

La edad **no se introduce ni se guarda**: se calcula con la fecha de nacimiento y la fecha actual. Por
eso cambia automáticamente cuando llega el cumpleaños.

### 4.2 Buscar

El buscador filtra en tiempo real por nombre, apellido, dirección o sexo. No distingue mayúsculas de
minúsculas, pero sí tiene en cuenta los acentos.

- Si hay coincidencias, la tabla se actualiza.
- Si no hay ninguna, aparece el estado **Sin coincidencias**.
- Al borrar el texto, vuelve el listado completo.

### 4.3 Crear una persona

1. Pulsar **Nueva persona**.
2. Completar el formulario:
   - **Nombre**: obligatorio, máximo 80 caracteres.
   - **Apellido**: obligatorio, máximo 80 caracteres.
   - **Sexo**: obligatorio; seleccionar una opción.
   - **Fecha de nacimiento**: obligatoria y no puede ser futura.
   - **Dirección**: obligatoria, máximo 200 caracteres.
3. Pulsar **Crear persona**.

La edad no se pide: se calcula al guardar y aparece en la tabla. Si algún dato no es válido, el
formulario muestra el error junto al campo correspondiente.

### 4.4 Editar una persona

1. Pulsar el botón de editar de la fila deseada.
2. Modificar los campos necesarios.
3. Pulsar **Guardar cambios**.

El formulario carga los datos actuales. Si se cambia la fecha de nacimiento, la edad de la tabla se
actualiza automáticamente. Para descartar los cambios, pulsar **Cancelar**.

### 4.5 Eliminar una persona

1. Pulsar el botón de eliminar de la fila deseada.
2. Confirmar la operación en el diálogo.

La eliminación es inmediata e irreversible. Si se cancela, la persona permanece en el listado.

### 4.6 Restablecer los datos de ejemplo

1. Pulsar **Restablecer datos mock**.
2. Confirmar la operación.

La aplicación elimina todas las personas actuales y vuelve a insertar exactamente las 10 personas de
ejemplo. Los identificadores no se reinician necesariamente, por lo que pueden cambiar respecto a un
arranque inicial.

## 5. Tema claro y oscuro

El botón de tema de la cabecera alterna entre claro y oscuro. La preferencia se guarda en el navegador
y se mantiene al recargar. Si nunca se ha elegido un tema, la aplicación respeta la preferencia del
sistema operativo.

## 6. Documentación

La opción **Documentación** del menú superior abre una página con el conocimiento del proyecto:

- **Prompt de reconstrucción:** instrucciones completas para recrear la aplicación, con botón para
  copiarlas.
- **Documentación general:** pestañas con el README y las guías de arquitectura, seguridad, API,
  ejecución, pruebas, manual, operación, despliegue y seguimiento.
- **AGENTS.md:** reglas de trabajo del proyecto.
- **Resultados de pruebas:** una tabla por tipo de prueba (unitarias, integración, extremo a extremo,
  interfaz, mutación y compilación del frontend).

El contenido se genera automáticamente desde los documentos, los tests y los informes reales. No se
edita desde la interfaz y siempre muestra el último estado publicado.

## 7. Estados y mensajes

| Situación | Qué muestra la aplicación |
| --- | --- |
| Cargando datos | Indicador de carga en la tabla. |
| Sin personas | Estado vacío con acceso para crear la primera persona. |
| Búsqueda sin resultados | Estado **Sin coincidencias**. |
| Operación correcta | Notificación de confirmación. |
| Error de validación | Mensaje junto al campo afectado. |
| Error de conexión o del servidor | Aviso con el mensaje devuelto por la API. |
| Sesión renovada | Aviso de que el token se ha renovado; no hay que hacer nada. |
| Sesión caducada o backend reiniciado | Aviso de que se vuelve a autenticar; el flujo continúa solo. |
| Error de renderizado | Pantalla de recuperación con opción de recargar. |

Los avisos de sesión son informativos: la aplicación renueva el token o vuelve a autenticarse de forma
transparente, sin pedir credenciales.

## 8. Validaciones

| Campo | Reglas |
| --- | --- |
| Nombre | Obligatorio, máximo 80 caracteres. |
| Apellido | Obligatorio, máximo 80 caracteres. |
| Sexo | Obligatorio. |
| Fecha de nacimiento | Obligatoria y no futura. |
| Dirección | Obligatoria, máximo 200 caracteres. |

Las mismas reglas se aplican en el backend. Aunque se saltara la validación del navegador, la API
rechazaría los datos inválidos con un error \`400\`.

## 9. Accesibilidad y diseño

- La interfaz está en español.
- Los formularios tienen etiquetas asociadas a cada campo.
- Los errores se anuncian y se asocian al campo correspondiente.
- Los diálogos se pueden cerrar con el botón **Cancelar**, el botón de cierre, la tecla \`Esc\` o un
  clic fuera del cuadro.
- El diseño es responsive: en pantallas estrechas, los campos del formulario se apilan en una columna.
- Se respeta \`prefers-reduced-motion\` y la preferencia de tema del sistema.

## 10. Limitaciones

- El acceso usa un token de demostración con credenciales fijas; no hay gestión de usuarios ni
  registro.
- El token vive en memoria de la pestaña: recargar obliga a un nuevo autologin transparente.
- Los datos se guardan en una base H2 local; no están pensados para uso multiusuario.
- El restablecimiento elimina todos los datos actuales sin posibilidad de deshacer.
- La aplicación no está preparada para producción sin revisar seguridad, base de datos, copias de
  seguridad y despliegue.

## 11. Más información

- [Ejecución local](EJECUCION.md)
- [Seguridad](SEGURIDAD.md)
- [API REST](API.md)
- [Arquitectura](ARQUITECTURA.md)
- [Operación y mantenimiento](OPERACION.md)
- [Pruebas](PRUEBAS.md)
- [Prompt de reconstrucción](PROMPT.md)
`,
  },
  {
    id: "operacion",
    titulo: "Operación y mantenimiento de PruebasOpenCode1",
    archivo: "docs/OPERACION.md",
    resumen: "Configuración, base de datos H2, copias y diagnóstico.",
    markdown: `# Operación y mantenimiento de PruebasOpenCode1

> Documento actualizado el 2026-11-09.
>
> **Alcance:** operación local y preparación para entornos futuros. No describe un despliegue real en
> PRE o PRO; para eso, véase [\`DESPLIEGUE.md\`](DESPLIEGUE.md).

## 1. Componentes en ejecución

| Componente | Puerto por defecto | Descripción |
| --- | --- | --- |
| Backend Spring Boot | \`8080\` | API REST \`/api/v1\`, Actuator, Swagger UI y consola H2. |
| Frontend Vite | \`5173\` | SPA en desarrollo con proxy \`/api\` hacia el backend. |
| Frontend compilado | \`4173\` | Servidor de previsualización de \`dist/\`; no incluye proxy. |
| Docker PRE | \`8088\` (front) / \`8081\` (API) | Nginx + backend con perfil \`pre\`. |
| Docker PRO | \`8098\` (front) / \`8091\` (API) | Nginx + backend con perfil \`prod\`. |
| H2 | — | Base de datos en fichero, usada por el backend. |

En desarrollo, el navegador habla con Vite y Vite redirige las peticiones \`/api/**\` al backend. El
backend también admite peticiones directas mediante CORS configurable. La autenticación se realiza con
un **token Bearer** que el frontend guarda en memoria y envía en la cabecera \`Authorization\`.

## 2. Configuración

### 2.1 Backend

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| \`SPRING_PROFILES_ACTIVE\` | \`dev\` | Perfil activo: \`dev\`, \`test\`, \`pre\` o \`prod\`. |
| \`SERVER_PORT\` | \`8080\` | Puerto HTTP. |
| \`DB_URL\` | \`jdbc:h2:file:./data/pruebasopencode1\` (\`dev\`) | URL JDBC de H2. |
| \`DB_USERNAME\` | \`sa\` (\`dev\`/\`test\`) | Usuario de la base de datos. Obligatorio en \`pre\`/\`prod\`. |
| \`DB_PASSWORD\` | *(vacía)* (\`dev\`/\`test\`) | Contraseña de la base de datos. Obligatoria en \`pre\`/\`prod\`. |
| \`JPA_DDL_AUTO\` | \`update\` | Estrategia de esquema de Hibernate. |
| \`JPA_SHOW_SQL\` | \`false\` | Muestra el SQL ejecutado en los logs. |
| \`H2_CONSOLE_ENABLED\` | \`true\` (\`dev\`/\`pre\`/\`prod\`) | Activa la consola H2 en \`/h2-console\`. |
| \`H2_CONSOLE_ALLOW_OTHERS\` | \`false\` | Permite el acceso a la consola desde otra IP. En Docker/Kubernetes se define \`true\`. |
| \`CORS_ALLOWED_ORIGINS\` | \`http://localhost:5173,http://127.0.0.1:5173\` (\`dev\`/\`test\`) | Orígenes permitidos, separados por comas. Obligatorio en \`pre\`/\`prod\`. |
| \`SEED_MOCK_DATA\` | \`true\` (\`dev\`/\`pre\`/\`prod\`) | Siembra los 10 datos mock si la tabla está vacía. |
| \`APP_AUTH_USERNAME\` | \`demo\` (\`dev\`/\`test\`) | Usuario del autologin. Obligatorio en \`pre\`/\`prod\`. |
| \`APP_AUTH_PASSWORD\` | \`demo1234\` (\`dev\`/\`test\`) | Contraseña usada para generar el hash BCrypt. Obligatoria en \`pre\`/\`prod\`. |
| \`APP_AUTH_ROLE\` | \`USER\` | Rol del usuario. |
| \`APP_AUTH_TOKEN_TTL\` | \`15m\` (\`dev\`/\`test\`), \`10m\` (\`pre\`), \`5m\` (\`prod\`) | Vigencia del token Bearer. |
| \`SPRINGDOC_ENABLED\` | \`true\` (\`dev\`/\`test\`/\`pre\`/\`prod\`) | Activa Swagger UI y \`/v3/api-docs\`. |
| \`LOG_LEVEL\` | \`INFO\` (\`dev\`), \`WARN\` (\`pre\`/\`prod\`) | Nivel de log del paquete de la aplicación. |

Ejemplo:

\`\`\`powershell
$env:SERVER_PORT = "9090"
$env:H2_CONSOLE_ENABLED = "false"
$env:APP_AUTH_TOKEN_TTL = "20m"
cd D:\\PruebasOpenCode1\\back
.\\mvnw.cmd spring-boot:run
\`\`\`

La plantilla completa está en \`back/.env.example\`. Los ficheros \`.env\` reales están excluidos por
\`.gitignore\`.

### 2.2 Frontend

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| \`VITE_API_BASE_URL\` | \`/api/v1\` | URL base de la API usada por el cliente. |
| \`VITE_PROXY_TARGET\` | \`http://localhost:8080\` | Destino del proxy de desarrollo. |
| \`VITE_AUTH_USERNAME\` | \`demo\` | Usuario del autologin transparente. |
| \`VITE_AUTH_PASSWORD\` | \`demo1234\` | Contraseña del autologin transparente. |

Las variables de Vite se resuelven al arrancar o compilar; hay que reiniciar el servidor tras
cambiarlas. El fichero \`front/.env.example\` contiene valores de referencia.

## 3. Arranque y parada

### 3.1 Desarrollo local

\`\`\`powershell
# Terminal 1: backend
cd D:\\PruebasOpenCode1\\back
.\\mvnw.cmd spring-boot:run

# Terminal 2: frontend
cd D:\\PruebasOpenCode1\\front
npm.cmd run dev
\`\`\`

También se pueden arrancar desde Eclipse (backend) y VS Code (frontend). Las instrucciones detalladas
están en [\`EJECUCION.md\`](EJECUCION.md).

Para detener los procesos, usar \`Ctrl+C\` en cada terminal o el botón de parada del IDE. Antes de
copiar o restaurar la base de datos, detener siempre el backend.

### 3.2 Docker Compose

\`\`\`powershell
Copy-Item deploy\\docker\\.env.pre.example deploy\\docker\\.env.pre
.\\deploy\\docker\\levantar.ps1 -Entorno pre -Reconstruir
.\\deploy\\docker\\parar.ps1 -Entorno pre
\`\`\`

- PRE publica el frontend en \`8088\` y la API en \`8081\`.
- PRO publica el frontend en \`8098\` y la API en \`8091\`.
- Cada entorno usa su propio proyecto Compose, red y volumen H2.
- Los datos se guardan en \`pruebasopencode1-back-data-<entorno>\`.
- \`parar.ps1 -EliminarDatos\` elimina también el volumen.

La guía completa está en [\`DESPLIEGUE.md\`](DESPLIEGUE.md).

### 3.3 Comprobaciones tras el arranque

\`\`\`powershell
# Salud del backend (público)
Invoke-RestMethod http://localhost:8080/actuator/health

# Autologin: obtiene el token
$login = Invoke-RestMethod -Method Post http://localhost:8080/api/v1/auth/login \`
  -ContentType "application/json" \`
  -Body (@{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json)
$cabecera = @{ Authorization = "Bearer $($login.token)" }

# Listado de personas (autenticado)
Invoke-RestMethod http://localhost:8080/api/v1/personas -Headers $cabecera

# Estado de la sesión
Invoke-RestMethod http://localhost:8080/api/v1/auth/sesion -Headers $cabecera

# Swagger UI
Start-Process http://localhost:8080/swagger-ui/index.html
\`\`\`

Sin token, \`GET /api/v1/personas\` devuelve \`401\` con un \`ProblemDetail\`.

## 4. Base de datos H2

### 4.1 Ubicación

La URL por defecto es relativa al directorio desde el que se arranca el backend:

- Si se arranca desde \`back\`, los ficheros quedan en \`back/data/\`.
- El fichero principal es \`pruebasopencode1.mv.db\`.
- Pueden aparecer ficheros auxiliares de trazas o bloqueo.

Solo un proceso puede abrir el fichero H2 a la vez. Si aparece \`Database may be already in use\`,
detener la otra instancia del backend.

### 4.2 Copia de seguridad

1. Detener el backend.
2. Copiar el fichero \`back/data/pruebasopencode1.mv.db\` a una ubicación segura.
3. Volver a arrancar el backend.

La copia contiene datos personales de prueba y el hash de credenciales; debe almacenarse con las
mismas precauciones que cualquier base de datos real.

### 4.3 Restauración

1. Detener el backend.
2. Guardar una copia del fichero actual, si se quiere conservar.
3. Sustituir \`pruebasopencode1.mv.db\` por la copia de seguridad.
4. Arrancar el backend.

### 4.4 Restablecer el contenido

- Para recuperar los 10 datos mock sin detener el backend:

  \`\`\`powershell
  $login = Invoke-RestMethod -Method Post http://localhost:8080/api/v1/auth/login \`
    -ContentType "application/json" \`
    -Body (@{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json)
  Invoke-RestMethod -Method Post http://localhost:8080/api/v1/personas/reset \`
    -Headers @{ Authorization = "Bearer $($login.token)" }
  \`\`\`

- Para borrar completamente la base de datos local:

  1. Detener el backend.
  2. Eliminar la carpeta \`back/data/\`.
  3. Arrancar el backend; se creará una base nueva y se sembrarán los datos mock.

El reset restablece el contenido, pero no reinicia necesariamente la secuencia de identificadores.
Tampoco reinicia la tabla de usuarios ni los tokens activos.

## 5. Migración del esquema

El esquema se actualiza con \`spring.jpa.hibernate.ddl-auto=update\`. Este modo añade columnas y tablas
nuevas, pero no elimina columnas antiguas.

\`MigracionEsquema\` se ejecuta al arrancar y elimina la antigua columna \`edad\` de la tabla \`personas\`
cuando existe. La edad ya no se almacena: se calcula desde \`fechaNacimiento\`.

La auditoría añade las columnas \`creado_en\`, \`actualizado_en\`, \`creado_por\` y \`actualizado_por\` con
\`ddl-auto=update\`. Las filas anteriores a la auditoría las conservan a \`null\`; los registros nuevos y
los del reset se rellenan automáticamente.

Consecuencias prácticas:

- Al actualizar desde una versión anterior **no es necesario borrar** \`back/data\`.
- La migración se ejecuta antes de la siembra inicial de datos mock.
- Es una migración ligera específica de H2, pensada para desarrollo.
- Para PRE/PRO se recomienda sustituirla por Flyway o Liquibase.

Comprobación manual de las columnas:

\`\`\`sql
SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE LOWER(TABLE_NAME) = 'personas'
ORDER BY ORDINAL_POSITION;
\`\`\`

No debe aparecer la columna \`EDAD\`; sí deben aparecer las cuatro columnas de auditoría.

## 6. Logs y diagnóstico

- Los logs se muestran en la consola o en la vista de consola del IDE.
- \`LOG_LEVEL=DEBUG\` aumenta el detalle de la aplicación.
- \`JPA_SHOW_SQL=true\` muestra el SQL de Hibernate.
- \`GET /actuator/health\` devuelve el estado general.
- \`GET /actuator/health/liveness\` y \`/actuator/health/readiness\` están preparados para Kubernetes.
- \`/swagger-ui/index.html\` y \`/v3/api-docs\` permiten revisar y probar la API (\`dev\`/\`test\`/\`pre\`/\`prod\`).
- \`/h2-console\` permite inspeccionar la base de datos en desarrollo.
- \`POST /api/v1/auth/logout\` revoca el token actual; sirve para comprobar el ciclo de vida.

Credenciales H2 locales:

| Parámetro | Valor |
| --- | --- |
| JDBC URL | \`jdbc:h2:file:./data/pruebasopencode1\` |
| Usuario | \`sa\` |
| Contraseña | *(vacía)* |

## 7. Rutina de comprobación

Antes de dar por buena una instalación local:

1. \`GET /actuator/health\` responde \`UP\`.
2. \`POST /api/v1/auth/login\` devuelve un token y \`GET /api/v1/auth/sesion\` lo confirma.
3. \`GET /api/v1/personas\` con token devuelve datos; sin token devuelve \`401\`.
4. La SPA carga en \`http://localhost:5173\`.
5. Crear, editar, eliminar y restablecer funcionan.
6. La edad mostrada coincide con la fecha de nacimiento.
7. Los campos de auditoría aparecen en los registros nuevos.
8. No hay errores en la consola del navegador.
9. Los logs no muestran excepciones ni errores de base de datos.

## 8. Problemas frecuentes

| Problema | Causa probable / solución |
| --- | --- |
| \`Port 8080 was already in use\` | Otro backend está arrancado. Detenerlo o cambiar \`SERVER_PORT\`. |
| \`Port 5173 is in use\` | Vite usa \`strictPort\`; detener el proceso anterior o cambiar el puerto. |
| El frontend muestra «No se pudo conectar» | Backend detenido o proxy apuntando a otro puerto. |
| Error de CORS | Añadir el origen del frontend a \`CORS_ALLOWED_ORIGINS\`. |
| \`Database may be already in use\` | Solo un proceso puede usar el fichero H2. Cerrar la otra instancia. |
| H2 arranca en memoria | Falta \`application.yml\` en el classpath; revisar \`EJECUCION.md\`. |
| La consola H2 no carga | Comprobar \`H2_CONSOLE_ENABLED=true\`; en Docker/Kubernetes, \`H2_CONSOLE_ALLOW_OTHERS=true\`. |
| La API devuelve \`401\` al probarla a mano | Falta el token: hacer \`POST /api/v1/auth/login\` y enviar \`Authorization: Bearer <token>\`. |
| El autologin falla con \`401\` | \`VITE_AUTH_USERNAME\`/\`VITE_AUTH_PASSWORD\` no coinciden con \`APP_AUTH_*\`. |
| La sesión caduca continuamente | Revisar \`APP_AUTH_TOKEN_TTL\`; el frontend renueva 60 s antes. |
| Los avisos de sesión aparecen tras reiniciar el backend | Esperado: los tokens viven en memoria y el frontend se reautentica. |
| No aparece la columna \`edad\` | Es el comportamiento esperado: la edad se calcula. |
| Los datos no cambian tras editar | Comprobar que el backend no está usando otra base de datos u otro puerto. |

## 9. Seguridad y buenas prácticas

- La API usa tokens Bearer opacos de corta duración; el backend es sin estado.
- Las credenciales del autologin son fijas y de demostración; no son secretos reales.
- En \`pre\` y \`prod\` los secretos (\`DB_*\`, \`APP_AUTH_*\`, \`CORS_ALLOWED_ORIGINS\`) deben inyectarse desde
  el entorno; no tienen valor por defecto. En Docker se leen de \`.env.<entorno>\`; en Kubernetes, del
  \`Secret pruebasopencode1-secrets\`.
- Por defecto, la consola H2 y Swagger están activos también en \`pre\`/\`prod\` para igualar el
  comportamiento local. Antes de exponer un entorno real, definir \`H2_CONSOLE_ENABLED=false\` y
  \`SPRINGDOC_ENABLED=false\`; el acceso a la consola debe quedar restringido a la red interna.
- No exponer el puerto de H2 ni el fichero \`.mv.db\`.
- No incluir contraseñas ni rutas específicas en el repositorio; usar variables de entorno y mantener
  los \`.env\` fuera de control de versiones.
- Revisar \`CORS_ALLOWED_ORIGINS\` antes de publicar el frontend.
- Las copias de seguridad contienen datos personales y hashes: cifrarlas y limitar su acceso.
- Antes de un despliegue real, añadir autenticación individual, TLS, gestión de secretos, una base de
  datos adecuada y revisar CSRF si se introducen cookies.

## 10. Ejecución y despliegue en PRE y PRO

La configuración está externalizada para no modificar el código al cambiar de entorno. La
contenerización y los manifiestos están implementados:

1. **Docker Compose**: \`deploy/docker/.env.pre\` y \`.env.pro\` definen perfil, base de datos, CORS y
   secretos. \`levantar.ps1\` y \`parar.ps1\` gestionan cada entorno por separado.
2. **Kubernetes**: \`deploy/k8s/overlays/pre\` y \`pro\` aplican namespace, perfil, réplicas, Ingress y
   TLS sobre una base común. Los secretos se crean con \`kubectl create secret\`.
3. **H2**: volumen persistente y una sola réplica de backend con estrategia \`Recreate\`. Para escalar
   el backend hace falta una base externa y migraciones formales.
4. **Tokens**: viven en memoria del backend; el frontend puede escalar, el backend no sin un almacén
   compartido o JWT.
5. **Salud**: Actuator expone \`liveness\`/\`readiness\`; Nginx expone \`/healthz\`.
6. **Verificación**: \`node scripts\\verificar-despliegue.mjs\` valida Dockerfiles, Compose y Kustomize
   sin clúster (**43/43**).

Antes de una implantación real: publicar las imágenes en un registro, sustituir hosts y certificados,
crear secretos reales, configurar copias de seguridad y sustituir el autologin por autenticación
individual. El procedimiento y las limitaciones se detallan en [\`DESPLIEGUE.md\`](DESPLIEGUE.md).

## 11. Mantenimiento

- Antes de actualizar dependencias, ejecutar \`mvnw clean verify\` y \`npm run build\`.
- Tras cambios en la lógica de negocio o el mapper, ejecutar PIT con
  \`mvnw -B test-compile org.pitest:pitest-maven:mutationCoverage\` y revisar
  \`target/pit-reports/index.html\`.
- Revisar la compatibilidad de springdoc con la versión de Spring Boot antes de actualizarlo.
- Ejecutar las pruebas de integración y de interfaz (en ese orden) tras cambios funcionales.
- Regenerar la documentación viva con \`npm run docs\` tras modificar documentos o pruebas.
- Actualizar \`docs/SEGUIMIENTO.md\` y este documento cuando cambien la configuración o el
  procedimiento de operación.
`,
  },
  {
    id: "despliegue",
    titulo: "Despliegue de PruebasOpenCode1 en Docker y Kubernetes",
    archivo: "docs/DESPLIEGUE.md",
    resumen: "Docker Compose y Kubernetes con overlays PRE/PRO verificados.",
    markdown: `# Despliegue de PruebasOpenCode1 en Docker y Kubernetes

> Documento actualizado el 2026-11-09.
>
> **Estado:** contenerización y manifiestos **implementados y verificados** para PRE y PRO. No se ha
> realizado un despliegue real en un clúster: no había contexto de Kubernetes configurado. Las
> imágenes se han construido y probado con Docker Compose, y los overlays se han renderizado con
> Kustomize.

## 1. Objetivo

Permitir que PruebasOpenCode1 se ejecute en dos entornos sin modificar el código fuente:

- **PRE**: preproducción, con configuración y datos de prueba.
- **PRO**: producción.

La aplicación mantiene las tecnologías obligatorias del proyecto: Java 21, Spring Boot, H2, React,
TypeScript y Vite. El cambio de entorno se resuelve con variables de entorno, perfiles de Spring y
overlays de Kustomize.

## 2. Arquitectura desplegada

\`\`\`text
                         ┌──────────────────────────────┐
        Internet  ─────▶ │  Ingress / Load Balancer     │
                         │  pre.pruebasopencode1...     │
                         │  pruebasopencode1...         │
                         └──────────────┬───────────────┘
                                        │
                         ┌──────────────▼───────────────┐
                         │  front (Nginx sin root)      │
                         │  SPA + proxy /api → back     │
                         └──────────────┬───────────────┘
                                        │ HTTP interno
                         ┌──────────────▼───────────────┐
                         │  back (Spring Boot :8080)    │
                         │  1 réplica + Recreate        │
                         └──────────────┬───────────────┘
                                        │ JDBC
                         ┌──────────────▼───────────────┐
                         │  H2 en volumen persistente   │
                         │  PVC ReadWriteOnce           │
                         └──────────────────────────────┘
\`\`\`

Decisiones clave:

| Decisión | Motivo |
| --- | --- |
| Dos imágenes independientes | Backend y frontend tienen ciclos de vida y escalado distintos. |
| Nginx sirve la SPA y proxifica \`/api\` | La API y la interfaz comparten origen; se evita CORS en el navegador. |
| Backend sin root (UID 10001) | Reduce privilegios dentro del contenedor. |
| Nginx \`nginx-unprivileged\` en el puerto 8080 | No necesita root ni capacidades para escuchar en un puerto privilegiado. |
| Configuración en tiempo de ejecución | La misma imagen de backend sirve para PRE y PRO. |
| H2 con PVC y una réplica | H2 en fichero no admite escrituras concurrentes de varias instancias. |
| Kustomize base + overlays | Evita duplicar manifiestos y hace explícitas las diferencias PRE/PRO. |

## 3. Estructura

\`\`\`text
deploy/
├── README.md
├── docker/
│   ├── back.Dockerfile
│   ├── front.Dockerfile
│   ├── nginx.conf
│   ├── docker-compose.yml
│   ├── .env.pre.example
│   ├── .env.pro.example
│   ├── construir.ps1
│   ├── levantar.ps1
│   └── parar.ps1
└── k8s/
    ├── base/
    │   ├── kustomization.yaml
    │   ├── configmap.yaml
    │   ├── back-pvc.yaml
    │   ├── back-deployment.yaml
    │   ├── back-service.yaml
    │   ├── front-deployment.yaml
    │   ├── front-service.yaml
    │   └── ingress.yaml
    └── overlays/
        ├── pre/
        │   ├── kustomization.yaml
        │   ├── namespace.yaml
        │   ├── configmap-patch.yaml
        │   ├── ingress-patch.yaml
        │   └── secret.example.yaml
        └── pro/
            ├── kustomization.yaml
            ├── namespace.yaml
            ├── configmap-patch.yaml
            ├── ingress-patch.yaml
            ├── front-replicas-patch.yaml
            ├── hpa-front.yaml
            ├── pdb-front.yaml
            └── secret.example.yaml
\`\`\`

La raíz incorpora \`.dockerignore\`, que excluye \`.git\`, dependencias, builds, datos H2 y ficheros
\`.env\`.

## 4. Imágenes Docker

### 4.1 Backend

\`deploy/docker/back.Dockerfile\` usa dos etapas:

1. \`maven:3.9.11-eclipse-temurin-21\` compila con Maven Wrapper y genera
   \`target/pruebasopencode1-back.jar\` sin ejecutar pruebas.
2. \`eclipse-temurin:21-jre-alpine\` ejecuta el JAR con un usuario \`app\` (UID/GID 10001).

Características:

- \`JAVA_OPTS\` con \`-XX:MaxRAMPercentage=75\` y salida ante \`OutOfMemoryError\`.
- Directorio \`/app/data\` preparado para el volumen H2.
- Sin secretos ni ficheros de entorno en la imagen.
- \`SPRING_PROFILES_ACTIVE\` se define en el orquestador.

### 4.2 Frontend

\`deploy/docker/front.Dockerfile\` usa dos etapas:

1. \`node:24-alpine\` ejecuta \`npm ci\` y \`npm run build\`. El contexto incluye \`AGENTS.md\`, \`docs/\`,
   \`scripts/\` y los tests de Java porque \`npm run build\` regenera la documentación viva.
2. \`nginxinc/nginx-unprivileged:1.27-alpine\` sirve \`dist/\` en el puerto 8080.

\`nginx.conf\` incluye:

- Fallback de SPA: \`try_files $uri $uri/ /index.html\`.
- Proxy \`/api/\` a \`http://back:8080\`.
- \`/healthz\` para sondas.
- Cabeceras de seguridad, caché de assets con hash y \`no-cache\` para \`index.html\`.

### 4.3 Construcción de las imágenes

#### Requisitos

- Docker Desktop o Docker Engine con Compose v2 en funcionamiento.
- Conexión a Internet en la primera construcción para descargar las imágenes base y las dependencias.
- Ejecutar los comandos desde la **raíz del repositorio**.
- No hace falta JDK ni Node instalados en el host: las dos imágenes se construyen en etapas
  multi-stage dentro de Docker.
- Un fichero \`.env.<entorno>\` con las credenciales. El frontend incrusta \`VITE_AUTH_USERNAME\` y
  \`VITE_AUTH_PASSWORD\` en el bundle al construir.

#### Paso 1: preparar la configuración de cada entorno

\`\`\`powershell
Copy-Item deploy\\docker\\.env.pre.example deploy\\docker\\.env.pre
Copy-Item deploy\\docker\\.env.pro.example deploy\\docker\\.env.pro
\`\`\`

Editar los secretos de ambos ficheros. Están excluidos de Git y de \`.dockerignore\`; no se copian
dentro de las imágenes.

#### Paso 2: construir con el script (recomendado)

\`\`\`powershell
powershell -ExecutionPolicy Bypass -File .\\deploy\\docker\\construir.ps1 -Entorno pre
powershell -ExecutionPolicy Bypass -File .\\deploy\\docker\\construir.ps1 -Entorno pro
\`\`\`

El script lee \`deploy/docker/.env.<entorno>\`, construye el backend y el frontend y genera estas
etiquetas:

- \`pruebasopencode1-back:pre\` y \`pruebasopencode1-front:pre\`.
- \`pruebasopencode1-back:pro\` y \`pruebasopencode1-front:pro\`.

El backend usa el mismo código en ambos entornos; la etiqueta \`:pro\` existe para poder publicar y
desplegar cada entorno por separado. Si se quiere evitar recompilarlo dos veces:

\`\`\`powershell
docker tag pruebasopencode1-back:pre pruebasopencode1-back:pro
\`\`\`

El frontend **sí** debe construirse una vez por entorno, porque las variables \`VITE_*\` se incrustan
en el bundle.

#### Paso 3: construir con \`docker build\` directamente

Backend:

\`\`\`powershell
docker build -f deploy/docker/back.Dockerfile -t pruebasopencode1-back:pre .
\`\`\`

Frontend:

\`\`\`powershell
docker build -f deploy/docker/front.Dockerfile \`
  --build-arg VITE_API_BASE_URL=/api/v1 \`
  --build-arg VITE_AUTH_USERNAME=demo \`
  --build-arg VITE_AUTH_PASSWORD=demo1234 \`
  -t pruebasopencode1-front:pre .
\`\`\`

Para PRO se repiten los comandos con \`-t pruebasopencode1-front:pro\` y los valores de
\`deploy/docker/.env.pro\`.

> El contexto del build es la raíz del repositorio (\`.\`). No usar \`deploy/docker\` como contexto: los
> Dockerfiles copian \`back/\`, \`front/\`, \`docs/\`, \`scripts/\` y \`AGENTS.md\` desde la raíz.

#### Paso 4: comprobar las imágenes

\`\`\`powershell
docker images --filter "reference=pruebasopencode1-*"
docker image inspect pruebasopencode1-back:pre --format "{{.Config.User}}"
docker image inspect pruebasopencode1-front:pre --format "{{json .Config.ExposedPorts}}"
\`\`\`

Resultados esperados:

- El backend se ejecuta con el usuario \`app\` (UID 10001), no como root.
- Backend y frontend exponen el puerto \`8080/tcp\`.
- No hay ficheros \`.env\` ni secretos dentro de las imágenes.

Después se pueden arrancar los contenedores:

\`\`\`powershell
powershell -ExecutionPolicy Bypass -File .\\deploy\\docker\\levantar.ps1 -Entorno pre
docker compose --env-file deploy/docker/.env.pre -f deploy/docker/docker-compose.yml ps
Invoke-RestMethod http://localhost:8081/actuator/health
\`\`\`

#### Paso 5: publicar en un registro

\`\`\`powershell
docker login ghcr.io
powershell -ExecutionPolicy Bypass -File .\\deploy\\docker\\construir.ps1 -Entorno pre -Registro ghcr.io/pedrojaen
docker push ghcr.io/pedrojaen/pruebasopencode1-back:pre
docker push ghcr.io/pedrojaen/pruebasopencode1-front:pre
\`\`\`

En Kubernetes hay que ajustar \`images.newName\` del overlay al nombre publicado en el registro.

#### Cuándo hay que reconstruir

| Cambio | Imagen que hay que reconstruir |
| --- | --- |
| Código, \`pom.xml\` o configuración del backend | Backend |
| Código del frontend, \`package.json\` o \`package-lock.json\` | Frontend |
| \`nginx.conf\` | Frontend |
| \`README.md\`, \`AGENTS.md\`, \`docs/\` o \`scripts/\` | Frontend, porque \`npm run build\` regenera \`/documentacion\` |
| \`VITE_API_BASE_URL\`, \`VITE_AUTH_USERNAME\` o \`VITE_AUTH_PASSWORD\` | Frontend |
| Variables de ejecución, secretos o perfil de Spring | Ninguna: se inyectan al arrancar |

#### Problemas frecuentes

| Problema | Solución |
| --- | --- |
| \`No existe ...\\.env.pre\` | Copiar \`.env.pre.example\` a \`.env.pre\`. |
| PowerShell bloquea el script | Usar \`powershell -ExecutionPolicy Bypass -File ...\` o los comandos \`docker build\` directos. |
| \`request returned 500\` o el motor no responde | Abrir Docker Desktop y esperar a que el motor esté operativo. |
| \`failed to solve\` al descargar imágenes base | Comprobar la conexión, el proxy o el DNS de Docker. |
| \`Define DB_USERNAME...\` al arrancar | Faltan variables obligatorias en \`.env.<entorno>\`. |
| Cambios que no aparecen | Reconstruir la imagen afectada y recrear: \`docker compose ... up -d --force-recreate\`. |
| Puerto ocupado | Cambiar \`FRONT_PORT\` o \`BACK_PORT\` en \`.env.<entorno>\`. |
| Imagen para otra arquitectura | Construir en la arquitectura destino o añadir \`--platform linux/amd64\`. |

## 5. Docker Compose para PRE y PRO

El fichero \`deploy/docker/docker-compose.yml\` se parametriza con
\`deploy/docker/.env.<entorno>\`. Las credenciales son obligatorias: Compose falla con un mensaje claro
si falta alguna.

\`\`\`powershell
.\\deploy\\docker\\levantar.ps1 -Entorno pre -Reconstruir
.\\deploy\\docker\\levantar.ps1 -Entorno pro -Reconstruir
\`\`\`

| Entorno | Frontend | API directa | Perfil | TTL | Red y volumen |
| --- | --- | --- | --- | --- | --- |
| PRE | \`http://localhost:8088\` | \`http://localhost:8081\` | \`pre\` | \`10m\` | \`pruebasopencode1-pre_*\` |
| PRO | \`http://localhost:8098\` | \`http://localhost:8091\` | \`prod\` | \`5m\` | \`pruebasopencode1-pro_*\` |

Ambos entornos pueden ejecutarse a la vez: usan proyectos, contenedores, redes y volúmenes distintos.

Comprobaciones:

\`\`\`powershell
Invoke-RestMethod http://localhost:8081/actuator/health
Invoke-WebRequest http://localhost:8088/healthz -UseBasicParsing
$login = Invoke-RestMethod -Method Post http://localhost:8088/api/v1/auth/login \`
  -ContentType "application/json" \`
  -Body (@{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json)
Invoke-RestMethod http://localhost:8088/api/v1/personas \`
  -Headers @{ Authorization = "Bearer $($login.token)" }
\`\`\`

Parada:

\`\`\`powershell
.\\deploy\\docker\\parar.ps1 -Entorno pre
.\\deploy\\docker\\parar.ps1 -Entorno pro -EliminarDatos
\`\`\`

## 6. Kubernetes

### 6.1 Recursos base

| Recurso | Nombre | Uso |
| --- | --- | --- |
| \`ConfigMap\` | \`pruebasopencode1-config\` | Variables no sensibles por entorno. |
| \`Secret\` | \`pruebasopencode1-secrets\` | \`DB_USERNAME\`, \`DB_PASSWORD\`, \`APP_AUTH_USERNAME\`, \`APP_AUTH_PASSWORD\`. |
| \`PersistentVolumeClaim\` | \`back-data\` | Datos H2 (\`/app/data\`), \`ReadWriteOnce\`, 1 Gi. |
| \`Deployment\` | \`back\` | 1 réplica, estrategia \`Recreate\`, usuario 10001, root FS de solo lectura y \`/tmp\` efímero. |
| \`Deployment\` | \`front\` | Nginx, 1 réplica en PRE y 2 en PRO, \`RollingUpdate\`. |
| \`Service\` | \`back\` | Puerto 8080 interno. |
| \`Service\` | \`front\` | Puerto 80 interno. |
| \`Ingress\` | \`pruebasopencode1\` | Entrada HTTP/HTTPS al frontend. |
| \`HorizontalPodAutoscaler\` | \`front\` (PRO) | 2–4 réplicas al 70 % de CPU. |
| \`PodDisruptionBudget\` | \`front\` (PRO) | Al menos 1 réplica disponible. |

El backend usa:

- \`startupProbe\` sobre \`/actuator/health/liveness\`.
- \`livenessProbe\` sobre \`/actuator/health/liveness\`.
- \`readinessProbe\` sobre \`/actuator/health/readiness\`.
- \`resources\` 250m/512Mi y límites 1 CPU/1 Gi.
- \`securityContext\` sin root, sin escalada de privilegios, \`seccomp\` y \`drop: ALL\`.

### 6.2 Namespaces y secretos

\`\`\`powershell
kubectl apply -f deploy/k8s/overlays/pre/namespace.yaml
kubectl -n pruebasopencode1-pre create secret generic pruebasopencode1-secrets \`
  --from-literal=DB_USERNAME=sa \`
  --from-literal=DB_PASSWORD='...' \`
  --from-literal=APP_AUTH_USERNAME='...' \`
  --from-literal=APP_AUTH_PASSWORD='...'
\`\`\`

Los ficheros \`secret.example.yaml\` son plantillas y **no** están incluidos en la kustomization. No se
versionan secretos reales.

### 6.3 Despliegue

\`\`\`powershell
kubectl kustomize deploy/k8s/overlays/pre > pre-render.yaml
kubectl apply -k deploy/k8s/overlays/pre
kubectl -n pruebasopencode1-pre rollout status deployment/back
kubectl -n pruebasopencode1-pre rollout status deployment/front
\`\`\`

Para PRO:

\`\`\`powershell
kubectl apply -f deploy/k8s/overlays/pro/namespace.yaml
kubectl -n pruebasopencode1-pro create secret generic pruebasopencode1-secrets ...
kubectl apply -k deploy/k8s/overlays/pro
\`\`\`

Antes de aplicar en un clúster real:

- Publicar las imágenes en un registro y ajustar \`images.newName\` en el overlay.
- Crear los secretos TLS \`pruebasopencode1-pre-tls\` y \`pruebasopencode1-pro-tls\`, o adaptar el
  Ingress.
- Cambiar los hosts \`*.pruebasopencode1.example.com\` por los dominios reales.
- Confirmar la \`StorageClass\` del PVC.
- Verificar que el Ingress Controller es \`nginx\` o cambiar \`ingressClassName\`.

## 7. Configuración por entorno

### 7.1 Backend

| Variable | PRE | PRO |
| --- | --- | --- |
| \`SPRING_PROFILES_ACTIVE\` | \`pre\` | \`prod\` |
| \`DB_URL\` | \`jdbc:h2:file:/app/data/pruebasopencode1\` | Igual |
| \`DB_USERNAME\` / \`DB_PASSWORD\` | \`Secret\` | \`Secret\` |
| \`JPA_DDL_AUTO\` | \`update\` | \`update\` |
| \`H2_CONSOLE_ENABLED\` | \`true\` | \`true\` |
| \`H2_CONSOLE_ALLOW_OTHERS\` | \`true\` | \`true\` |
| \`SPRINGDOC_ENABLED\` | \`true\` | \`true\` |
| \`SEED_MOCK_DATA\` | \`true\` | \`true\` |
| \`CORS_ALLOWED_ORIGINS\` | Dominio de PRE | Dominio de PRO |
| \`APP_AUTH_USERNAME\` / \`APP_AUTH_PASSWORD\` | \`Secret\` | \`Secret\` |
| \`APP_AUTH_ROLE\` | \`USER\` | \`USER\` |
| \`APP_AUTH_TOKEN_TTL\` | \`10m\` | \`5m\` |
| \`LOG_LEVEL\` | \`INFO\` | \`WARN\` |

### 7.2 Frontend

| Variable | PRE | PRO |
| --- | --- | --- |
| \`VITE_API_BASE_URL\` | \`/api/v1\` | \`/api/v1\` |
| \`VITE_AUTH_USERNAME\` / \`VITE_AUTH_PASSWORD\` | Deben coincidir con el \`Secret\` | Deben coincidir con el \`Secret\` |

\`VITE_API_BASE_URL\` es relativa porque Nginx proxifica \`/api\`. Las credenciales \`VITE_AUTH_*\` se
incrustan al construir la imagen: si cambian en el secreto, hay que reconstruir el frontend.

PRE y PRO replican el comportamiento local: si la base está vacía se siembran los 10 datos mock, el
reset vuelve a dejar esos 10 registros y la consola H2 y Swagger están activos. Nginx expone también
\`/h2-console\`, \`/swagger-ui\`, \`/v3/api-docs\` y \`/actuator\` en el mismo origen que la SPA.

\`H2_CONSOLE_ALLOW_OTHERS=true\` es necesario en Docker y Kubernetes porque la petición a la consola no
llega desde \`127.0.0.1\`. Antes de exponer un entorno real, definir \`H2_CONSOLE_ENABLED=false\`,
\`H2_CONSOLE_ALLOW_OTHERS=false\` y \`SPRINGDOC_ENABLED=false\`, y sustituir el autologin.

## 8. Persistencia H2 y copias

- El backend escribe en \`/app/data/pruebasopencode1.mv.db\` dentro del PVC.
- Solo puede existir **una** instancia del backend sobre el volumen. Por eso \`replicas: 1\` y
  \`strategy: Recreate\`.
- El volumen es \`ReadWriteOnce\`; no se puede montar simultáneamente en varios nodos.
- Copia de seguridad: ejecutar un \`Job\` que detenga el pod o use la herramienta de H2 para backup, y
  copiar el \`.mv.db\` a almacenamiento seguro. El fichero contiene datos personales y hashes BCrypt.
- Para PRO con alta disponibilidad, la evolución recomendada es una base de datos externa
  (PostgreSQL gestionado) y migraciones Flyway/Liquibase. El código ya está desacoplado por JPA, pero
  el cambio exige autorización expresa porque el alcance actual especifica H2.

## 9. Tokens y escalado

El backend guarda los tokens Bearer en memoria. El frontend escala sin problema, pero el backend no:

- Con 1 réplica, cada token vive en su proceso hasta caducar o revocarse.
- Con varias réplicas, una petición puede llegar a un proceso que no conoce el token y devolver
  \`401\`. El frontend reintenta, pero no es una solución definitiva.

Opciones futuras: almacén compartido (Redis), JWT firmados o sesiones pegajosas. En esta fase se
mantiene una réplica de backend y se documenta la limitación.

## 10. Pipeline previsto

1. CI: \`mvnw -B clean verify\`, \`npm ci && npm run build\` y \`node scripts/verificar-despliegue.mjs\`.
2. Construcción de imágenes etiquetadas por commit y versión.
3. Escaneo de vulnerabilidades y publicación en el registro.
4. Despliegue automático en PRE y pruebas de humo.
5. Promoción manual a PRO, con \`RollingUpdate\` en el frontend y \`Recreate\` en el backend.
6. Verificación de sondas, logs y métricas; rollback a la etiqueta anterior si falla.

## 11. Diferencias PRE / PRO

| Aspecto | PRE | PRO |
| --- | --- | --- |
| Perfil | \`pre\` | \`prod\` |
| Namespace | \`pruebasopencode1-pre\` | \`pruebasopencode1-pro\` |
| Réplicas frontend | 1 | 2–4 (HPA) |
| Réplicas backend | 1 | 1 (limitación H2) |
| TTL del token | \`10m\` | \`5m\` |
| Log | \`INFO\` | \`WARN\` |
| TLS | Certificado de pruebas | Certificado válido |
| Aprobación de despliegue | Automática | Manual |
| Copias de seguridad | Opcionales | Obligatorias |

## 12. Verificación realizada

El 2026-11-09 se comprobó:

| Comprobación | Resultado |
| --- | --- |
| Construcción de \`pruebasopencode1-back:pre\` | Correcta |
| Construcción de \`pruebasopencode1-front:pre\` | Correcta (Vite + documentación viva) |
| Construcción de \`pruebasopencode1-back:pro\` | Correcta |
| Construcción de \`pruebasopencode1-front:pro\` | Correcta |
| Compose PRE: contenedores y sondas | 2/2 \`healthy\` |
| Compose PRO: contenedores y sondas | 2/2 \`healthy\` |
| Datos mock y reset (PRE y PRO) | 10 personas iniciales; reset restaura exactamente 10 |
| Consola H2 y Swagger por el frontend | \`200\` en \`/h2-console\` y \`/swagger-ui/index.html\`; login H2 correcto en PRE y PRO |
| SPA por Nginx (PRE y PRO) | \`200\`, fallback de rutas y assets |
| API por proxy \`/api\` | Login, CRUD, \`401\` sin token y auditoría |
| Perfil y TTL | PRE \`pre\`/\`10m\`; PRO \`prod\`/\`5m\` (299 s reales) |
| Persistencia H2 | Datos conservados tras reiniciar el backend |
| Kustomize PRE y PRO | Renderizado correcto |
| Verificación automática de despliegue | **43/43 comprobaciones** |

No se ejecutó \`kubectl apply\` porque el entorno no tenía un contexto de clúster configurado.

## 13. Pasos pendientes para una implantación real

- [ ] Configurar un clúster y un contexto de Kubernetes.
- [ ] Publicar las imágenes en un registro accesible.
- [ ] Sustituir los hosts y certificados de ejemplo.
- [ ] Crear los secretos reales en cada namespace.
- [ ] Decidir la base de datos definitiva para PRO (H2 con PVC o PostgreSQL).
- [ ] Sustituir el autologin por autenticación individual antes de PRO.
- [ ] Resolver el estado compartido de tokens si el backend escala.
- [ ] Configurar CI/CD, escaneo de imágenes y políticas de red.
- [ ] Definir copias de seguridad, retención, métricas, logs y alertas.
- [ ] Ejecutar pruebas de carga, recuperación y rollback.
`,
  },
  {
    id: "seguimiento",
    titulo: "Seguimiento del proyecto PruebasOpenCode1",
    archivo: "docs/SEGUIMIENTO.md",
    resumen: "Fases, tareas, resultados, incidencias y próximos pasos.",
    markdown: `# Seguimiento del proyecto PruebasOpenCode1

> Última actualización: 2026-11-09
> Última verificación funcional: 2026-11-09
> Estado global: **Completado (local y despliegue PRE/PRO preparado)**

## 1. Plan de implementación y estado

### Fase 0. Análisis y preparación

- [x] Leer \`AGENTS.md\` del proyecto y recopilar requisitos.
- [x] Revisar el contenido actual de la carpeta y conservar los archivos existentes.
- [x] Verificar el entorno disponible (Java, Maven, Node, npm).
- [x] Preparar el toolchain necesario para compilar y verificar (JDK 21 y Maven).
- [x] Crear la estructura base \`/back\`, \`/front\`, \`/docs\`.

### Fase 1. Backend: base y modelo de datos

- [x] Crear \`pom.xml\` con Spring Boot, Spring Web, Spring Data JPA, Validation, H2, Actuator y Maven Wrapper.
- [x] Configurar la aplicación, perfiles y parámetros externalizables.
- [x] Implementar la entidad \`Persona\` y el enum \`Sexo\`.
- [x] Implementar el repositorio JPA.
- [x] Configurar H2 (base de datos de fichero, consola y creación automática del esquema).

### Fase 2. Backend: lógica de negocio y API REST

- [x] Crear DTO de entrada/salida y mapper.
- [x] Aplicar validaciones con Jakarta Bean Validation.
- [x] Implementar la capa de servicio (listar, obtener, crear, actualizar, eliminar, restablecer).
- [x] Implementar el controlador REST y la respuesta 201 con cabecera \`Location\`.
- [x] Implementar gestión global de errores con respuestas HTTP coherentes.
- [x] Configurar CORS mediante propiedad de entorno.
- [x] Añadir datos mock y siembra inicial idempotente.
- [x] Implementar el endpoint de restablecimiento de datos mock.

### Fase 3. Backend: pruebas y compilación

- [x] Pruebas unitarias de la capa de servicio (11).
- [x] Pruebas de integración de la API de personas (14): CRUD, validaciones, 404, reset, CORS, Swagger y auditoría.
- [x] Pruebas de integración de autenticación (9): 401, login, expiración, token válido, credenciales, BCrypt, logout, revocación y consulta de sesión.
- [x] Añadir mutation testing con PIT sobre el servicio y el mapper.
- [x] Documentación interactiva de la API con springdoc-openapi y Swagger UI.
- [x] Ejecutar \`mvnw clean verify\` y corregir errores.

### Fase 4. Frontend: base

- [x] Crear proyecto Vite + React + TypeScript.
- [x] Configurar TypeScript, Vite, proxy \`/api\` y variables de entorno.
- [x] Implementar layout, cabecera, navegación y estilos globales.
- [x] Implementar pantalla de bienvenida de PruebasOpenCode1.

### Fase 5. Frontend: gestión de personas

- [x] Implementar cliente HTTP y tipos de la API.
- [x] Implementar hook de estado y operaciones CRUD.
- [x] Implementar tabla de personas con búsqueda y estados de carga/vacío/error.
- [x] Implementar formulario modal de creación y edición con validaciones.
- [x] Implementar confirmación de eliminación.
- [x] Implementar restablecimiento de datos mock con confirmación.
- [x] Implementar notificaciones de éxito y error.
- [x] Verificar diseño responsive y accesibilidad básica.

### Fase 6. Integración y verificación funcional

- [x] Compilar el frontend (\`npm run build\` y comprobación de tipos).
- [x] Arrancar backend y frontend.
- [x] Verificar la comunicación real a través del proxy de Vite.
- [x] Ejecutar un smoke test de todas las operaciones (listar, obtener, crear, actualizar, eliminar, reset).
- [x] Verificar la interfaz completa con navegador real (Playwright Core + Chrome).
- [x] Corregir los defectos detectados.

### Fase 7. Documentación y preparación de despliegues

- [x] Crear \`docs/ARQUITECTURA.md\`.
- [x] Crear \`docs/EJECUCION.md\`.
- [x] Crear \`docs/API.md\`.
- [x] Crear \`docs/DESPLIEGUE.md\` con el diseño previsto para Docker/Kubernetes (PRE/PRO).
- [x] Crear \`docs/PRUEBAS.md\` con la estrategia, suites, mutation testing, comandos y resultados esperados.
- [x] Crear \`docs/MANUAL_USUARIO.md\` con los flujos de uso de la interfaz.
- [x] Crear \`docs/OPERACION.md\` con configuración, H2, copias, migración y diagnóstico.
- [x] Crear \`README.md\` raíz, \`.gitignore\` y \`.editorconfig\`.
- [x] Revisar las cifras de pruebas y enlaces de la documentación existente.
- [x] Actualizar este seguimiento con resultados y decisiones.

### Fase 8. Revisión final

- [x] Revisar que no queden datos simulados en el frontend.
- [x] Revisar que no haya secretos ni valores específicos de entorno en el código.
- [x] Verificar el proyecto Maven y los scripts de VS Code (los IDEs no están instalados en el entorno).
- [x] Registrar problemas pendientes y siguientes pasos.

### Fase 9. Documentación viva en el frontend

- [x] Crear \`docs/PROMPT.md\` con el prompt completo de reconstrucción.
- [x] Crear \`front/scripts/generar-documentacion.mjs\` para leer documentos, tests, Surefire, E2E/UI y PIT.
- [x] Generar \`front/src/content/documentacion.generated.ts\` desde las fuentes reales.
- [x] Implementar \`Markdown.tsx\` sin dependencias externas.
- [x] Crear la página \`/documentacion\` con prompt, documentación, \`AGENTS.md\` y tablas de resultados.
- [x] Añadir «Documentación» al menú superior y los estilos responsive.
- [x] Ejecutar \`npm run docs\` automáticamente en \`predev\` y \`prebuild\`.
- [x] Verificar la página con build de producción y navegador real.

### Fase 10. Seguridad y autologin

- [x] Añadir Spring Security y BCrypt al backend.
- [x] Crear la entidad \`Usuario\`, su repositorio y el servicio de carga de usuarios.
- [x] Configurar CORS con cabecera \`Authorization\`, respuestas \`401\`/\`403\` y seguridad sin estado.
- [x] Sembrar y sincronizar el usuario de demostración con contraseña cifrada.
- [x] Implementar el autologin transparente en el frontend con promesa única.

### Fase 11. Endurecimiento (hardening)

- [x] Sustituir la sesión HTTP por **tokens Bearer opacos** de corta duración (\`TokenService\`, \`TokenAuthenticationFilter\`).
- [x] Versionar la API bajo \`/api/v1\` y actualizar cliente, proxy y scripts.
- [x] Estandarizar los errores con **RFC 9457** (\`ProblemDetail\`) en todos los códigos \`400\`–\`500\`.
- [x] Añadir **auditoría JPA** (\`creadoEn\`, \`actualizadoEn\`, \`creadoPor\`, \`actualizadoPor\`).
- [x] Externalizar secretos y configuración; crear \`back/.env.example\` y excluir \`.env\` del repositorio.
- [x] Definir los perfiles \`dev\`, \`test\`, \`pre\` y \`prod\` con TTL de token y Swagger configurables.
- [x] Implementar avisos de «sesión renovada» y «sesión caducada» sin romper el autologin.
- [x] Añadir \`ErrorBoundary\` de React para errores de renderizado.
- [x] Implementar tema claro/oscuro/\`sistema\` persistido en \`localStorage\`.
- [x] Actualizar las suites de integración (18) y UI (14) al modelo Bearer y al tema oscuro.
- [x] Reescribir \`docs/SEGURIDAD.md\`, \`API.md\`, \`ARQUITECTURA.md\`, \`EJECUCION.md\`, \`PRUEBAS.md\` y \`PROMPT.md\`.

### Fase 12. Publicación y despliegue PRE/PRO

- [x] Publicar el proyecto en el repositorio público \`https://github.com/PedroJaen/PruebasOpenCode1\`.
- [x] Añadir \`.dockerignore\` y dos Dockerfiles multi-stage: backend JRE 21 sin root y frontend Nginx sin privilegios.
- [x] Configurar Nginx con fallback de SPA, proxy \`/api\` a \`back:8080\`, \`/healthz\` y cabeceras de seguridad.
- [x] Crear \`deploy/docker/docker-compose.yml\` parametrizado por entorno, con red y volumen H2 propios.
- [x] Añadir las plantillas \`.env.pre.example\` y \`.env.pro.example\` y los scripts \`construir.ps1\`, \`levantar.ps1\` y \`parar.ps1\`.
- [x] Crear la base Kustomize y los overlays \`pre\` y \`pro\`, con namespaces, ConfigMap, PVC, Ingress, TLS, HPA y PDB.
- [x] Mantener una sola réplica de backend y estrategia \`Recreate\` por la limitación de H2 en fichero.
- [x] Crear \`scripts/verificar-despliegue.mjs\` y el comando \`npm run test:deploy\` (**43 comprobaciones**).
- [x] Integrar la tabla de despliegue en la documentación viva (\`/documentacion\`).
- [x] Construir las cuatro imágenes y probar PRE y PRO con Docker Compose.
- [x] Verificar en contenedores: SPA, fallback, assets, login, CRUD, \`401\` sin token, perfiles y TTL.
- [x] Verificar la persistencia de H2 tras reiniciar el backend.
- [x] Renderizar ambos overlays con \`kubectl kustomize\` y validar Compose con \`docker compose config\`.
- [x] Actualizar \`README.md\`, \`AGENTS.md\`, \`DESPLIEGUE.md\`, \`ARQUITECTURA.md\`, \`EJECUCION.md\`, \`PRUEBAS.md\`, \`OPERACION.md\`, \`PROMPT.md\` y \`deploy/README.md\`.

### Fase 13. Paridad funcional de PRE y PRO con local

- [x] Activar \`SEED_MOCK_DATA=true\`, \`H2_CONSOLE_ENABLED=true\` y \`SPRINGDOC_ENABLED=true\` por defecto en los perfiles \`pre\` y \`prod\`.
- [x] Añadir \`H2_CONSOLE_ALLOW_OTHERS\`, con \`true\` en Compose y Kubernetes para permitir el acceso desde la red interna.
- [x] Publicar \`/h2-console\`, \`/swagger-ui\`, \`/v3/api-docs\` y \`/actuator\` a través de Nginx en el mismo origen que la SPA.
- [x] Actualizar las plantillas \`.env.pre.example\` y \`.env.pro.example\` y el ConfigMap base.
- [x] Ampliar \`scripts/verificar-despliegue.mjs\` de 40 a **43 comprobaciones**.
- [x] Reconstruir las cuatro imágenes y verificar en Docker: 10 datos mock, reset, CRUD, \`401\`, consola H2 y Swagger.
- [x] Verificar la persistencia de H2 tras reiniciar el backend en ambos entornos.
- [x] Actualizar la documentación y regenerar la página \`/documentacion\`.

## 2. Resultados de verificación (2026-11-09)

| Comprobación | Comando | Resultado |
| --- | --- | --- |
| Backend: compilación y pruebas | \`back\\mvnw.cmd -B clean verify\` | **BUILD SUCCESS** · 34 pruebas, 0 fallos |
| Swagger UI y OpenAPI | \`GET /v3/api-docs\` + \`/swagger-ui/index.html\` | **200 OK** · rutas \`/api/v1\`, \`bearerAuth\` y operaciones expuestas |
| Frontend: tipos y build | \`npm.cmd run build\` | **Correcto** · \`dist/\` generado |
| Integración API vía proxy | \`node scripts\\verificar-integracion.mjs\` | **18/18 comprobaciones** |
| Interfaz real en navegador | \`npm.cmd run test:ui\` (en \`/front\`) | **14/14 comprobaciones**, sin errores de consola |
| Mutation testing | \`back\\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage\` | **BUILD SUCCESS** · 21/21 mutaciones, 100 % de detección y 48/50 (96 %) de cobertura |
| Documentación viva | \`npm run build\` + Chrome headless sobre Vite | **Correcta** · secciones, tablas de resultados y consola sin errores |
| Verificación de despliegue | \`node scripts\\verificar-despliegue.mjs\` | **43/43 comprobaciones** |
| Imágenes Docker | \`back:pre\`, \`front:pre\`, \`back:pro\`, \`front:pro\` | **4/4 construidas** correctamente |
| Compose PRE | \`.\\deploy\\docker\\levantar.ps1 -Entorno pre\` | **2/2 contenedores \`healthy\`** · SPA, API, login, CRUD, \`401\` y persistencia H2 |
| Compose PRO | \`.\\deploy\\docker\\levantar.ps1 -Entorno pro\` | **2/2 contenedores \`healthy\`** · perfil \`prod\`, TTL 299 s y CRUD |
| Kustomize PRE/PRO | \`kubectl kustomize deploy/k8s/overlays/<entorno>\` | **Renderizado correcto** · namespaces, perfiles e imágenes |
| Migración de esquema heredado | JAR nuevo sobre H2 con columna \`edad\` | **Correcta** · columna eliminada, CRUD operativo y edad recalculada |
| Render en Chrome headless | \`chrome --headless --dump-dom\` | 10 filas de personas renderizadas |

Revisión documental (2026-11-09): 10 documentos en \`docs/\`, \`README.md\` y \`AGENTS.md\`, sin enlaces
internos rotos y con las cifras de pruebas alineadas con la última ejecución funcional. La página
\`/documentacion\` se genera desde estas fuentes y se verificó el mismo día.

Mutation testing: PIT 1.30.2 analiza \`PersonaServiceImpl\` y \`PersonaMapper\` con 21 mutaciones
generadas, 21 detectadas y una cobertura de líneas del 96 %.

### Pruebas de backend

- \`PersonaServiceImplTest\`: 11 pruebas unitarias.
- \`PersonaControllerIntegrationTest\`: 14 pruebas de integración.
- \`AuthControllerIntegrationTest\`: 9 pruebas de autenticación por token.
- Total: **34 pruebas**, 0 fallos, 0 errores.
- PIT: **21/21 mutaciones detectadas** (umbral mínimo del 90 %).

### Integración verificada

A través de \`http://127.0.0.1:5173/api/v1\` (proxy de Vite → backend):

1. SPA servida correctamente.
2. Backend \`UP\` en Actuator.
3. CORS permite \`http://localhost:5173\` y la cabecera \`Authorization\`.
4. Sin token, la API de personas devuelve \`401\` con \`ProblemDetail\`.
5. El autologin emite el token Bearer y \`/api/v1/auth/sesion\` lo confirma.
6. Reset con 10 registros.
7. Listado completo con auditoría.
8. Creación con \`201\`, \`Location\`, edad calculada y auditoría.
9. Listado actualizado.
10. Consulta por id.
11. \`404\` con \`ProblemDetail\` para id inexistente.
12. Modificación persistida con auditoría actualizada.
13. Validaciones \`400\` por campo.
14. Sexo inválido \`400\`.
15. Eliminación \`204\`.
16. \`404\` al eliminar inexistente.
17. Reset final con 10 registros.
18. Logout que revoca el token y devuelve \`401\` en la siguiente petición.

### Interfaz verificada

1. Pantalla de bienvenida y acceso a gestión.
2. Autologin transparente, sin formulario ni credenciales visibles.
3. Listado con 10 personas reales.
4. Búsqueda con resultados.
5. Estado sin coincidencias.
6. Creación mediante formulario y actualización de la tabla.
7. Edición con persistencia.
8. Eliminación con confirmación.
9. Reset con confirmación.
10. Validaciones en español.
11. Cierre del modal sin guardar.
12. Tema oscuro aplicado y preferencia guardada.
13. Tema oscuro persistente tras recargar.
14. Consola del navegador sin errores.

La página \`/documentacion\` se verifica por separado con una comprobación de navegador real.

### Despliegue verificado

Con Docker 28.0.1 y Compose v2.33.1:

1. Las cuatro imágenes compilan: \`pruebasopencode1-back:pre\`, \`pruebasopencode1-front:pre\`,
   \`pruebasopencode1-back:pro\` y \`pruebasopencode1-front:pro\`.
2. PRE arranca en \`8088\` (frontend) y \`8081\` (API directa) con perfil \`pre\` y TTL \`10m\`.
3. PRO arranca en \`8098\` (frontend) y \`8091\` (API directa) con perfil \`prod\` y TTL \`5m\` (299 s reales).
4. Nginx sirve la SPA, aplica el fallback de rutas y devuelve \`200\` en \`/healthz\`.
5. El proxy \`/api\` funciona: login, listado, creación, eliminación y \`401\` sin token.
6. El backend y el frontend quedan \`healthy\` en ambos entornos.
7. H2 conserva los datos tras reiniciar el contenedor del backend.
8. Si la base está vacía se siembran 10 personas mock; el reset restaura exactamente esas 10.
9. La consola H2 (incluido el login a la base de datos) y Swagger responden por el puerto del
   frontend y por el backend directo.
10. \`kubectl kustomize\` renderiza PRE y PRO con namespaces, ConfigMap, PVC, Deployments, Services,
    Ingress, y en PRO también HPA y PDB.
11. \`docker compose config --quiet\` valida ambas plantillas de entorno.
12. La suite \`scripts/verificar-despliegue.mjs\` supera **43/43 comprobaciones**.

No se ejecutó \`kubectl apply\` porque el entorno no tenía un contexto de Kubernetes configurado.

## 3. Decisiones técnicas

| Fecha | Decisión | Justificación |
| --- | --- | --- |
| 2026-11-06 | Spring Boot 3.5.16 y Java 21 | Versión estable compatible con los requisitos. |
| 2026-11-06 | H2 en fichero para desarrollo | Conserva datos entre reinicios y permite probar el reset; los tests usan H2 en memoria. |
| 2026-11-06 | Perfil \`test\` con H2 en memoria | Aísla las pruebas y evita depender del estado local. |
| 2026-11-06 | Configuración por variables de entorno | Facilita Docker/Kubernetes y los entornos PRE/PRO sin tocar código. |
| 2026-11-06 | DTO + mapper explícito, sin Lombok | Contratos estables, menos dependencias y máxima compatibilidad con IDEs. |
| 2026-11-06 | \`POST /api/v1/personas/reset\` | Operación explícita, idempotente y separada del CRUD. |
| 2026-11-06 | Frontend con React Router y CSS propio | Interfaz moderna y ligera, sin dependencias de UI innecesarias. |
| 2026-11-06 | Proxy \`/api\` en Vite | Evita CORS en desarrollo y centraliza la configuración de la API. |
| 2026-11-06 | Playwright Core con el Chrome del sistema | Prueba la UI real sin descargar navegadores adicionales. |
| 2026-11-06 | Actuator con sondas de salud | Prepara el backend para futuras sondas de Kubernetes. |
| 2026-11-06 | springdoc-openapi 2.8.16 + Swagger UI | Documentación interactiva generada desde el código; permite probar la API desde el navegador sin trabajo manual. La rama 3.x requiere Spring Boot 4 y no es compatible. |
| 2026-11-06 | \`edad\` calculada, no persistida | Se elimina la columna \`edad\`; \`PersonaResponse\` la deriva de \`fechaNacimiento\` y la fecha actual. Evita datos obsoletos y mantiene la edad visible en el frontend. \`MigracionEsquema\` retira la columna antigua en bases existentes. |
| 2026-11-09 | Documentación viva generada desde las fuentes | Evita duplicar contenido y garantiza que \`/documentacion\` refleje siempre el último estado de documentos, tests e informes. |
| 2026-11-09 | Contraseña BCrypt en H2 | Almacenamiento realista: nunca se guarda ni se devuelve la contraseña en claro. |
| 2026-11-09 | Autologin transparente con promesa única | Cumple el requisito de no mostrar login y evita duplicados por React StrictMode. |
| 2026-11-09 | Tokens Bearer opacos en memoria en lugar de sesión HTTP | Autenticación real sin estado de sesión, revocación explícita en el logout y sin dependencia de JWT. Se documentan los límites: el backend reiniciado invalida los tokens y el frontend los renueva de forma transparente. |
| 2026-11-09 | Token solo en memoria del frontend | No se persiste en el navegador; recargar la pestaña provoca un nuevo autologin transparente. |
| 2026-11-09 | CSRF desactivado en la demo | No se usan cookies de autenticación: el token viaja en la cabecera \`Authorization\`, no se envía automáticamente. Se documenta como decisión revisable antes de producción. |
| 2026-11-09 | Versionado \`/api/v1\` | Permite evolucionar el contrato sin romper clientes existentes. |
| 2026-11-09 | Errores RFC 9457 (\`ProblemDetail\`) | Contrato estándar con \`type\`, \`title\`, \`status\`, \`detail\` e \`instance\`, mantenible y fácil de consumir. |
| 2026-11-09 | Auditoría JPA básica | Registra quién y cuándo creó o modificó cada persona; campos anulables para bases H2 ya existentes. |
| 2026-11-09 | Perfiles \`dev\`/\`test\`/\`pre\`/\`prod\` con secretos externalizados | Evita secretos versionados y permite cambiar de entorno sin tocar código. |
| 2026-11-09 | Tema oscuro con preferencia \`sistema\` | Mejora la accesibilidad y respeta la preferencia del sistema, persistida en \`localStorage\`. |
| 2026-11-09 | \`ErrorBoundary\` en React | Evita que un error de renderizado deje la aplicación en blanco. |
| 2026-11-09 | Paridad funcional de PRE/PRO con local | PRE y PRO siembran los 10 datos mock, permiten reset y exponen consola H2 y Swagger por defecto, para que el comportamiento sea idéntico al local. Se documenta que un entorno real debe desactivar consola/Swagger y sustituir el autologin. |
| 2026-11-09 | \`H2_CONSOLE_ALLOW_OTHERS=true\` en Docker/Kubernetes | La consola solo acepta peticiones de \`127.0.0.1\` por defecto; dentro de un contenedor la petición llega desde la red interna. Se limita al entorno interno y se puede desactivar por variable. |
| 2026-11-09 | Nginx publica consola, Swagger y Actuator | Permite usar las mismas herramientas que en local desde el mismo origen de la SPA, sin abrir puertos adicionales del backend. |
| 2026-11-09 | Dos imágenes Docker independientes | Backend y frontend tienen ciclos de vida y escalado distintos; se evita acoplar sus builds. |
| 2026-11-09 | Nginx sin privilegios sirve la SPA y proxifica \`/api\` | La interfaz y la API comparten origen; no se necesita CORS para el tráfico del navegador. |
| 2026-11-09 | Backend sin root (UID 10001) y root FS de solo lectura | Reduce la superficie de ataque; \`/app/data\` y \`/tmp\` se montan explícitamente. |
| 2026-11-09 | Imagen de backend única para PRE y PRO | Perfil, base de datos, CORS y secretos se inyectan en tiempo de ejecución. |
| 2026-11-09 | Frontend construido por entorno | \`VITE_AUTH_*\` se incrusta en el bundle, así que cada entorno tiene su propia etiqueta. |
| 2026-11-09 | Kustomize base + overlays PRE/PRO | Evita duplicar manifiestos y hace explícitas las diferencias de entorno. |
| 2026-11-09 | H2 sobre PVC, 1 réplica de backend y \`Recreate\` | H2 en fichero no admite escrituras concurrentes de varias instancias. |
| 2026-11-09 | Secretos fuera de Git y de las kustomizations | Se crean con \`kubectl create secret\` o se leen de \`.env.<entorno>\`; nunca se versionan. |

## 4. Entorno de verificación

| Herramienta | Versión utilizada |
| --- | --- |
| Sistema | Windows 11 |
| Java | Temurin 21.0.13+9 LTS |
| Maven | 3.9.16 (Maven Wrapper) |
| Spring Boot | 3.5.16 |
| springdoc-openapi | 2.8.16 |
| Swagger UI | Incluida en springdoc (WebJar) |
| Hibernate | 6.6.53.Final |
| H2 | 2.3.232 |
| Node.js | 24.22.1 |
| React | 19.3.1 |
| React Router | 7.18.5 |
| TypeScript | 5.9.3 |
| Vite | 7.3.7 |
| Playwright Core | 1.65.0 |
| Docker | 28.0.1 |
| Docker Compose | v2.33.1 |
| kubectl / Kustomize | 1.32.2 / v5.5.0 |

> El entorno inicial solo tenía Java 17 y no tenía Maven. Para verificar se descargaron JDK 21 y
> Maven 3.9.16 en \`C:\\Users\\Nagasia\\.opencode-tools\`, fuera del repositorio. El proyecto usa Maven
> Wrapper y no depende de esa ruta.

## 5. Incidencias y notas

- **Java 17 en el entorno inicial:** el proyecto exige Java 21. Se instaló Temurin 21 fuera del
  repositorio y se añadió \`maven-enforcer-plugin\` para fallar con un mensaje claro si se usa una
  versión anterior.
- **Maven no instalado:** se generó Maven Wrapper con distribución 3.9.16. El primer build descarga
  Maven y las dependencias.
- **Política de PowerShell:** \`npm.ps1\` está bloqueado; se usó \`npm.cmd\`. Documentado en
  \`docs/EJECUCION.md\`. La ejecución de los \`.ps1\` de despliegue también puede requerir
  \`powershell -ExecutionPolicy Bypass -File\` o los comandos \`docker compose\` equivalentes.
- **Aviso de npm sobre scripts de instalación:** npm mostró un aviso sobre el \`postinstall\` de
  esbuild. No impidió la instalación ni el build; Vite funcionó correctamente.
- **Eclipse y VS Code no instalados:** no se pudieron abrir literalmente los IDEs. Se validó el
  proyecto Maven estándar, el arranque por CLI y los scripts de npm, y se documentó la importación y
  ejecución desde ambos IDEs.
- **\`application.yml\` no copiado por Eclipse (2026-11-06):** al arrancar desde Eclipse se produjo
  \`Could not resolve placeholder 'app.cors.allowed-origins'\` y H2 arrancó en memoria. La causa fue
  que \`target/classes\` se recompiló sin copiar \`src/main/resources/application.yml\`, porque el
  proyecto no se había importado como proyecto Maven o no se había actualizado. Se añadió un valor
  por defecto para CORS, un diagnóstico que avisa en el log si falta \`application.yml\` y una guía de
  corrección en \`docs/EJECUCION.md\`. El JAR empaquetado siempre incluye la configuración.
- **Rutas inexistentes devolvían 500 (2026-11-06):** el manejador genérico de excepciones capturaba
  \`NoResourceFoundException\` y respondía \`500\` con traza en el log. Se añadió un manejador específico
  que responde \`404\`, ahora con \`ProblemDetail\`, sin registrar el error como fallo interno.
- **Secuencia de identificadores:** el reset elimina e inserta de nuevo, pero H2 no reinicia la
  secuencia de \`id\`. Se documenta en \`docs/API.md\`; no afecta a la funcionalidad.
- **Versión de springdoc (2026-11-06):** la última publicada era 3.2.0, pero está construida sobre
  Spring Boot 4.1.2 y no es compatible con Spring Boot 3.5.16. Se usó la última de la rama 2.x,
  **2.8.16**, compilada contra Spring Boot 3.5.11. Antes de actualizar springdoc hay que comprobar la
  versión de Spring Boot del proyecto.
- **Edad almacenada (2026-11-06):** \`edad\` se guardaba en \`personas\` y podía quedar desincronizada con
  \`fechaNacimiento\`. Ahora no se persiste: \`PersonaMapper\` la calcula en cada respuesta y el formulario
  del frontend ya no la pide. Para no romper bases H2 existentes se añadió \`MigracionEsquema\`, que
  elimina la columna antigua al arrancar.
- **Mutation testing (2026-11-09):** se añadió PIT 1.30.2 con \`pitest-junit5-plugin\` para mutar el
  servicio y el mapper. La primera ejecución dejó una mutación superviviente en \`updateEntity\`: no se
  comprobaba que el sexo se actualizara. Se añadió la aserción y el resultado quedó en 21/21. Lanzar
  solo \`pitest:mutationCoverage\` reutiliza \`target/test-classes\`; hay que ejecutar antes
  \`test-compile\`, y así se documenta en \`docs/PRUEBAS.md\` y \`docs/EJECUCION.md\`.
- **Migración a tokens Bearer (2026-11-09):** se sustituyó la cookie de sesión por tokens opacos de
  32 bytes con caducidad en memoria. El backend pasa a \`SessionCreationPolicy.STATELESS\`. Un reinicio
  del backend invalida los tokens y el frontend vuelve a autenticarse de forma transparente, por lo
  que no se rompe la experiencia de uso.
- **Campos de auditoría en bases existentes (2026-11-09):** las filas creadas antes de activar la
  auditoría conservan los campos a \`null\`; \`ddl-auto=update\` añade las columnas sin recrear la tabla.
  Los registros nuevos y los del reset se rellenan con el usuario autenticado o con \`sistema\`.
- **Carrera entre suites E2E y UI (2026-11-09):** al ejecutarlas en paralelo se produjo un \`500\`
  (\`ObjectOptimisticLockingFailureException\`) porque ambas hacen reset sobre las mismas filas. Se
  documenta que deben ejecutarse secuencialmente: primero integración y después interfaz.
- **\`hola.txt\`:** se conservó el archivo existente en la raíz, ya que el usuario pidió no eliminarlo.
- **Docker Desktop detenido (2026-11-09):** el CLI estaba instalado pero el motor no respondía. Se
  inició Docker Desktop y se esperó a que el motor estuviera operativo antes de construir y probar.
- **Sin contexto de Kubernetes (2026-11-09):** \`kubectl config current-context\` no devolvía ningún
  contexto, por lo que no se pudo ejecutar \`kubectl apply\`. La validación se hizo con
  \`kubectl kustomize\` y \`docker compose config\`, que no requieren clúster.
- **Falso negativo en la persistencia H2 (2026-11-09):** una primera comprobación tras reiniciar
  mostró 0 personas por una lectura prematura; repetida con \`restart\` y espera suficiente, conservó
  los datos. Se documenta para no repetir la lectura antes de que el backend esté listo.
- **H2 y concurrencia (2026-11-09):** H2 en fichero no admite varias instancias sobre el mismo
  volumen. El despliegue fija \`replicas: 1\` y \`strategy: Recreate\`; para escalar el backend hace falta
  una base de datos externa.
- **Tokens en memoria y varias réplicas (2026-11-09):** el frontend puede escalar, pero el backend no
  comparte los tokens entre procesos. Se mantiene una réplica y se documentan Redis/JWT/sesiones
  pegajosas como evolución.
- **Autologin en el bundle (2026-11-09):** las credenciales \`VITE_AUTH_*\` quedan visibles en el
  bundle. Es válido para la demo y PRE, pero antes de PRO hay que sustituirlo por autenticación
  individual.

## 6. Problemas pendientes y limitaciones conocidas

No hay problemas bloqueantes para el alcance actual. Limitaciones y siguientes pasos:

1. **Endurecimiento de seguridad:** el autologin usa credenciales fijas visibles en el bundle y CSRF
   está desactivado porque no hay cookies. Para producción hay que sustituirlo por autenticación
   individual, HTTPS, gestión de secretos y una revisión de CSRF; el plan está en \`docs/SEGURIDAD.md\`.
2. **Tokens en memoria de una sola instancia:** con varias réplicas habría que compartir el
   almacenamiento de tokens o migrar a JWT firmados. Se documenta en \`docs/DESPLIEGUE.md\`.
3. **Despliegue real:** las imágenes y los manifiestos de Docker y Kubernetes están implementados y
   validados, pero no se ha aplicado sobre un clúster por no haber contexto configurado.
4. **Base de datos para PRE/PRO:** H2 en fichero no es adecuada para múltiples réplicas. El despliegue
   actual usa un PVC y una sola réplica; para alta disponibilidad habrá que decidir una base externa
   (requiere autorización).
5. **Registro, hosts y TLS:** los overlays usan imágenes locales y hosts \`*.pruebasopencode1.example.com\`
   de ejemplo. Antes de desplegar hay que publicar las imágenes y sustituir hosts, certificados y
   \`StorageClass\`.
6. **Pruebas unitarias de componentes React:** se cubren con build de tipos y pruebas E2E de
   navegador; se podría añadir Vitest/Testing Library si se requiere cobertura unitaria del frontend.
7. **Migraciones de esquema:** se usa \`ddl-auto=update\` en desarrollo y \`MigracionEsquema\` para retirar
   la antigua columna \`edad\`. Para PRE/PRO conviene Flyway o Liquibase.
8. **Internacionalización:** la interfaz está en español; no se ha implementado multiidioma.
9. **Mutation testing:** PIT cubre solo el servicio y el mapper; controladores, entidades y
   configuración no se mutan. Todavía no está integrado en un pipeline de CI.
10. **Consola H2 y Swagger activos por defecto en PRE/PRO:** es una decisión deliberada para igualar
    el comportamiento local. En un entorno expuesto hay que definir \`H2_CONSOLE_ENABLED=false\`,
    \`H2_CONSOLE_ALLOW_OTHERS=false\` y \`SPRINGDOC_ENABLED=false\`.

## 7. Cómo continuar

1. Revisar la aplicación siguiendo \`docs/EJECUCION.md\`.
2. Repetir las verificaciones con los comandos de la sección 2, incluido PIT tras cambios en la
   lógica de negocio o el mapper, y ejecutar integración y UI en secuencia.
3. Ejecutar \`node scripts\\verificar-despliegue.mjs\` tras cualquier cambio en \`deploy/\`.
4. Abordar las limitaciones de la sección 6 según prioridad.
5. Para un despliegue real: configurar un clúster, publicar las imágenes, crear los secretos y aplicar
   los overlays PRE/PRO siguiendo \`docs/DESPLIEGUE.md\`.
`,
  },
]

export const RESULTADOS: GrupoResultados[] = [
  {
    "id": "unitarias",
    "titulo": "Pruebas unitarias del backend",
    "descripcion": "Lógica de negocio aislada con JUnit 5 y Mockito.",
    "comando": "back\\mvnw.cmd -B clean verify",
    "fecha": "2026-11-09",
    "resumen": "11 pruebas · 11 superadas",
    "columnas": [
      "Prueba",
      "Método",
      "Resultado"
    ],
    "filas": [
      [
        "Listar todas devuelve las personas mapeadas",
        "listarTodasDevuelveLasPersonasMapeadas",
        "Superada"
      ],
      [
        "Obtener por id devuelve la persona",
        "obtenerPorIdDevuelveLaPersona",
        "Superada"
      ],
      [
        "Obtener por id lanza excepcion si no existe",
        "obtenerPorIdLanzaExcepcionSiNoExiste",
        "Superada"
      ],
      [
        "Crear guarda la persona y recorta los espacios",
        "crearGuardaLaPersonaYRecortaLosEspacios",
        "Superada"
      ],
      [
        "Actualizar modifica la persona existente",
        "actualizarModificaLaPersonaExistente",
        "Superada"
      ],
      [
        "La edad tiene en cuenta si el cumpleanos todavia no ha llegado",
        "laEdadTieneEnCuentaSiElCumpleanosTodaviaNoHaLlegado",
        "Superada"
      ],
      [
        "Actualizar lanza excepcion si no existe",
        "actualizarLanzaExcepcionSiNoExiste",
        "Superada"
      ],
      [
        "Eliminar borra la persona existente",
        "eliminarBorraLaPersonaExistente",
        "Superada"
      ],
      [
        "Eliminar lanza excepcion si no existe",
        "eliminarLanzaExcepcionSiNoExiste",
        "Superada"
      ],
      [
        "Restablecer datos mock elimina todo y reinserta los diez registros",
        "restablecerDatosMockEliminaTodoYReinsertaLosDiezRegistros",
        "Superada"
      ],
      [
        "Los datos mock tienen todas las propiedades",
        "losDatosMockTienenTodasLasPropiedades",
        "Superada"
      ]
    ]
  },
  {
    "id": "integracion-backend",
    "titulo": "Pruebas de integración del backend",
    "descripcion": "API REST versionada con MockMvc, H2 en memoria y autenticación por token Bearer.",
    "comando": "back\\mvnw.cmd -B clean verify",
    "fecha": "2026-11-09",
    "resumen": "23 pruebas · 23 superadas",
    "columnas": [
      "Prueba",
      "Método",
      "Resultado"
    ],
    "filas": [
      [
        "Listar devuelve lista vacia inicialmente",
        "listarDevuelveListaVaciaInicialmente",
        "Superada"
      ],
      [
        "Crear devuelve201 con location y los datos guardados",
        "crearDevuelve201ConLocationYLosDatosGuardados",
        "Superada"
      ],
      [
        "Obtener por id devuelve la persona",
        "obtenerPorIdDevuelveLaPersona",
        "Superada"
      ],
      [
        "Obtener por id inexistente devuelve404",
        "obtenerPorIdInexistenteDevuelve404",
        "Superada"
      ],
      [
        "Crear con datos invalidos devuelve400 con validaciones",
        "crearConDatosInvalidosDevuelve400ConValidaciones",
        "Superada"
      ],
      [
        "Crear con sexo invalido devuelve400",
        "crearConSexoInvalidoDevuelve400",
        "Superada"
      ],
      [
        "Actualizar modifica la persona",
        "actualizarModificaLaPersona",
        "Superada"
      ],
      [
        "Actualizar inexistente devuelve404",
        "actualizarInexistenteDevuelve404",
        "Superada"
      ],
      [
        "Eliminar devuelve204 y borra la persona",
        "eliminarDevuelve204YBorraLaPersona",
        "Superada"
      ],
      [
        "Eliminar inexistente devuelve404",
        "eliminarInexistenteDevuelve404",
        "Superada"
      ],
      [
        "Reset elimina los datos actuales y reinserta solo los mock",
        "resetEliminaLosDatosActualesYReinsertaSoloLosMock",
        "Superada"
      ],
      [
        "El preflight cors permite el origen del frontend",
        "elPreflightCorsPermiteElOrigenDelFrontend",
        "Superada"
      ],
      [
        "Swagger expone la documentacion open api y la interfaz",
        "swaggerExponeLaDocumentacionOpenApiYLaInterfaz",
        "Superada"
      ],
      [
        "Una ruta desconocida devuelve404 en lugar de500",
        "unaRutaDesconocidaDevuelve404EnLugarDe500",
        "Superada"
      ],
      [
        "Sin token la api de personas devuelve401 problem detail",
        "sinTokenLaApiDePersonasDevuelve401ProblemDetail",
        "Superada"
      ],
      [
        "Login valido emite un token bearer con expiracion",
        "loginValidoEmiteUnTokenBearerConExpiracion",
        "Superada"
      ],
      [
        "El token valido permite acceder a la api de personas",
        "elTokenValidoPermiteAccederALaApiDePersonas",
        "Superada"
      ],
      [
        "Login con credenciales invalidas devuelve401 problem detail",
        "loginConCredencialesInvalidasDevuelve401ProblemDetail",
        "Superada"
      ],
      [
        "Un token invalido devuelve401",
        "unTokenInvalidoDevuelve401",
        "Superada"
      ],
      [
        "La contrasena se guarda cifrada en la base de datos",
        "laContrasenaSeGuardaCifradaEnLaBaseDeDatos",
        "Superada"
      ],
      [
        "Logout revoca el token",
        "logoutRevocaElToken",
        "Superada"
      ],
      [
        "Consultar sesion con token devuelve usuario rol y expiracion",
        "consultarSesionConTokenDevuelveUsuarioRolYExpiracion",
        "Superada"
      ],
      [
        "Consultar sesion sin token devuelve estado anonimo",
        "consultarSesionSinTokenDevuelveEstadoAnonimo",
        "Superada"
      ]
    ]
  },
  {
    "id": "integracion-e2e",
    "titulo": "Integración de extremo a extremo",
    "descripcion": "Flujo real frontend → proxy de Vite → API → H2.",
    "comando": "node scripts\\verificar-integracion.mjs",
    "fecha": "2026-11-09",
    "resumen": "18 comprobaciones · 18 superadas",
    "columnas": [
      "Comprobación",
      "Resultado"
    ],
    "filas": [
      [
        "El frontend sirve la SPA de PruebasOpenCode1",
        "Superada"
      ],
      [
        "El backend responde UP en /actuator/health",
        "Superada"
      ],
      [
        "CORS permite el origen del frontend y la cabecera Authorization",
        "Superada"
      ],
      [
        "Sin token, GET /api/v1/personas devuelve 401 ProblemDetail",
        "Superada"
      ],
      [
        "POST /api/v1/auth/login emite el token y GET /api/v1/auth/sesion lo confirma",
        "Superada"
      ],
      [
        "POST /api/v1/personas/reset deja exactamente 10 personas",
        "Superada"
      ],
      [
        "GET /api/v1/personas devuelve el listado con auditoría",
        "Superada"
      ],
      [
        "POST /api/v1/personas crea la persona con id … y auditoría",
        "Superada"
      ],
      [
        "El listado refleja la nueva persona",
        "Superada"
      ],
      [
        "GET /api/v1/personas/{id} devuelve la persona creada",
        "Superada"
      ],
      [
        "GET de un id inexistente devuelve 404 ProblemDetail",
        "Superada"
      ],
      [
        "PUT /api/v1/personas/{id} persiste los cambios y la auditoría",
        "Superada"
      ],
      [
        "Los datos inválidos devuelven 400 ProblemDetail con validaciones por campo",
        "Superada"
      ],
      [
        "Un valor de sexo no permitido devuelve 400",
        "Superada"
      ],
      [
        "DELETE /api/v1/personas/{id} elimina la persona",
        "Superada"
      ],
      [
        "Eliminar un id inexistente devuelve 404",
        "Superada"
      ],
      [
        "El reset final vuelve a dejar los 10 registros mock",
        "Superada"
      ],
      [
        "POST /api/v1/auth/logout revoca el token y la API vuelve a responder 401",
        "Superada"
      ]
    ]
  },
  {
    "id": "interfaz",
    "titulo": "Pruebas de interfaz con navegador real",
    "descripcion": "Chrome o Edge del sistema mediante Playwright Core, sin descargar navegadores.",
    "comando": "front\\npm run test:ui",
    "fecha": "2026-11-09",
    "resumen": "14 comprobaciones · 14 superadas",
    "columnas": [
      "Comprobación",
      "Resultado"
    ],
    "filas": [
      [
        "La pantalla de bienvenida carga y muestra el acceso a personas",
        "Superada"
      ],
      [
        "El listado muestra las 10 personas servidas por la API",
        "Superada"
      ],
      [
        "El autologin se ejecuta sin mostrar formulario ni credenciales al usuario",
        "Superada"
      ],
      [
        "La búsqueda filtra el listado en tiempo real",
        "Superada"
      ],
      [
        "La búsqueda sin resultados muestra un estado vacío específico",
        "Superada"
      ],
      [
        "El formulario crea una persona y la tabla muestra su edad calculada",
        "Superada"
      ],
      [
        "El formulario de edición persiste los cambios",
        "Superada"
      ],
      [
        "La confirmación de borrado elimina la persona",
        "Superada"
      ],
      [
        "El restablecimiento pide confirmación y deja los 10 registros mock",
        "Superada"
      ],
      [
        "El formulario muestra validaciones en español antes de enviar",
        "Superada"
      ],
      [
        "El modal se cierra sin guardar",
        "Superada"
      ],
      [
        "El botón de tema activa el modo oscuro y guarda la preferencia",
        "Superada"
      ],
      [
        "El tema oscuro persiste tras recargar la página",
        "Superada"
      ],
      [
        "No hay errores en la consola del navegador",
        "Superada"
      ]
    ]
  },
  {
    "id": "mutacion",
    "titulo": "Mutation testing del backend",
    "descripcion": "PIT sobre PersonaServiceImpl y PersonaMapper. Cobertura de líneas: 48/50 (96 %).",
    "comando": "back\\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage",
    "fecha": "2026-11-09",
    "resumen": "21/21 mutaciones detectadas · cobertura 48/50 (96 %)",
    "columnas": [
      "Mutador",
      "Generadas",
      "Detectadas",
      "Supervivientes",
      "Resultado"
    ],
    "filas": [
      [
        "Total (según documentación)",
        "21",
        "21",
        "0",
        "Superada"
      ]
    ]
  },
  {
    "id": "frontend",
    "titulo": "Compilación y tipos del frontend",
    "descripcion": "Contrato de TypeScript y build de producción con Vite.",
    "comando": "front\\npm run build",
    "fecha": "2026-11-09",
    "resumen": "2 comprobaciones · 2 superadas",
    "columnas": [
      "Comprobación",
      "Comando",
      "Resultado"
    ],
    "filas": [
      [
        "Comprobación de tipos",
        "tsc --noEmit",
        "Superada"
      ],
      [
        "Build de producción",
        "vite build",
        "Superada"
      ]
    ]
  },
  {
    "id": "despliegue",
    "titulo": "Verificación de despliegue Docker y Kubernetes",
    "descripcion": "Dockerfiles, Nginx, Docker Compose y overlays Kustomize de PRE y PRO, sin necesidad de clúster.",
    "comando": "front\\npm run test:deploy",
    "fecha": "2026-11-09",
    "resumen": "43/43 comprobaciones superadas",
    "columnas": [
      "Comprobación",
      "Resultado"
    ],
    "filas": [
      [
        "Existe deploy/docker/back.Dockerfile",
        "Superada"
      ],
      [
        "Existe deploy/docker/front.Dockerfile",
        "Superada"
      ],
      [
        "Existe deploy/docker/nginx.conf",
        "Superada"
      ],
      [
        "Existe deploy/docker/docker-compose.yml",
        "Superada"
      ],
      [
        "Existe deploy/docker/.env.pre.example",
        "Superada"
      ],
      [
        "Existe deploy/docker/.env.pro.example",
        "Superada"
      ],
      [
        "Existe deploy/k8s/base/kustomization.yaml",
        "Superada"
      ],
      [
        "Existe deploy/k8s/overlays/pre/kustomization.yaml",
        "Superada"
      ],
      [
        "Existe deploy/k8s/overlays/pro/kustomization.yaml",
        "Superada"
      ],
      [
        "Backend multi-stage + JRE 21 + usuario no root",
        "Superada"
      ],
      [
        "Frontend multi-stage + Nginx sin privilegios",
        "Superada"
      ],
      [
        "Nginx: SPA, proxy /api y salud",
        "Superada"
      ],
      [
        "Nginx: consola H2, Swagger y Actuator accesibles",
        "Superada"
      ],
      [
        ".dockerignore excluye secretos y artefactos",
        "Superada"
      ],
      [
        "Compose: datos mock y herramientas como en local",
        "Superada"
      ],
      [
        "Docker Compose PRE válido",
        "Superada"
      ],
      [
        "Docker Compose PRO válido",
        "Superada"
      ],
      [
        "Kustomize PRE renderiza",
        "Superada"
      ],
      [
        "  namespace en PRE",
        "Superada"
      ],
      [
        "  ConfigMap en PRE",
        "Superada"
      ],
      [
        "  2 Deployments en PRE",
        "Superada"
      ],
      [
        "  2 Services en PRE",
        "Superada"
      ],
      [
        "  PVC en PRE",
        "Superada"
      ],
      [
        "  Ingress en PRE",
        "Superada"
      ],
      [
        "  perfil en PRE",
        "Superada"
      ],
      [
        "  imagen back en PRE",
        "Superada"
      ],
      [
        "  imagen front en PRE",
        "Superada"
      ],
      [
        "  sin Secret versionado en PRE",
        "Superada"
      ],
      [
        "Kustomize PRO renderiza",
        "Superada"
      ],
      [
        "  namespace en PRO",
        "Superada"
      ],
      [
        "  ConfigMap en PRO",
        "Superada"
      ],
      [
        "  2 Deployments en PRO",
        "Superada"
      ],
      [
        "  2 Services en PRO",
        "Superada"
      ],
      [
        "  PVC en PRO",
        "Superada"
      ],
      [
        "  Ingress en PRO",
        "Superada"
      ],
      [
        "  perfil en PRO",
        "Superada"
      ],
      [
        "  imagen back en PRO",
        "Superada"
      ],
      [
        "  imagen front en PRO",
        "Superada"
      ],
      [
        "  sin Secret versionado en PRO",
        "Superada"
      ],
      [
        "PRE y PRO: datos mock, consola H2 y Swagger activos",
        "Superada"
      ],
      [
        "PRO: HPA, PDB y 2 réplicas de frontend",
        "Superada"
      ],
      [
        "PRO: backend con una única réplica y estrategia Recreate",
        "Superada"
      ],
      [
        "PRE: backend con una única réplica y estrategia Recreate",
        "Superada"
      ]
    ]
  }
]
