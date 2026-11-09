# Pruebas de PruebasOpenCode1

> Documento actualizado el 2026-11-09. Resultados funcionales de la última ejecución: 2026-11-09.

## 1. Objetivo

Este documento describe la estrategia de pruebas del proyecto, qué cubre cada suite, cómo ejecutarla
y qué resultados se consideran correctos.

Las pruebas verifican el comportamiento local de la aplicación. No sustituyen a la monitorización ni
a las pruebas de carga o seguridad de un entorno real.

## 2. Estrategia

| Nivel | Herramienta | Cantidad | Alcance |
| --- | --- | --- | --- |
| Unitarias de backend | JUnit 5 + Mockito | 11 pruebas | Lógica de negocio de `PersonaServiceImpl`: CRUD, reset, errores y cálculo de edad. |
| Integración de backend | Spring Boot Test + MockMvc + H2 en memoria | 14 pruebas | API REST de personas: CRUD, validaciones, errores RFC 9457, CORS, Swagger, rutas inexistentes y auditoría. |
| Seguridad de backend | Spring Boot Test + MockMvc + BCrypt | 9 pruebas | Tokens Bearer, login, expiración, logout, revocación y contraseña cifrada. |
| Tipos y build de frontend | TypeScript + Vite | 2 comprobaciones | Contrato de tipos y compilación de producción. |
| Integración de extremo a extremo | Node.js + `fetch` a través del proxy de Vite | 18 comprobaciones | Flujo real frontend → proxy → autologin → API → H2 → auditoría. |
| Interfaz con navegador | Playwright Core + Chrome/Edge del sistema | 14 comprobaciones | Pantallas, autologin transparente, formularios, confirmaciones, notificaciones, tema oscuro y consola del navegador. |
| Mutación de backend | PIT 1.30.2 + JUnit 5 | 21 mutaciones | Servicio y mapper: CRUD, cálculo de edad, limpieza de datos y actualización. |
| Migración de esquema | Verificación manual con H2 antigua | — | Retirada de la columna heredada `edad` y funcionamiento posterior del CRUD. |

Total de pruebas de backend en `clean verify`: **34** (11 unitarias + 14 de integración de personas +
9 de autenticación).

## 3. Requisitos

- JDK 21 en `JAVA_HOME`.
- Node.js 20.19+ (probado con Node 24).
- Backend y frontend arrancados para las suites de integración y de interfaz.
- Chrome o Edge instalado para `npm run test:ui`.

En PowerShell, si `npm.ps1` está bloqueado, usar `npm.cmd`.

## 4. Comandos

### 4.1 Backend

```powershell
cd D:\PruebasOpenCode1\back
$env:JAVA_HOME = "C:\ruta\al\jdk-21"
.\mvnw.cmd -B clean verify
```

El comando compila, ejecuta las **34 pruebas** y genera `target/pruebasopencode1-back.jar`.

### 4.2 Frontend

```powershell
cd D:\PruebasOpenCode1\front
npm.cmd run typecheck
npm.cmd run build
```

`build` ejecuta `tsc --noEmit` y genera `dist/`.

### 4.3 Integración de la API

Con el backend en `8080` y el frontend en `5173`:

```powershell
cd D:\PruebasOpenCode1
node scripts\verificar-integracion.mjs
```

Rutas y destinos configurables:

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| `API_BASE_URL` | `http://127.0.0.1:5173/api/v1` | API consumida por el script. |
| `FRONT_URL` | `http://127.0.0.1:5173` | Frontend que sirve la SPA. |
| `BACK_URL` | `http://localhost:8080` | Backend para salud y CORS. |

Ejemplo con un backend en otro puerto:

```powershell
$env:BACK_URL = "http://localhost:9090"
node scripts\verificar-integracion.mjs
```

> Ejecutar esta suite antes que la de interfaz. Ambas restablecen los datos mock y no deben ejecutarse
> en paralelo.

### 4.4 Interfaz con navegador real

