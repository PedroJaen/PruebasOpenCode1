# Despliegue de PruebasOpenCode1 en Docker y Kubernetes

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

```text
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
```

Decisiones clave:

| Decisión | Motivo |
| --- | --- |
| Dos imágenes independientes | Backend y frontend tienen ciclos de vida y escalado distintos. |
| Nginx sirve la SPA y proxifica `/api` | La API y la interfaz comparten origen; se evita CORS en el navegador. |
| Backend sin root (UID 10001) | Reduce privilegios dentro del contenedor. |
| Nginx `nginx-unprivileged` en el puerto 8080 | No necesita root ni capacidades para escuchar en un puerto privilegiado. |
| Configuración en tiempo de ejecución | La misma imagen de backend sirve para PRE y PRO. |
| H2 con PVC y una réplica | H2 en fichero no admite escrituras concurrentes de varias instancias. |
| Kustomize base + overlays | Evita duplicar manifiestos y hace explícitas las diferencias PRE/PRO. |

## 3. Estructura

```text
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
```

La raíz incorpora `.dockerignore`, que excluye `.git`, dependencias, builds, datos H2 y ficheros
`.env`.

## 4. Imágenes Docker

### 4.1 Backend

`deploy/docker/back.Dockerfile` usa dos etapas:

1. `maven:3.9.11-eclipse-temurin-21` compila con Maven Wrapper y genera
   `target/pruebasopencode1-back.jar` sin ejecutar pruebas.
2. `eclipse-temurin:21-jre-alpine` ejecuta el JAR con un usuario `app` (UID/GID 10001).

Características:

- `JAVA_OPTS` con `-XX:MaxRAMPercentage=75` y salida ante `OutOfMemoryError`.
- Directorio `/app/data` preparado para el volumen H2.
- Sin secretos ni ficheros de entorno en la imagen.
- `SPRING_PROFILES_ACTIVE` se define en el orquestador.

### 4.2 Frontend

`deploy/docker/front.Dockerfile` usa dos etapas:

1. `node:24-alpine` ejecuta `npm ci` y `npm run build`. El contexto incluye `AGENTS.md`, `docs/`,
   `scripts/` y los tests de Java porque `npm run build` regenera la documentación viva.
2. `nginxinc/nginx-unprivileged:1.27-alpine` sirve `dist/` en el puerto 8080.

`nginx.conf` incluye:

- Fallback de SPA: `try_files $uri $uri/ /index.html`.
- Proxy `/api/` a `http://back:8080`.
- `/healthz` para sondas.
- Cabeceras de seguridad, caché de assets con hash y `no-cache` para `index.html`.

### 4.3 Construcción de las imágenes

#### Requisitos

- Docker Desktop o Docker Engine con Compose v2 en funcionamiento.
- Conexión a Internet en la primera construcción para descargar las imágenes base y las dependencias.
- Ejecutar los comandos desde la **raíz del repositorio**.
- No hace falta JDK ni Node instalados en el host: las dos imágenes se construyen en etapas
  multi-stage dentro de Docker.
- Un fichero `.env.<entorno>` con las credenciales. El frontend incrusta `VITE_AUTH_USERNAME` y
  `VITE_AUTH_PASSWORD` en el bundle al construir.

#### Paso 1: preparar la configuración de cada entorno

```powershell
Copy-Item deploy\docker\.env.pre.example deploy\docker\.env.pre
Copy-Item deploy\docker\.env.pro.example deploy\docker\.env.pro
```

Editar los secretos de ambos ficheros. Están excluidos de Git y de `.dockerignore`; no se copian
dentro de las imágenes.

