import { api } from './client'
import type { Persona, PersonaInput } from '../types/persona'

/** Servicio de comunicación con los endpoints de personas del backend. */
export const personasApi = {
  listar(): Promise<Persona[]> {
    return api.get<Persona[]>('/personas')
  },

  obtener(id: number): Promise<Persona> {
    return api.get<Persona>(`/personas/${id}`)
  },

  crear(datos: PersonaInput): Promise<Persona> {
    return api.post<Persona>('/personas', datos)
  },

  actualizar(id: number, datos: PersonaInput): Promise<Persona> {
    return api.put<Persona>(`/personas/${id}`, datos)
  },

  eliminar(id: number): Promise<void> {
    return api.delete<void>(`/personas/${id}`)
  },

  restablecer(): Promise<Persona[]> {
    return api.post<Persona[]>('/personas/reset')
  },
}
