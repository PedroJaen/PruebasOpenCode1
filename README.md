# PruebasOpenCode1

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
- API versionada en `/api/v1` con autologin transparente mediante **tokens Bearer** de corta duración.
- Contraseña del usuario cifrada con **BCrypt** en H2.
- **Auditoría JPA** de creación y modificación (quién y cuándo).
- Edad calculada automáticamente desde la fecha de nacimiento; no se almacena en la base de datos.
- Tema claro, oscuro o `sistema`, persistido en el navegador.
- `ErrorBoundary` de React para errores de renderizado.
- Perfiles `dev`, `test`, `pre` y `prod` con configuración externalizada y secretos fuera del repositorio.
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

```text
PruebasOpenCode1/
├── back/       API REST en Spring Boot
├── front/      SPA en React + TypeScript + Vite
├── docs/       Documentación general, prompt de reconstrucción y seguimiento
├── deploy/     Dockerfiles, Compose y manifiestos Kustomize PRE/PRO
├── scripts/    Verificación de integración y de despliegue
└── AGENTS.md   Reglas del proyecto
```

## Inicio rápido

### Requisitos

- JDK 21.
- Node.js 20.19+ (probado con Node 24).
- No es necesario instalar Maven: se incluye Maven Wrapper.

### 1. Backend

```powershell
cd back
.\mvnw.cmd spring-boot:run
```

- API: `http://localhost:8080/api/v1/personas`
- Salud: `http://localhost:8080/actuator/health`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- Consola H2 (solo `dev`): `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/pruebasopencode1`
  - Usuario: `sa`
  - Contraseña: vacía

El backend arranca con el perfil `dev` por defecto. Se puede seleccionar otro perfil con
`SPRING_PROFILES_ACTIVE` (`dev`, `test`, `pre`, `prod`). Las variables de entorno de referencia están
en `back/.env.example`; los ficheros `.env` reales no se versionan.

### 2. Frontend

En otra terminal:

```powershell
cd front
npm install
npm run dev
```

Abrir `http://localhost:5173`.

- `/` — bienvenida y acceso a la gestión.
- `/personas` — listado, creación, edición, eliminación y reset. El autologin se ejecuta de forma
  transparente la primera vez que se entra.
- `/documentacion` — prompt de reconstrucción, documentación, `AGENTS.md` y tablas de resultados.

> En Windows, si PowerShell bloquea `npm.ps1`, usar `npm.cmd`.

## Compilación y pruebas

```powershell
# Backend: compilación + 34 pruebas
cd back
.\mvnw.cmd clean verify

# Mutation testing opcional (servicio y mapper)
.\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage

# Frontend: tipos + build de producción
cd ..\front
npm run build

# Regenerar la página /documentacion desde las fuentes
npm run docs

# Con ambos servidores arrancados:
# 18 comprobaciones de integración a través del proxy de Vite
cd ..
node scripts\verificar-integracion.mjs

# 14 comprobaciones de interfaz en navegador real (requiere backend y frontend)
cd front
npm run test:ui
```

> Ejecutar la suite de integración **antes** que la de interfaz: ambas restablecen los datos mock y no
> deben ejecutarse en paralelo.

Resultados de la última verificación: **BUILD SUCCESS**, 34 pruebas de backend (11 unitarias, 14 de
integración de personas y 9 de autenticación), 18 comprobaciones de integración y 14 de interfaz, sin
errores en consola. PIT detecta **21/21 mutaciones (100 %)** en el servicio y el mapper. El detalle
está en [`docs/SEGUIMIENTO.md`](docs/SEGUIMIENTO.md) y la estrategia de pruebas en
[`docs/PRUEBAS.md`](docs/PRUEBAS.md).

## Docker y Kubernetes (PRE/PRO)

El proyecto incluye imágenes y manifiestos listos para PRE y PRO:

```powershell
# Construir imágenes de PRE
Copy-Item deploy\docker\.env.pre.example deploy\docker\.env.pre
.\deploy\docker\construir.ps1 -Entorno pre

# Arrancar PRE: front http://localhost:8088 · API directa http://localhost:8081
.\deploy\docker\levantar.ps1 -Entorno pre -Reconstruir

# PRO: front http://localhost:8098 · API directa http://localhost:8091
Copy-Item deploy\docker\.env.pro.example deploy\docker\.env.pro
.\deploy\docker\levantar.ps1 -Entorno pro -Reconstruir
```

