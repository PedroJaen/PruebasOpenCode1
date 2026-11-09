import { Fragment, type ReactNode } from 'react'

interface Props {
  markdown: string
  onNavigateDoc?: (id: string) => void
}

interface ItemLista {
  texto: string
  hijos: ListaMarkdown[]
}

interface ListaMarkdown {
  ordenada: boolean
  items: ItemLista[]
}

type Bloque =
  | { tipo: 'titulo'; nivel: number; texto: string }
  | { tipo: 'parrafo'; texto: string }
  | { tipo: 'codigo'; lenguaje: string; codigo: string }
  | { tipo: 'lista'; lista: ListaMarkdown }
  | { tipo: 'tabla'; cabecera: string[]; filas: string[][] }
  | { tipo: 'cita'; texto: string }
  | { tipo: 'separador' }

const PATRON_ITEM = /^(\s*)([-*+]|\d+\.)\s+(.*)$/
const PATRON_ENLACE = /^\[([^\]]+)\]\(([^)]+)\)$/
const PATRON_INLINE =
  /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\n]+\*|_[^_\n]+_)/g

function esSeparadorTabla(linea: string): boolean {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(linea.trim())
}

function celdasDeFila(linea: string): string[] {
  return linea
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((celda) => celda.trim())
}

function construirLista(lineas: string[]): ListaMarkdown {
  const raiz: ListaMarkdown = {
    ordenada: /^\s*\d+\.\s/.test(lineas[0] ?? ''),
    items: [],
  }
  const pila: Array<{ indent: number | null; lista: ListaMarkdown }> = [
    { indent: null, lista: raiz },
  ]

  for (const linea of lineas) {
    const coincidencia = linea.match(PATRON_ITEM)
    if (!coincidencia) {
      const ultima = pila[pila.length - 1]?.lista.items.at(-1)
      if (ultima && linea.trim()) {
        ultima.texto = `${ultima.texto} ${linea.trim()}`
      }
      continue
    }

    const indent = coincidencia[1].length
    const ordenada = /\d+\./.test(coincidencia[2])

    while (pila.length > 1 && indent < (pila[pila.length - 1].indent ?? -1)) {
      pila.pop()
    }

    let actual = pila[pila.length - 1]
    if (actual.indent === null) {
      actual.indent = indent
    }

    if (indent > actual.indent && actual.lista.items.length > 0) {
      const padre = actual.lista.items[actual.lista.items.length - 1]
      const nueva: ListaMarkdown = { ordenada, items: [] }
      padre.hijos.push(nueva)
      actual = { indent, lista: nueva }
      pila.push(actual)
    }

    actual.lista.items.push({ texto: coincidencia[3], hijos: [] })
  }

  return raiz
}

