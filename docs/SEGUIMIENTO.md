# Seguimiento del proyecto PruebasOpenCode1

> Última actualización: 2026-11-09
> Última verificación funcional: 2026-11-09
> Estado global: **Completado (fase local)**

## 1. Plan de implementación y estado

### Fase 0. Análisis y preparación

- [x] Leer `AGENTS.md` del proyecto y recopilar requisitos.
- [x] Revisar el contenido actual de la carpeta y conservar los archivos existentes.
- [x] Verificar el entorno disponible (Java, Maven, Node, npm).
- [x] Preparar el toolchain necesario para compilar y verificar (JDK 21 y Maven).
- [x] Crear la estructura base `/back`, `/front`, `/docs`.

### Fase 1. Backend: base y modelo de datos

- [x] Crear `pom.xml` con Spring Boot, Spring Web, Spring Data JPA, Validation, H2, Actuator y Maven Wrapper.
- [x] Configurar la aplicación, perfiles y parámetros externalizables.
- [x] Implementar la entidad `Persona` y el enum `Sexo`.
- [x] Implementar el repositorio JPA.
- [x] Configurar H2 (base de datos de fichero, consola y creación automática del esquema).

### Fase 2. Backend: lógica de negocio y API REST

- [x] Crear DTO de entrada/salida y mapper.
- [x] Aplicar validaciones con Jakarta Bean Validation.
- [x] Implementar la capa de servicio (listar, obtener, crear, actualizar, eliminar, restablecer).
- [x] Implementar el controlador REST y la respuesta 201 con cabecera `Location`.
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
- [x] Ejecutar `mvnw clean verify` y corregir errores.

### Fase 4. Frontend: base

- [x] Crear proyecto Vite + React + TypeScript.
- [x] Configurar TypeScript, Vite, proxy `/api` y variables de entorno.
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

- [x] Compilar el frontend (`npm run build` y comprobación de tipos).
- [x] Arrancar backend y frontend.
- [x] Verificar la comunicación real a través del proxy de Vite.
- [x] Ejecutar un smoke test de todas las operaciones (listar, obtener, crear, actualizar, eliminar, reset).
- [x] Verificar la interfaz completa con navegador real (Playwright Core + Chrome).
- [x] Corregir los defectos detectados.

### Fase 7. Documentación y preparación de despliegues

- [x] Crear `docs/ARQUITECTURA.md`.
- [x] Crear `docs/EJECUCION.md`.
- [x] Crear `docs/API.md`.
- [x] Crear `docs/DESPLIEGUE.md` con el diseño previsto para Docker/Kubernetes (PRE/PRO).
- [x] Crear `docs/PRUEBAS.md` con la estrategia, suites, mutation testing, comandos y resultados esperados.
- [x] Crear `docs/MANUAL_USUARIO.md` con los flujos de uso de la interfaz.
- [x] Crear `docs/OPERACION.md` con configuración, H2, copias, migración y diagnóstico.
- [x] Crear `README.md` raíz, `.gitignore` y `.editorconfig`.
- [x] Revisar las cifras de pruebas y enlaces de la documentación existente.
- [x] Actualizar este seguimiento con resultados y decisiones.

### Fase 8. Revisión final

- [x] Revisar que no queden datos simulados en el frontend.
- [x] Revisar que no haya secretos ni valores específicos de entorno en el código.
- [x] Verificar el proyecto Maven y los scripts de VS Code (los IDEs no están instalados en el entorno).
- [x] Registrar problemas pendientes y siguientes pasos.

### Fase 9. Documentación viva en el frontend

- [x] Crear `docs/PROMPT.md` con el prompt completo de reconstrucción.
- [x] Crear `front/scripts/generar-documentacion.mjs` para leer documentos, tests, Surefire, E2E/UI y PIT.
- [x] Generar `front/src/content/documentacion.generated.ts` desde las fuentes reales.
- [x] Implementar `Markdown.tsx` sin dependencias externas.
- [x] Crear la página `/documentacion` con prompt, documentación, `AGENTS.md` y tablas de resultados.
- [x] Añadir «Documentación» al menú superior y los estilos responsive.
- [x] Ejecutar `npm run docs` automáticamente en `predev` y `prebuild`.
- [x] Verificar la página con build de producción y navegador real.

