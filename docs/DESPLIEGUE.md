# Preparación de despliegues de PruebasOpenCode1

> Documento actualizado el 2026-11-09.
>
> **Alcance actual:** este documento describe el diseño previsto. No se han implementado ni
> simulado despliegues reales en PRE o PRO, tal y como establece `AGENTS.md`.

## 1. Objetivo

Dejar preparada la aplicación para una futura contenerización y despliegue en Kubernetes en dos
entornos:

- **PRE**: preproducción, con datos y configuración de pruebas.
- **PRO**: producción.

La prioridad es que el paso a esos entornos no obligue a modificar el código fuente.

## 2. Principios ya aplicados

| Principio | Aplicación en PruebasOpenCode1 |
| --- | --- |
| Configuración externalizada | Backend por variables de entorno (`DB_URL`, `CORS_ALLOWED_ORIGINS`, `SERVER_PORT`, `APP_AUTH_TOKEN_TTL`, etc.). |
| Perfiles por entorno | `dev`, `test`, `pre` y `prod` en `application-<perfil>.yml`; `dev` por defecto. |
| Frontend configurable | `VITE_API_BASE_URL` en tiempo de compilación, por defecto `/api/v1`. |
| Separación de aplicaciones | Directorios independientes `/back` y `/front`, con builds propios. |
| Salud observable | Spring Boot Actuator con `health`, `liveness` y `readiness`. |
| Sin secretos en el repositorio | `back/.env.example` documenta las variables; los `.env` reales están excluidos. En `pre`/`prod` los secretos no tienen valor por defecto. |
| API versionada | Todas las rutas de negocio bajo `/api/v1`. |
| Errores estándar | RFC 9457 (`application/problem+json`) en todos los entornos. |
| Persistencia aislada | El acceso a datos está encapsulado en el repositorio JPA. |
| Imágenes reproducibles | Versiones fijadas en `pom.xml`, `package-lock.json` y Maven Wrapper. |
| Aplicación frontend estática | El build de Vite genera recursos que puede servir cualquier servidor web. |

## 3. Arquitectura objetivo

```text
                         ┌──────────────────────────────┐
        Internet  ─────▶ │  Ingress / Load Balancer     │
                         │  pre.pruebasopencode1.local  │
                         │  pro.pruebasopencode1.local  │
                         └──────────────┬───────────────┘
                                        │
                     ┌──────────────────┴──────────────────┐
                     │                                     │
          ┌──────────▼──────────┐              ┌───────────▼──────────┐
          │  front (Nginx)      │              │  back (Spring Boot)  │
          │  estáticos React    │── /api/v1 ──▶│  API REST :8080      │
          └─────────────────────┘              └───────────┬──────────┘
                                                           │ JDBC
                                                           ▼
                                                  ┌──────────────────┐
                                                  │  Base de datos   │
                                                  │  PRE / PRO       │
                                                  └──────────────────┘
```

Dos imágenes independientes:

1. **Frontend**: build de Vite servido por Nginx, con proxy `/api` hacia el backend o con
   `VITE_API_BASE_URL` apuntando al Ingress de la API.
2. **Backend**: JAR de Spring Boot ejecutado con una JRE 21.

## 4. Estructura futura propuesta

No creada todavía; se incluye como guía para la siguiente fase:

```text
deploy/
├── docker/
│   ├── back.Dockerfile          # multi-stage: Maven + JDK 21 → JRE 21
│   ├── front.Dockerfile         # multi-stage: Node + Vite → Nginx
│   └── nginx.conf
├── k8s/
│   ├── base/
│   │   ├── namespace.yaml
│   │   ├── back-deployment.yaml
│   │   ├── back-service.yaml
│   │   ├── front-deployment.yaml
│   │   ├── front-service.yaml
│   │   ├── ingress.yaml
│   │   ├── configmap.yaml
│   │   └── secret.example.yaml
│   └── overlays/
│       ├── pre/
│       │   ├── kustomization.yaml
│       │   ├── configmap-patch.yaml
│       │   └── replicas-patch.yaml
│       └── pro/
│           ├── kustomization.yaml
│           ├── configmap-patch.yaml
│           └── replicas-patch.yaml
└── README.md
```

Se propone **Kustomize** para compartir la base y aplicar diferencias por entorno sin duplicar
manifiestos.

## 5. Imágenes previstas

### 5.1 Backend

