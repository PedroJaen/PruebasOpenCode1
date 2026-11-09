# Ejecución de PruebasOpenCode1

> Documento actualizado el 2026-11-09.

## 1. Requisitos previos

| Herramienta | Versión recomendada | Comprobación |
| --- | --- | --- |
| JDK | **21** (obligatorio) | `java -version` |
| Maven | No es necesario instalarlo: se usa Maven Wrapper | `.\mvnw.cmd -v` |
| Node.js | 20.19+ o 22.12+ (probado con 24) | `node -v` |
| npm | Incluido con Node.js | `npm -v` |
| Eclipse | 2024-06 o superior, con soporte Java 21 | — |
| Visual Studio Code | Cualquier versión reciente | — |
| Chrome o Edge | Para la prueba automática de interfaz | — |
| Docker Desktop / Docker Engine | 28 o superior, con Compose v2 | `docker --version` |
| kubectl | 1.32 o superior (incluye Kustomize) | `kubectl version --client` |

> En el entorno de verificación se utilizó Temurin JDK 21.0.13 y Maven 3.9.16 (gestionado por el
> wrapper). El proyecto no depende de esas rutas concretas.

## 2. Backend (`/back`)

### 2.1 Compilar y probar

Windows PowerShell:

```powershell
cd D:\PruebasOpenCode1\back
.\mvnw.cmd clean verify
```

Linux/macOS:

```bash
cd PruebasOpenCode1/back
chmod +x mvnw
./mvnw clean verify
```

El primer arranque descarga Maven y las dependencias. El resultado esperado es `BUILD SUCCESS` con
**34 pruebas** superadas (11 unitarias, 14 de integración de personas y 9 de autenticación) y el
artefacto `target/pruebasopencode1-back.jar`.

### 2.2 Perfiles

El backend usa `dev` cuando no se indica perfil. Los perfiles disponibles son:

| Perfil | Uso | Base de datos | Consola H2 | Swagger | TTL del token |
| --- | --- | --- | --- | --- | --- |
| `dev` | Desarrollo local (por defecto). | H2 en fichero. | Sí | Sí | `15m` |
| `test` | Pruebas automatizadas. | H2 en memoria, `create-drop`. | No | Sí | `15m` |
| `pre` | Preproducción simulada. | H2 en `./data/pre`, configurable. | No | No | `10m` |
| `prod` | Producción simulada. | H2 en `./data/prod`, configurable. | No | No | `5m` |

Se selecciona con `SPRING_PROFILES_ACTIVE`:

```powershell
$env:SPRING_PROFILES_ACTIVE = "dev"
.\mvnw.cmd spring-boot:run
```

En `pre` y `prod` las variables sensibles (`APP_AUTH_USERNAME`, `APP_AUTH_PASSWORD`, `DB_USERNAME`,
`DB_PASSWORD`, `CORS_ALLOWED_ORIGINS`) no tienen valores por defecto: el entorno debe inyectarlas.
La plantilla de variables está en `back/.env.example`.

### 2.3 Arrancar

Opción A, con Maven Wrapper:

```powershell
cd D:\PruebasOpenCode1\back
.\mvnw.cmd spring-boot:run
```

Opción B, con el JAR empaquetado:

```powershell
cd D:\PruebasOpenCode1\back
.\mvnw.cmd clean package
java -jar target\pruebasopencode1-back.jar
```

El backend queda disponible en:

- API: `http://localhost:8080/api/v1/personas`
- Salud: `http://localhost:8080/actuator/health`
- Consola H2: `http://localhost:8080/h2-console` (solo `dev`)
- Swagger UI: `http://localhost:8080/swagger-ui/index.html` (no en `pre`/`prod`)
- OpenAPI JSON: `http://localhost:8080/v3/api-docs` (no en `pre`/`prod`)

Swagger UI permite consultar y probar todos los endpoints desde el navegador (**Authorize** con el
token y **Try it out**). No requiere ninguna herramienta adicional: se genera automáticamente a
partir del código del backend.

Credenciales H2 por defecto en `dev`:

| Parámetro | Valor |
| --- | --- |
| JDBC URL | `jdbc:h2:file:./data/pruebasopencode1` |
| Usuario | `sa` |
| Contraseña | *(vacía)* |

La ruta `./data/...` es relativa al directorio desde el que se arranca el backend. Si se arranca
desde `back`, los ficheros quedan en `back/data/`.

