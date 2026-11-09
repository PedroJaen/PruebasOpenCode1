# API REST de PruebasOpenCode1

> Documento actualizado el 2026-11-09.

## 1. Información general

| Aspecto | Valor |
| --- | --- |
| URL base local | `http://localhost:8080/api/v1` |
| Formato de datos | JSON (`application/json; charset=UTF-8`) |
| Formato de errores | RFC 9457 (`application/problem+json`) |
| Autenticación | Token Bearer de corta duración emitido por `POST /api/v1/auth/login`. |
| Cabecera de autenticación | `Authorization: Bearer <token>` |
| Origen permitido por defecto | `http://localhost:5173`, `http://127.0.0.1:5173` |
| Salud | `GET http://localhost:8080/actuator/health` |
| Consola H2 | `http://localhost:8080/h2-console` (solo `dev`) |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` |

La API está versionada en la ruta `/api/v1`. El frontend en desarrollo consume
`http://localhost:5173/api/v1`, que Vite redirige al backend. En producción la URL base se configura
con `VITE_API_BASE_URL`.

Salvo los endpoints de `/api/v1/auth/**`, todas las rutas `/api/**` requieren un token válido. Sin
token, o con un token caducado o revocado, el backend devuelve `401` con un `ProblemDetail`.

## 2. Modelo `Persona`

### 2.1 Respuesta

```json
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
```

### 2.2 Campos

| Campo | Tipo | Obligatorio en entrada | Reglas |
| --- | --- | --- | --- |
| `id` | entero | No | Generado por la base de datos. Solo aparece en respuestas. |
| `nombre` | texto | Sí | No vacío, máximo 80 caracteres. |
| `apellido` | texto | Sí | No vacío, máximo 80 caracteres. |
| `edad` | entero | No | Calculado desde `fechaNacimiento` y la fecha actual. No se almacena. |
| `sexo` | texto | Sí | `MASCULINO`, `FEMENINO` u `OTRO`. |
| `direccion` | texto | Sí | No vacía, máximo 200 caracteres. |
| `fechaNacimiento` | fecha `yyyy-MM-dd` | Sí | No puede ser futura. |
| `creadoEn` | instante ISO 8601 | No | Auditoría: instante de creación. |
| `actualizadoEn` | instante ISO 8601 | No | Auditoría: instante de la última modificación. |
| `creadoPor` | texto | No | Auditoría: usuario autenticado o `sistema`. |
| `actualizadoPor` | texto | No | Auditoría: usuario autenticado o `sistema`. |

Los textos se recortan (eliminan espacios al principio y al final) antes de guardarse.

La `edad` no forma parte del cuerpo de entrada: el backend la calcula en cada respuesta a partir de
`fechaNacimiento` y de la fecha actual, por lo que se mantiene actualizada automáticamente.

Los cuatro campos de auditoría los rellena Spring Data JPA. Pueden ser `null` en registros creados
antes de activar la auditoría; los registros nuevos y los del reset siempre se rellenan.

## 3. Endpoints

| Método | Ruta | Descripción | Éxito |
| --- | --- | --- | --- |
| `GET` | `/api/v1/personas` | Lista todas las personas ordenadas por apellido y nombre. | `200 OK` |
| `GET` | `/api/v1/personas/{id}` | Obtiene una persona por identificador. | `200 OK` |
| `POST` | `/api/v1/personas` | Crea una persona. | `201 Created` |
| `PUT` | `/api/v1/personas/{id}` | Modifica todos los datos de una persona. | `200 OK` |
| `DELETE` | `/api/v1/personas/{id}` | Elimina una persona. | `204 No Content` |
| `POST` | `/api/v1/personas/reset` | Elimina todo y reinserta los 10 datos mock iniciales. | `200 OK` |
| `POST` | `/api/v1/auth/login` | Valida las credenciales y emite un token Bearer. | `200 OK` |
| `GET` | `/api/v1/auth/sesion` | Consulta el estado del token actual. | `200 OK` |
| `POST` | `/api/v1/auth/logout` | Revoca el token actual. | `204 No Content` |

