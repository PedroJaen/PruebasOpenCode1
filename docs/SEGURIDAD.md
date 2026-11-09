# Seguridad de PruebasOpenCode1

> Documento actualizado el 2026-11-09.

## 1. Objetivo

PruebasOpenCode1 es una aplicación de demostración, pero sus llamadas a la API no son simuladas: el
backend valida credenciales reales, guarda la contraseña cifrada en H2 y protege los recursos con
**tokens Bearer de corta duración** gestionados por Spring Security.

Para no añadir fricción al usuario, el frontend realiza un **autologin transparente** la primera vez
que se accede a la gestión de personas. No hay pantalla de login ni se muestran credenciales: el
usuario ve directamente el listado y todas las peticiones viajan autenticadas con la cabecera
`Authorization: Bearer <token>`.

Este modelo es deliberadamente simple y **no es apto para producción**: las credenciales fijas del
autologin forman parte del bundle del navegador. Los límites y la hoja de ruta de endurecimiento se
describen en el apartado 8.

## 2. Piezas del modelo de seguridad

| Pieza | Tecnología | Responsabilidad |
| --- | --- | --- |
| Backend | Spring Boot 3.5 + Spring Security | Filtro de seguridad, autenticación y autorización. |
| Almacén de usuarios | JPA + Hibernate + H2 | Tabla `usuarios` con la contraseña cifrada. |
| Cifrado | BCrypt (`BCryptPasswordEncoder`) | Hash adaptativo con sal aleatoria por contraseña. |
| Token | `TokenService` + `TokenAuthenticationFilter` | Emite y valida tokens opacos en memoria con caducidad. |
| Frontend | React + TypeScript + Vite | Autologin transparente, token en memoria y renovación. |
| Contrato de autologin | `POST /api/v1/auth/login` | Valida credenciales y emite el token Bearer. |
| Formato de error | RFC 9457 (`ProblemDetail`) | Respuestas `application/problem+json` homogéneas. |
| Auditoría | Spring Data JPA Auditing | Registra usuario e instante de creación/modificación. |

## 3. Flujo de autologin y renovación

```text
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
```

Características del flujo:

- Se ejecuta **solo** al entrar en la sección de personas; la pantalla de bienvenida y la
  documentación no crean token.
- Una **promesa única** (`front/src/api/auth.ts`) evita duplicar el login cuando React StrictMode
  ejecuta el efecto dos veces.
- El token se guarda **únicamente en memoria**. No se escribe en `localStorage`, `sessionStorage` ni
  cookies: recargar la pestaña o cerrarla obliga a un nuevo autologin transparente.
- El token se renueva automáticamente **60 segundos antes** de su caducidad. Si la renovación falla,
  la siguiente petición lo intenta de nuevo.
- El cliente HTTP renueva la sesión una sola vez tras un `401` y repite la petición original. Las
  rutas `/auth/**` nunca se reintentan para evitar bucles de credenciales incorrectas.
- La interfaz muestra avisos discretos de **«sesión renovada»** y **«sesión caducada»** sin
  interrumpir al usuario ni pedirle que vuelva a iniciar sesión.
- El usuario nunca ve un formulario, un botón de login ni las credenciales.

### 3.1 Por qué tokens Bearer y no cookies de sesión

La versión anterior usaba `HttpSession` y la cookie `JSESSIONID`. Se migró a tokens Bearer por estas
razones:

- **Estado fuera del navegador**: el token no se envía automáticamente en cada petición del navegador,
  lo que reduce la superficie de ataques CSRF.
- **Revocación explícita**: `POST /api/v1/auth/logout` elimina el token del servidor; no depende de la
  caducidad de una sesión.
- **Caducidad corta y renovación controlada**: 15 minutos en `dev`, 10 en `pre` y 5 en `prod`
  (configurable con `APP_AUTH_TOKEN_TTL`).
- **Contrato explícito**: `Authorization: Bearer` es visible en Swagger UI y en los ejemplos de la API.

Contrapartidas asumidas (documentadas para no ocultarlas):

- El token se pierde al **reiniciar el backend**, porque se guarda en memoria. El frontend lo detecta
  con un `401` y vuelve a autenticarse de forma transparente.
- No hay estado de sesión ni lista de dispositivos conectados.
- No se implementa JWT ni firma criptográfica: son tokens opacos de un único backend.
- El logout solo revoca el token del dispositivo actual.
- En una arquitectura con varias réplicas haría falta una memoria compartida (Redis) o JWT firmados.

### 3.2 Eventos de sesión en la interfaz

`front/src/api/auth.ts` expone `suscribirEventosSesion()`. `PersonasPage` se suscribe y muestra:

| Evento | Cuándo se emite | Mensaje |
| --- | --- | --- |
| `sesion-renovada` | Tras un `401`, el autologin obtiene un token nuevo. | «Sesión renovada automáticamente». |
| `sesion-caducada` | La renovación falla (backend caído o credenciales inválidas). | «La sesión ha caducado. Vuelve a intentarlo». |

Los avisos usan el mismo sistema de notificaciones que el resto de operaciones y no bloquean la
interfaz.