> Actualización desde una versión anterior: al arrancar, `MigracionEsquema` elimina automáticamente
> la antigua columna `edad` de `personas`. No es necesario borrar `back/data`: la edad pasa a
> calcularse desde `fechaNacimiento`. Los registros antiguos pueden tener vacíos los campos de
> auditoría; los nuevos se rellenan automáticamente.

### 2.4 Importar en Eclipse

1. Abrir Eclipse con un JDK 21 configurado
   (`Window > Preferences > Java > Installed JREs`).
2. `File > Import... > Maven > Existing Maven Projects`.
3. Seleccionar la carpeta `D:\PruebasOpenCode1\back` y finalizar.
4. Esperar a que Eclipse descargue las dependencias de Maven.
5. Ejecutar `com.pruebasopencode1.personas.PruebasOpenCode1Application` con
   `Run As > Java Application`.

No se requiere ninguna configuración adicional ni plugin de Lombok. Si Eclipse usa Java 17, el
`maven-enforcer-plugin` detendrá la compilación con un mensaje claro indicando que se necesita
Java 21.

> **Importante:** el proyecto debe importarse como **Maven > Existing Maven Projects**, no como
> «Existing Projects into Workspace». Si se importa como proyecto Java genérico, Eclipse compila las
> clases pero no copia `src/main/resources/*.yml` a `target/classes`. En ese caso Spring Boot arranca
> con una base de datos H2 en memoria y falla al resolver propiedades como
> `app.cors.allowed-origins`.
>
> Para corregirlo:
>
> 1. Ejecutar `Maven > Update Project...` (o `Alt+F5`) sobre el proyecto `pruebasopencode1-back`.
> 2. Comprobar que existe `D:\PruebasOpenCode1\back\target\classes\application.yml`.
> 3. Si no existe, ejecutar desde la terminal `.\mvnw.cmd clean package` y volver a arrancar.
>
> Como alternativa, arrancar con `.\mvnw.cmd spring-boot:run`, que siempre usa los recursos del
> proyecto. Al arrancar, la aplicación deja un aviso en el log si detecta que falta
> `application.yml`.

### 2.5 Datos de prueba

Al arrancar con la base de datos vacía se insertan 10 personas de ejemplo. Para recuperarlas en
cualquier momento:

- Desde la interfaz: botón **Restablecer datos mock** (pide confirmación).
- Desde la API (con un token válido):

```powershell
$login = Invoke-RestMethod -Method Post http://localhost:8080/api/v1/auth/login `
  -ContentType "application/json" `
  -Body (@{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json)
Invoke-RestMethod -Method Post http://localhost:8080/api/v1/personas/reset `
  -Headers @{ Authorization = "Bearer $($login.token)" }
```

Para empezar desde cero, detener el backend y eliminar la carpeta `back/data`.

## 3. Frontend (`/front`)

### 3.1 Instalar y arrancar

```powershell
cd D:\PruebasOpenCode1\front
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

> Si PowerShell bloquea `npm.ps1` por la política de ejecución de scripts, usar `npm.cmd`:
> `npm.cmd install` y `npm.cmd run dev`.

El servidor de Vite redirige `/api` a `http://localhost:8080`. El backend debe estar en marcha para
que la pantalla de personas cargue datos. El frontend hace el autologin de forma transparente y
guarda el token solo en memoria.

La ruta `http://localhost:5173/documentacion` muestra la documentación viva del proyecto. No necesita
backend: su contenido se genera antes de arrancar Vite.

> `npm run dev` ejecuta automáticamente `npm run docs` (hook `predev`) para regenerar la página con el
> último contenido de `AGENTS.md`, `docs/*.md` y los informes de pruebas.

### 3.2 Abrir en Visual Studio Code

1. `File > Open Folder...` y seleccionar `D:\PruebasOpenCode1\front`.
2. Abrir la terminal integrada y ejecutar `npm install` y `npm run dev`.
3. Abrir `http://localhost:5173` en el navegador.

Extensiones recomendadas (opcionales): ESLint, Prettier y la extensión oficial de TypeScript. El
proyecto no requiere configuración adicional de VS Code.

### 3.3 Compilar para producción

```powershell
npm run build
npm run preview
```

