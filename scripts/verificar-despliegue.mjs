/**
 * Verifica la preparación de despliegue de PruebasOpenCode1:
 *
 * - Existencia y contenido mínimo de Dockerfiles, Nginx y Compose.
 * - Configuración válida de Docker Compose para PRE y PRO.
 * - Renderizado de los overlays Kustomize PRE y PRO.
 * - Ausencia de secretos reales entre los recursos renderizados.
 *
 * No necesita un clúster de Kubernetes ni el motor de Docker arrancado.
 * Genera deploy/verificacion-despliegue.json, que alimenta la página
 * /documentacion del frontend.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const raiz = resolve(scriptDir, '..')
const informe = join(raiz, 'deploy', 'verificacion-despliegue.json')
const comprobaciones = []

function ejecutar(comando, argumentos) {
  return spawnSync(comando, argumentos, {
    cwd: raiz,
    encoding: 'utf8',
    shell: false,
  })
}

function anotar(nombre, comando, ok, detalle = '') {
  comprobaciones.push({
    nombre,
    comando,
    resultado: ok ? 'Superada' : 'Fallida',
    detalle: ok ? '' : detalle.trim().slice(0, 500),
  })
  const icono = ok ? 'OK  ' : 'FAIL'
  console.log(`${icono} ${nombre}`)
  if (!ok && detalle) {
    console.log(`     ${detalle.trim().split('\n')[0]}`)
  }
}

function existe(ruta) {
  return existsSync(join(raiz, ruta))
}

function leer(ruta) {
  return readFileSync(join(raiz, ruta), 'utf8')
}

// 1. Ficheros base del despliegue.
const ficheros = [
  'deploy/docker/back.Dockerfile',
  'deploy/docker/front.Dockerfile',
  'deploy/docker/nginx.conf',
  'deploy/docker/docker-compose.yml',
  'deploy/docker/.env.pre.example',
  'deploy/docker/.env.pro.example',
  'deploy/k8s/base/kustomization.yaml',
  'deploy/k8s/overlays/pre/kustomization.yaml',
  'deploy/k8s/overlays/pro/kustomization.yaml',
]
for (const fichero of ficheros) {
  anotar(`Existe ${fichero}`, 'Test-Path', existe(fichero), `Falta ${fichero}`)
}

// 2. Dockerfiles y Nginx con las garantías esperadas.
const backDockerfile = existe('deploy/docker/back.Dockerfile')
  ? leer('deploy/docker/back.Dockerfile')
  : ''
const frontDockerfile = existe('deploy/docker/front.Dockerfile')
  ? leer('deploy/docker/front.Dockerfile')
  : ''
const nginx = existe('deploy/docker/nginx.conf') ? leer('deploy/docker/nginx.conf') : ''
const dockerignore = existe('.dockerignore') ? leer('.dockerignore') : ''

anotar(
  'Backend multi-stage + JRE 21 + usuario no root',
  'Dockerfile',
  backDockerfile.includes('AS build') &&
    backDockerfile.includes('eclipse-temurin:21-jre') &&
    backDockerfile.includes('USER app'),
  'Falta multi-stage, JRE 21 o USER app.',
)
anotar(
  'Frontend multi-stage + Nginx sin privilegios',
  'Dockerfile',
  frontDockerfile.includes('AS build') &&
    frontDockerfile.includes('nginx-unprivileged') &&
    frontDockerfile.includes('npm run build'),
  'Falta multi-stage, Nginx unprivileged o npm run build.',
)
anotar(
  'Nginx: SPA, proxy /api y salud',
  'nginx.conf',
  nginx.includes('try_files $uri $uri/ /index.html') &&
    nginx.includes('proxy_pass http://back:8080') &&
    nginx.includes('/healthz') &&
    nginx.includes('listen 8080'),
  'Falta fallback SPA, proxy /api, /healthz o listen 8080.',
)
anotar(
  'Nginx: consola H2, Swagger y Actuator accesibles',
  'nginx.conf',
  nginx.includes('location = /h2-console') &&
    nginx.includes('location /h2-console/') &&
    nginx.includes('location /swagger-ui/') &&
    nginx.includes('location /v3/api-docs') &&
    nginx.includes('location /actuator/') &&
    nginx.includes('proxy_set_header Host $http_host'),
  'Faltan los proxies de consola H2, Swagger o Actuator, o el Host con puerto.',
)
anotar(
  '.dockerignore excluye secretos y artefactos',
  '.dockerignore',
  dockerignore.includes('**/.env') &&
    dockerignore.includes('back/target') &&
    dockerignore.includes('back/data') &&
    dockerignore.includes('front/node_modules') &&
    dockerignore.includes('front/dist'),
  'Faltan exclusiones de secretos o artefactos.',
)

// 3. Docker Compose PRE y PRO con los ficheros de ejemplo.
const compose = existe('deploy/docker/docker-compose.yml')
  ? leer('deploy/docker/docker-compose.yml')
  : ''
anotar(
  'Compose: datos mock y herramientas como en local',
  'docker-compose.yml',
  compose.includes('SEED_MOCK_DATA:-true') &&
    compose.includes('H2_CONSOLE_ENABLED:-true') &&
    compose.includes('H2_CONSOLE_ALLOW_OTHERS:-true') &&
    compose.includes('SPRINGDOC_ENABLED:-true'),
  'Compose debe activar datos mock, consola H2 y Swagger por defecto.',
)