## 4. Backend

### 4.1 Entidad `Usuario`

Tabla `usuarios`:

| Campo | Tipo Java | Columna | Restricciones |
| --- | --- | --- | --- |
| `id` | `Long` | `id` | Clave primaria autoincremental. |
| `username` | `String` | `username` | Obligatorio, único, máximo 60 caracteres. |
| `password` | `String` | `password_hash` | Obligatorio, hash BCrypt de 60 caracteres. |
| `rol` | `String` | `rol` | Obligatorio; por defecto `USER`. |
| `activo` | `boolean` | `activo` | Permite deshabilitar la cuenta. |
| `fechaAlta` | `LocalDateTime` | `fecha_alta` | Fecha de creación. |

La contraseña en claro nunca se persiste ni se devuelve en ninguna respuesta. `SesionResponse` solo
expone `autenticado`, `usuario`, `rol` y `expiraEn`.

### 4.2 Siembra y sincronización del usuario

`UsuarioInitializer` se ejecuta al arrancar:

1. Busca el usuario configurado en la base de datos.
2. Si no existe, lo crea con `passwordEncoder.encode(contraseña)`.
3. Si existe y la contraseña configurada ya no coincide, regenera el hash y actualiza el rol.
4. Si coincide, conserva el hash existente.

Así la base de datos es la fuente real de autenticación y la contraseña siempre está cifrada, incluso
tras cambiar las variables de entorno.

### 4.3 Configuración de Spring Security

`SecurityConfig` define:

- Autenticación **sin estado**: `SessionCreationPolicy.STATELESS`.
- `DaoAuthenticationProvider` respaldado por `UsuarioDetailsService` y BCrypt.
- `TokenAuthenticationFilter` antes de `UsernamePasswordAuthenticationFilter`.
- Respuestas `401` y `403` en formato RFC 9457 (`ProblemDetail`), no `ApiError`.
- `formLogin`, `httpBasic` y el logout automático de Spring desactivados: el contrato lo controla
  `AuthController`.
- CSRF desactivado porque **no se usan cookies de autenticación** (véase el apartado 7).
- CORS con `allowCredentials(true)` y cabecera `Authorization` permitida. Aunque el token no viaja en
  cookies, se mantiene la configuración para no romper clientes y preflight existentes.

Rutas públicas:

- `/api/v1/auth/**`
- `/actuator/health`, `/actuator/health/**`, `/actuator/info`
- `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html`
- `/h2-console/**` (solo desarrollo)
- `/error`

El resto de `/api/**` requiere un token válido.

### 4.4 Endpoints de autenticación

