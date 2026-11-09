# Operación y mantenimiento de PruebasOpenCode1

> Documento actualizado el 2026-11-09.
>
> **Alcance:** operación local y preparación para entornos futuros. No describe un despliegue real en
> PRE o PRO; para eso, véase [`DESPLIEGUE.md`](DESPLIEGUE.md).

## 1. Componentes en ejecución

| Componente | Puerto por defecto | Descripción |
| --- | --- | --- |
| Backend Spring Boot | `8080` | API REST `/api/v1`, Actuator, Swagger UI y consola H2. |
| Frontend Vite | `5173` | SPA en desarrollo con proxy `/api` hacia el backend. |
| Frontend compilado | `4173` | Servidor de previsualización de `dist/`; no incluye proxy. |
| H2 | — | Base de datos en fichero, usada por el backend. |

En desarrollo, el navegador habla con Vite y Vite redirige las peticiones `/api/**` al backend. El
backend también admite peticiones directas mediante CORS configurable. La autenticación se realiza con
un **token Bearer** que el frontend guarda en memoria y envía en la cabecera `Authorization`.

## 2. Configuración

### 2.1 Backend

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| `SPRING_PROFILES_ACTIVE` | `dev` | Perfil activo: `dev`, `test`, `pre` o `prod`. |
| `SERVER_PORT` | `8080` | Puerto HTTP. |
| `DB_URL` | `jdbc:h2:file:./data/pruebasopencode1` (`dev`) | URL JDBC de H2. |
| `DB_USERNAME` | `sa` (`dev`/`test`) | Usuario de la base de datos. Obligatorio en `pre`/`prod`. |
| `DB_PASSWORD` | *(vacía)* (`dev`/`test`) | Contraseña de la base de datos. Obligatoria en `pre`/`prod`. |
| `JPA_DDL_AUTO` | `update` | Estrategia de esquema de Hibernate. |
| `JPA_SHOW_SQL` | `false` | Muestra el SQL ejecutado en los logs. |
| `H2_CONSOLE_ENABLED` | `true` (`dev`) | Activa la consola H2 en `/h2-console`. |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` (`dev`/`test`) | Orígenes permitidos, separados por comas. Obligatorio en `pre`/`prod`. |
| `SEED_MOCK_DATA` | `true` (`dev`), `false` (`pre`/`prod`) | Siembra los 10 datos mock si la tabla está vacía. |
| `APP_AUTH_USERNAME` | `demo` (`dev`/`test`) | Usuario del autologin. Obligatorio en `pre`/`prod`. |
| `APP_AUTH_PASSWORD` | `demo1234` (`dev`/`test`) | Contraseña usada para generar el hash BCrypt. Obligatoria en `pre`/`prod`. |
| `APP_AUTH_ROLE` | `USER` | Rol del usuario. |
| `APP_AUTH_TOKEN_TTL` | `15m` (`dev`/`test`), `10m` (`pre`), `5m` (`prod`) | Vigencia del token Bearer. |
| `SPRINGDOC_ENABLED` | `true` (`dev`/`test`), `false` (`pre`/`prod`) | Activa Swagger UI y `/v3/api-docs`. |
| `LOG_LEVEL` | `INFO` (`dev`), `WARN` (`pre`/`prod`) | Nivel de log del paquete de la aplicación. |

Ejemplo:

```powershell
$env:SERVER_PORT = "9090"
$env:H2_CONSOLE_ENABLED = "false"
$env:APP_AUTH_TOKEN_TTL = "20m"
cd D:\PruebasOpenCode1\back
.\mvnw.cmd spring-boot:run
```

La plantilla completa está en `back/.env.example`. Los ficheros `.env` reales están excluidos por
`.gitignore`.

### 2.2 Frontend

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api/v1` | URL base de la API usada por el cliente. |
| `VITE_PROXY_TARGET` | `http://localhost:8080` | Destino del proxy de desarrollo. |
| `VITE_AUTH_USERNAME` | `demo` | Usuario del autologin transparente. |
| `VITE_AUTH_PASSWORD` | `demo1234` | Contraseña del autologin transparente. |

Las variables de Vite se resuelven al arrancar o compilar; hay que reiniciar el servidor tras
cambiarlas. El fichero `front/.env.example` contiene valores de referencia.

## 3. Arranque y parada

### 3.1 Desarrollo local

```powershell
# Terminal 1: backend
cd D:\PruebasOpenCode1\back
.\mvnw.cmd spring-boot:run

# Terminal 2: frontend
cd D:\PruebasOpenCode1\front
npm.cmd run dev
```

También se pueden arrancar desde Eclipse (backend) y VS Code (frontend). Las instrucciones detalladas
están en [`EJECUCION.md`](EJECUCION.md).

Para detener los procesos, usar `Ctrl+C` en cada terminal o el botón de parada del IDE. Antes de
copiar o restaurar la base de datos, detener siempre el backend.

