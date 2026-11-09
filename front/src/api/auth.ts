import { api, configurarProveedorToken, configurarReautenticacion } from './client'

/** Estado que devuelve el backend para la sesión autenticada. */
export interface SesionApi {
  autenticado: boolean
  usuario: string | null
  rol: string | null
  expiraEn: string | null
}

/** Respuesta del login con un token Bearer de corta duración. */
interface TokenApi {
  token: string
  tipo: string
  expiraEn: string
  segundosRestantes: number
  usuario: string
  rol: string
}

/**
 * Credenciales fijas del autologin transparente. Se configuran con
 * `VITE_AUTH_USERNAME` y `VITE_AUTH_PASSWORD` y deben coincidir con las del
 * backend (`APP_AUTH_USERNAME` / `APP_AUTH_PASSWORD`).
 *
 * Al formar parte del bundle del navegador no son un secreto real: este
 * mecanismo es válido para la demo local, no para producción.
 */
const USUARIO = import.meta.env.VITE_AUTH_USERNAME?.trim() || 'demo'
const CONTRASENA = import.meta.env.VITE_AUTH_PASSWORD || 'demo1234'

/** Se renueva el token este margen antes de que caduque. */
const MARGEN_RENOVACION_MS = 60_000

/** Eventos que la interfaz usa para avisar de la renovación o caducidad. */
export type EventoSesion = 'sesion-renovada' | 'sesion-caducada'
export type EscuchaSesion = (evento: EventoSesion) => void

const escuchas = new Set<EscuchaSesion>()

export function suscribirEventosSesion(escucha: EscuchaSesion): () => void {
  escuchas.add(escucha)
  return () => {
    escuchas.delete(escucha)
  }
}

function emitir(evento: EventoSesion): void {
  for (const escucha of escuchas) {
    escucha(evento)
  }
}

// El token vive únicamente en memoria: no se guarda en localStorage ni en
// cookies, de modo que cerrar o recargar la pestaña obliga a un nuevo login.
let token: string | null = null
let expiraEnMs = 0
let sesion: Promise<void> | null = null
let temporizador: number | null = null

function tokenVigente(): boolean {
  return token !== null && expiraEnMs - Date.now() > MARGEN_RENOVACION_MS
}

function programarRenovacion(): void {
  if (temporizador !== null) {
    window.clearTimeout(temporizador)
    temporizador = null
  }
  if (token === null) {
    return
  }
  const restante = expiraEnMs - Date.now() - MARGEN_RENOVACION_MS
  if (restante <= 0) {
    return
  }
  temporizador = window.setTimeout(() => {
    temporizador = null
    void renovarEnSegundoPlano()
  }, restante)
}

/** Realiza el login transparente con las credenciales fijas. */
async function iniciarSesion(): Promise<void> {
  const datos = await api.post<TokenApi>('/auth/login', {
    usuario: USUARIO,
    contrasena: CONTRASENA,
  })
  token = datos.token
  const expiracion = Date.parse(datos.expiraEn)
  expiraEnMs = Number.isNaN(expiracion)
    ? Date.now() + datos.segundosRestantes * 1000
    : expiracion
  programarRenovacion()
}

async function asegurarSesionInterna(): Promise<void> {
  if (tokenVigente()) {
    return
  }
  token = null
  expiraEnMs = 0
  await iniciarSesion()
}

/**
 * Garantiza que existe un token válido. Se ejecuta la primera vez que el
 * usuario entra en la gestión de personas y se reutiliza durante toda la vida
 * de la pestaña. Si falla, se olvida la promesa para permitir reintentos.
 */
export function asegurarSesion(): Promise<void> {
  if (!sesion) {
    sesion = asegurarSesionInterna().catch((error: unknown) => {
      sesion = null
      throw error
    })
  }
  return sesion
}

async function renovarEnSegundoPlano(): Promise<void> {
  try {
    await renovarSesion()
  } catch {
    // Si falla, la próxima petición volverá a intentarlo y mostrará el error.
  }
}

/**
 * Renueva el token desde cero. La usa el cliente HTTP cuando el backend
 * responde 401 porque el token ha caducado o el backend se ha reiniciado.
 */
async function renovarSesion(): Promise<void> {
  sesion = null
  token = null
  expiraEnMs = 0
  try {
    await asegurarSesion()
    emitir('sesion-renovada')
  } catch (error) {
    emitir('sesion-caducada')
    throw error
  }
}

/** Cierra la sesión en el backend e invalida el token local. */
export async function cerrarSesion(): Promise<void> {
  try {
    await api.post<void>('/auth/logout')
  } catch {
    // El logout es best-effort; el token local se descarta igualmente.
  } finally {
    token = null
    expiraEnMs = 0
    sesion = null
    if (temporizador !== null) {
      window.clearTimeout(temporizador)
      temporizador = null
    }
  }
}

configurarProveedorToken(() => token)
configurarReautenticacion(renovarSesion)
