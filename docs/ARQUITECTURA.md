# Arquitectura de PruebasOpenCode1

> Documento actualizado el 2026-11-09.

## 1. Visión general

PruebasOpenCode1 es una aplicación web full stack para la gestión de personas. Está formada por
dos aplicaciones independientes que se comunican mediante una API REST versionada:

- **Backend** (`/back`): Java 21, Spring Boot 3.5, Spring Data JPA, Hibernate, H2, Maven,
  Spring Security con tokens Bearer y springdoc-openapi (Swagger UI).
- **Frontend** (`/front`): React 19, TypeScript, Vite y React Router.
- **Documentación** (`/docs`): arquitectura, seguridad, API, ejecución, pruebas, manual de usuario,
  operación, despliegue y seguimiento.

```text
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
```

En desarrollo, Vite publica el frontend en `http://localhost:5173` y redirige las peticiones
`/api/**` al backend en `http://localhost:8080`. El backend también acepta peticiones directas del
origen del frontend mediante CORS configurable.

## 2. Estructura del repositorio

```text
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
```

## 3. Backend

### 3.1 Arquitectura por capas

| Capa | Clases | Responsabilidad |
| --- | --- | --- |
| Controller | `PersonaController`, `AuthController` | Expone los endpoints REST, valida la entrada y construye las respuestas HTTP. |
| Service | `PersonaService`, `PersonaServiceImpl`, `UsuarioDetailsService` | Lógica de negocio, transacciones y carga de usuarios para Spring Security. |
| Repository | `PersonaRepository`, `UsuarioRepository` | Acceso a datos mediante Spring Data JPA. |
| Entity | `Persona`, `Sexo`, `Usuario` | Modelo persistente JPA. |
| DTO | `PersonaRequest`, `PersonaResponse`, `LoginRequest`, `SesionResponse`, `TokenResponse` | Contratos de entrada/salida, separados de las entidades. |
| Mapper | `PersonaMapper` | Conversión entidad ↔ DTO, cálculo de edad y normalización de textos. |
| Security | `TokenService`, `TokenAuthenticationFilter` | Emisión, validación y revocación de tokens Bearer opacos. |
| Config | `AuditoriaConfig`, `CorsConfig`, `MockDataInitializer`, `MigracionEsquema`, `ConfiguracionDiagnostico`, `OpenApiConfig`, `SecurityConfig`, `UsuarioInitializer` | Auditoría JPA, CORS, siembra, migración, aviso de configuración, OpenAPI, seguridad sin estado y usuario del autologin. |
| Exception | `GlobalExceptionHandler`, `PersonaNotFoundException` | Traducción de errores a `ProblemDetail` RFC 9457, incluidos `401` y `403`. |

Flujo de una petición de escritura:

```text
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
```

### 3.2 Modelo de datos

Tabla `personas`:

| Campo | Tipo Java | Columna | Restricciones |
| --- | --- | --- | --- |
| `id` | `Long` | `id` | Clave primaria, autoincremental (`IDENTITY`). |
| `nombre` | `String` | `nombre` | Obligatorio, máximo 80 caracteres. |
| `apellido` | `String` | `apellido` | Obligatorio, máximo 80 caracteres. |
| `sexo` | `Sexo` | `sexo` | Obligatorio, almacenado como texto. |
| `direccion` | `String` | `direccion` | Obligatorio, máximo 200 caracteres. |
| `fechaNacimiento` | `LocalDate` | `fecha_nacimiento` | Obligatorio, no puede ser futura. |
| `creadoEn` | `Instant` | `creado_en` | `@CreatedDate`, solo en creación. |
| `actualizadoEn` | `Instant` | `actualizado_en` | `@LastModifiedDate`. |
| `creadoPor` | `String` | `creado_por` | `@CreatedBy`, solo en creación. |
| `actualizadoPor` | `String` | `actualizado_por` | `@LastModifiedBy`. |

Valores de `Sexo`: `MASCULINO`, `FEMENINO`, `OTRO`.

La edad **no se almacena**. `PersonaResponse` incluye `edad`, pero `PersonaMapper` la calcula en cada
respuesta con `Period.between(fechaNacimiento, LocalDate.now())`, de modo que siempre refleja la fecha
actual y no puede quedar desincronizada. Por eso `PersonaRequest` no acepta `edad`.

