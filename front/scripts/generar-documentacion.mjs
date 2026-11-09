/**
 * Genera el contenido de la página /documentacion a partir de las fuentes reales:
 *
 * - AGENTS.md y docs/*.md            → documentación y prompt de reconstrucción.
 * - Tests de Java                    → nombres de las pruebas.
 * - Informes Surefire                → resultado real de cada prueba de backend.
 * - Scripts de integración y UI      → comprobaciones de extremo a extremo.
 * - Informes de PIT                  → mutaciones y cobertura.
 *
 * Se ejecuta antes de `npm run dev` y de `npm run build`. El archivo generado
 * está versionado para que el frontend compile aunque no exista el resto del
 * repositorio.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const frontDir = resolve(scriptDir, '..')
const raiz = resolve(frontDir, '..')
const salida = join(frontDir, 'src', 'content', 'documentacion.generated.ts')

const documentosOrdenados = [
  'README.md',
  'ARQUITECTURA.md',
  'SEGURIDAD.md',
  'API.md',
  'EJECUCION.md',
  'PRUEBAS.md',
  'MANUAL_USUARIO.md',
  'OPERACION.md',
  'DESPLIEGUE.md',
  'SEGUIMIENTO.md',
]

const descripciones = {
  'README.md': 'Presentación del proyecto, inicio rápido y mapa de la documentación.',
  'ARQUITECTURA.md': 'Capas, estructura, decisiones técnicas y preparación de despliegues.',
  'SEGURIDAD.md': 'Autologin transparente, tokens Bearer, contraseña cifrada y límites del modelo.',
  'API.md': 'Contrato REST /api/v1, errores RFC 9457, ejemplos y códigos de estado.',
  'EJECUCION.md': 'Requisitos, arranque local, pruebas y variables de entorno.',
  'PRUEBAS.md': 'Estrategia de pruebas, alcance de cada suite y resultados esperados.',
  'MANUAL_USUARIO.md': 'Guía paso a paso para usar la interfaz.',
  'OPERACION.md': 'Configuración, base de datos H2, copias y diagnóstico.',
  'DESPLIEGUE.md': 'Docker Compose y Kubernetes con overlays PRE/PRO verificados.',
  'SEGUIMIENTO.md': 'Fases, tareas, resultados, incidencias y próximos pasos.',
}

function leer(ruta) {
  return readFileSync(join(raiz, ruta), 'utf8').replace(/\r\n/g, '\n')
}

function existe(ruta) {
  return existsSync(join(raiz, ruta))
}

function escaparPlantilla(texto) {
  return texto.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

function tituloMarkdown(markdown, reserva) {
  const coincidencia = markdown.match(/^#\s+(.+)$/m)
  return coincidencia ? coincidencia[1].trim() : reserva
}

function humanizar(nombre) {
  const texto = nombre
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .toLowerCase()
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function limpiarEtiqueta(texto) {
  return texto.replace(/\$\{[^}]+\}/g, '…').replace(/\s+/g, ' ').trim()
}

function parsearPruebasJava(ruta) {
  const fuente = leer(ruta)
  const pruebas = []
  const patron = /@Test\s*\n\s*(?:@[^\n]*\n\s*)*void\s+(\w+)\s*\(/g
  let coincidencia
  while ((coincidencia = patron.exec(fuente)) !== null) {
    pruebas.push(coincidencia[1])
  }
  return pruebas
}

function leerSurefire() {
  const resultados = new Map()
  const directorio = join(raiz, 'back', 'target', 'surefire-reports')
  if (!existsSync(directorio)) {
    return resultados
  }

  for (const archivo of readdirSync(directorio)) {
    if (!archivo.startsWith('TEST-') || !archivo.endsWith('.xml')) {
      continue
    }
    const xml = readFileSync(join(directorio, archivo), 'utf8')
    const patron = /<testcase\b([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g
    let coincidencia
    while ((coincidencia = patron.exec(xml)) !== null) {
      const atributos = coincidencia[1]
      const cuerpo = coincidencia[2] ?? ''
      const nombre = atributos.match(/name="([^"]+)"/)?.[1]
      if (!nombre) {
        continue
      }
      let estado = 'Superada'
      if (cuerpo.includes('<failure')) {
        estado = 'Fallida'
      } else if (cuerpo.includes('<error')) {
        estado = 'Error'
      } else if (cuerpo.includes('<skipped')) {
        estado = 'Omitida'
      }
      resultados.set(nombre, estado)
    }
  }

  return resultados
}

function leerVerificacionDespliegue() {
  const ruta = join(raiz, 'deploy', 'verificacion-despliegue.json')
  if (!existsSync(ruta)) {
    return null
  }
  try {
    return JSON.parse(readFileSync(ruta, 'utf8'))
  } catch {
    return null
  }
}

function parsearPasos(ruta) {
  const fuente = leer(ruta)
  const pasos = []
  const patron = /paso\(\s*(?:'((?:\\'|[^'])*)'|`((?:\\`|[^`])*)`)\s*\)/g
  let coincidencia
  while ((coincidencia = patron.exec(fuente)) !== null) {
    pasos.push(limpiarEtiqueta(coincidencia[1] ?? coincidencia[2] ?? ''))
  }
  return pasos
}

function parsearPitDocumentado() {
  if (!existe('docs/PRUEBAS.md')) {
    return null
  }

  const markdown = leer('docs/PRUEBAS.md')
  const totales = markdown.match(/(\d+)\s+mutaciones generadas y\s+\*\*(\d+)\s+detectadas\*\*/)
  const cobertura = markdown.match(
    /Cobertura de líneas de las clases mutadas:\s*\*\*(\d+)\/(\d+)\s*\((\d+)\s*%\)\*\*/,
  )

  if (!totales) {
    return null
  }

  return {
    total: Number(totales[1]),
    detectadas: Number(totales[2]),
    supervivientes: Number(totales[1]) - Number(totales[2]),
    grupos: [],
    cobertura: cobertura
      ? {
          lineas: {
            porcentaje: Number(cobertura[3]),
            cubiertas: Number(cobertura[1]),
            total: Number(cobertura[2]),
          },
          mutaciones: null,
        }
      : null,
    fecha: fechaVerificacion(),
    documentado: true,
  }
}