```dockerfile
# Borrador conceptual, no implementado.
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN ./mvnw -B dependency:go-offline
COPY src src
RUN ./mvnw -B clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/pruebasopencode1-back.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

Consideraciones:

- Ejecutar con usuario no root.
- Añadir `JAVA_OPTS` para límites de memoria (`-XX:MaxRAMPercentage=75`).
- No copiar `data/` ni `.env` dentro de la imagen.
- Fijar la imagen base por digest en la implementación real.
- Definir `SPRING_PROFILES_ACTIVE` como `pre` o `prod` en el orquestador, no en la imagen.

### 5.2 Frontend

```dockerfile
# Borrador conceptual, no implementado.
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

`nginx.conf` debe incluir:

- Fallback de SPA: `try_files $uri $uri/ /index.html;`.
- Proxy opcional de `/api` al servicio `back`.
- Cabeceras de seguridad básicas.
- Compresión y caché para assets con hash.

## 6. Configuración por entorno

### 6.1 Backend

| Variable | PRE | PRO |
| --- | --- | --- |
| `SPRING_PROFILES_ACTIVE` | `pre` | `prod` |
| `SERVER_PORT` | `8080` | `8080` |
| `DB_URL` | URL de la base de datos de PRE | URL de la base de datos de PRO |
| `DB_USERNAME` / `DB_PASSWORD` | Desde `Secret` | Desde `Secret` |
| `JPA_DDL_AUTO` | `validate` o `update` controlado | `validate` |
| `H2_CONSOLE_ENABLED` | `false` | `false` |
| `CORS_ALLOWED_ORIGINS` | Dominio del frontend de PRE | Dominio del frontend de PRO |
| `SEED_MOCK_DATA` | `false` | `false` |
| `APP_AUTH_USERNAME` / `APP_AUTH_PASSWORD` | Desde `Secret` | Desde `Secret` |
| `APP_AUTH_ROLE` | `USER` | `USER` |
| `APP_AUTH_TOKEN_TTL` | `10m` (valor del perfil) | `5m` (valor del perfil) |
| `SPRINGDOC_ENABLED` | `false` | `false` |
| `LOG_LEVEL` | `INFO` | `INFO` |

`application-pre.yml` y `application-pro.yml` contienen solo valores no sensibles; los secretos
siempre se inyectan desde el orquestador (`Secret` de Kubernetes). Ningún secreto debe viajar en la
imagen ni en el repositorio.

### 6.2 Frontend

| Variable | PRE | PRO |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://api.pre.pruebasopencode1.example.com/api/v1` | `https://api.pruebasopencode1.example.com/api/v1` |
| `VITE_AUTH_USERNAME` / `VITE_AUTH_PASSWORD` | Credenciales de demostración de PRE | Credenciales reales inyectadas en el build |

Al ser variables de compilación, se pasan como `ARG` en la imagen y se genera una imagen por entorno (o
una imagen parametrizada en el pipeline). Las credenciales del autologin viajan en el bundle del
navegador: en un despliegue real habría que sustituir el autologin por un flujo de autenticación
individual antes de usar PRO.

## 7. Tokens y estado en un despliegue con varias réplicas

El backend es **sin estado de sesión**, pero guarda los tokens Bearer en memoria (`TokenService`). Por
tanto:

- Una sola réplica funciona sin cambios: cada token vive en su proceso hasta caducar o revocarse.
- Con **varias réplicas**, una petición puede llegar a un proceso que no conoce el token y devolver
  `401`. El frontend reintenta de forma transparente, pero conviene evitarlo.

Opciones para PRE/PRO, a decidir en la siguiente fase:

1. **Afianzar una única réplica** para el backend mientras se mantiene el modelo actual.
2. **Almacén compartido de tokens** (por ejemplo Redis) accesible por todas las réplicas.
3. **JWT firmados** con clave gestionada por el orquestador, sin almacenamiento de sesión.
4. **Sesiones pegajosas** en el Ingress (parcial y no recomendado como solución definitiva).

En esta fase no se implementa ninguna; el diseño queda abierto y documentado en
[`SEGURIDAD.md`](SEGURIDAD.md).

## 8. Kubernetes: recursos previstos