`MigracionEsquema` elimina al arrancar la columna `edad` de bases H2 creadas con versiones anteriores.
Así una instalación existente se actualiza sin borrar `back/data`.

### 3.3 Persistencia y configuración

- H2 en modo fichero: `jdbc:h2:file:./data/pruebasopencode1` en `dev`.
- Esquema creado/actualizado automáticamente con `spring.jpa.hibernate.ddl-auto=update`.
- Consola H2 disponible en `/h2-console` solo en desarrollo.
- Perfil `test`: H2 en memoria, `create-drop`, sin consola y sin siembra automática.
- Perfiles `dev`, `test`, `pre` y `prod` como ficheros `application-<perfil>.yml`.
- Todos los parámetros relevantes se leen de variables de entorno con valores por defecto en local
  (puerto, URL de base de datos, credenciales, CORS, nivel de log, siembra, autenticación y TTL del
  token). En `pre` y `prod` los secretos no tienen valor por defecto.
- Los datos mock viven en una única fuente (`MockDataFactory`) y se insertan al arrancar solo si la
  tabla está vacía. El endpoint de reset elimina todo y vuelve a insertar esa misma lista.
- La tabla `usuarios` la mantiene `UsuarioInitializer`; la contraseña se guarda con BCrypt y los
  tokens se emiten con una vigencia configurable (`APP_AUTH_TOKEN_TTL`).

### 3.4 Gestión de errores

`GlobalExceptionHandler` devuelve un `ProblemDetail` RFC 9457 con `type`, `title`, `status`, `detail`
e `instance`. Las validaciones añaden la propiedad `validaciones`:

```json
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
```

| Situación | Código | `type` |
| --- | --- | --- |
| Recurso inexistente | 404 | `no-encontrado` |
| Validación de campos | 400 | `validacion` |
| JSON mal formado, enum o fecha inválidos | 400 | `cuerpo-ilegible` |
| Sin token o token inválido | 401 | `no-autenticado` |
| Credenciales incorrectas | 401 | `credenciales` |
| Token sin permisos | 403 | `acceso-denegado` |
| Conflicto de integridad | 409 | `conflicto` |
| Error inesperado | 500 | `error-interno` |

### 3.5 CORS

La propiedad `app.cors.allowed-origins` (variable `CORS_ALLOWED_ORIGINS`) contiene una lista
separada por comas. Por defecto permite `http://localhost:5173` y `http://127.0.0.1:5173`.
Se aplica a `/api/**` con métodos `GET`, `POST`, `PUT`, `DELETE` y `OPTIONS`, cabeceras abiertas
(incluida `Authorization`), exposición de `Location` y `allowCredentials(true)` por compatibilidad.

### 3.6 Datos iniciales

Se incluyen 10 personas de ejemplo con todos los campos cubiertos. Al arrancar:

- Si la tabla está vacía, se insertan los datos mock.
- Si ya existen datos, se conservan.
- `POST /api/v1/personas/reset` elimina todas las filas y reinserta exactamente esos 10 registros.

### 3.7 Seguridad, tokens y auditoría

La API de personas está protegida con Spring Security y **tokens Bearer de corta duración**. El
backend es **sin estado**: no crea `HttpSession` ni cookie `JSESSIONID`. El frontend ejecuta un
autologin transparente la primera vez que se entra en `/personas`:

1. `GET /api/v1/auth/sesion` comprueba si el token en memoria sigue vigente.
2. Si no lo está, `POST /api/v1/auth/login` valida las credenciales fijas.
3. El backend genera 32 bytes con `SecureRandom` y devuelve un token opaco con su caducidad.
4. El frontend guarda el token **solo en memoria** y lo envía en `Authorization: Bearer`.
5. `TokenAuthenticationFilter` valida el token en cada petición.
6. Si el token caduca o el backend se reinicia, un `401` dispara una renovación transparente.

| Elemento | Implementación |
| --- | --- |
| Vigencia | `15m` en `dev`/`test`, `10m` en `pre`, `5m` en `prod` (`APP_AUTH_TOKEN_TTL`). |
| Almacenamiento | Mapa en memoria del backend; se pierde al reiniciar. |
| Renovación | El frontend renueva 60 s antes de caducar y reintenta una vez tras `401`. |
| Logout | `POST /api/v1/auth/logout` elimina el token del servidor. |
| Contraseña | BCrypt en la tabla `usuarios`. |
| Auditoría | `@EnableJpaAuditing`; usuario del `SecurityContext` o `sistema`. |