function parsearMarkdown(markdown: string): Bloque[] {
  const lineas = markdown.replace(/\r\n/g, '\n').split('\n')
  const bloques: Bloque[] = []
  let i = 0

  while (i < lineas.length) {
    const linea = lineas[i]

    if (!linea.trim()) {
      i += 1
      continue
    }

    const cercado = linea.match(/^```(\w*)\s*$/)
    if (cercado) {
      const codigo: string[] = []
      i += 1
      while (i < lineas.length && !/^```\s*$/.test(lineas[i])) {
        codigo.push(lineas[i])
        i += 1
      }
      i += 1
      bloques.push({ tipo: 'codigo', lenguaje: cercado[1], codigo: codigo.join('\n') })
      continue
    }

    const titulo = linea.match(/^(#{1,6})\s+(.*)$/)
    if (titulo) {
      bloques.push({ tipo: 'titulo', nivel: titulo[1].length, texto: titulo[2].trim() })
      i += 1
      continue
    }

    if (/^\s*([-*_])\s*\1\s*\1[\s\S]*$/.test(linea) && linea.trim().length >= 3) {
      bloques.push({ tipo: 'separador' })
      i += 1
      continue
    }

    if (linea.trimStart().startsWith('|') && i + 1 < lineas.length && esSeparadorTabla(lineas[i + 1])) {
      const cabecera = celdasDeFila(linea)
      const filas: string[][] = []
      i += 2
      while (i < lineas.length && lineas[i].trimStart().startsWith('|')) {
        filas.push(celdasDeFila(lineas[i]))
        i += 1
      }
      bloques.push({ tipo: 'tabla', cabecera, filas })
      continue
    }

    if (/^\s*>\s?/.test(linea)) {
      const cita: string[] = []
      while (i < lineas.length && /^\s*>\s?/.test(lineas[i])) {
        cita.push(lineas[i].replace(/^\s*>\s?/, ''))
        i += 1
      }
      bloques.push({ tipo: 'cita', texto: cita.join(' ') })
      continue
    }

    if (PATRON_ITEM.test(linea)) {
      const lista: string[] = []
      while (i < lineas.length) {
        const actual = lineas[i]
        if (PATRON_ITEM.test(actual)) {
          lista.push(actual)
          i += 1
          continue
        }
        if (actual.trim() && /^\s{2,}/.test(actual) && !actual.trimStart().startsWith('|')) {
          lista.push(actual)
          i += 1
          continue
        }
        break
      }
      bloques.push({ tipo: 'lista', lista: construirLista(lista) })
      continue
    }

    const parrafo: string[] = []
    while (i < lineas.length) {
      const actual = lineas[i]
      if (
        !actual.trim() ||
        /^```/.test(actual) ||
        /^(#{1,6})\s+/.test(actual) ||
        /^\s*>\s?/.test(actual) ||
        PATRON_ITEM.test(actual) ||
        actual.trimStart().startsWith('|')
      ) {
        break
      }
      parrafo.push(actual.trim())
      i += 1
    }
    bloques.push({ tipo: 'parrafo', texto: parrafo.join(' ') })
  }

  return bloques
}

function renderEnlace(token: string, clave: string, onNavigateDoc?: (id: string) => void): ReactNode {
  const coincidencia = token.match(PATRON_ENLACE)
  if (!coincidencia) {
    return token
  }

  const [, texto, url] = coincidencia
  if (/\.md$/i.test(url) && onNavigateDoc) {
    const id = url
      .replace(/^\.\//, '')
      .replace(/^docs\//, '')
      .replace(/\.md$/i, '')
      .toLowerCase()
    return (
      <button
        className="markdown__enlace-doc"
        key={clave}
        type="button"
        onClick={() => onNavigateDoc(id)}
      >
        {texto}
      </button>
    )
  }

  return (
    <a
      className="markdown__enlace"
      href={url}
      key={clave}
      {...(/^https?:/i.test(url) ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {texto}
    </a>
  )
}

function renderInline(
  texto: string,
  clave: string,
  onNavigateDoc?: (id: string) => void,
): ReactNode {
  const nodos: ReactNode[] = []
  let ultimo = 0
  PATRON_INLINE.lastIndex = 0

  let coincidencia = PATRON_INLINE.exec(texto)
  while (coincidencia !== null) {
    if (coincidencia.index > ultimo) {
      nodos.push(texto.slice(ultimo, coincidencia.index))
    }

    const token = coincidencia[0]
    const claveToken = `${clave}-${nodos.length}`

    if (token.startsWith('**') || token.startsWith('__')) {
      nodos.push(<strong key={claveToken}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      nodos.push(
        <code className="markdown__codigo" key={claveToken}>
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith('[')) {
      nodos.push(
        <Fragment key={claveToken}>{renderEnlace(token, claveToken, onNavigateDoc)}</Fragment>,
      )
    } else {
      nodos.push(<em key={claveToken}>{token.slice(1, -1)}</em>)
    }

    ultimo = coincidencia.index + token.length
    coincidencia = PATRON_INLINE.exec(texto)
  }

  if (ultimo < texto.length) {
    nodos.push(texto.slice(ultimo))
  }

  return nodos
}

function renderLista(
  lista: ListaMarkdown,
  clave: string,
  onNavigateDoc?: (id: string) => void,
): ReactNode {
  const Etiqueta = lista.ordenada ? 'ol' : 'ul'
  return (
    <Etiqueta className={lista.ordenada ? 'markdown__lista markdown__lista--ordenada' : 'markdown__lista'}>
      {lista.items.map((item, indice) => (
        <li key={`${clave}-${indice}`}>
          {renderInline(item.texto, `${clave}-${indice}`, onNavigateDoc)}
          {item.hijos.map((hijo, indiceHijo) => (
            <Fragment key={`${clave}-${indice}-${indiceHijo}`}>
              {renderLista(hijo, `${clave}-${indice}-${indiceHijo}`, onNavigateDoc)}
            </Fragment>
          ))}
        </li>
      ))}
    </Etiqueta>
  )
}

function renderBloque(
  bloque: Bloque,
  indice: number,
  onNavigateDoc?: (id: string) => void,
): ReactNode {
  const clave = `bloque-${indice}`

  switch (bloque.tipo) {
    case 'titulo': {
      const nivel = Math.min(6, bloque.nivel + 1) as 2 | 3 | 4 | 5 | 6
      const Etiqueta = `h${nivel}` as const
      return (
        <Etiqueta className={`markdown__titulo markdown__titulo--${nivel}`} key={clave}>
          {renderInline(bloque.texto, clave, onNavigateDoc)}
        </Etiqueta>
      )
    }
    case 'parrafo':
      return (
        <p className="markdown__parrafo" key={clave}>
          {renderInline(bloque.texto, clave, onNavigateDoc)}
        </p>
      )
    case 'codigo':
      return (
        <pre className="markdown__pre" key={clave}>
          <code data-lenguaje={bloque.lenguaje || undefined}>{bloque.codigo}</code>
        </pre>
      )
    case 'lista':
      return <Fragment key={clave}>{renderLista(bloque.lista, clave, onNavigateDoc)}</Fragment>
    case 'tabla':
      return (
        <div className="markdown__tabla-envoltorio" key={clave}>
          <table className="markdown__tabla">
            <thead>
              <tr>
                {bloque.cabecera.map((celda, indiceCelda) => (
                  <th key={`${clave}-th-${indiceCelda}`}>
                    {renderInline(celda, `${clave}-th-${indiceCelda}`, onNavigateDoc)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloque.filas.map((fila, indiceFila) => (
                <tr key={`${clave}-tr-${indiceFila}`}>
                  {fila.map((celda, indiceCelda) => (
                    <td key={`${clave}-td-${indiceFila}-${indiceCelda}`}>
                      {renderInline(celda, `${clave}-td-${indiceFila}-${indiceCelda}`, onNavigateDoc)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'cita':
      return (
        <blockquote className="markdown__cita" key={clave}>
          {renderInline(bloque.texto, clave, onNavigateDoc)}
        </blockquote>
      )
    case 'separador':
      return <hr className="markdown__separador" key={clave} />
  }
}

export function Markdown({ markdown, onNavigateDoc }: Props) {
  return (
    <div className="markdown">
      {parsearMarkdown(markdown).map((bloque, indice) =>
        renderBloque(bloque, indice, onNavigateDoc),
      )}
    </div>
  )
}