Kubernetes:

```powershell
kubectl apply -f deploy/k8s/overlays/pre/namespace.yaml
kubectl -n pruebasopencode1-pre create secret generic pruebasopencode1-secrets `
  --from-literal=DB_USERNAME=sa --from-literal=DB_PASSWORD='...' `
  --from-literal=APP_AUTH_USERNAME='...' --from-literal=APP_AUTH_PASSWORD='...'
kubectl apply -k deploy/k8s/overlays/pre
```

La validación sin clúster se ejecuta con `node scripts\verificar-despliegue.mjs` (**40/40**). La guía
completa, las diferencias PRE/PRO y las limitaciones de H2 y de los tokens están en
[`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) y [`deploy/README.md`](deploy/README.md).

## Documentación

- [Prompt de reconstrucción](docs/PROMPT.md): instrucciones completas para recrear la aplicación.
- [Seguimiento del proyecto](docs/SEGUIMIENTO.md): plan, resultados, decisiones e incidencias.
- [Arquitectura](docs/ARQUITECTURA.md): estructura, capas, modelo de datos y decisiones técnicas.
- [Seguridad](docs/SEGURIDAD.md): autologin transparente, tokens Bearer, BCrypt y límites del modelo.
- [Ejecución local](docs/EJECUCION.md): requisitos, arranque desde Eclipse/VS Code y problemas frecuentes.
- [API REST](docs/API.md): endpoints `/api/v1`, contratos, errores RFC 9457 y ejemplos.
- [Pruebas](docs/PRUEBAS.md): estrategia, suites, mutation testing, comandos y resultados esperados.
- [Manual de usuario](docs/MANUAL_USUARIO.md): uso de la interfaz, tema y avisos de sesión.
- [Operación](docs/OPERACION.md): configuración, H2, copias, migración, logs y diagnóstico.
- [Despliegue](docs/DESPLIEGUE.md): Docker Compose y Kubernetes con overlays PRE/PRO verificados.

La ruta `/documentacion` del frontend reúne el prompt, estos documentos, `AGENTS.md` y una tabla por
tipo de prueba. Su contenido se genera con `npm run docs` desde las fuentes reales, por lo que no debe
editarse a mano.

## Configuración

El backend se configura por variables de entorno con valores por defecto para desarrollo
(`SERVER_PORT`, `DB_URL`, `CORS_ALLOWED_ORIGINS`, `SEED_MOCK_DATA`, `APP_AUTH_USERNAME`,
`APP_AUTH_PASSWORD`, `APP_AUTH_TOKEN_TTL`, etc.). En `pre` y `prod` los secretos no tienen valor por
defecto y deben inyectarse desde el entorno. El frontend usa `VITE_API_BASE_URL`,
`VITE_PROXY_TARGET`, `VITE_AUTH_USERNAME` y `VITE_AUTH_PASSWORD`; hay un ejemplo en
`front/.env.example`.

## Notas

- La base de datos H2 se guarda en `back/data/` al arrancar desde esa carpeta.
- La edad no se guarda en la tabla `personas`: se calcula desde `fechaNacimiento` y la fecha actual.
- Al arrancar, el backend elimina automáticamente la antigua columna `edad` si existe. No hace falta
  borrar `back/data` al actualizar desde una versión anterior.
- Las filas creadas antes de la auditoría conservan sus campos de auditoría a `null`; las nuevas y las
  del reset se rellenan automáticamente.
- El restablecimiento de datos mock restablece el contenido, no la secuencia de identificadores.
- Las credenciales del autologin son fijas y de demostración (`demo` / `demo1234`); no son aptas para
  producción. El token se guarda solo en memoria y el backend es sin estado. El detalle del modelo
  está en [`docs/SEGURIDAD.md`](docs/SEGURIDAD.md).
- Las imágenes Docker y los manifiestos de Kubernetes para PRE y PRO están implementados y validados.
  No se ha desplegado en un clúster real; H2 exige una sola réplica de backend y volumen persistente.
  Véase [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md).