- `npm run build` ejecuta la comprobación de tipos (`tsc --noEmit`) y genera `dist/`.
- `npm run preview` sirve el resultado en `http://localhost:4173` (sin proxy `/api`).
- En producción hay que definir `VITE_API_BASE_URL` antes de compilar, por ejemplo:
  `https://api.pre.pruebasopencode1.example.com/api/v1`.

### 3.4 Documentación viva

```powershell
npm run docs
```

Genera `src/content/documentacion.generated.ts` desde las fuentes reales:

- `AGENTS.md` y `docs/*.md` (incluido `docs/PROMPT.md`).
- Los tests de Java y los informes Surefire de `back/target/surefire-reports`.
- Las comprobaciones de `scripts/verificar-integracion.mjs` y `front/scripts/verificar-ui.mjs`.
- Los informes de PIT (`back/target/pit-reports`) o, si no existen, las cifras documentadas.

El hook `prebuild` también lo ejecuta, de modo que la página `/documentacion` del build siempre refleja
el estado actual. El archivo generado no debe editarse a mano.

### 3.5 Docker Compose y Kubernetes

La guía completa está en [`DESPLIEGUE.md`](DESPLIEGUE.md) y en `deploy/README.md`.

```powershell
# Construir imágenes de PRE
Copy-Item deploy\docker\.env.pre.example deploy\docker\.env.pre
.\deploy\docker\construir.ps1 -Entorno pre

# Arrancar PRE (front 8088, API directa 8081)
.\deploy\docker\levantar.ps1 -Entorno pre -Reconstruir

# Detener
.\deploy\docker\parar.ps1 -Entorno pre
```

Para PRO se usa `.env.pro` y los puertos 8098/8091. Ambos entornos pueden ejecutarse a la vez.

> Si PowerShell bloquea los scripts (política de ejecución), se pueden lanzar con
> `powershell -ExecutionPolicy Bypass -File .\deploy\docker\levantar.ps1 -Entorno pre` o ejecutar
> directamente `docker compose --env-file deploy\docker\.env.pre -f deploy\docker\docker-compose.yml up -d`.

Kubernetes:

```powershell
kubectl apply -f deploy/k8s/overlays/pre/namespace.yaml
kubectl -n pruebasopencode1-pre create secret generic pruebasopencode1-secrets `
  --from-literal=DB_USERNAME=sa `
  --from-literal=DB_PASSWORD='...' `
  --from-literal=APP_AUTH_USERNAME='...' `
  --from-literal=APP_AUTH_PASSWORD='...'
kubectl apply -k deploy/k8s/overlays/pre
kubectl -n pruebasopencode1-pre rollout status deployment/back
```

Antes de aplicar en un clúster real hay que publicar las imágenes en un registro, ajustar el
`Ingress`, el TLS y la `StorageClass`. La verificación sin clúster se ejecuta con:

```powershell
node scripts\verificar-despliegue.mjs
```

## 4. Pruebas y verificación

La estrategia completa, el alcance de cada suite y los resultados esperados están en
[`PRUEBAS.md`](PRUEBAS.md).

### 4.1 Backend

```powershell
cd D:\PruebasOpenCode1\back
.\mvnw.cmd clean verify
```

Incluye:

- `PersonaServiceImplTest`: 11 pruebas unitarias de la lógica de negocio.
- `PersonaControllerIntegrationTest`: 14 pruebas de integración (CRUD, reset, validaciones, 404,
  CORS, Swagger y auditoría).
- `AuthControllerIntegrationTest`: 9 pruebas de autenticación (401 sin token, login, token con
  expiración, acceso con token, credenciales inválidas, token inválido, contraseña BCrypt en H2,
  logout que revoca el token y consulta de sesión con y sin token).

### 4.2 Frontend

```powershell
cd D:\PruebasOpenCode1\front
npm run typecheck
npm run build
```

### 4.3 Integración completa

Con backend y frontend arrancados, desde la raíz:

```powershell
node scripts\verificar-integracion.mjs
```

Comprueba a través del proxy de Vite: `401` sin token, autologin, salud, CORS, listado, reset,
creación, consulta, edición, validaciones, auditoría, eliminación, logout con revocación y reset final
(**18 comprobaciones**).

> Ejecutar esta suite **antes** que la de interfaz. Ambas hacen reset de datos y no deben correr en
> paralelo.

### 4.4 Prueba de interfaz con navegador real

Con backend y frontend arrancados, y después de la suite de integración:

```powershell
cd D:\PruebasOpenCode1\front
npm run test:ui
```

Usa Chrome o Edge instalado en el sistema mediante `playwright-core`, sin descargar navegadores.
Valida bienvenida, autologin transparente, listado, búsqueda, creación, edición, eliminación,
confirmaciones, reset, validaciones, persistencia del tema oscuro y consola sin errores
(**14 comprobaciones**). Si el navegador está en una ruta no estándar:

```powershell
$env:CHROME_PATH = "C:\ruta\a\chrome.exe"
npm run test:ui
```

### 4.5 Mutation testing

Opcional, fuera de `clean verify` para no alargar el ciclo normal:

```powershell
cd D:\PruebasOpenCode1\back
.\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage
```

Analiza `PersonaServiceImpl` y `PersonaMapper` con las pruebas unitarias del servicio. El resultado
esperado es `BUILD SUCCESS` con **21/21 mutaciones detectadas**. El informe HTML queda en
`back/target/pit-reports/index.html`. La configuración y los umbrales del 90 % están en `pom.xml`.
Incluir `test-compile` evita analizar clases de prueba obsoletas.

### 4.6 Despliegue

```powershell
node scripts\verificar-despliegue.mjs
```

Valida los Dockerfiles, Nginx, Docker Compose PRE/PRO y los overlays Kustomize. No necesita el motor
de Docker arrancado ni un clúster. El resultado esperado es **40/40 comprobaciones** y el informe
`deploy/verificacion-despliegue.json`.

## 5. Variables de entorno

### 5.1 Backend

| Variable | Valor por defecto | Descripción |
| --- | --- | --- |
| `SPRING_PROFILES_ACTIVE` | `dev` | Perfil activo: `dev`, `test`, `pre` o `prod`. |
| `SERVER_PORT` | `8080` | Puerto HTTP. |
| `DB_URL` | `jdbc:h2:file:./data/pruebasopencode1` (`dev`) | URL JDBC de H2. |
| `DB_USERNAME` | `sa` (`dev`/`test`) | Usuario de la base de datos. Obligatorio en `pre`/`prod`. |
| `DB_PASSWORD` | *(vacía)* (`dev`/`test`) | Contraseña de la base de datos. Obligatoria en `pre`/`prod`. |
| `JPA_DDL_AUTO` | `update` | Estrategia de creación del esquema. |
| `JPA_SHOW_SQL` | `false` | Muestra SQL en los logs. |
| `H2_CONSOLE_ENABLED` | `true` (`dev`) | Activa la consola H2. |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` (`dev`/`test`) | Orígenes permitidos. Obligatorio en `pre`/`prod`. |
| `SEED_MOCK_DATA` | `true` (`dev`), `false` (`pre`/`prod`) | Siembra inicial si la base de datos está vacía. |
| `APP_AUTH_USERNAME` | `demo` (`dev`/`test`) | Usuario del autologin. Obligatorio en `pre`/`prod`. |
| `APP_AUTH_PASSWORD` | `demo1234` (`dev`/`test`) | Contraseña usada para generar el hash BCrypt. Obligatoria en `pre`/`prod`. |
| `APP_AUTH_ROLE` | `USER` | Rol asignado al usuario. |
| `APP_AUTH_TOKEN_TTL` | `15m` (`dev`/`test`), `10m` (`pre`), `5m` (`prod`) | Vigencia del token Bearer. |
| `SPRINGDOC_ENABLED` | `true` (`dev`/`test`), `false` (`pre`/`prod`) | Activa Swagger UI y `/v3/api-docs`. |
| `LOG_LEVEL` | `INFO` (`dev`), `WARN` (`pre`/`prod`) | Nivel de log del paquete de la aplicación. |

Ejemplo:

```powershell
$env:SERVER_PORT = "9090"
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173"
$env:APP_AUTH_TOKEN_TTL = "20m"
.\mvnw.cmd spring-boot:run
```

La plantilla completa está en `back/.env.example`. Los ficheros `.env` reales están excluidos por
`.gitignore`.

### 5.2 Frontend

| Variable | Valor por defecto | Descripción |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api/v1` | URL base de la API usada por el cliente. |
| `VITE_PROXY_TARGET` | `http://localhost:8080` | Destino del proxy de desarrollo. |
| `VITE_AUTH_USERNAME` | `demo` | Usuario del autologin transparente. |
| `VITE_AUTH_PASSWORD` | `demo1234` | Contraseña del autologin transparente. |