#### Paso 2: construir con el script (recomendado)

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\docker\construir.ps1 -Entorno pre
powershell -ExecutionPolicy Bypass -File .\deploy\docker\construir.ps1 -Entorno pro
```

El script lee `deploy/docker/.env.<entorno>`, construye el backend y el frontend y genera estas
etiquetas:

- `pruebasopencode1-back:pre` y `pruebasopencode1-front:pre`.
- `pruebasopencode1-back:pro` y `pruebasopencode1-front:pro`.

El backend usa el mismo código en ambos entornos; la etiqueta `:pro` existe para poder publicar y
desplegar cada entorno por separado. Si se quiere evitar recompilarlo dos veces:

```powershell
docker tag pruebasopencode1-back:pre pruebasopencode1-back:pro
```

El frontend **sí** debe construirse una vez por entorno, porque las variables `VITE_*` se incrustan
en el bundle.

#### Paso 3: construir con `docker build` directamente

Backend:

```powershell
docker build -f deploy/docker/back.Dockerfile -t pruebasopencode1-back:pre .
```

Frontend:

```powershell
docker build -f deploy/docker/front.Dockerfile `
  --build-arg VITE_API_BASE_URL=/api/v1 `
  --build-arg VITE_AUTH_USERNAME=demo `
  --build-arg VITE_AUTH_PASSWORD=demo1234 `
  -t pruebasopencode1-front:pre .
```

Para PRO se repiten los comandos con `-t pruebasopencode1-front:pro` y los valores de
`deploy/docker/.env.pro`.

> El contexto del build es la raíz del repositorio (`.`). No usar `deploy/docker` como contexto: los
> Dockerfiles copian `back/`, `front/`, `docs/`, `scripts/` y `AGENTS.md` desde la raíz.

#### Paso 4: comprobar las imágenes

```powershell
docker images --filter "reference=pruebasopencode1-*"
docker image inspect pruebasopencode1-back:pre --format "{{.Config.User}}"
docker image inspect pruebasopencode1-front:pre --format "{{json .Config.ExposedPorts}}"
```

Resultados esperados:

- El backend se ejecuta con el usuario `app` (UID 10001), no como root.
- Backend y frontend exponen el puerto `8080/tcp`.
- No hay ficheros `.env` ni secretos dentro de las imágenes.

Después se pueden arrancar los contenedores:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\docker\levantar.ps1 -Entorno pre
docker compose --env-file deploy/docker/.env.pre -f deploy/docker/docker-compose.yml ps
Invoke-RestMethod http://localhost:8081/actuator/health
```

#### Paso 5: publicar en un registro

```powershell
docker login ghcr.io
powershell -ExecutionPolicy Bypass -File .\deploy\docker\construir.ps1 -Entorno pre -Registro ghcr.io/pedrojaen
docker push ghcr.io/pedrojaen/pruebasopencode1-back:pre
docker push ghcr.io/pedrojaen/pruebasopencode1-front:pre
```

En Kubernetes hay que ajustar `images.newName` del overlay al nombre publicado en el registro.

#### Cuándo hay que reconstruir

| Cambio | Imagen que hay que reconstruir |
| --- | --- |
| Código, `pom.xml` o configuración del backend | Backend |
| Código del frontend, `package.json` o `package-lock.json` | Frontend |
| `nginx.conf` | Frontend |
| `README.md`, `AGENTS.md`, `docs/` o `scripts/` | Frontend, porque `npm run build` regenera `/documentacion` |
| `VITE_API_BASE_URL`, `VITE_AUTH_USERNAME` o `VITE_AUTH_PASSWORD` | Frontend |
| Variables de ejecución, secretos o perfil de Spring | Ninguna: se inyectan al arrancar |

#### Problemas frecuentes

| Problema | Solución |
| --- | --- |
| `No existe ...\.env.pre` | Copiar `.env.pre.example` a `.env.pre`. |
| PowerShell bloquea el script | Usar `powershell -ExecutionPolicy Bypass -File ...` o los comandos `docker build` directos. |
| `request returned 500` o el motor no responde | Abrir Docker Desktop y esperar a que el motor esté operativo. |
| `failed to solve` al descargar imágenes base | Comprobar la conexión, el proxy o el DNS de Docker. |
| `Define DB_USERNAME...` al arrancar | Faltan variables obligatorias en `.env.<entorno>`. |
| Cambios que no aparecen | Reconstruir la imagen afectada y recrear: `docker compose ... up -d --force-recreate`. |
| Puerto ocupado | Cambiar `FRONT_PORT` o `BACK_PORT` en `.env.<entorno>`. |
| Imagen para otra arquitectura | Construir en la arquitectura destino o añadir `--platform linux/amd64`. |