Tabla `usuarios`:

| Campo | Tipo Java | Columna | Restricciones |
| --- | --- | --- | --- |
| `id` | `Long` | `id` | Clave primaria autoincremental. |
| `username` | `String` | `username` | Obligatorio, único, máximo 60 caracteres. |
| `password` | `String` | `password_hash` | Hash BCrypt de 60 caracteres. |
| `rol` | `String` | `rol` | Obligatorio; por defecto `USER`. |
| `activo` | `boolean` | `activo` | Permite deshabilitar la cuenta. |
| `fechaAlta` | `LocalDateTime` | `fecha_alta` | Fecha de creación. |

`UsuarioInitializer` crea el usuario configurado con BCrypt al arrancar y mantiene el hash alineado
con `APP_AUTH_PASSWORD`. La contraseña en claro nunca se persiste. `SecurityConfig` publica
`/api/v1/auth/**`, Actuator, Swagger y la consola H2; el resto de `/api/**` exige un token válido y
responde `401`/`403` con `ProblemDetail`.

El modelo es válido para la demo local, no para producción: las credenciales fijas viajan en el
bundle del navegador y CSRF está desactivado porque no se usan cookies de autenticación. El detalle
completo está en [`SEGURIDAD.md`](SEGURIDAD.md).

## 4. Frontend

### 4.1 Organización

| Elemento | Responsabilidad |
| --- | --- |
| `App.tsx` | Rutas (`/`, `/personas`, `/documentacion`, `*`), cabecera, contenido y pie. |
| `main.tsx` | Monta React dentro de `ErrorBoundary` y aplica el tema inicial. |
| `theme.ts` y `hooks/useTema.ts` | Preferencia claro/oscuro/sistema y persistencia en `localStorage`. |
| `pages/InicioPage.tsx` | Pantalla de bienvenida con presentación y acceso a la gestión. |
| `pages/PersonasPage.tsx` | Estado de la pantalla, búsqueda, modales, avisos de sesión y notificaciones. |
| `pages/DocumentacionPage.tsx` | Documentación viva: prompt, documentos, `AGENTS.md` y resultados. |
| `components/ErrorBoundary.tsx` | Pantalla de recuperación ante errores de renderizado. |
| `components/Markdown.tsx` | Renderizador Markdown propio, sin dependencias externas. |
| `content/documentacion.generated.ts` | Contenido generado desde las fuentes del repositorio. |
| `scripts/generar-documentacion.mjs` | Generador que lee documentos, tests e informes de pruebas. |
| `components/PersonaTable.tsx` | Tabla responsive, avatares, insignias y acciones. |
| `components/PersonaForm.tsx` | Formulario modal de creación/edición con validación. |
| `components/ConfirmDialog.tsx` | Confirmación reutilizable para borrado y reset. |
| `components/Modal.tsx` | Modal accesible con cierre por Escape y bloqueo de scroll. |
| `hooks/usePersonas.ts` | Carga y mutaciones contra la API; única fuente de verdad remota. |
| `hooks/useNotificacion.ts` | Toasts de éxito y error con autocierre. |
| `api/auth.ts` | Autologin transparente, token en memoria, renovación, logout y eventos de sesión. |
| `api/client.ts` | `fetch` centralizado, cabecera Bearer, `ProblemDetail` y reintento único tras `401`. |
| `api/personas.ts` | Contrato de endpoints de personas. |
| `types/persona.ts` | Tipos, etiquetas, formateo de fechas y ordenación. |
| `styles.css` | Sistema visual propio, responsive, accesible y con tema oscuro. |

### 4.2 Comunicación con la API

- URL base por defecto: `/api/v1` (proxy de Vite en desarrollo).
- Configurable en producción con `VITE_API_BASE_URL`.
- El proxy de desarrollo se puede redirigir con `VITE_PROXY_TARGET`.
- Antes de cargar personas, `usePersonas` llama a `asegurarSesion()`: consulta `/auth/sesion` y, si
  no hay token vigente, hace `POST /auth/login` con las credenciales de demostración. Es transparente
  para el usuario.