### Fase 10. Seguridad y autologin

- [x] Añadir Spring Security y BCrypt al backend.
- [x] Crear la entidad `Usuario`, su repositorio y el servicio de carga de usuarios.
- [x] Configurar CORS con cabecera `Authorization`, respuestas `401`/`403` y seguridad sin estado.
- [x] Sembrar y sincronizar el usuario de demostración con contraseña cifrada.
- [x] Implementar el autologin transparente en el frontend con promesa única.

### Fase 11. Endurecimiento (hardening)

- [x] Sustituir la sesión HTTP por **tokens Bearer opacos** de corta duración (`TokenService`, `TokenAuthenticationFilter`).
- [x] Versionar la API bajo `/api/v1` y actualizar cliente, proxy y scripts.
- [x] Estandarizar los errores con **RFC 9457** (`ProblemDetail`) en todos los códigos `400`–`500`.
- [x] Añadir **auditoría JPA** (`creadoEn`, `actualizadoEn`, `creadoPor`, `actualizadoPor`).
- [x] Externalizar secretos y configuración; crear `back/.env.example` y excluir `.env` del repositorio.
- [x] Definir los perfiles `dev`, `test`, `pre` y `prod` con TTL de token y Swagger configurables.
- [x] Implementar avisos de «sesión renovada» y «sesión caducada» sin romper el autologin.
- [x] Añadir `ErrorBoundary` de React para errores de renderizado.
- [x] Implementar tema claro/oscuro/`sistema` persistido en `localStorage`.
- [x] Actualizar las suites de integración (18) y UI (14) al modelo Bearer y al tema oscuro.
- [x] Reescribir `docs/SEGURIDAD.md`, `API.md`, `ARQUITECTURA.md`, `EJECUCION.md`, `PRUEBAS.md` y `PROMPT.md`.

## 2. Resultados de verificación (2026-11-09)

| Comprobación | Comando | Resultado |
| --- | --- | --- |
| Backend: compilación y pruebas | `back\mvnw.cmd -B clean verify` | **BUILD SUCCESS** · 34 pruebas, 0 fallos |
| Swagger UI y OpenAPI | `GET /v3/api-docs` + `/swagger-ui/index.html` | **200 OK** · rutas `/api/v1`, `bearerAuth` y operaciones expuestas |
| Frontend: tipos y build | `npm.cmd run build` | **Correcto** · `dist/` generado |
| Integración API vía proxy | `node scripts\verificar-integracion.mjs` | **18/18 comprobaciones** |
| Interfaz real en navegador | `npm.cmd run test:ui` (en `/front`) | **14/14 comprobaciones**, sin errores de consola |
| Mutation testing | `back\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage` | **BUILD SUCCESS** · 21/21 mutaciones, 100 % de detección y 48/50 (96 %) de cobertura |
| Documentación viva | `npm run build` + Chrome headless sobre Vite | **Correcta** · secciones, tablas de resultados y consola sin errores |
| Migración de esquema heredado | JAR nuevo sobre H2 con columna `edad` | **Correcta** · columna eliminada, CRUD operativo y edad recalculada |
| Render en Chrome headless | `chrome --headless --dump-dom` | 10 filas de personas renderizadas |

Revisión documental (2026-11-09): 10 documentos en `docs/`, `README.md` y `AGENTS.md`, sin enlaces
internos rotos y con las cifras de pruebas alineadas con la última ejecución funcional. La página
`/documentacion` se genera desde estas fuentes y se verificó el mismo día.

Mutation testing: PIT 1.30.2 analiza `PersonaServiceImpl` y `PersonaMapper` con 21 mutaciones
generadas, 21 detectadas y una cobertura de líneas del 96 %.

### Pruebas de backend

- `PersonaServiceImplTest`: 11 pruebas unitarias.
- `PersonaControllerIntegrationTest`: 14 pruebas de integración.
- `AuthControllerIntegrationTest`: 9 pruebas de autenticación por token.
- Total: **34 pruebas**, 0 fallos, 0 errores.
- PIT: **21/21 mutaciones detectadas** (umbral mínimo del 90 %).