## 5. Docker Compose para PRE y PRO

El fichero `deploy/docker/docker-compose.yml` se parametriza con
`deploy/docker/.env.<entorno>`. Las credenciales son obligatorias: Compose falla con un mensaje claro
si falta alguna.

```powershell
.\deploy\docker\levantar.ps1 -Entorno pre -Reconstruir
.\deploy\docker\levantar.ps1 -Entorno pro -Reconstruir
```

| Entorno | Frontend | API directa | Perfil | TTL | Red y volumen |
| --- | --- | --- | --- | --- | --- |
| PRE | `http://localhost:8088` | `http://localhost:8081` | `pre` | `10m` | `pruebasopencode1-pre_*` |
| PRO | `http://localhost:8098` | `http://localhost:8091` | `prod` | `5m` | `pruebasopencode1-pro_*` |

Ambos entornos pueden ejecutarse a la vez: usan proyectos, contenedores, redes y volúmenes distintos.

Comprobaciones:

```powershell
Invoke-RestMethod http://localhost:8081/actuator/health
Invoke-WebRequest http://localhost:8088/healthz -UseBasicParsing
$login = Invoke-RestMethod -Method Post http://localhost:8088/api/v1/auth/login `
  -ContentType "application/json" `
  -Body (@{ usuario = "demo"; contrasena = "demo1234" } | ConvertTo-Json)
Invoke-RestMethod http://localhost:8088/api/v1/personas `
  -Headers @{ Authorization = "Bearer $($login.token)" }
```

Parada:

```powershell
.\deploy\docker\parar.ps1 -Entorno pre
.\deploy\docker\parar.ps1 -Entorno pro -EliminarDatos
```

## 6. Kubernetes

### 6.1 Recursos base

| Recurso | Nombre | Uso |
| --- | --- | --- |
| `ConfigMap` | `pruebasopencode1-config` | Variables no sensibles por entorno. |
| `Secret` | `pruebasopencode1-secrets` | `DB_USERNAME`, `DB_PASSWORD`, `APP_AUTH_USERNAME`, `APP_AUTH_PASSWORD`. |
| `PersistentVolumeClaim` | `back-data` | Datos H2 (`/app/data`), `ReadWriteOnce`, 1 Gi. |
| `Deployment` | `back` | 1 réplica, estrategia `Recreate`, usuario 10001, root FS de solo lectura y `/tmp` efímero. |
| `Deployment` | `front` | Nginx, 1 réplica en PRE y 2 en PRO, `RollingUpdate`. |
| `Service` | `back` | Puerto 8080 interno. |
| `Service` | `front` | Puerto 80 interno. |
| `Ingress` | `pruebasopencode1` | Entrada HTTP/HTTPS al frontend. |
| `HorizontalPodAutoscaler` | `front` (PRO) | 2–4 réplicas al 70 % de CPU. |
| `PodDisruptionBudget` | `front` (PRO) | Al menos 1 réplica disponible. |

El backend usa:

- `startupProbe` sobre `/actuator/health/liveness`.
- `livenessProbe` sobre `/actuator/health/liveness`.
- `readinessProbe` sobre `/actuator/health/readiness`.
- `resources` 250m/512Mi y límites 1 CPU/1 Gi.
- `securityContext` sin root, sin escalada de privilegios, `seccomp` y `drop: ALL`.

### 6.2 Namespaces y secretos

```powershell
kubectl apply -f deploy/k8s/overlays/pre/namespace.yaml
kubectl -n pruebasopencode1-pre create secret generic pruebasopencode1-secrets `
  --from-literal=DB_USERNAME=sa `
  --from-literal=DB_PASSWORD='...' `
  --from-literal=APP_AUTH_USERNAME='...' `
  --from-literal=APP_AUTH_PASSWORD='...'