Con backend y frontend arrancados, y después de la suite de integración:

```powershell
cd D:\PruebasOpenCode1\front
npm.cmd run test:ui
```

Si el navegador está en una ruta no estándar:

```powershell
$env:CHROME_PATH = "C:\ruta\a\chrome.exe"
npm.cmd run test:ui
```

### 4.5 Mutation testing

PIT se ejecuta de forma opcional, fuera de `clean verify`, para no alargar el ciclo normal:

```powershell
cd D:\PruebasOpenCode1\back
$env:JAVA_HOME = "C:\ruta\al\jdk-21"
.\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage
```

`test-compile` es necesario: si se lanza solo el goal de PIT, reutiliza las clases de prueba ya
compiladas y puede analizar una versión antigua de los tests.

El informe HTML queda en `back/target/pit-reports/index.html` y el XML en
`back/target/pit-reports/mutations.xml`. La configuración está en `back/pom.xml` y aplica estos
umbrales: **90 % de mutaciones detectadas** y **90 % de cobertura de líneas** de las clases mutadas.

## 5. Qué cubre cada suite

### 5.1 Pruebas unitarias del servicio

`PersonaServiceImplTest` comprueba:

- Listado y consulta por identificador.
- Creación con recorte de espacios.
- Actualización de una persona existente y error si no existe.
- Eliminación y error si no existe.
- Restablecimiento de los 10 registros mock.
- Cálculo de la edad desde `fechaNacimiento`.
- Edad correcta cuando el cumpleaños todavía no ha llegado.

### 5.2 Pruebas de integración de la API de personas

`PersonaControllerIntegrationTest` comprueba:

- `POST` devuelve `201`, cabecera `Location` y datos normalizados.
- Listado inicial vacío en el perfil de test.
- `GET` por identificador y `404` con `ProblemDetail` para identificadores inexistentes.
- `PUT` persiste los cambios y devuelve `200`.
- `DELETE` devuelve `204` y `404` si la persona no existe.
- Reset con exactamente 10 registros mock.
- Validaciones `400` por campo con la propiedad `validaciones`.
- Sexo desconocido y fechas no válidas según las reglas de validación.
- Auditoría: `creadoPor`/`actualizadoPor` reflejan el usuario autenticado.
- CORS para el origen del frontend y cabecera `Authorization`.
- Swagger UI y `/v3/api-docs`.
- Ruta inexistente devuelve `404` y no `500`.

Los tests de personas usan `@WithMockUser(username = "demo", roles = "USER")` y comprueban la
auditoría con el usuario `demo`.

### 5.3 Pruebas de autenticación

`AuthControllerIntegrationTest` comprueba:

- Sin token, `GET /api/v1/personas` devuelve `401` con `ProblemDetail` y la ruta solicitada.
- Un login válido emite un token Bearer con expiración y datos del usuario.
- El token válido permite acceder a la API de personas.
- Credenciales incorrectas devuelven `401` sin revelar si el usuario existe.
- Un token inválido o manipulado devuelve `401`.
- La contraseña almacenada es un hash BCrypt de 60 caracteres y `matches()` lo confirma.
- El logout revoca el token y las peticiones posteriores devuelven `401`.
- `GET /api/v1/auth/sesion` con token devuelve usuario, rol y expiración.
- `GET /api/v1/auth/sesion` sin token devuelve `200` con `autenticado: false`.

### 5.4 Script de integración

`scripts/verificar-integracion.mjs` recorre 18 comprobaciones:

1. La SPA se sirve correctamente.
2. El backend responde `UP` en Actuator.
3. El preflight CORS permite el origen del frontend y la cabecera `Authorization`.
4. Sin token, `GET /api/v1/personas` devuelve `401` con `ProblemDetail`.
5. El autologin emite el token y `/api/v1/auth/sesion` lo confirma.
6. El reset deja exactamente 10 personas.
7. El listado completo es correcto e incluye la auditoría.
8. La creación devuelve `201`, `Location`, la edad calculada y la auditoría.
9. El listado refleja la nueva persona.
10. La consulta por identificador devuelve la persona creada.
11. Un identificador inexistente devuelve `404` con `ProblemDetail`.
12. La modificación persiste los cambios y actualiza la auditoría.
13. Los datos inválidos devuelven `400` con validaciones por campo.
14. Un sexo no permitido devuelve `400`.
15. La eliminación devuelve `204`.
16. Eliminar un identificador inexistente devuelve `404`.
17. El reset final vuelve a dejar 10 registros mock.
18. El logout revoca el token y la API vuelve a devolver `401`.

El script realiza el login, conserva el token en memoria, restablece los datos al empezar y, si falla,
intenta limpiar la persona creada.

### 5.5 Prueba de interfaz

`front/scripts/verificar-ui.mjs` valida 14 comprobaciones:

1. Pantalla de bienvenida y acceso a personas.
2. El autologin se ejecuta con `200` al entrar en personas, sin formulario ni credenciales visibles.
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

La página `/documentacion` se comprueba aparte, tal y como se describe en el apartado 5.7.

### 5.6 Mutation testing

PIT modifica el bytecode de `PersonaServiceImpl` y `PersonaMapper` para comprobar si las pruebas
detectan los cambios. Se ejecutan las pruebas unitarias del servicio, que cubren también el mapper de
forma indirecta.

Alcance actual:

- 21 mutaciones generadas y **21 detectadas**.
- Cobertura de líneas de las clases mutadas: **48/50 (96 %)**.
- Umbral configurado: 90 % de mutaciones y 90 % de cobertura de líneas.

No se mutan controladores, entidades, configuración ni pruebas de integración: el objetivo es vigilar
la lógica con ramas y cálculos propios sin disparar el tiempo de ejecución.

### 5.7 Página de documentación

La ruta `/documentacion` se verifica con un navegador real (Chrome/Edge headless) sobre la aplicación
servida por Vite. La comprobación cubre:

1. La ruta responde y la opción «Documentación» aparece activa en el menú.
2. Existen las secciones de resumen, prompt, documentación, `AGENTS.md` y resultados.
3. El prompt se renderiza como Markdown y `AGENTS.md` conserva sus reglas.
4. Las 10 pestañas de documentación cambian de documento.
5. Hay 6 tablas de resultados (unitarias, integración backend, E2E, interfaz, mutación y frontend).
6. El botón de copiar prompt responde y el índice lateral navega.
7. Los enlaces internos entre documentos son interactivos.
8. La consola del navegador no contiene errores.

La documentación general incluye `SEGURIDAD.md`, por lo que la página explica también el autologin,
los tokens Bearer y el almacenamiento cifrado de credenciales.

La comprobación más reciente (2026-11-09) se ejecutó con Chrome headless después de `npm run build`:
confirmó las secciones de resultados, las tablas generadas y la ausencia de errores en consola.

## 6. Datos de prueba

- El perfil `test` usa H2 en memoria, `create-drop`, sin consola y sin siembra automática.
- El entorno local usa H2 en fichero y siembra 10 personas mock solo si la tabla está vacía.
- La tabla `usuarios` se crea o sincroniza al arrancar con la contraseña BCrypt configurada.
- Los scripts de integración y de interfaz llaman al endpoint de reset, por lo que no dependen del
  estado previo de la base de datos local.
- El reset restablece el contenido de personas, no la secuencia de identificadores ni la tabla de
  usuarios.
- Los registros antiguos pueden tener vacíos los campos de auditoría; los nuevos y los del reset se
  rellenan con el usuario autenticado o con `sistema`.

## 7. Resultados esperados

Resultados de la última verificación funcional (2026-11-09):