Ejemplo para usar otro puerto de backend:

```powershell
$env:VITE_PROXY_TARGET = "http://localhost:9090"
npm run dev
```

Las variables del frontend se leen en tiempo de compilación; hay que reiniciar Vite tras cambiarlas.
El fichero `front/.env.example` documenta los valores disponibles.

## 6. Comprobaciones rápidas

```powershell
# Salud del backend (público)
Invoke-RestMethod http://localhost:8080/actuator/health

# Autologin: guarda el token en $login
$credenciales = @{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/v1/auth/login `
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
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/v1/personas `
  -ContentType "application/json" -Body $cuerpo -Headers $cabecera

# Restablecer datos mock
Invoke-RestMethod -Method Post http://localhost:8080/api/v1/personas/reset -Headers $cabecera
```

Sin el paso de autologin, las rutas `/api/**` distintas de `/api/v1/auth/**` devuelven `401`. El
frontend hace ese login de forma transparente al entrar en `/personas`.

## 7. Problemas frecuentes

| Problema | Causa / solución |
| --- | --- |
| `release version 21 not supported` | Eclipse o Maven usan Java 17. Configurar un JDK 21 y `JAVA_HOME`. |
| `Could not resolve placeholder 'app.cors.allowed-origins'` | Eclipse no copió `src/main/resources` al classpath. Importar como proyecto Maven, ejecutar `Maven > Update Project` y comprobar `target/classes/application.yml`; si falta, `.\mvnw.cmd clean package`. |
| Al arrancar aparece H2 en memoria (`jdbc:h2:mem:...`) | Misma causa: falta `application.yml` en el classpath. Seguir los pasos anteriores o usar `.\mvnw.cmd spring-boot:run`. |
| `Port 8080 was already in use` | Cambiar `SERVER_PORT` o detener el proceso que ocupa el puerto. |
| `Port 5173 is in use` | Vite usa `strictPort`; detener el proceso anterior o cambiar el puerto en `vite.config.ts`. |
| El frontend muestra «No se pudo conectar» | El backend no está arrancado o el proxy apunta a otro puerto. |
| La API devuelve `401` al probarla a mano | Falta el token: ejecutar `POST /api/v1/auth/login` y enviar `Authorization: Bearer <token>`. |
| El autologin falla con `401` | `VITE_AUTH_USERNAME` / `VITE_AUTH_PASSWORD` no coinciden con `APP_AUTH_USERNAME` / `APP_AUTH_PASSWORD`. |
| La sesión caduca continuamente | Revisar `APP_AUTH_TOKEN_TTL`; el frontend renueva 60 s antes de la caducidad. |
| Error de CORS | Añadir el origen del frontend a `CORS_ALLOWED_ORIGINS`. |
| `Database may be already in use` (H2) | Solo un proceso puede usar el fichero H2; cerrar la otra instancia. |
| La consola H2 no carga | Verificar `H2_CONSOLE_ENABLED=true` y el perfil `dev`; en `pre`/`prod` está desactivada. |
| `npm.ps1 cannot be loaded` | Usar `npm.cmd` o ajustar la política de ejecución de PowerShell. |
| La prueba UI no encuentra el navegador | Definir `CHROME_PATH` con la ruta de Chrome o Edge. |
| Las suites E2E/UI fallan con `409` o `500` | No ejecutarlas en paralelo: ambas hacen reset. Ejecutar integración y después UI. |
| Se quieren borrar todos los datos | Detener el backend y eliminar `back/data`. |

## 8. Documentación relacionada

- [`PROMPT.md`](PROMPT.md): prompt de reconstrucción de la aplicación.
- [`PRUEBAS.md`](PRUEBAS.md): estrategia y comandos de prueba.
- [`SEGURIDAD.md`](SEGURIDAD.md): autologin, tokens Bearer y contraseña cifrada.
- [`MANUAL_USUARIO.md`](MANUAL_USUARIO.md): uso de la interfaz.
- [`OPERACION.md`](OPERACION.md): configuración, H2, copias, migración y diagnóstico.
- [`API.md`](API.md): endpoints y contratos.
- [`DESPLIEGUE.md`](DESPLIEGUE.md): preparación para PRE y PRO.