### 3.2 Comprobaciones tras el arranque

```powershell
# Salud del backend (público)
Invoke-RestMethod http://localhost:8080/actuator/health

# Autologin: obtiene el token
$login = Invoke-RestMethod -Method Post http://localhost:8080/api/v1/auth/login `
  -ContentType "application/json" `
  -Body (@{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json)
$cabecera = @{ Authorization = "Bearer $($login.token)" }

# Listado de personas (autenticado)
Invoke-RestMethod http://localhost:8080/api/v1/personas -Headers $cabecera

# Estado de la sesión
Invoke-RestMethod http://localhost:8080/api/v1/auth/sesion -Headers $cabecera

# Swagger UI
Start-Process http://localhost:8080/swagger-ui/index.html
```

Sin token, `GET /api/v1/personas` devuelve `401` con un `ProblemDetail`.

## 4. Base de datos H2

### 4.1 Ubicación

La URL por defecto es relativa al directorio desde el que se arranca el backend:

- Si se arranca desde `back`, los ficheros quedan en `back/data/`.
- El fichero principal es `pruebasopencode1.mv.db`.
- Pueden aparecer ficheros auxiliares de trazas o bloqueo.

Solo un proceso puede abrir el fichero H2 a la vez. Si aparece `Database may be already in use`,
detener la otra instancia del backend.

### 4.2 Copia de seguridad

1. Detener el backend.
2. Copiar el fichero `back/data/pruebasopencode1.mv.db` a una ubicación segura.
3. Volver a arrancar el backend.

La copia contiene datos personales de prueba y el hash de credenciales; debe almacenarse con las
mismas precauciones que cualquier base de datos real.

### 4.3 Restauración

1. Detener el backend.
2. Guardar una copia del fichero actual, si se quiere conservar.
3. Sustituir `pruebasopencode1.mv.db` por la copia de seguridad.
4. Arrancar el backend.

### 4.4 Restablecer el contenido

- Para recuperar los 10 datos mock sin detener el backend:

  ```powershell
  $login = Invoke-RestMethod -Method Post http://localhost:8080/api/v1/auth/login `
    -ContentType "application/json" `
    -Body (@{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json)
  Invoke-RestMethod -Method Post http://localhost:8080/api/v1/personas/reset `
    -Headers @{ Authorization = "Bearer $($login.token)" }
  ```

- Para borrar completamente la base de datos local:

  1. Detener el backend.
  2. Eliminar la carpeta `back/data/`.
  3. Arrancar el backend; se creará una base nueva y se sembrarán los datos mock.

El reset restablece el contenido, pero no reinicia necesariamente la secuencia de identificadores.
Tampoco reinicia la tabla de usuarios ni los tokens activos.

## 5. Migración del esquema

El esquema se actualiza con `spring.jpa.hibernate.ddl-auto=update`. Este modo añade columnas y tablas
nuevas, pero no elimina columnas antiguas.

`MigracionEsquema` se ejecuta al arrancar y elimina la antigua columna `edad` de la tabla `personas`
cuando existe. La edad ya no se almacena: se calcula desde `fechaNacimiento`.

La auditoría añade las columnas `creado_en`, `actualizado_en`, `creado_por` y `actualizado_por` con
`ddl-auto=update`. Las filas anteriores a la auditoría las conservan a `null`; los registros nuevos y
los del reset se rellenan automáticamente.

Consecuencias prácticas:

- Al actualizar desde una versión anterior **no es necesario borrar** `back/data`.
- La migración se ejecuta antes de la siembra inicial de datos mock.
- Es una migración ligera específica de H2, pensada para desarrollo.
- Para PRE/PRO se recomienda sustituirla por Flyway o Liquibase.

Comprobación manual de las columnas:

```sql
SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE LOWER(TABLE_NAME) = 'personas'
ORDER BY ORDINAL_POSITION;
```

No debe aparecer la columna `EDAD`; sí deben aparecer las cuatro columnas de auditoría.

## 6. Logs y diagnóstico

- Los logs se muestran en la consola o en la vista de consola del IDE.
- `LOG_LEVEL=DEBUG` aumenta el detalle de la aplicación.
- `JPA_SHOW_SQL=true` muestra el SQL de Hibernate.
- `GET /actuator/health` devuelve el estado general.
- `GET /actuator/health/liveness` y `/actuator/health/readiness` están preparados para Kubernetes.
- `/swagger-ui/index.html` y `/v3/api-docs` permiten revisar y probar la API (`dev`/`test`).
- `/h2-console` permite inspeccionar la base de datos en desarrollo.
- `POST /api/v1/auth/logout` revoca el token actual; sirve para comprobar el ciclo de vida.

Credenciales H2 locales:

| Parámetro | Valor |
| --- | --- |
| JDBC URL | `jdbc:h2:file:./data/pruebasopencode1` |
| Usuario | `sa` |
| Contraseña | *(vacía)* |

## 7. Rutina de comprobación

Antes de dar por buena una instalación local:

1. `GET /actuator/health` responde `UP`.
2. `POST /api/v1/auth/login` devuelve un token y `GET /api/v1/auth/sesion` lo confirma.
3. `GET /api/v1/personas` con token devuelve datos; sin token devuelve `401`.
4. La SPA carga en `http://localhost:5173`.
5. Crear, editar, eliminar y restablecer funcionan.
6. La edad mostrada coincide con la fecha de nacimiento.
7. Los campos de auditoría aparecen en los registros nuevos.
8. No hay errores en la consola del navegador.
9. Los logs no muestran excepciones ni errores de base de datos.