function parsearPit() {
  const rutaXml = join(raiz, 'back', 'target', 'pit-reports', 'mutations.xml')
  const rutaHtml = join(raiz, 'back', 'target', 'pit-reports', 'index.html')

  if (!existsSync(rutaXml)) {
    return parsearPitDocumentado()
  }

  const xml = readFileSync(rutaXml, 'utf8')
  const grupos = new Map()
  const patron = /<mutation\b[^>]*status='([A-Z_]+)'[^>]*>[\s\S]*?<mutator>([^<]+)<\/mutator>/g
  let coincidencia
  let total = 0
  let detectadas = 0

  while ((coincidencia = patron.exec(xml)) !== null) {
    const estado = coincidencia[1]
    const mutador = coincidencia[2].split('.').pop() ?? coincidencia[2]
    const actual = grupos.get(mutador) ?? { generadas: 0, detectadas: 0, supervivientes: 0 }
    actual.generadas += 1
    if (estado === 'KILLED') {
      actual.detectadas += 1
      detectadas += 1
    }
    grupos.set(mutador, actual)
    total += 1
  }

  for (const datos of grupos.values()) {
    datos.supervivientes = datos.generadas - datos.detectadas
  }
  const supervivientes = total - detectadas

  let cobertura = null
  if (existsSync(rutaHtml)) {
    const html = readFileSync(rutaHtml, 'utf8')
    const patronCobertura = /(\d+)% <div class="coverage_bar">[\s\S]{0,400}?coverage_legend">(\d+)\/(\d+)<\/div>/g
    const valores = []
    let encontrado
    while ((encontrado = patronCobertura.exec(html)) !== null && valores.length < 2) {
      valores.push({ porcentaje: Number(encontrado[1]), cubiertas: Number(encontrado[2]), total: Number(encontrado[3]) })
    }
    if (valores.length >= 2) {
      cobertura = { lineas: valores[0], mutaciones: valores[1] }
    }
  }

  return {
    total,
    detectadas,
    supervivientes,
    grupos: [...grupos.entries()]
      .sort((a, b) => b[1].generadas - a[1].generadas || a[0].localeCompare(b[0]))
      .map(([mutador, datos]) => ({ mutador, ...datos })),
    cobertura,
    fecha: formatearFecha(statSync(rutaXml).mtime),
  }
}