| Recurso | Uso |
| --- | --- |
| `Namespace` | Aislamiento por entorno (`pruebasopencode1-pre`, `pruebasopencode1-pro`). |
| `Deployment` (back) | Réplicas del backend, variables desde `ConfigMap`/`Secret`. |
| `Service` (back) | Exposición interna en el puerto 8080. |
| `Deployment` (front) | Réplicas de Nginx con los estáticos. |
| `Service` (front) | Exposición interna en el puerto 80. |
| `Ingress` | TLS y enrutamiento por dominio; `/api` al backend si no hay proxy en Nginx. |
| `ConfigMap` | Variables no sensibles por entorno. |
| `Secret` | Credenciales de base de datos y de autenticación. |
| `HorizontalPodAutoscaler` | Escalado por CPU/memoria en PRO. |
| `PodDisruptionBudget` | Disponibilidad durante actualizaciones en PRO. |
| `NetworkPolicy` | Restringir tráfico al backend y a la base de datos. |

### 8.1 Sondas

El backend ya expone las sondas necesarias:

```yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 20
  periodSeconds: 5
```

El frontend puede usar una sonda HTTP a `/` en el puerto 80.

### 8.2 Recursos orientativos

```yaml
resources:
  requests:
    cpu: 250m
    memory: 512Mi
  limits:
    cpu: "1"
    memory: 1Gi
```

Ajustar con métricas reales. En PRO se recomienda un mínimo de dos réplicas del backend y del
frontend, teniendo en cuenta la limitación de tokens en memoria descrita en el apartado 7.

## 9. Gestión de la base de datos

La configuración actual usa H2 en fichero, adecuada para desarrollo local. Para PRE/PRO hay dos
opciones:

1. **H2 sobre volumen persistente** con una sola réplica y `Recreate`.
   - Sencillo y fiel al alcance actual.
   - No admite escalado horizontal ni alta disponibilidad.
   - Requiere `PersistentVolumeClaim` y copias de seguridad.
2. **Base de datos externa** (por ejemplo PostgreSQL) mediante un servicio gestionado.
   - Recomendado para PRO por robustez, copias y escalado.
   - Implica una decisión técnica y autorización expresa, ya que el proyecto especifica H2.
   - El código ya está desacoplado por JPA; el cambio principal sería el driver, la URL y las
     migraciones (Flyway/Liquibase).

En esta fase no se decide ni se implementa ese cambio.

## 10. Pipeline de entrega previsto

1. **Integración continua**
   - Backend: `./mvnw -B clean verify`.
   - Frontend: `npm ci && npm run build`.
   - Análisis estático y escaneo de dependencias.
2. **Construcción de imágenes**
   - Etiquetado por commit y versión semántica.
   - Escaneo de vulnerabilidades.
3. **Publicación**
   - Registro de imágenes corporativo.
4. **Despliegue en PRE**
   - Aplicar overlay `pre`, ejecutar pruebas de humo.
5. **Promoción a PRO**
   - Aprobación manual.
   - Aplicar overlay `pro` con estrategia `RollingUpdate`.
   - Verificar sondas y métricas; posibilidad de rollback a la versión anterior.

## 11. Diferencias PRE / PRO

| Aspecto | PRE | PRO |
| --- | --- | --- |
| Perfil | `pre` | `prod` |
| Réplicas | 1 | ≥ 2 |
| Datos | Datos de prueba | Datos reales |
| `SEED_MOCK_DATA` | `false` | `false` |
| Consola H2 | Deshabilitada | Deshabilitada |
| Swagger | Deshabilitado | Deshabilitado |
| TTL del token | `10m` | `5m` |
| TLS | Sí (certificado de pruebas) | Sí (certificado válido) |
| Recursos | Ajustados | Dimensionados con métricas |
| Copias de seguridad | Opcionales | Obligatorias |
| Monitorización | Básica | Completa (métricas, logs, alertas) |
| Aprobación de despliegue | Automática | Manual |

## 12. Pasos pendientes para una implantación real

- [ ] Crear los Dockerfiles definitivos y `.dockerignore`.
- [ ] Crear `nginx.conf` con fallback SPA y proxy.
- [ ] Crear los manifiestos base de Kubernetes y los overlays PRE/PRO.
- [ ] Definir la estrategia de base de datos para cada entorno.
- [ ] Decidir la estrategia de tokens para múltiples réplicas (apartado 7).
- [ ] Sustituir el autologin por autenticación individual antes de usar PRO.
- [ ] Configurar registro de imágenes, pipeline CI/CD y escaneo de seguridad.
- [ ] Configurar dominios, TLS, DNS y firewall.
- [ ] Definir políticas de copias de seguridad y retención.
- [ ] Configurar logs centralizados, métricas y alertas.
- [ ] Ejecutar pruebas de carga y de recuperación.
- [ ] Documentar el runbook de operación y rollback.
