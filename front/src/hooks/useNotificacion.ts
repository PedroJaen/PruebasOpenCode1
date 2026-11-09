import { useCallback, useEffect, useRef, useState } from 'react'

export type TipoNotificacion = 'exito' | 'error'

export interface Notificacion {
  id: number
  tipo: TipoNotificacion
  texto: string
}

const DURACION_MS = 5000

/** Gestiona el mensaje flotante de éxito o error. */
export function useNotificacion() {
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null)
  const temporizador = useRef<number | null>(null)

  const mostrar = useCallback((tipo: TipoNotificacion, texto: string) => {
    if (temporizador.current !== null) {
      window.clearTimeout(temporizador.current)
    }
    setNotificacion({ id: Date.now(), tipo, texto })
    temporizador.current = window.setTimeout(() => {
      setNotificacion(null)
      temporizador.current = null
    }, DURACION_MS)
  }, [])

  const cerrar = useCallback(() => {
    if (temporizador.current !== null) {
      window.clearTimeout(temporizador.current)
      temporizador.current = null
    }
    setNotificacion(null)
  }, [])

  useEffect(() => {
    return () => {
      if (temporizador.current !== null) {
        window.clearTimeout(temporizador.current)
      }
    }
  }, [])

  return {
    notificacion,
    mostrarExito: useCallback((texto: string) => mostrar('exito', texto), [mostrar]),
    mostrarError: useCallback((texto: string) => mostrar('error', texto), [mostrar]),
    cerrar,
  }
}
