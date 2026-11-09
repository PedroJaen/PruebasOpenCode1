# Despliegue de PruebasOpenCode1

Esta carpeta contiene la preparación real de despliegue para **PRE** (preproducción) y **PRO**
(producción), con Docker y Kubernetes. No se ha desplegado en un clúster real: se han construido y
probado las imágenes y se han validado los manifiestos.

## Estructura

```text
deploy/
├── docker/
│   ├── back.Dockerfile          # Maven + JDK 21 → JRE 21 sin root
│   ├── front.Dockerfile         # Node + Vite → Nginx sin privilegios
│   ├── nginx.conf               # SPA, proxy /api y /healthz
│   ├── docker-compose.yml       # PRE/PRO con variables de entorno
│   ├── .env.pre.example         # plantilla de PRE
│   ├── .env.pro.example         # plantilla de PRO
│   ├── construir.ps1            # construye las dos imágenes
│   ├── levantar.ps1             # docker compose up
│   └── parar.ps1                # docker compose down
└── k8s/
    ├── base/                    # recursos comunes
    └── overlays/
        ├── pre/                 # namespace, perfil pre, TLS de PRE
        └── pro/                 # namespace, perfil prod, HPA y PDB
```

## Docker: construir las imágenes

Requisitos: Docker Desktop o Docker Engine con Compose v2.

```powershell
Copy-Item deploy\docker\.env.pre.example deploy\docker\.env.pre
# Cambiar los secretos de .env.pre antes de usar la imagen
.\deploy\docker\construir.ps1 -Entorno pre
```

También se puede publicar en un registro:

```powershell
.\deploy\docker\construir.ps1 -Entorno pro -Registro ghcr.io/pedrojaen
```

Las imágenes resultantes son:

- `pruebasopencode1-back:pre` / `pruebasopencode1-back:pro`
- `pruebasopencode1-front:pre` / `pruebasopencode1-front:pro`

La imagen del backend es la misma para ambos entornos; el perfil, la base de datos, CORS y los
secretos se inyectan en tiempo de ejecución. La imagen del frontend incorpora en el bundle las
credenciales `VITE_AUTH_*`, por lo que se construye una etiqueta por entorno.

## Docker Compose: PRE y PRO

```powershell
# PRE (front 8088, API directa 8081)
Copy-Item deploy\docker\.env.pre.example deploy\docker\.env.pre
.\deploy\docker\levantar.ps1 -Entorno pre -Reconstruir

# PRO (front 8098, API directa 8091)
Copy-Item deploy\docker\.env.pro.example deploy\docker\.env.pro
.\deploy\docker\levantar.ps1 -Entorno pro -Reconstruir
```

Comprobaciones:

```powershell
Invoke-RestMethod http://localhost:8081/actuator/health
Invoke-WebRequest http://localhost:8088/healthz -UseBasicParsing
Start-Process http://localhost:8088
```

Detener y eliminar datos:

```powershell
.\deploy\docker\parar.ps1 -Entorno pre
.\deploy\docker\parar.ps1 -Entorno pre -EliminarDatos
```

Los ficheros `.env.pre` y `.env.pro` están excluidos de Git. Los datos H2 viven en el volumen
`pruebasopencode1-back-data-<entorno>`.

> Si PowerShell bloquea los scripts por política de ejecución, usa
> `powershell -ExecutionPolicy Bypass -File .\deploy\docker\levantar.ps1 -Entorno pre` o los comandos
> `docker compose` equivalentes.

## Kubernetes

Requisitos: un clúster con Ingress Controller y `kubectl` 1.32 o superior (incluye Kustomize).

1. Publicar las imágenes en un registro accesible por el clúster.
2. Ajustar `newName` en `deploy/k8s/overlays/<entorno>/kustomization.yaml` si se usa un registro.
3. Crear el namespace y el secreto:

```powershell
kubectl apply -f deploy/k8s/overlays/pre/namespace.yaml
kubectl -n pruebasopencode1-pre create secret generic pruebasopencode1-secrets `
  --from-literal=DB_USERNAME=sa `
  --from-literal=DB_PASSWORD='...' `
  --from-literal=APP_AUTH_USERNAME='...' `
  --from-literal=APP_AUTH_PASSWORD='...'
```

4. Revisar y aplicar el overlay:

```powershell
kubectl kustomize deploy/k8s/overlays/pre | Out-File -Encoding utf8 pre-render.yaml
kubectl apply -k deploy/k8s/overlays/pre
kubectl -n pruebasopencode1-pre rollout status deployment/back
kubectl -n pruebasopencode1-pre rollout status deployment/front
```

5. Crear el certificado TLS `pruebasopencode1-pre-tls` (o adaptar el Ingress) y apuntar el DNS de
   `pre.pruebasopencode1.example.com` al Ingress Controller.

Para PRO se repite con `pruebasopencode1-pro`, `APP_AUTH_TOKEN_TTL=5m`, 2 réplicas de frontend, HPA y
PDB. El backend de PRO mantiene **1 réplica** por la limitación de H2 en fichero.

## Verificación sin clúster

```powershell
node scripts\verificar-despliegue.mjs
```

Genera `deploy/verificacion-despliegue.json` y alimenta la tabla de despliegue de `/documentacion`.
Comprueba Dockerfiles, Nginx, Compose PRE/PRO y el renderizado Kustomize de ambos overlays.

## Limitaciones conocidas

- **H2 en fichero:** solo una réplica de backend y estrategia `Recreate`; el volumen es `RWO`.
  Para escalar el backend hace falta una base de datos externa y migraciones formales.
- **Tokens en memoria:** el frontend puede escalar, pero el backend no puede compartir tokens entre
  réplicas. Si se escala, hace falta Redis, JWT o sesiones pegajosas.
- **Autologin de demostración:** las credenciales `VITE_AUTH_*` viajan en el bundle. Antes de PRO hay
  que sustituirlo por autenticación individual.
- **Secretos:** los ejemplos no son secretos reales. Usar un gestor de secretos o `kubectl create
  secret` con valores propios.
- **Registro e Ingress:** las imágenes y los hosts de los overlays son valores de ejemplo; hay que
  adaptarlos al entorno real.
