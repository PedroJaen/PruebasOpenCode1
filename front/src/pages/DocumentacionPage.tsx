import { useMemo, useState } from 'react'
import { Markdown } from '../components/Markdown'
import { Icono } from '../components/Icono'
import {
  AGENTS,
  DOCUMENTOS,
  GENERADO_EL,
  PROMPT,
  RESULTADOS,
  type GrupoResultados,
} from '../content/documentacion.generated'

function irASeccion(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const ETIQUETAS_DOCUMENTO: Record<string, string> = {
  'README.md': 'README',
  'ARQUITECTURA.md': 'Arquitectura',
  'SEGURIDAD.md': 'Seguridad',
  'API.md': 'API',
  'EJECUCION.md': 'Ejecución',
  'PRUEBAS.md': 'Pruebas',
  'MANUAL_USUARIO.md': 'Manual de usuario',
  'OPERACION.md': 'Operación',
  'DESPLIEGUE.md': 'Despliegue',
  'SEGUIMIENTO.md': 'Seguimiento',
}

function claseResultado(valor: string): string {
  if (/superad|correct|ok|verificad/i.test(valor)) {
    return 'resultado resultado--ok'
  }
  if (/revisar|fall|error/i.test(valor)) {
    return 'resultado resultado--mal'
  }
  return 'resultado resultado--aviso'
}

function celdaEsCodigo(columna: string): boolean {
  return /método|metodo|comando|archivo/i.test(columna)
}

function TablaResultados({ grupo }: { grupo: GrupoResultados }) {
  return (
    <article className="resultados-grupo" id={`resultados-${grupo.id}`}>
      <header className="resultados-grupo__cabecera">
        <div>
          <h3>{grupo.titulo}</h3>
          <p>{grupo.descripcion}</p>
        </div>
        <div className="resultados-grupo__meta">
          <span className={claseResultado(grupo.resumen)}>{grupo.resumen}</span>
          {grupo.fecha ? <span className="resultados-grupo__fecha">{grupo.fecha}</span> : null}
        </div>
      </header>

      <div className="resultados-grupo__comando">
        <code>{grupo.comando}</code>
      </div>

      <div className="resultados-tabla-envoltorio">
        <table className="resultados-tabla">
          <thead>
            <tr>
              {grupo.columnas.map((columna) => (
                <th key={columna}>{columna}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grupo.filas.map((fila, indiceFila) => (
              <tr key={`${grupo.id}-${indiceFila}`}>
                {fila.map((celda, indiceCelda) => {
                  const columna = grupo.columnas[indiceCelda] ?? ''
                  if (/resultado/i.test(columna)) {
                    return (
                      <td key={`${grupo.id}-${indiceFila}-${indiceCelda}`}>
                        <span className={claseResultado(celda)}>{celda}</span>
                      </td>
                    )
                  }
                  if (celdaEsCodigo(columna)) {
                    return (
                      <td key={`${grupo.id}-${indiceFila}-${indiceCelda}`}>
                        <code>{celda}</code>
                      </td>
                    )
                  }
                  return <td key={`${grupo.id}-${indiceFila}-${indiceCelda}`}>{celda}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export function DocumentacionPage() {
  const [docActivo, setDocActivo] = useState(DOCUMENTOS[0]?.id ?? '')
  const [estadoCopia, setEstadoCopia] = useState<'inicial' | 'copiado' | 'error'>('inicial')

  const documentoActivo = useMemo(
    () => DOCUMENTOS.find((documento) => documento.id === docActivo) ?? DOCUMENTOS[0],
    [docActivo],
  )

  const resumen = useMemo(() => {
    const backend = RESULTADOS.filter(
      (grupo) => grupo.id === 'unitarias' || grupo.id === 'integracion-backend',
    ).reduce((total, grupo) => total + grupo.filas.length, 0)
    const e2e = RESULTADOS.find((grupo) => grupo.id === 'integracion-e2e')?.filas.length ?? 0
    const ui = RESULTADOS.find((grupo) => grupo.id === 'interfaz')?.filas.length ?? 0
    const mutacion = RESULTADOS.find((grupo) => grupo.id === 'mutacion')
    const filaTotal = mutacion?.filas.find((fila) => fila[0]?.toLowerCase().startsWith('total'))
    return {
      documentos: DOCUMENTOS.length,
      backend,
      navegador: e2e + ui,
      mutaciones: filaTotal ? Number(filaTotal[1]) : 0,
    }
  }, [])

  function navegarADocumento(id: string) {
    if (id === 'prompt' || id === 'agents') {
      irASeccion(id)
      return
    }
    if (DOCUMENTOS.some((documento) => documento.id === id)) {
      setDocActivo(id)
      irASeccion('documentacion')
    }
  }

  async function copiarPrompt() {
    try {
      await navigator.clipboard.writeText(PROMPT.markdown)
      setEstadoCopia('copiado')
    } catch {
      setEstadoCopia('error')
    }
    window.setTimeout(() => setEstadoCopia('inicial'), 2600)
  }

  return (
    <div className="documentacion">
      <header className="pagina-cabecera documentacion__cabecera">
        <div className="pagina-cabecera__texto">
          <span className="seccion__etiqueta">Documentación viva</span>
          <h1>Todo PruebasOpenCode1, siempre al día</h1>
          <p>
            Prompt de reconstrucción, documentación general, reglas del proyecto y resultados reales
            de las pruebas. El contenido se genera desde las fuentes del repositorio.
          </p>
        </div>
        <div className="documentacion__sello">
          <Icono nombre="codigo" tamano={18} />
          <span>
            Generado el <strong>{GENERADO_EL}</strong>
          </span>
        </div>
      </header>

      <div className="documentacion__layout">
        <aside className="documentacion__indice">
          <nav aria-label="Secciones de la documentación">
            <p className="documentacion__indice-titulo">Contenido</p>
            <button type="button" onClick={() => irASeccion('resumen')}>
              Resumen
            </button>
            <button type="button" onClick={() => irASeccion('prompt')}>
              Prompt de reconstrucción
            </button>
            <button type="button" onClick={() => irASeccion('documentacion')}>
              Documentación general
            </button>
            <button type="button" onClick={() => irASeccion('agents')}>
              AGENTS.md
            </button>
            <button type="button" onClick={() => irASeccion('resultados')}>
              Resultados de pruebas
            </button>
          </nav>

          <div className="documentacion__indice-nota">
            <p>Se actualiza sola</p>
            <span>
              <code>npm run docs</code> se ejecuta antes de <code>npm run dev</code> y de{' '}
              <code>npm run build</code>.
            </span>
          </div>
        </aside>

        <div className="documentacion__contenido">
          <section className="doc-seccion" id="resumen">
            <div className="doc-seccion__cabecera">
              <span className="doc-seccion__etiqueta">Resumen</span>
              <h2>Qué vas a encontrar aquí</h2>
              <p>
                Esta pantalla reúne la información necesaria para entender, ejecutar y reconstruir
                PruebasOpenCode1 sin depender de archivos externos.
              </p>
            </div>

            <div className="documentacion__metricas">
              <article>
                <span>{resumen.documentos}</span>
                <p>documentos enlazados</p>
              </article>
              <article>
                <span>{resumen.backend}</span>
                <p>pruebas de backend</p>
              </article>
              <article>
                <span>{resumen.navegador}</span>
                <p>comprobaciones de integración y UI</p>
              </article>
              <article>
                <span>{resumen.mutaciones}</span>
                <p>mutaciones analizadas con PIT</p>
              </article>
            </div>

            <div className="documentacion__accesos">
              <button type="button" onClick={() => irASeccion('prompt')}>
                <Icono nombre="rayo" tamano={20} />
                <span>
                  <strong>Reconstruir la aplicación</strong>
                  Prompt completo con stack, estructura y criterios de aceptación.
                </span>
              </button>
              <button type="button" onClick={() => irASeccion('documentacion')}>
                <Icono nombre="codigo" tamano={20} />
                <span>
                  <strong>Leer la documentación</strong>
                  Arquitectura, API, ejecución, pruebas, manual y operación.
                </span>
              </button>
              <button type="button" onClick={() => irASeccion('agents')}>
                <Icono nombre="escudo" tamano={20} />
                <span>
                  <strong>Consultar AGENTS.md</strong>
                  Normas y requisitos que rigen el desarrollo del proyecto.
                </span>
              </button>
              <button type="button" onClick={() => irASeccion('resultados')}>
                <Icono nombre="check" tamano={20} />
                <span>
                  <strong>Ver resultados de pruebas</strong>
                  Una tabla por tipo de prueba, generada desde las fuentes.
                </span>
              </button>
            </div>
          </section>

          <section className="doc-seccion" id="prompt">
            <div className="doc-seccion__cabecera doc-seccion__cabecera--accion">
              <div>
                <span className="doc-seccion__etiqueta">Prompt</span>
                <h2>Reconstrucción desde cero</h2>
                <p>
                  Pega este prompt en un agente de programación para generar una aplicación
                  equivalente al estado actual de PruebasOpenCode1.
                </p>
              </div>
              <button type="button" className="boton boton--primario" onClick={() => void copiarPrompt()}>
                <Icono nombre={estadoCopia === 'copiado' ? 'check' : 'codigo'} tamano={18} />
                {estadoCopia === 'copiado'
                  ? 'Prompt copiado'
                  : estadoCopia === 'error'
                    ? 'No se pudo copiar'
                    : 'Copiar prompt'}
              </button>
            </div>

            <div className="doc-panel doc-panel--markdown">
              <Markdown markdown={PROMPT.markdown} onNavigateDoc={navegarADocumento} />
            </div>
          </section>

          <section className="doc-seccion" id="documentacion">
            <div className="doc-seccion__cabecera">
              <span className="doc-seccion__etiqueta">Documentación general</span>
              <h2>Guías del proyecto</h2>
              <p>
                Elige un documento. Los enlaces internos entre documentos también abren la pestaña
                correspondiente.
              </p>
            </div>

            <div className="doc-pestanas" role="tablist" aria-label="Documentos del proyecto">
              {DOCUMENTOS.map((documento) => (
                <button
                  type="button"
                  role="tab"
                  key={documento.id}
                  aria-selected={documentoActivo?.id === documento.id}
                  className={
                    documentoActivo?.id === documento.id
                      ? 'doc-pestana doc-pestana--activa'
                      : 'doc-pestana'
                  }
                  onClick={() => setDocActivo(documento.id)}
                >
                  {ETIQUETAS_DOCUMENTO[documento.archivo.split('/').pop() ?? documento.archivo] ??
                    documento.titulo}
                </button>
              ))}
            </div>

            {documentoActivo ? (
              <>
                <div className="doc-panel__meta">
                  <div>
                    <h3>{documentoActivo.titulo}</h3>
                    <p>{documentoActivo.resumen}</p>
                  </div>
                  <code>{documentoActivo.archivo}</code>
                </div>
                <div className="doc-panel doc-panel--markdown" role="tabpanel">
                  <Markdown
                    markdown={documentoActivo.markdown}
                    onNavigateDoc={navegarADocumento}
                  />
                </div>
              </>
            ) : null}
          </section>

          <section className="doc-seccion" id="agents">
            <div className="doc-seccion__cabecera">
              <span className="doc-seccion__etiqueta">Reglas del proyecto</span>
              <h2>{AGENTS.titulo}</h2>
              <p>{AGENTS.resumen}</p>
            </div>

            <div className="doc-panel doc-panel--markdown">
              <Markdown markdown={AGENTS.markdown} onNavigateDoc={navegarADocumento} />
            </div>
          </section>

          <section className="doc-seccion" id="resultados">
            <div className="doc-seccion__cabecera">
              <span className="doc-seccion__etiqueta">Calidad</span>
              <h2>Resultados de las pruebas</h2>
              <p>
                Una tabla por tipo de prueba. Los nombres se leen de los tests y de los scripts de
                verificación; los resultados de backend, del informe de Surefire, y los de mutación,
                del informe de PIT.
              </p>
            </div>

            <div className="resultados-lista">
              {RESULTADOS.map((grupo) => (
                <TablaResultados grupo={grupo} key={grupo.id} />
              ))}
            </div>

            <p className="documentacion__nota">
              Las comprobaciones de integración y de interfaz se marcan como superadas según la
              última verificación registrada en <code>docs/SEGUIMIENTO.md</code>. Si fallan, el
              seguimiento y esta página deben actualizarse en el mismo cambio.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
