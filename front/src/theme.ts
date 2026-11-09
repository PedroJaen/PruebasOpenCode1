/** Preferencias visuales de PruebasOpenCode1. Se guardan en localStorage. */
export type Tema = 'claro' | 'oscuro' | 'sistema'

const CLAVE_TEMA = 'pruebasopencode1.tema'
const CONSULTA_OSCURO = '(prefers-color-scheme: dark)'

/** Lee la preferencia guardada; si no existe, respeta el sistema. */
export function leerTema(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA)
    if (guardado === 'claro' || guardado === 'oscuro' || guardado === 'sistema') {
      return guardado
    }
  } catch {
    // localStorage puede no estar disponible (modo privado, políticas, etc.).
  }
  return 'sistema'
}

export function esTemaOscuro(tema: Tema): boolean {
  return tema === 'oscuro' || (tema === 'sistema' && window.matchMedia(CONSULTA_OSCURO).matches)
}

/** Aplica el tema al documento y persiste la preferencia. */
export function aplicarTema(tema: Tema): void {
  const oscuro = esTemaOscuro(tema)
  document.documentElement.dataset.tema = oscuro ? 'oscuro' : 'claro'
  document.documentElement.style.colorScheme = oscuro ? 'dark' : 'light'
  try {
    localStorage.setItem(CLAVE_TEMA, tema)
  } catch {
    // La aplicación sigue funcionando aunque no se pueda persistir.
  }
}

/** Inicializa el tema al arrancar y escucha cambios del sistema. */
export function inicializarTema(): void {
  aplicarTema(leerTema())
  window.matchMedia(CONSULTA_OSCURO).addEventListener('change', () => {
    if (leerTema() === 'sistema') {
      aplicarTema('sistema')
    }
  })
}

/** Alterna entre claro y oscuro conservando el resto de preferencias. */
export function siguienteTema(tema: Tema): Tema {
  return esTemaOscuro(tema) ? 'claro' : 'oscuro'
}