- Todas las peticiones usan `credentials: 'omit'` y la cabecera `Authorization: Bearer <token>`; si
  una llamada autenticada recibe `401`, se renueva el token una vez y se repite.
- No se usan datos simulados ni almacenamiento local como sustituto del backend. La lista que se
  muestra proviene de `GET /api/v1/personas` y todas las mutaciones se confirman contra la API.
- `ApiError` (clase del cliente) conserva el código HTTP, el `title`, el `detail`, el `type` y las
  validaciones por campo de una respuesta `application/problem+json`.

### 4.3 Estados de interfaz

- **Carga**: indicador animado en la tabla y contador «Cargando…».
- **Error de carga**: aviso con mensaje y botón «Reintentar».
- **Lista vacía**: estado específico con acción para crear la primera persona.
- **Búsqueda sin resultados**: mensaje diferenciado.
- **Operaciones**: botones deshabilitados mientras se guarda, elimina o restablece.
- **Confirmaciones**: borrado y reset requieren confirmación explícita.
- **Feedback**: notificaciones de éxito/error y validaciones en español.
- **Sesión**: avisos de «sesión renovada» y «sesión caducada» sin interrumpir el flujo.
- **Errores de renderizado**: `ErrorBoundary` muestra una pantalla de recuperación en lugar de una
  página en blanco.

### 4.4 Diseño, tema y accesibilidad

- Interfaz íntegramente en español.
- Diseño responsive con puntos de corte en 960, 720 y 460 px.
- Tema claro, oscuro o `sistema`; se guarda en `localStorage` con la clave `pruebasopencode1.tema`.
- Un script en `index.html` aplica el tema antes de montar React para evitar parpadeos.
- Navegación por teclado, `focus-visible`, etiquetas asociadas, `aria-invalid`,
  `aria-describedby`, diálogos `role="dialog"` y enlace «Saltar al contenido».
- Soporte de `prefers-reduced-motion` y `prefers-color-scheme`.
- Sin dependencias de UI externas: sistema visual propio basado en variables CSS.

### 4.5 Documentación viva

La ruta `/documentacion` centraliza el conocimiento del proyecto dentro de la propia aplicación:

| Sección | Origen |
| --- | --- |
| Prompt de reconstrucción | `docs/PROMPT.md` |
| Documentación general | `README.md` y `docs/*.md` |
| Reglas del proyecto | `AGENTS.md` |
| Resultados de pruebas | Tests de Java, Surefire, scripts E2E/UI y PIT |

`front/scripts/generar-documentacion.mjs` lee esas fuentes y escribe
`front/src/content/documentacion.generated.ts`. El resultado se renderiza con `Markdown.tsx`, un
intérprete ligero que soporta títulos, listas, tablas, código, citas, enlaces y formato en línea sin
añadir dependencias. Los enlaces internos entre documentos abren la pestaña correspondiente.

Los hooks `predev` y `prebuild` ejecutan `npm run docs`, por lo que la página no puede quedar
desincronizada de las fuentes al arrancar o compilar. Cada tabla de resultados se genera por tipo de
prueba y marca las comprobaciones con el último resultado registrado.

## 5. Decisiones arquitectónicas