for (const entorno of ['pre', 'pro']) {
  const resultado = ejecutar('docker', [
    'compose',
    '--env-file',
    `deploy/docker/.env.${entorno}.example`,
    '-f',
    'deploy/docker/docker-compose.yml',
    'config',
    '--quiet',
  ])
  anotar(
    `Docker Compose ${entorno.toUpperCase()} válido`,
    `docker compose --env-file .env.${entorno}.example config`,
    resultado.status === 0,
    `${resultado.stdout ?? ''}\n${resultado.stderr ?? ''}`,
  )
}

// 4. Kustomize PRE y PRO.
function renderizar(entorno, perfiles) {
  const resultado = ejecutar('kubectl', ['kustomize', `deploy/k8s/overlays/${entorno}`])
  if (resultado.status !== 0) {
    anotar(
      `Kustomize ${entorno.toUpperCase()} renderiza`,
      'kubectl kustomize',
      false,
      `${resultado.stdout ?? ''}\n${resultado.stderr ?? ''}`,
    )
    return null
  }
  anotar(`Kustomize ${entorno.toUpperCase()} renderiza`, 'kubectl kustomize', true)
  const yaml = resultado.stdout

  const esperado = [
    ['namespace', `namespace: pruebasopencode1-${entorno}`],
    ['ConfigMap', 'kind: ConfigMap'],
    ['2 Deployments', (yaml.match(/^kind: Deployment$/gm) ?? []).length === 2],
    ['2 Services', (yaml.match(/^kind: Service$/gm) ?? []).length === 2],
    ['PVC', 'kind: PersistentVolumeClaim'],
    ['Ingress', 'kind: Ingress'],
    ['perfil', `SPRING_PROFILES_ACTIVE: ${perfiles}`],
    ['imagen back', `image: pruebasopencode1-back:${entorno}`],
    ['imagen front', `image: pruebasopencode1-front:${entorno}`],
  ]
  for (const [nombre, valor] of esperado) {
    const ok = typeof valor === 'boolean' ? valor : yaml.includes(valor)
    anotar(`  ${nombre} en ${entorno.toUpperCase()}`, 'kubectl kustomize', ok, `No se encontró ${valor}`)
  }

  anotar(
    `  sin Secret versionado en ${entorno.toUpperCase()}`,
    'kubectl kustomize',
    !yaml.includes('kind: Secret'),
    'El overlay no debe incluir secretos reales.',
  )
  return yaml
}

const pre = renderizar('pre', 'pre')
const pro = renderizar('pro', 'prod')

anotar(
  'PRE y PRO: datos mock, consola H2 y Swagger activos',
  'kubectl kustomize',
  Boolean(
    pre &&
      pro &&
      pre.includes('SEED_MOCK_DATA: "true"') &&
      pre.includes('H2_CONSOLE_ENABLED: "true"') &&
      pre.includes('SPRINGDOC_ENABLED: "true"') &&
      pro.includes('SEED_MOCK_DATA: "true"') &&
      pro.includes('H2_CONSOLE_ENABLED: "true"') &&
      pro.includes('SPRINGDOC_ENABLED: "true"'),
  ),
  'Los ConfigMap de PRE y PRO deben activar datos mock, consola H2 y Swagger.',
)

if (pro) {
  anotar(
    'PRO: HPA, PDB y 2 réplicas de frontend',
    'kubectl kustomize',
    pro.includes('kind: HorizontalPodAutoscaler') &&
      pro.includes('kind: PodDisruptionBudget') &&
      /kind: Deployment[\s\S]*?name: front[\s\S]*?replicas: 2/.test(pro),
    'Falta HPA, PDB o replicas: 2 en el frontend de PRO.',
  )
  anotar(
    'PRO: backend con una única réplica y estrategia Recreate',
    'kubectl kustomize',
    /name: back[\s\S]*?replicas: 1[\s\S]*?type: Recreate/.test(pro),
    'H2 en fichero exige una réplica y Recreate.',
  )
}

if (pre) {
  anotar(
    'PRE: backend con una única réplica y estrategia Recreate',
    'kubectl kustomize',
    /name: back[\s\S]*?replicas: 1[\s\S]*?type: Recreate/.test(pre),
    'H2 en fichero exige una réplica y Recreate.',
  )
}

// 5. Informe.
const superadas = comprobaciones.filter((c) => c.resultado === 'Superada').length
const fecha = new Date()
const informeFinal = {
  fecha: `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(
    fecha.getDate(),
  ).padStart(2, '0')}`,
  total: comprobaciones.length,
  superadas,
  fallidas: comprobaciones.length - superadas,
  comprobaciones,
}
writeFileSync(informe, `${JSON.stringify(informeFinal, null, 2)}\n`, 'utf8')

console.log(
  `\nVerificación de despliegue: ${superadas}/${comprobaciones.length} comprobaciones superadas.`,
)
console.log(`Informe: ${informe}`)
process.exit(superadas === comprobaciones.length ? 0 : 1)