### Integración verificada

A través de `http://127.0.0.1:5173/api/v1` (proxy de Vite → backend):

1. SPA servida correctamente.
2. Backend `UP` en Actuator.
3. CORS permite `http://localhost:5173` y la cabecera `Authorization`.
4. Sin token, la API de personas devuelve `401` con `ProblemDetail`.
5. El autologin emite el token Bearer y `/api/v1/auth/sesion` lo confirma.
6. Reset con 10 registros.
7. Listado completo con auditoría.
8. Creación con `201`, `Location`, edad calculada y auditoría.
9. Listado actualizado.
10. Consulta por id.
11. `404` con `ProblemDetail` para id inexistente.
12. Modificación persistida con auditoría actualizada.
13. Validaciones `400` por campo.
14. Sexo inválido `400`.
15. Eliminación `204`.
16. `404` al eliminar inexistente.
17. Reset final con 10 registros.
18. Logout que revoca el token y devuelve `401` en la siguiente petición.

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

La página `/documentacion` se verifica por separado con una comprobación de navegador real.

## 3. Decisiones técnicas

| Fecha | Decisión | Justificación |
| --- | --- | --- |
| 2026-11-06 | Spring Boot 3.5.16 y Java 21 | Versión estable compatible con los requisitos. |
| 2026-11-06 | H2 en fichero para desarrollo | Conserva datos entre reinicios y permite probar el reset; los tests usan H2 en memoria. |
| 2026-11-06 | Perfil `test` con H2 en memoria | Aísla las pruebas y evita depender del estado local. |
| 2026-11-06 | Configuración por variables de entorno | Facilita Docker/Kubernetes y los entornos PRE/PRO sin tocar código. |
| 2026-11-06 | DTO + mapper explícito, sin Lombok | Contratos estables, menos dependencias y máxima compatibilidad con IDEs. |
| 2026-11-06 | `POST /api/v1/personas/reset` | Operación explícita, idempotente y separada del CRUD. |
| 2026-11-06 | Frontend con React Router y CSS propio | Interfaz moderna y ligera, sin dependencias de UI innecesarias. |
| 2026-11-06 | Proxy `/api` en Vite | Evita CORS en desarrollo y centraliza la configuración de la API. |
| 2026-11-06 | Playwright Core con el Chrome del sistema | Prueba la UI real sin descargar navegadores adicionales. |
| 2026-11-06 | Actuator con sondas de salud | Prepara el backend para futuras sondas de Kubernetes. |
| 2026-11-06 | springdoc-openapi 2.8.16 + Swagger UI | Documentación interactiva generada desde el código; permite probar la API desde el navegador sin trabajo manual. La rama 3.x requiere Spring Boot 4 y no es compatible. |
| 2026-11-06 | `edad` calculada, no persistida | Se elimina la columna `edad`; `PersonaResponse` la deriva de `fechaNacimiento` y la fecha actual. Evita datos obsoletos y mantiene la edad visible en el frontend. `MigracionEsquema` retira la columna antigua en bases existentes. |
| 2026-11-09 | Documentación viva generada desde las fuentes | Evita duplicar contenido y garantiza que `/documentacion` refleje siempre el último estado de documentos, tests e informes. |
| 2026-11-09 | Contraseña BCrypt en H2 | Almacenamiento realista: nunca se guarda ni se devuelve la contraseña en claro. |
| 2026-11-09 | Autologin transparente con promesa única | Cumple el requisito de no mostrar login y evita duplicados por React StrictMode. |
| 2026-11-09 | Tokens Bearer opacos en memoria en lugar de sesión HTTP | Autenticación real sin estado de sesión, revocación explícita en el logout y sin dependencia de JWT. Se documentan los límites: el backend reiniciado invalida los tokens y el frontend los renueva de forma transparente. |
| 2026-11-09 | Token solo en memoria del frontend | No se persiste en el navegador; recargar la pestaña provoca un nuevo autologin transparente. |
| 2026-11-09 | CSRF desactivado en la demo | No se usan cookies de autenticación: el token viaja en la cabecera `Authorization`, no se envía automáticamente. Se documenta como decisión revisable antes de producción. |
| 2026-11-09 | Versionado `/api/v1` | Permite evolucionar el contrato sin romper clientes existentes. |
| 2026-11-09 | Errores RFC 9457 (`ProblemDetail`) | Contrato estándar con `type`, `title`, `status`, `detail` e `instance`, mantenible y fácil de consumir. |
| 2026-11-09 | Auditoría JPA básica | Registra quién y cuándo creó o modificó cada persona; campos anulables para bases H2 ya existentes. |
| 2026-11-09 | Perfiles `dev`/`test`/`pre`/`prod` con secretos externalizados | Evita secretos versionados y permite cambiar de entorno sin tocar código. |
| 2026-11-09 | Tema oscuro con preferencia `sistema` | Mejora la accesibilidad y respeta la preferencia del sistema, persistida en `localStorage`. |
| 2026-11-09 | `ErrorBoundary` en React | Evita que un error de renderizado deje la aplicación en blanco. |

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

