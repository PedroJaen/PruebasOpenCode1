import type { ValidacionesApi } from '../types/persona'

const configurada = import.meta.env.VITE_API_BASE_URL?.trim()
export const API_BASE_URL = (configurada && configurada.length > 0 ? configurada : '/api/v1').replace(
  /\/+$/,
  '',
)

interface CuerpoProblemaApi {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  validaciones?: ValidacionesApi
}

/**
 * Error de comunicación con la API. Conserva el código HTTP, el título y las
 * validaciones por campo de una respuesta RFC 9457 (`application/problem+json`).
 */
export class ApiError extends Error {
  readonly estado: number | null
  readonly validaciones: ValidacionesApi | null
  readonly tipo: string | null
  readonly titulo: string | null

  constructor(
    mensaje: string,
    estado: number | null = null,
    validaciones: ValidacionesApi | null = null,
    tipo: string | null = null,
    titulo: string | null = null,
  ) {
    super(mensaje)
    this.name = 'ApiError'
    this.estado = estado
    this.validaciones = validaciones
    this.tipo = tipo
    this.titulo = titulo
  }
}

/** Devuelve el token Bearer en memoria. Se registra desde `auth.ts`. */
let proveedorToken: (() => string | null) | null = null

export function configurarProveedorToken(proveedor: () => string | null): void {
  proveedorToken = proveedor
}

/**
 * Función que vuelve a autenticar cuando la API responde 401. Se registra
 * desde `auth.ts` para evitar dependencias circulares.
 */
let reautenticador: (() => Promise<void>) | null = null

export function configurarReautenticacion(nueva: () => Promise<void>): void {
  reautenticador = nueva
}

/** Indica si una ruta pertenece al propio flujo de autenticación. */
function esRutaDeAutenticacion(ruta: string): boolean {
  return ruta.startsWith('/auth/')
}

async function ejecutarPeticion(ruta: string, opciones: RequestInit): Promise<Response> {
  const token = proveedorToken?.() ?? null
  const cabeceras: Record<string, string> = {
    Accept: 'application/json, application/problem+json',
    ...(opciones.body === undefined ? {} : { 'Content-Type': 'application/json' }),
    ...(opciones.headers as Record<string, string> | undefined),
  }
  if (token) {
    cabeceras.Authorization = `Bearer ${token}`
  }

  try {
    return await fetch(`${API_BASE_URL}${ruta}`, {
      ...opciones,
      // El token viaja en la cabecera Authorization; no se usan cookies.
      credentials: 'omit',
      headers: cabeceras,
    })
  } catch {
    throw new ApiError(
      'No se pudo conectar con el servidor. Comprueba que el backend de PruebasOpenCode1 esté en marcha.',
    )
  }
}

async function solicitar<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  let respuesta = await ejecutarPeticion(ruta, opciones)

  // Si el token ha caducado o el backend se ha reiniciado, se renueva una vez
  // de forma transparente y se repite la petición original. El login nunca se
  // reintenta para no entrar en un bucle de credenciales incorrectas.
  if (respuesta.status === 401 && reautenticador && !esRutaDeAutenticacion(ruta)) {
    await reautenticador()
    respuesta = await ejecutarPeticion(ruta, opciones)
  }

  if (!respuesta.ok) {
    let cuerpo: CuerpoProblemaApi | null = null
    try {
      cuerpo = (await respuesta.json()) as CuerpoProblemaApi
    } catch {
      cuerpo = null
    }

    const mensaje =
      cuerpo?.detail ??
      cuerpo?.title ??
      `La operación ha fallado (código HTTP ${respuesta.status}).`
    throw new ApiError(
      mensaje,
      respuesta.status,
      cuerpo?.validaciones ?? null,
      cuerpo?.type ?? null,
      cuerpo?.title ?? null,
    )
  }

  if (respuesta.status === 204) {
    return undefined as T
  }

  return (await respuesta.json()) as T
}

export const api = {
  get<T>(ruta: string): Promise<T> {
    return solicitar<T>(ruta)
  },
  post<T>(ruta: string, cuerpo?: unknown): Promise<T> {
    return solicitar<T>(ruta, {
      method: 'POST',
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    })
  },
  put<T>(ruta: string, cuerpo: unknown): Promise<T> {
    return solicitar<T>(ruta, {
      method: 'PUT',
      body: JSON.stringify(cuerpo),
    })
  },
  delete<T>(ruta: string): Promise<T> {
    return solicitar<T>(ruta, { method: 'DELETE' })
  },
}

export function mensajeDeError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  return 'Se ha producido un error inesperado. Inténtalo de nuevo.'
}