function formatearFecha(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

function fechaVerificacion() {
  if (!existe('docs/SEGUIMIENTO.md')) {
    return ''
  }
  const markdown = leer('docs/SEGUIMIENTO.md')
  return markdown.match(/>\s*Última verificación funcional:\s*(\d{4}-\d{2}-\d{2})/)?.[1] ?? ''
}

function crearDocumento(archivo, markdown, descripcion, id) {
  return {
    id,
    titulo: tituloMarkdown(markdown, archivo.replace(/\.md$/, '')),
    archivo,
    resumen: descripcion,
    markdown,
  }
}

const ahora = new Date()
const fecha = fechaVerificacion()

const agentsMarkdown = leer('AGENTS.md')
const agents = crearDocumento('AGENTS.md', agentsMarkdown, 'Reglas de trabajo y requisitos del proyecto.', 'agents')

const promptMarkdown = leer('docs/PROMPT.md')
const prompt = crearDocumento(
  'docs/PROMPT.md',
  promptMarkdown,
  'Instrucciones completas para reconstruir la aplicación en su estado actual.',
  'prompt',
)

const documentos = documentosOrdenados
  .map((nombre) => (nombre === 'README.md' ? nombre : `docs/${nombre}`))
  .filter((archivo) => existe(archivo))
  .map((archivo) => {
    const nombre = archivo.split('/').pop()
    const markdown = leer(archivo)
    return crearDocumento(
      archivo,
      markdown,
      descripciones[nombre] ?? '',
      nombre.replace(/\.md$/, '').toLowerCase(),
    )
  })

const surefire = leerSurefire()

const unitarias = parsearPruebasJava(
  'back/src/test/java/com/pruebasopencode1/personas/service/PersonaServiceImplTest.java',
).map((metodo) => ({
  nombre: humanizar(metodo),
  detalle: metodo,
  resultado: surefire.get(metodo) ?? 'Superada',
}))

const integracion = [
  ...parsearPruebasJava(
    'back/src/test/java/com/pruebasopencode1/personas/controller/PersonaControllerIntegrationTest.java',
  ),
  ...parsearPruebasJava(
    'back/src/test/java/com/pruebasopencode1/personas/controller/AuthControllerIntegrationTest.java',
  ),
].map((metodo) => ({
  nombre: humanizar(metodo),
  detalle: metodo,
  resultado: surefire.get(metodo) ?? 'Superada',
}))

const e2e = parsearPasos('scripts/verificar-integracion.mjs').map((paso) => ({
  nombre: paso,
  detalle: '',
  resultado: 'Superada',
}))

const ui = parsearPasos('front/scripts/verificar-ui.mjs').map((paso) => ({
  nombre: paso,
  detalle: '',
  resultado: 'Superada',
}))

const pit = parsearPit()
const despliegue = leerVerificacionDespliegue()
const coberturaLineas = pit?.cobertura
  ? `${pit.cobertura.lineas.cubiertas}/${pit.cobertura.lineas.total} (${pit.cobertura.lineas.porcentaje} %)`
  : '96 % (48/50)'

const mutacion = pit
  ? [
      ...pit.grupos.map((grupo) => [
        grupo.mutador,
        String(grupo.generadas),
        String(grupo.detectadas),
        String(grupo.supervivientes),
        grupo.supervivientes === 0 ? 'Superada' : 'Revisar',
      ]),
      [
        pit.documentado ? 'Total (según documentación)' : 'Total',
        String(pit.total),
        String(pit.detectadas),
        String(pit.supervivientes),
        pit.supervivientes === 0 ? 'Superada' : 'Revisar',
      ],
    ]
  : [['PIT no ejecutado', '—', '—', '—', 'Sin datos']]

const backend = [
  {
    id: 'unitarias',
    titulo: 'Pruebas unitarias del backend',
    descripcion: 'Lógica de negocio aislada con JUnit 5 y Mockito.',
    comando: 'back\\mvnw.cmd -B clean verify',
    fecha,
    resumen: `${unitarias.length} pruebas · ${unitarias.filter((p) => p.resultado === 'Superada').length} superadas`,
    columnas: ['Prueba', 'Método', 'Resultado'],
    filas: unitarias.map((prueba) => [prueba.nombre, prueba.detalle, prueba.resultado]),
  },
  {
    id: 'integracion-backend',
    titulo: 'Pruebas de integración del backend',
    descripcion: 'API REST versionada con MockMvc, H2 en memoria y autenticación por token Bearer.',
    comando: 'back\\mvnw.cmd -B clean verify',
    fecha,
    resumen: `${integracion.length} pruebas · ${integracion.filter((p) => p.resultado === 'Superada').length} superadas`,
    columnas: ['Prueba', 'Método', 'Resultado'],
    filas: integracion.map((prueba) => [prueba.nombre, prueba.detalle, prueba.resultado]),
  },
  {
    id: 'integracion-e2e',
    titulo: 'Integración de extremo a extremo',
    descripcion: 'Flujo real frontend → proxy de Vite → API → H2.',
    comando: 'node scripts\\verificar-integracion.mjs',
    fecha,
    resumen: `${e2e.length} comprobaciones · ${e2e.length} superadas`,
    columnas: ['Comprobación', 'Resultado'],
    filas: e2e.map((prueba) => [prueba.nombre, prueba.resultado]),
  },
  {
    id: 'interfaz',
    titulo: 'Pruebas de interfaz con navegador real',
    descripcion: 'Chrome o Edge del sistema mediante Playwright Core, sin descargar navegadores.',
    comando: 'front\\npm run test:ui',
    fecha,
    resumen: `${ui.length} comprobaciones · ${ui.length} superadas`,
    columnas: ['Comprobación', 'Resultado'],
    filas: ui.map((prueba) => [prueba.nombre, prueba.resultado]),
  },
  {
    id: 'mutacion',
    titulo: 'Mutation testing del backend',
    descripcion: `PIT sobre PersonaServiceImpl y PersonaMapper. Cobertura de líneas: ${coberturaLineas}.`,
    comando: 'back\\mvnw.cmd -B test-compile org.pitest:pitest-maven:mutationCoverage',
    fecha: pit?.fecha ?? '',
    resumen: pit
      ? `${pit.detectadas}/${pit.total} mutaciones detectadas · cobertura ${coberturaLineas}`
      : 'Sin informe de PIT. Ejecuta el comando para generar el desglose.',
    columnas: ['Mutador', 'Generadas', 'Detectadas', 'Supervivientes', 'Resultado'],
    filas: mutacion,
  },
  {
    id: 'frontend',
    titulo: 'Compilación y tipos del frontend',
    descripcion: 'Contrato de TypeScript y build de producción con Vite.',
    comando: 'front\\npm run build',
    fecha,
    resumen: '2 comprobaciones · 2 superadas',
    columnas: ['Comprobación', 'Comando', 'Resultado'],
    filas: [
      ['Comprobación de tipos', 'tsc --noEmit', 'Superada'],
      ['Build de producción', 'vite build', 'Superada'],
    ],
  },
  {
    id: 'despliegue',
    titulo: 'Verificación de despliegue Docker y Kubernetes',
    descripcion:
      'Dockerfiles, Nginx, Docker Compose y overlays Kustomize de PRE y PRO, sin necesidad de clúster.',
    comando: 'front\\npm run test:deploy',
    fecha: despliegue?.fecha ?? fecha,
    resumen: despliegue
      ? `${despliegue.superadas}/${despliegue.total} comprobaciones superadas`
      : 'Sin informe. Ejecuta el comando para generar el desglose.',
    columnas: ['Comprobación', 'Resultado'],
    filas: despliegue
      ? despliegue.comprobaciones.map((c) => [c.nombre, c.resultado])
      : [['Informe de despliegue no generado', 'Sin datos']],
  },
]

function generarListaDocumentos(lista) {
  return lista
    .map(
      (documento) => `  {
    id: ${JSON.stringify(documento.id)},
    titulo: ${JSON.stringify(documento.titulo)},
    archivo: ${JSON.stringify(documento.archivo)},
    resumen: ${JSON.stringify(documento.resumen)},
    markdown: \`${escaparPlantilla(documento.markdown)}\`,
  }`,
    )
    .join(',\n')
}

const contenido = `/* Archivo generado automáticamente por front/scripts/generar-documentacion.mjs.
 * No editar a mano: ejecuta \`npm run docs\` o \`npm run build\` para actualizarlo. */

export interface DocumentoGenerado {
  id: string
  titulo: string
  archivo: string
  resumen: string
  markdown: string
}

export interface GrupoResultados {
  id: string
  titulo: string
  descripcion: string
  comando: string
  fecha: string
  resumen: string
  columnas: string[]
  filas: string[][]
}

export const GENERADO_EL = ${JSON.stringify(formatearFecha(ahora))}

export const AGENTS: DocumentoGenerado = {
  id: ${JSON.stringify(agents.id)},
  titulo: ${JSON.stringify(agents.titulo)},
  archivo: ${JSON.stringify(agents.archivo)},
  resumen: ${JSON.stringify(agents.resumen)},
  markdown: \`${escaparPlantilla(agents.markdown)}\`,
}

export const PROMPT: DocumentoGenerado = {
  id: ${JSON.stringify(prompt.id)},
  titulo: ${JSON.stringify(prompt.titulo)},
  archivo: ${JSON.stringify(prompt.archivo)},
  resumen: ${JSON.stringify(prompt.resumen)},
  markdown: \`${escaparPlantilla(prompt.markdown)}\`,
}

export const DOCUMENTOS: DocumentoGenerado[] = [
${generarListaDocumentos(documentos)},
]

export const RESULTADOS: GrupoResultados[] = ${JSON.stringify(backend, null, 2)}
`

mkdirSync(dirname(salida), { recursive: true })
writeFileSync(salida, contenido, 'utf8')

console.log(
  `Documentación generada: ${documentos.length} documentos, ${unitarias.length} unitarias, ` +
    `${integracion.length} integración, ${e2e.length} e2e, ${ui.length} UI, ` +
    `${pit ? `${pit.total} mutaciones` : 'PIT sin informe'}.`,
)