> El entorno inicial solo tenía Java 17 y no tenía Maven. Para verificar se descargaron JDK 21 y
> Maven 3.9.16 en `C:\Users\Nagasia\.opencode-tools`, fuera del repositorio. El proyecto usa Maven
> Wrapper y no depende de esa ruta.

## 5. Incidencias y notas

- **Java 17 en el entorno inicial:** el proyecto exige Java 21. Se instaló Temurin 21 fuera del
  repositorio y se añadió `maven-enforcer-plugin` para fallar con un mensaje claro si se usa una
  versión anterior.
- **Maven no instalado:** se generó Maven Wrapper con distribución 3.9.16. El primer build descarga
  Maven y las dependencias.
- **Política de PowerShell:** `npm.ps1` está bloqueado; se usó `npm.cmd`. Documentado en
  `docs/EJECUCION.md`.
- **Aviso de npm sobre scripts de instalación:** npm mostró un aviso sobre el `postinstall` de
  esbuild. No impidió la instalación ni el build; Vite funcionó correctamente.
- **Eclipse y VS Code no instalados:** no se pudieron abrir literalmente los IDEs. Se validó el
  proyecto Maven estándar, el arranque por CLI y los scripts de npm, y se documentó la importación y
  ejecución desde ambos IDEs.
- **`application.yml` no copiado por Eclipse (2026-11-06):** al arrancar desde Eclipse se produjo
  `Could not resolve placeholder 'app.cors.allowed-origins'` y H2 arrancó en memoria. La causa fue
  que `target/classes` se recompiló sin copiar `src/main/resources/application.yml`, porque el
  proyecto no se había importado como proyecto Maven o no se había actualizado. Se añadió un valor
  por defecto para CORS, un diagnóstico que avisa en el log si falta `application.yml` y una guía de
  corrección en `docs/EJECUCION.md`. El JAR empaquetado siempre incluye la configuración.
- **Rutas inexistentes devolvían 500 (2026-11-06):** el manejador genérico de excepciones capturaba
  `NoResourceFoundException` y respondía `500` con traza en el log. Se añadió un manejador específico
  que responde `404`, ahora con `ProblemDetail`, sin registrar el error como fallo interno.
- **Secuencia de identificadores:** el reset elimina e inserta de nuevo, pero H2 no reinicia la
  secuencia de `id`. Se documenta en `docs/API.md`; no afecta a la funcionalidad.
- **Versión de springdoc (2026-11-06):** la última publicada era 3.2.0, pero está construida sobre
  Spring Boot 4.1.2 y no es compatible con Spring Boot 3.5.16. Se usó la última de la rama 2.x,
  **2.8.16**, compilada contra Spring Boot 3.5.11. Antes de actualizar springdoc hay que comprobar la
  versión de Spring Boot del proyecto.