| Decisión | Motivo |
| --- | --- |
| Separar entidad y DTO | Evita exponer el modelo JPA y permite contratos estables y validados. |
| Mapper explícito sin Lombok | Menos dependencias, código transparente y compatible con cualquier IDE. |
| H2 en fichero en desarrollo | Los datos sobreviven a reinicios y se puede probar el reset; los tests usan memoria. |
| Mutation testing opcional con PIT | Detecta pruebas que pasan sin verificar realmente la lógica, sin añadir tiempo a `clean verify`. |
| `POST /api/v1/personas/reset` | Operación explícita, idempotente y separada del CRUD. |
| Versionado `/api/v1` | Permite evolucionar el contrato sin romper clientes existentes. |
| CORS configurable por entorno | Permite cambiar orígenes sin recompilar. |
| Proxy `/api` en Vite | Evita CORS en desarrollo y simplifica la configuración del cliente. |
| Configuración por perfiles y variables de entorno | Permite Docker/Kubernetes y entornos PRE/PRO sin tocar código. |
| Dos imágenes Docker independientes | Backend JRE y frontend Nginx con ciclos de vida y escalado separados. |
| Kustomize base + overlays PRE/PRO | Evita duplicar manifiestos y hace explícitas las diferencias de entorno. |
| H2 sobre PVC y una réplica de backend | H2 en fichero no admite concurrencia de varias instancias; se documenta la limitación. |
| Seguridad con tokens Bearer opacos | Autenticación real sin estado, revocación explícita y sin dependencia JWT. |
| Token en memoria del frontend | No se persiste en el navegador; recargar provoca un nuevo autologin transparente. |
| Contraseña con BCrypt en H2 | Demuestra un almacenamiento realista de credenciales y evita guardar texto plano. |
| Autologin transparente con promesa única | Cumple el requisito de no mostrar login y evita duplicados con React StrictMode. |
| Errores RFC 9457 (`ProblemDetail`) | Contrato estándar, mantenible y fácil de consumir por el frontend. |
| Auditoría JPA básica | Registra quién y cuándo creó o modificó cada persona. |
| CSRF desactivado en la demo | No hay cookies de autenticación; se documenta y se revisará si cambia el modelo. |
| CSS propio con tema oscuro | Interfaz ligera, moderna y sin dependencias innecesarias. |
| `ErrorBoundary` en React | Evita que un error de renderizado deje la aplicación en blanco. |
| Actuator con sondas de salud | Alimenta las sondas de Kubernetes y la monitorización. |

## 6. Calidad y pruebas

- **Backend**: 11 pruebas unitarias del servicio + 14 de integración de personas + 9 de autenticación
  = **34 pruebas**. Se ejecutan con Maven Wrapper. Cubren CRUD, reset, validaciones, errores RFC 9457,
  CORS, Swagger, rutas inexistentes, tokens, logout y contraseña BCrypt.
- **Frontend**: comprobación de tipos y build de producción con Vite.
- **Integración**: script Node que recorre el flujo completo a través del proxy de Vite, incluido el
  `401` sin token, el autologin, la auditoría y la revocación tras el logout (**18 comprobaciones**).
- **Interfaz**: script con navegador real (Chrome/Edge mediante `playwright-core`) que valida
  bienvenida, autologin transparente, listado, búsqueda, creación, edición, borrado, reset,
  validaciones, tema oscuro y consola sin errores (**14 comprobaciones**).
- **Mutación**: PIT 1.30.2 sobre `PersonaServiceImpl` y `PersonaMapper`, con 21 mutaciones y umbral
  mínimo del 90 %. Es opcional y se ejecuta fuera de `clean verify`.
- **Documentación**: la página `/documentacion` se regenera con `npm run docs` y se valida con el
  build de tipos. Una verificación funcional comprueba sus secciones, pestañas, tablas y consola.
- **Despliegue**: `scripts/verificar-despliegue.mjs` valida Dockerfiles, Nginx, Compose PRE/PRO y los
  overlays Kustomize (**40 comprobaciones**, sin clúster).

La estrategia detallada está en [`PRUEBAS.md`](PRUEBAS.md) y los resultados se registran en
[`SEGUIMIENTO.md`](SEGUIMIENTO.md).

## 7. Docker y Kubernetes

La aplicación se puede ejecutar en Docker y Kubernetes sin cambiar el código:

- **Imágenes**: `deploy/docker/back.Dockerfile` (Maven + JRE 21 sin root) y
  `deploy/docker/front.Dockerfile` (Node + Nginx sin privilegios).
- **Compose**: `deploy/docker/docker-compose.yml` con un proyecto, red, volumen y puertos por entorno.
- **Kubernetes**: base común en `deploy/k8s/base` y overlays `pre`/`pro` con namespace, perfil,
  ConfigMap, Ingress, TLS y recursos de escalado.
- **Configuración**: el perfil, la base de datos, CORS y los secretos se inyectan por entorno; la
  imagen del backend es la misma en PRE y PRO.
- **Salud**: Actuator expone `liveness` y `readiness`; Nginx expone `/healthz`.
- **Persistencia**: H2 sobre un PVC, una sola réplica de backend y estrategia `Recreate`.

El procedimiento completo está en [`DESPLIEGUE.md`](DESPLIEGUE.md) y en `deploy/README.md`. No se ha
desplegado en un clúster real porque el entorno de verificación no tenía contexto de Kubernetes.