```

Los ficheros `secret.example.yaml` son plantillas y **no** están incluidos en la kustomization. No se
versionan secretos reales.

### 6.3 Despliegue

```powershell
kubectl kustomize deploy/k8s/overlays/pre > pre-render.yaml
kubectl apply -k deploy/k8s/overlays/pre
kubectl -n pruebasopencode1-pre rollout status deployment/back
kubectl -n pruebasopencode1-pre rollout status deployment/front
```

Para PRO:

```powershell
kubectl apply -f deploy/k8s/overlays/pro/namespace.yaml
kubectl -n pruebasopencode1-pro create secret generic pruebasopencode1-secrets ...
kubectl apply -k deploy/k8s/overlays/pro
```

Antes de aplicar en un clúster real:

- Publicar las imágenes en un registro y ajustar `images.newName` en el overlay.
- Crear los secretos TLS `pruebasopencode1-pre-tls` y `pruebasopencode1-pro-tls`, o adaptar el
  Ingress.
- Cambiar los hosts `*.pruebasopencode1.example.com` por los dominios reales.
- Confirmar la `StorageClass` del PVC.
- Verificar que el Ingress Controller es `nginx` o cambiar `ingressClassName`.

## 7. Configuración por entorno

### 7.1 Backend

| Variable | PRE | PRO |
| --- | --- | --- |
| `SPRING_PROFILES_ACTIVE` | `pre` | `prod` |
| `DB_URL` | `jdbc:h2:file:/app/data/pruebasopencode1` | Igual |
| `DB_USERNAME` / `DB_PASSWORD` | `Secret` | `Secret` |
| `JPA_DDL_AUTO` | `update` | `update` |
| `H2_CONSOLE_ENABLED` | `true` | `true` |
| `H2_CONSOLE_ALLOW_OTHERS` | `true` | `true` |
| `SPRINGDOC_ENABLED` | `true` | `true` |
| `SEED_MOCK_DATA` | `true` | `true` |
| `CORS_ALLOWED_ORIGINS` | Dominio de PRE | Dominio de PRO |
| `APP_AUTH_USERNAME` / `APP_AUTH_PASSWORD` | `Secret` | `Secret` |
| `APP_AUTH_ROLE` | `USER` | `USER` |
| `APP_AUTH_TOKEN_TTL` | `10m` | `5m` |
| `LOG_LEVEL` | `INFO` | `WARN` |

### 7.2 Frontend

| Variable | PRE | PRO |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api/v1` | `/api/v1` |
| `VITE_AUTH_USERNAME` / `VITE_AUTH_PASSWORD` | Deben coincidir con el `Secret` | Deben coincidir con el `Secret` |

`VITE_API_BASE_URL` es relativa porque Nginx proxifica `/api`. Las credenciales `VITE_AUTH_*` se
incrustan al construir la imagen: si cambian en el secreto, hay que reconstruir el frontend.

PRE y PRO replican el comportamiento local: si la base está vacía se siembran los 10 datos mock, el
reset vuelve a dejar esos 10 registros y la consola H2 y Swagger están activos. Nginx expone también
`/h2-console`, `/swagger-ui`, `/v3/api-docs` y `/actuator` en el mismo origen que la SPA.

`H2_CONSOLE_ALLOW_OTHERS=true` es necesario en Docker y Kubernetes porque la petición a la consola no
llega desde `127.0.0.1`. Antes de exponer un entorno real, definir `H2_CONSOLE_ENABLED=false`,
`H2_CONSOLE_ALLOW_OTHERS=false` y `SPRINGDOC_ENABLED=false`, y sustituir el autologin.

## 8. Persistencia H2 y copias