| Método | Ruta | Descripción | Respuesta |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/login` | Valida credenciales y emite el token. | `200` con `TokenResponse`. |
| `GET` | `/api/v1/auth/sesion` | Consulta el estado del token. | `200` con `SesionResponse`. |
| `POST` | `/api/v1/auth/logout` | Revoca el token actual. | `204`. |

Cuerpo del login:

```json
{
  "usuario": "demo",
  "contrasena": "demo1234"
}
```

Respuesta:

```json
{
  "token": "Q2xhdmUtb3BhY2EtZGUtMzItYnl0ZXM...",
  "tipo": "Bearer",
  "expiraEn": "2026-11-09T16:15:00Z",
  "segundosRestantes": 900,
  "usuario": "demo",
  "rol": "ROLE_USER"
}
```

`GET /api/v1/auth/sesion` devuelve `autenticado`, `usuario`, `rol` y `expiraEn`. Sin token válido
responde `200` con `{"autenticado": false, "usuario": null, "rol": null, "expiraEn": null}` para que
el sondeo previo al autologin no genere errores de red en la consola.

Credenciales incorrectas devuelven `401` con el mensaje genérico
`Usuario o contraseña incorrectos.` para no revelar si el usuario existe. El formato es
`application/problem+json`.

### 4.5 Auditoría básica

`AuditoriaConfig` activa `@EnableJpaAuditing`. La entidad `Persona` guarda cuatro campos adicionales:

| Campo | Columna | Origen |
| --- | --- | --- |
| `creadoEn` | `creado_en` | `@CreatedDate`; instante de creación. |
| `actualizadoEn` | `actualizado_en` | `@LastModifiedDate`; instante de la última modificación. |
| `creadoPor` | `creado_por` | `@CreatedBy`; usuario autenticado o `sistema`. |
| `actualizadoPor` | `actualizado_por` | `@LastModifiedBy`; usuario autenticado o `sistema`. |

El usuario se toma del `SecurityContext`. Durante la siembra inicial o el reset sin petición
autenticada se registra `sistema`. Los cuatro campos se incluyen en `PersonaResponse`.

> Los registros creados antes de activar la auditoría pueden tener estos campos a `null`; los nuevos y
> los del reset siempre se rellenan.

## 5. Configuración

### 5.1 Backend

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| `APP_AUTH_USERNAME` | `demo` | Usuario del autologin. |
| `APP_AUTH_PASSWORD` | `demo1234` | Contraseña en claro usada solo para generar el hash. |
| `APP_AUTH_ROLE` | `USER` | Rol asignado al usuario. |
| `APP_AUTH_TOKEN_TTL` | `15m` (`dev`/`test`), `10m` (`pre`), `5m` (`prod`) | Vigencia del token Bearer. |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Orígenes permitidos. |
| `SPRING_PROFILES_ACTIVE` | `dev` | Perfil activo: `dev`, `test`, `pre` o `prod`. |

En los perfiles `pre` y `prod` **no hay valores por defecto** para `APP_AUTH_USERNAME`,
`APP_AUTH_PASSWORD`, `DB_USERNAME`, `DB_PASSWORD` ni `CORS_ALLOWED_ORIGINS`: el entorno debe
inyectarlos. Esto evita arrastrar secretos de demostración a entornos superiores.

### 5.2 Frontend

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| `VITE_AUTH_USERNAME` | `demo` | Usuario enviado por el autologin. |
| `VITE_AUTH_PASSWORD` | `demo1234` | Contraseña enviada por el autologin. |
| `VITE_API_BASE_URL` | `/api/v1` | URL base de la API. |

Deben coincidir con las variables del backend. Al compilarse dentro del bundle no son secretos: son
valores de demostración.

### 5.3 Externalización de secretos

- El repositorio no contiene `.env` reales; solo `back/.env.example` como plantilla.
- `.gitignore` excluye `back/.env`, `back/.env.*`, `front/.env` y `front/.env.*`, pero conserva los
  `.env.example`.
- En `pre`/`prod` los secretos se inyectan desde el entorno o desde un gestor de secretos.
- El frontend solo contiene credenciales de demostración; en un despliegue real no debe incluir
  contraseñas.

## 6. Frontend

| Archivo | Responsabilidad |
| --- | --- |
| `src/api/auth.ts` | Autologin, token en memoria, renovación, logout y eventos de sesión. |
| `src/api/client.ts` | Cabecera `Authorization`, error RFC 9457 y reintento único tras `401`. |
| `src/hooks/usePersonas.ts` | Llama a `asegurarSesion()` antes de cargar el listado. |
| `src/pages/PersonasPage.tsx` | Avisos de sesión renovada o caducada. |
| `src/theme.ts` y `src/hooks/useTema.ts` | Preferencia de tema claro/oscuro/sistema. |
| `src/components/ErrorBoundary.tsx` | Recuperación ante errores de renderizado. |
| `src/vite-env.d.ts` | Tipado de las variables de entorno de autenticación. |
| `front/.env.example` | Documentación de las variables del autologin. |

El cliente HTTP usa `credentials: 'omit'`: el token viaja en la cabecera y no se envían cookies.

## 7. Decisiones y límites

### CSRF desactivado

La API se consume como SPA JSON con CORS restringido y no existen formularios HTML servidos por el
backend. Además, el token se envía en `Authorization: Bearer`, no en una cookie que el navegador
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

- La consola H2 y Swagger están abiertos en local; deben desactivarse fuera de desarrollo.
- No hay bloqueo por intentos fallidos, rotación de contraseña ni auditoría de accesos.
- No se usan HTTPS ni certificados por defecto en local.
- La auditoría cubre personas, no inicios de sesión ni cambios de configuración.

## 8. Endurecimiento futuro

1. Sustituir las credenciales fijas por un proveedor de identidad o login individual.
2. Servir todo por HTTPS.
3. Mantener CSRF desactivado mientras no haya cookies de autenticación; activarlo si se reintroducen.
4. Desactivar H2 Console y Swagger en PRE/PRO (ya ocurre en los perfiles `pre` y `prod`).
5. Añadir limitación de intentos, auditoría de accesos y políticas de contraseña.
6. Externalizar los secretos en un gestor de secretos, nunca en el repositorio.
7. Para varias réplicas, compartir tokens en Redis o adoptar JWT firmados con rotación de claves.

## 9. Verificación

La seguridad se comprueba en tres niveles:

- **Integración backend** (`AuthControllerIntegrationTest`, 9 pruebas): `401` sin token, login válido,
  token con expiración, acceso con token, credenciales inválidas, token inválido, contraseña BCrypt en
  base de datos, logout que revoca el token y consulta de sesión con y sin token.
- **Integración de extremo a extremo**: el script comprueba el `401` sin token, el login, la consulta
  de sesión, la auditoría y la revocación tras el logout.
- **Interfaz real**: el script detecta la petición de autologin, exige `200` y comprueba que no se
  muestra ningún campo de contraseña ni la acción de iniciar sesión.

Los resultados se registran en [`PRUEBAS.md`](PRUEBAS.md) y [`SEGUIMIENTO.md`](SEGUIMIENTO.md).

## 10. Documentación relacionada

- [`ARQUITECTURA.md`](ARQUITECTURA.md): capas y decisiones técnicas.
- [`API.md`](API.md): contrato REST, incluidos los endpoints de autenticación.
- [`EJECUCION.md`](EJECUCION.md): variables de entorno y arranque local.
- [`PRUEBAS.md`](PRUEBAS.md): suites y resultados.
- [`OPERACION.md`](OPERACION.md): base de datos y diagnóstico.
