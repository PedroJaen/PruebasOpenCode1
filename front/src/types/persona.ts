export type Sexo = 'MASCULINO' | 'FEMENINO' | 'OTRO'

export interface Persona {
  id: number
  nombre: string
  apellido: string
  edad: number
  sexo: Sexo
  direccion: string
  fechaNacimiento: string
}

/** Datos que envía el frontend al crear o editar una persona. */
export type PersonaInput = Omit<Persona, 'id' | 'edad'>

export const OPCIONES_SEXO: ReadonlyArray<{ valor: Sexo; etiqueta: string }> = [
  { valor: 'FEMENINO', etiqueta: 'Femenino' },
  { valor: 'MASCULINO', etiqueta: 'Masculino' },
  { valor: 'OTRO', etiqueta: 'Otro' },
]

export const ETIQUETA_SEXO: Record<Sexo, string> = {
  FEMENINO: 'Femenino',
  MASCULINO: 'Masculino',
  OTRO: 'Otro',
}

export type ValidacionesApi = Record<string, string>

export function nombreCompleto(persona: Persona): string {
  return `${persona.nombre} ${persona.apellido}`
}

export function iniciales(persona: Persona): string {
  return `${persona.nombre.charAt(0)}${persona.apellido.charAt(0)}`.toUpperCase()
}

/** Convierte una fecha ISO (yyyy-MM-dd) al formato español dd/mm/aaaa. */
export function formatearFecha(iso: string): string {
  const [anio, mes, dia] = iso.split('-')
  if (!anio || !mes || !dia) {
    return iso
  }
  return `${dia}/${mes}/${anio}`
}

export function hoyIso(): string {
  const hoy = new Date()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${hoy.getFullYear()}-${mes}-${dia}`
}

export function ordenarPersonas(personas: Persona[]): Persona[] {
  return [...personas].sort((a, b) =>
    `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`, 'es', {
      sensitivity: 'base',
    }),
  )
}
