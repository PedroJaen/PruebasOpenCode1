import { useCallback, useEffect, useState } from 'react'
import { personasApi } from '../api/personas'
import { asegurarSesion } from '../api/auth'
import { mensajeDeError } from '../api/client'
import { ordenarPersonas, type Persona, type PersonaInput } from '../types/persona'

/**
 * Estado y operaciones de personas contra la API real. No se guarda ninguna
 * copia local persistente: la fuente de verdad es siempre el backend.
 */
export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setErrorCarga(null)
    try {
      // Autologin transparente: solo se ejecuta al entrar en la gestión de
      // personas y se reutiliza durante toda la sesión del navegador.
      await asegurarSesion()
      const datos = await personasApi.listar()
      setPersonas(ordenarPersonas(datos))
    } catch (error) {
      setErrorCarga(mensajeDeError(error))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  const crear = useCallback(async (datos: PersonaInput): Promise<Persona> => {
    setGuardando(true)
    try {
      const creada = await personasApi.crear(datos)
      setPersonas((previas) => ordenarPersonas([...previas, creada]))
      return creada
    } finally {
      setGuardando(false)
    }
  }, [])

  const actualizar = useCallback(async (id: number, datos: PersonaInput): Promise<Persona> => {
    setGuardando(true)
    try {
      const actualizada = await personasApi.actualizar(id, datos)
      setPersonas((previas) =>
        ordenarPersonas(previas.map((persona) => (persona.id === id ? actualizada : persona))),
      )
      return actualizada
    } finally {
      setGuardando(false)
    }
  }, [])

  const eliminar = useCallback(async (id: number): Promise<void> => {
    setGuardando(true)
    try {
      await personasApi.eliminar(id)
      setPersonas((previas) => previas.filter((persona) => persona.id !== id))
    } finally {
      setGuardando(false)
    }
  }, [])

  const restablecer = useCallback(async (): Promise<Persona[]> => {
    setGuardando(true)
    try {
      const datos = await personasApi.restablecer()
      const ordenadas = ordenarPersonas(datos)
      setPersonas(ordenadas)
      return ordenadas
    } finally {
      setGuardando(false)
    }
  }, [])

  return {
    personas,
    cargando,
    guardando,
    errorCarga,
    recargar: cargar,
    crear,
    actualizar,
    eliminar,
    restablecer,
  }
}