| Comprobación | Resultado |
| --- | --- |
| `mvnw clean verify` | **BUILD SUCCESS** · 34 pruebas, 0 fallos |
| `npm run build` | Correcto · `dist/` generado y tipos validados |
| `verificar-integracion.mjs` | **18/18 comprobaciones** |
| `verificar-ui.mjs` | **14/14 comprobaciones**, sin errores de consola |
| `pitest:mutationCoverage` | **BUILD SUCCESS** · 21/21 mutaciones, 100 % de detección y 48/50 (96 %) de cobertura |
| Página `/documentacion` | Correcta · 5 secciones, 10 documentos, 6 tablas y consola sin errores |
| Migración de esquema heredado | Columna `edad` eliminada; CRUD y edades correctos |

## 8. Cómo añadir pruebas

- **Lógica de negocio:** añadir un caso en `PersonaServiceImplTest` con Mockito. Mantener las
  aserciones sobre el DTO de respuesta, no sobre detalles internos.
- **API:** añadir un caso en `PersonaControllerIntegrationTest` con `MockMvc` y el perfil `test`.
  Verificar siempre el código HTTP, el contenido `ProblemDetail` y, si aplica, la auditoría.
- **Seguridad:** añadir casos en `AuthControllerIntegrationTest`. Hacer login real con
  `MockMvc` para obtener el token y enviarlo en `Authorization`; comprobar siempre el `401` sin token
  y la revocación tras el logout.
- **Flujo completo:** ampliar `scripts/verificar-integracion.mjs` con una comprobación nueva y
  actualizar el contador y la documentación.
- **Interfaz:** ampliar `front/scripts/verificar-ui.mjs` usando roles y etiquetas accesibles. Evitar
  selectores frágiles basados en posición o clases internas.
- **Mutación:** al añadir o cambiar lógica del servicio o del mapper, ejecutar PIT. Si aparece una
  mutación superviviente, añadir la aserción que la detecte; no bajar los umbrales sin justificarlo.
- **Documentación:** si cambian `AGENTS.md`, `docs/*.md`, los tests o los scripts de verificación,
  ejecutar `npm run docs` en `/front` y comprobar `/documentacion`.
- Tras cambiar el número de pruebas, actualizar `README.md`, `docs/EJECUCION.md`, este documento y
  `docs/SEGUIMIENTO.md`.

## 9. Limitaciones y siguientes pasos

- No hay pruebas unitarias de componentes React; se cubren con el build de tipos y la prueba E2E.
- No se mide la cobertura global del proyecto ni se exige un umbral fuera de las clases mutadas.
- PIT solo analiza `PersonaServiceImpl` y `PersonaMapper`; controladores, entidades, seguridad,
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
| `Port 8080 was already in use` | Detener el proceso que ocupa el puerto o cambiar `SERVER_PORT`. |
| `Port 5173 is in use` | Vite usa `strictPort`; detener el proceso anterior o cambiar el puerto en `vite.config.ts`. |
| El script de integración no conecta | Comprobar que backend y frontend están arrancados y que `API_BASE_URL`, `FRONT_URL` y `BACK_URL` apuntan a los puertos correctos. |
| La API devuelve `401` en la suite | Revisar que el login se completó y que el token se envía en `Authorization: Bearer`. |
| No se encuentra Chrome ni Edge | Definir `CHROME_PATH` con la ruta del navegador. |
| `Database may be already in use` | Solo un proceso puede usar el fichero H2; cerrar la otra instancia. |
| PIT no tiene en cuenta una prueba nueva | Se lanzó solo el goal de PIT; ejecutar antes `test-compile`. |
| `/documentacion` muestra contenido antiguo | Ejecutar `npm run docs` en `/front` o reiniciar `npm run dev`/`npm run build`, que lo hacen automáticamente. |
| La prueba UI modifica datos locales | El script hace reset al final; si se interrumpe, ejecutar `POST /api/v1/personas/reset` con un token válido. |
| Las suites E2E y UI fallan al ejecutarse juntas | Ejecutarlas en secuencia: primero integración y después UI. |