## 8. Problemas frecuentes

| Problema | Causa probable / solución |
| --- | --- |
| `Port 8080 was already in use` | Otro backend está arrancado. Detenerlo o cambiar `SERVER_PORT`. |
| `Port 5173 is in use` | Vite usa `strictPort`; detener el proceso anterior o cambiar el puerto. |
| El frontend muestra «No se pudo conectar» | Backend detenido o proxy apuntando a otro puerto. |
| Error de CORS | Añadir el origen del frontend a `CORS_ALLOWED_ORIGINS`. |
| `Database may be already in use` | Solo un proceso puede usar el fichero H2. Cerrar la otra instancia. |
| H2 arranca en memoria | Falta `application.yml` en el classpath; revisar `EJECUCION.md`. |
| La consola H2 no carga | Comprobar `H2_CONSOLE_ENABLED=true` y perfil `dev`. |
| La API devuelve `401` al probarla a mano | Falta el token: hacer `POST /api/v1/auth/login` y enviar `Authorization: Bearer <token>`. |
| El autologin falla con `401` | `VITE_AUTH_USERNAME`/`VITE_AUTH_PASSWORD` no coinciden con `APP_AUTH_*`. |
| La sesión caduca continuamente | Revisar `APP_AUTH_TOKEN_TTL`; el frontend renueva 60 s antes. |
| Los avisos de sesión aparecen tras reiniciar el backend | Esperado: los tokens viven en memoria y el frontend se reautentica. |
| No aparece la columna `edad` | Es el comportamiento esperado: la edad se calcula. |
| Los datos no cambian tras editar | Comprobar que el backend no está usando otra base de datos u otro puerto. |

## 9. Seguridad y buenas prácticas

- La API usa tokens Bearer opacos de corta duración; el backend es sin estado.
- Las credenciales del autologin son fijas y de demostración; no son secretos reales.
- En `pre` y `prod` los secretos (`DB_*`, `APP_AUTH_*`, `CORS_ALLOWED_ORIGINS`) deben inyectarse desde
  el entorno; no tienen valor por defecto.
- La consola H2 y Swagger están desactivados fuera de desarrollo: `H2_CONSOLE_ENABLED=false` y
  `SPRINGDOC_ENABLED=false` en `pre`/`prod`.
- No exponer el puerto de H2 ni el fichero `.mv.db`.
- No incluir contraseñas ni rutas específicas en el repositorio; usar variables de entorno y mantener
  los `.env` fuera de control de versiones.
- Revisar `CORS_ALLOWED_ORIGINS` antes de publicar el frontend.
- Las copias de seguridad contienen datos personales y hashes: cifrarlas y limitar su acceso.
- Antes de un despliegue real, añadir autenticación individual, TLS, gestión de secretos, una base de
  datos adecuada y revisar CSRF si se introducen cookies.

## 10. Preparación para PRE y PRO

La configuración está externalizada para no modificar el código al cambiar de entorno. Antes de
desplegar:

1. Definir las variables de entorno de cada entorno (incluidos los secretos).
2. Decidir la base de datos: H2 con volumen persistente o una base externa.
3. Definir cómo se comparten los tokens si hay varias réplicas (almacén compartido o JWT).
4. Configurar copias de seguridad y retención.
5. Añadir TLS y una revisión de seguridad.
6. Sustituir la migración ligera por Flyway o Liquibase.
7. Revisar sondas, recursos, réplicas y límites en Kubernetes.

El diseño previsto se detalla en [`DESPLIEGUE.md`](DESPLIEGUE.md).

## 11. Mantenimiento

- Antes de actualizar dependencias, ejecutar `mvnw clean verify` y `npm run build`.
- Tras cambios en la lógica de negocio o el mapper, ejecutar PIT con
  `mvnw -B test-compile org.pitest:pitest-maven:mutationCoverage` y revisar
  `target/pit-reports/index.html`.
- Revisar la compatibilidad de springdoc con la versión de Spring Boot antes de actualizarlo.
- Ejecutar las pruebas de integración y de interfaz (en ese orden) tras cambios funcionales.
- Regenerar la documentación viva con `npm run docs` tras modificar documentos o pruebas.
- Actualizar `docs/SEGUIMIENTO.md` y este documento cuando cambien la configuración o el
  procedimiento de operación.
