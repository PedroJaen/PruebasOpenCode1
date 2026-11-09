import { useCallback, useEffect, useState } from 'react'
import { aplicarTema, esTemaOscuro, leerTema, siguienteTema, type Tema } from '../theme'

/** Estado del tema con persistencia en localStorage. */
export function useTema() {
  const [tema, setTema] = useState<Tema>(() => leerTema())
  const [oscuro, setOscuro] = useState(() => esTemaOscuro(leerTema()))

  useEffect(() => {
    aplicarTema(tema)
    setOscuro(esTemaOscuro(tema))

    if (tema !== 'sistema') {
      return
    }
    const consulta = window.matchMedia('(prefers-color-scheme: dark)')
    const alCambiar = () => {
      aplicarTema('sistema')
      setOscuro(consulta.matches)
    }
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [tema])

  const alternar = useCallback(() => {
    setTema((actual) => siguienteTema(actual))
  }, [])

  return { tema, oscuro, alternar }
}