- **Edad almacenada (2026-11-06):** `edad` se guardaba en `personas` y podía quedar desincronizada con
  `fechaNacimiento`. Ahora no se persiste: `PersonaMapper` la calcula en cada respuesta y el formulario
  del frontend ya no la pide. Para no romper bases H2 existentes se añadió `MigracionEsquema`, que
  elimina la columna antigua al arrancar.
- **Mutation testing (2026-11-09):** se añadió PIT 1.30.2 con `pitest-junit5-plugin` para mutar el
  servicio y el mapper. La primera ejecución dejó una mutación superviviente en `updateEntity`: no se
  comprobaba que el sexo se actualizara. Se añadió la aserción y el resultado quedó en 21/21. Lanzar
  solo `pitest:mutationCoverage` reutiliza `target/test-classes`; hay que ejecutar antes
  `test-compile`, y así se documenta en `docs/PRUEBAS.md` y `docs/EJECUCION.md`.
- **Migración a tokens Bearer (2026-11-09):** se sustituyó la cookie de sesión por tokens opacos de
  32 bytes con caducidad en memoria. El backend pasa a `SessionCreationPolicy.STATELESS`. Un reinicio
  del backend invalida los tokens y el frontend vuelve a autenticarse de forma transparente, por lo
  que no se rompe la experiencia de uso.
- **Campos de auditoría en bases existentes (2026-11-09):** las filas creadas antes de activar la
  auditoría conservan los campos a `null`; `ddl-auto=update` añade las columnas sin recrear la tabla.
  Los registros nuevos y los del reset se rellenan con el usuario autenticado o con `sistema`.
- **Carrera entre suites E2E y UI (2026-11-09):** al ejecutarlas en paralelo se produjo un `500`
  (`ObjectOptimisticLockingFailureException`) porque ambas hacen reset sobre las mismas filas. Se
  documenta que deben ejecutarse secuencialmente: primero integración y después interfaz.
- **`hola.txt`:** se conservó el archivo existente en la raíz, ya que el usuario pidió no eliminarlo.

## 6. Problemas pendientes y limitaciones conocidas

No hay problemas bloqueantes para el alcance actual. Limitaciones y siguientes pasos:

1. **Endurecimiento de seguridad:** el autologin usa credenciales fijas visibles en el bundle y CSRF
   está desactivado porque no hay cookies. Para producción hay que sustituirlo por autenticación
   individual, HTTPS, gestión de secretos y una revisión de CSRF; el plan está en `docs/SEGURIDAD.md`.
2. **Tokens en memoria de una sola instancia:** con varias réplicas habría que compartir el
   almacenamiento de tokens o migrar a JWT firmados. Se documenta en `docs/DESPLIEGUE.md`.
3. **Despliegue real:** Docker y Kubernetes están diseñados en `docs/DESPLIEGUE.md`, pero no
   implementados, tal y como se solicitó.
4. **Base de datos para PRE/PRO:** H2 en fichero no es adecuada para múltiples réplicas. Habrá que
   decidir entre H2 con volumen persistente y una base de datos externa (requiere autorización).
5. **Pruebas unitarias de componentes React:** se cubren con build de tipos y pruebas E2E de
   navegador; se podría añadir Vitest/Testing Library si se requiere cobertura unitaria del frontend.
6. **Migraciones de esquema:** se usa `ddl-auto=update` en desarrollo y `MigracionEsquema` para retirar
   la antigua columna `edad`. Para PRE/PRO conviene Flyway o Liquibase.
7. **Internacionalización:** la interfaz está en español; no se ha implementado multiidioma.
8. **Mutation testing:** PIT cubre solo el servicio y el mapper; controladores, entidades y
   configuración no se mutan. Todavía no está integrado en un pipeline de CI.

## 7. Cómo continuar

1. Revisar la aplicación siguiendo `docs/EJECUCION.md`.
2. Repetir las verificaciones con los comandos de la sección 2, incluido PIT tras cambios en la
   lógica de negocio o el mapper, y ejecutar integración y UI en secuencia.
3. Abordar las limitaciones de la sección 6 según prioridad.
4. Cuando se autorice, implementar las imágenes y manifiestos descritos en `docs/DESPLIEGUE.md`.