- El backend escribe en `/app/data/pruebasopencode1.mv.db` dentro del PVC.
- Solo puede existir **una** instancia del backend sobre el volumen. Por eso `replicas: 1` y
  `strategy: Recreate`.
- El volumen es `ReadWriteOnce`; no se puede montar simultáneamente en varios nodos.
- Copia de seguridad: ejecutar un `Job` que detenga el pod o use la herramienta de H2 para backup, y
  copiar el `.mv.db` a almacenamiento seguro. El fichero contiene datos personales y hashes BCrypt.
- Para PRO con alta disponibilidad, la evolución recomendada es una base de datos externa
  (PostgreSQL gestionado) y migraciones Flyway/Liquibase. El código ya está desacoplado por JPA, pero
  el cambio exige autorización expresa porque el alcance actual especifica H2.

## 9. Tokens y escalado

El backend guarda los tokens Bearer en memoria. El frontend escala sin problema, pero el backend no:

- Con 1 réplica, cada token vive en su proceso hasta caducar o revocarse.
- Con varias réplicas, una petición puede llegar a un proceso que no conoce el token y devolver
  `401`. El frontend reintenta, pero no es una solución definitiva.

Opciones futuras: almacén compartido (Redis), JWT firmados o sesiones pegajosas. En esta fase se
mantiene una réplica de backend y se documenta la limitación.

## 10. Pipeline previsto

1. CI: `mvnw -B clean verify`, `npm ci && npm run build` y `node scripts/verificar-despliegue.mjs`.
2. Construcción de imágenes etiquetadas por commit y versión.
3. Escaneo de vulnerabilidades y publicación en el registro.
4. Despliegue automático en PRE y pruebas de humo.
5. Promoción manual a PRO, con `RollingUpdate` en el frontend y `Recreate` en el backend.
6. Verificación de sondas, logs y métricas; rollback a la etiqueta anterior si falla.

## 11. Diferencias PRE / PRO

| Aspecto | PRE | PRO |
| --- | --- | --- |
| Perfil | `pre` | `prod` |
| Namespace | `pruebasopencode1-pre` | `pruebasopencode1-pro` |
| Réplicas frontend | 1 | 2–4 (HPA) |
| Réplicas backend | 1 | 1 (limitación H2) |
| TTL del token | `10m` | `5m` |
| Log | `INFO` | `WARN` |
| TLS | Certificado de pruebas | Certificado válido |
| Aprobación de despliegue | Automática | Manual |
| Copias de seguridad | Opcionales | Obligatorias |

## 12. Verificación realizada

El 2026-11-09 se comprobó:

| Comprobación | Resultado |
| --- | --- |
| Construcción de `pruebasopencode1-back:pre` | Correcta |
| Construcción de `pruebasopencode1-front:pre` | Correcta (Vite + documentación viva) |
| Construcción de `pruebasopencode1-back:pro` | Correcta |
| Construcción de `pruebasopencode1-front:pro` | Correcta |
| Compose PRE: contenedores y sondas | 2/2 `healthy` |
| Compose PRO: contenedores y sondas | 2/2 `healthy` |
| Datos mock y reset (PRE y PRO) | 10 personas iniciales; reset restaura exactamente 10 |
| Consola H2 y Swagger por el frontend | `200` en `/h2-console` y `/swagger-ui/index.html`; login H2 correcto en PRE y PRO |
| SPA por Nginx (PRE y PRO) | `200`, fallback de rutas y assets |
| API por proxy `/api` | Login, CRUD, `401` sin token y auditoría |
| Perfil y TTL | PRE `pre`/`10m`; PRO `prod`/`5m` (299 s reales) |
| Persistencia H2 | Datos conservados tras reiniciar el backend |
| Kustomize PRE y PRO | Renderizado correcto |
| Verificación automática de despliegue | **43/43 comprobaciones** |

No se ejecutó `kubectl apply` porque el entorno no tenía un contexto de clúster configurado.

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