### 3.1 Listar personas

```http
GET /api/v1/personas
Authorization: Bearer <token>
```

Respuesta `200 OK`:

```json
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
```

Si no hay datos, devuelve `[]` con `200 OK`.

### 3.2 Obtener una persona

```http
GET /api/v1/personas/1
Authorization: Bearer <token>
```

Respuesta `200 OK`: objeto `Persona`.

Si no existe, `404 Not Found` con:

```json
{
  "type": "https://pruebasopencode1.example/errors/no-encontrado",
  "title": "Recurso no encontrado",
  "status": 404,
  "detail": "No existe ninguna persona con el identificador 1.",
  "instance": "/api/v1/personas/1"
}
```

### 3.3 Crear una persona

```http
POST /api/v1/personas
Content-Type: application/json
Authorization: Bearer <token>
```

Cuerpo:

```json
{
  "nombre": "Ana",
  "apellido": "García",
  "sexo": "FEMENINO",
  "direccion": "Calle Mayor 1, Madrid",
  "fechaNacimiento": "1995-05-20"
}
```

Respuesta `201 Created`:

- Cabecera `Location: http://localhost:8080/api/v1/personas/{id}`
- Cuerpo con la persona creada (incluye `id` y auditoría).

### 3.4 Modificar una persona

```http
PUT /api/v1/personas/5
Content-Type: application/json
Authorization: Bearer <token>
```

Cuerpo: mismos campos que en la creación (sin `id`).

Respuesta `200 OK` con la persona actualizada. Si el identificador no existe, `404 Not Found`.

### 3.5 Eliminar una persona

```http
DELETE /api/v1/personas/5
Authorization: Bearer <token>
```

Respuesta `204 No Content`, sin cuerpo. Si no existe, `404 Not Found`.

### 3.6 Restablecer datos mock

```http
POST /api/v1/personas/reset
Authorization: Bearer <token>
```

Sin cuerpo. Elimina todas las personas actuales y vuelve a insertar exactamente los 10 registros de
ejemplo. Devuelve `200 OK` con el listado resultante.

> Nota: el reset restablece el **contenido**, no la secuencia de identificadores. Es posible que los
> nuevos registros mock reciban identificadores distintos a los de un arranque inicial. La API no
> garantiza valores de `id` concretos.

### 3.7 Autenticación

El frontend ejecuta un autologin transparente con credenciales fijas de demostración.

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "usuario": "demo",
  "contrasena": "demo1234"
}
```

Respuesta `200 OK`:

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

El token es un valor opaco de 32 bytes aleatorios, no un JWT. Se guarda en memoria del backend junto
con su caducidad y el frontend lo conserva solo en memoria.

Credenciales incorrectas devuelven `401` con:

```json
{
  "type": "https://pruebasopencode1.example/errors/credenciales",
  "title": "Credenciales incorrectas",
  "status": 401,
  "detail": "Usuario o contraseña incorrectos.",
  "instance": "/api/v1/auth/login"
}
```

La contraseña se almacena cifrada con BCrypt en la tabla `usuarios`; nunca se devuelve.

```http
GET /api/v1/auth/sesion
Authorization: Bearer <token>
```

Devuelve `200` con `autenticado`, `usuario`, `rol` y `expiraEn`. Si no hay token válido, devuelve
`200` con `{"autenticado": false, "usuario": null, "rol": null, "expiraEn": null}`. Este endpoint
nunca responde `401`, para que el sondeo previo al autologin no genere errores de red en la consola
del navegador.

```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

Revoca el token y devuelve `204`. A partir de ese momento el mismo token devuelve `401`. Los detalles
del modelo están en [`SEGURIDAD.md`](SEGURIDAD.md).

## 4. Errores RFC 9457

Todos los errores usan el formato `application/problem+json` definido por la RFC 9457:

| Campo | Descripción |
| --- | --- |
| `type` | URI que identifica el tipo de problema. |
| `title` | Título corto y legible. |
| `status` | Código HTTP. |
| `detail` | Explicación específica del problema. |
| `instance` | Ruta de la petición que provocó el error. |
| `validaciones` | Solo en errores de validación: mapa `campo → mensaje`. |

Tipos de error disponibles:

| `type` | Código | Situación |
| --- | --- | --- |
| `.../errors/no-autenticado` | `401` | Falta el token o no es válido. |
| `.../errors/credenciales` | `401` | Usuario o contraseña incorrectos. |
| `.../errors/acceso-denegado` | `403` | El usuario no tiene permisos. |
| `.../errors/validacion` | `400` | Validación de campos. |
| `.../errors/cuerpo-ilegible` | `400` | JSON mal formado, enum o fecha inválidos. |
| `.../errors/no-encontrado` | `404` | Persona o ruta inexistente. |
| `.../errors/conflicto` | `409` | Conflicto de integridad de datos. |
| `.../errors/error-interno` | `500` | Error interno no controlado. |

El prefijo `type` es `https://pruebasopencode1.example/errors/`.

### 4.1 Validaciones

Si la validación falla, se devuelve `400 Bad Request` con el detalle por campo:

```json
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
```

| Campo | Mensajes |
| --- | --- |
| `nombre` | `El nombre es obligatorio` · `El nombre no puede superar los 80 caracteres` |
| `apellido` | `El apellido es obligatorio` · `El apellido no puede superar los 80 caracteres` |
| `sexo` | `El sexo es obligatorio` |
| `direccion` | `La dirección es obligatoria` · `La dirección no puede superar los 200 caracteres` |
| `fechaNacimiento` | `La fecha de nacimiento es obligatoria` · `La fecha de nacimiento no puede ser futura` |

La edad no se valida como entrada porque no se recibe; se calcula siempre en el servidor.

Un JSON mal formado, un `sexo` desconocido o una fecha con formato incorrecto devuelven `400` con el
tipo `cuerpo-ilegible`:

```json
{
  "type": "https://pruebasopencode1.example/errors/cuerpo-ilegible",
  "title": "Petición no válida",
  "status": 400,
  "detail": "El cuerpo de la petición no es válido. Compruebe el formato de los datos (por ejemplo, el sexo y la fecha).",
  "instance": "/api/v1/personas"
}
```

## 5. Códigos de estado

| Código | Situación |
| --- | --- |
| `200` | Consulta, modificación, reset o login correctos. |
| `201` | Persona creada; incluye `Location`. |
| `204` | Persona eliminada o logout correcto; sin cuerpo. |
| `400` | Datos inválidos, JSON mal formado, enum o fecha incorrectos. |
| `401` | Sin token, token inválido o credenciales incorrectas. |
| `403` | Token válido sin permisos para la operación. |
| `404` | Persona no encontrada o ruta inexistente. |
| `409` | Conflicto de integridad de datos. |
| `500` | Error interno no controlado. |

## 6. CORS

El backend permite por defecto los orígenes:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Métodos permitidos: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`. Cabeceras permitidas: todas, incluida
`Authorization`. Se expone la cabecera `Location` para que el cliente pueda leerla. Se mantiene
`allowCredentials(true)` por compatibilidad, aunque el token viaja en la cabecera y el cliente usa
`credentials: 'omit'`.

Se configura con `CORS_ALLOWED_ORIGINS` (lista separada por comas) sin modificar código.

## 7. Ejemplos de uso

### PowerShell

```powershell
# Autologin y guardado del token
$credenciales = @{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/v1/auth/login `
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

Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/v1/personas `
  -ContentType "application/json" -Body $cuerpo -Headers $cabecera

# Modificar
Invoke-RestMethod -Method Put -Uri http://localhost:8080/api/v1/personas/1 `
  -ContentType "application/json" -Body $cuerpo -Headers $cabecera

# Eliminar
Invoke-RestMethod -Method Delete http://localhost:8080/api/v1/personas/1 -Headers $cabecera

# Restablecer
Invoke-RestMethod -Method Post http://localhost:8080/api/v1/personas/reset -Headers $cabecera
```

### cURL

```bash
# Autologin y extracción del token
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"demo","contrasena":"demo1234"}' | jq -r .token)

curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/personas

curl -H "Authorization: Bearer $TOKEN" -X POST http://localhost:8080/api/v1/personas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","apellido":"García","sexo":"FEMENINO","direccion":"Calle Mayor 1, Madrid","fechaNacimiento":"1995-05-20"}'

curl -H "Authorization: Bearer $TOKEN" -X DELETE http://localhost:8080/api/v1/personas/1

curl -H "Authorization: Bearer $TOKEN" -X POST http://localhost:8080/api/v1/personas/reset
```

## 8. Actuator

| Endpoint | Descripción |
| --- | --- |
| `GET /actuator/health` | Estado general. |
| `GET /actuator/health/liveness` | Sonda de vida (preparada para Kubernetes). |
| `GET /actuator/health/readiness` | Sonda de disponibilidad. |
| `GET /actuator/info` | Información de la aplicación. |

```powershell
Invoke-RestMethod http://localhost:8080/actuator/health
```

```json
{
  "status": "UP",
  "groups": ["liveness", "readiness"]
}
```

## 9. Documentación interactiva (Swagger UI)

La API se documenta automáticamente con **springdoc-openapi 2.8.16**. Con el backend arrancado:

| Recurso | URL |
| --- | --- |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |
| Redirección corta | `http://localhost:8080/swagger-ui.html` |
| Documento OpenAPI 3 (JSON) | `http://localhost:8080/v3/api-docs` |

Swagger UI muestra todos los grupos y operaciones detectados en los controladores:

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/sesion`
- `POST /api/v1/auth/logout`
- `GET /api/v1/personas`
- `GET /api/v1/personas/{id}`
- `POST /api/v1/personas`
- `PUT /api/v1/personas/{id}`
- `DELETE /api/v1/personas/{id}`
- `POST /api/v1/personas/reset`

El esquema de seguridad `bearerAuth` representa el token Bearer y aparece documentado en el OpenAPI.
Para probar una operación desde el navegador:

1. Abrir `http://localhost:8080/swagger-ui/index.html`.
2. Ejecutar `POST /api/v1/auth/login` con las credenciales de demostración y copiar el `token`.
3. Pulsar **Authorize** e introducir el token en el esquema `bearerAuth`.
4. Desplegar el endpoint deseado y pulsar **Try it out**.
5. Rellenar los parámetros o el cuerpo JSON y pulsar **Execute**.

La documentación se genera a partir del código, por lo que no hay que mantenerla a mano: los cambios
en `PersonaController` y en los DTO se reflejan automáticamente. El título, la descripción y el
esquema `bearerAuth` se definen en `OpenApiConfig`; las rutas y el orden de operaciones se configuran
en `application.yml` bajo la clave `springdoc`.

> Swagger y `/v3/api-docs` están activos por defecto en `dev`, `pre` y `prod` para igualar el
> comportamiento local. Se pueden desactivar con `SPRINGDOC_ENABLED=false` antes de exponer un entorno
> real. En Docker/Kubernetes también se puede acceder por el puerto del frontend, que actúa como proxy.

## 10. Documentación relacionada

- [`SEGURIDAD.md`](SEGURIDAD.md): autologin, tokens Bearer, BCrypt y límites del modelo.
- [`PRUEBAS.md`](PRUEBAS.md): comandos y alcance de las pruebas de la API.
- [`OPERACION.md`](OPERACION.md): configuración, H2 y diagnóstico.
- [`MANUAL_USUARIO.md`](MANUAL_USUARIO.md): uso de la interfaz que consume esta API.
- [`ARQUITECTURA.md`](ARQUITECTURA.md): capas y modelo de datos.
