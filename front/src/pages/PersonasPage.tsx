import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { suscribirEventosSesion } from '../api/auth'
import { mensajeDeError } from '../api/client'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Icono } from '../components/Icono'
import { NotificacionFlotante } from '../components/Notificacion'
import { PersonaForm } from '../components/PersonaForm'
import { PersonaTable } from '../components/PersonaTable'
import { useNotificacion } from '../hooks/useNotificacion'
import { usePersonas } from '../hooks/usePersonas'
import {
  ETIQUETA_SEXO,
  nombreCompleto,
  type Persona,
  type PersonaInput,
} from '../types/persona'

export function PersonasPage() {
  const {
    personas,
    cargando,
    guardando,
    errorCarga,
    recargar,
    crear,
    actualizar,
    eliminar,
    restablecer,
  } = usePersonas()

  const { notificacion, mostrarExito, mostrarError, cerrar } = useNotificacion()

  useEffect(() => {
    return suscribirEventosSesion((evento) => {
      if (evento === 'sesion-renovada') {
        mostrarExito('La sesión se ha renovado automáticamente.')
      } else {
        mostrarError('La sesión ha caducado. Recarga la página para volver a conectarte.')
      }
    })
  }, [mostrarExito, mostrarError])

  const [busqueda, setBusqueda] = useState('')
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [personaEditando, setPersonaEditando] = useState<Persona | null>(null)
  const [personaAEliminar, setPersonaAEliminar] = useState<Persona | null>(null)
  const [confirmarRestablecimiento, setConfirmarRestablecimiento] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [restableciendo, setRestableciendo] = useState(false)

  const personasFiltradas = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase('es')
    if (!consulta) {
      return personas
    }
    return personas.filter((persona) =>
      [persona.nombre, persona.apellido, persona.direccion, ETIQUETA_SEXO[persona.sexo]].some(
        (valor) => valor.toLocaleLowerCase('es').includes(consulta),
      ),
    )
  }, [busqueda, personas])

  function abrirCreacion() {
    setPersonaEditando(null)
    setFormularioAbierto(true)
  }

  function abrirEdicion(persona: Persona) {
    setPersonaEditando(persona)
    setFormularioAbierto(true)
  }

  function cerrarFormulario() {
    if (guardando) {
      return
    }
    setFormularioAbierto(false)
    setPersonaEditando(null)
  }

  async function manejarGuardar(datos: PersonaInput) {
    if (personaEditando) {
      await actualizar(personaEditando.id, datos)
      mostrarExito(`Se ha actualizado a ${datos.nombre} ${datos.apellido}.`)
    } else {
      await crear(datos)
      mostrarExito(`Se ha creado a ${datos.nombre} ${datos.apellido}.`)
    }
    setFormularioAbierto(false)
    setPersonaEditando(null)
  }

  async function confirmarEliminacion() {
    if (!personaAEliminar) {
      return
    }
    setEliminando(true)
    try {
      await eliminar(personaAEliminar.id)
      mostrarExito(`Se ha eliminado a ${nombreCompleto(personaAEliminar)}.`)
      setPersonaAEliminar(null)
    } catch (error) {
      mostrarError(mensajeDeError(error))
    } finally {
      setEliminando(false)
    }
  }

  async function confirmarRestablecer() {
    setRestableciendo(true)
    try {
      await restablecer()
      setBusqueda('')
      setConfirmarRestablecimiento(false)
      mostrarExito('Se han restablecido los 10 registros mock iniciales.')
    } catch (error) {
      mostrarError(mensajeDeError(error))
    } finally {
      setRestableciendo(false)
    }
  }

  const resumen =
    personasFiltradas.length === personas.length
      ? `${personas.length} ${personas.length === 1 ? 'persona' : 'personas'}`
      : `${personasFiltradas.length} de ${personas.length} personas`

  return (
    <>
      <div className="pagina-cabecera">
        <div className="pagina-cabecera__texto">
          <Link className="enlace-volver" to="/">
            <Icono nombre="volver" tamano={16} />
            Volver al inicio
          </Link>
          <h1>Gestión de personas</h1>
          <p>
            Consulta y administra el listado completo. Los cambios se guardan directamente en la
            base de datos del backend.
          </p>
        </div>

        <div className="pagina-cabecera__acciones">
          <button
            type="button"
            className="boton boton--secundario"
            onClick={() => setConfirmarRestablecimiento(true)}
            disabled={cargando || restableciendo}
          >
            <Icono nombre="restablecer" tamano={18} />
            Restablecer datos mock
          </button>
          <button type="button" className="boton boton--primario" onClick={abrirCreacion}>
            <Icono nombre="mas" tamano={18} />
            Nueva persona
          </button>
        </div>
      </div>

      <section className="panel" aria-label="Listado de personas">
        <div className="panel__barra">
          <div className="buscador">
            <Icono nombre="buscar" tamano={18} />
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar por nombre, apellido o dirección…"
              aria-label="Buscar personas"
            />
          </div>

          <div className="panel__meta">
            <span className="contador" aria-live="polite">
              {cargando ? 'Cargando…' : resumen}
            </span>
            <button
              type="button"
              className="boton-icono"
              onClick={() => void recargar()}
              disabled={cargando}
              title="Recargar listado"
              aria-label="Recargar listado"
            >
              <Icono nombre="refrescar" tamano={18} />
            </button>
          </div>
        </div>

        {errorCarga && (
          <div className="aviso aviso--error aviso--panel" role="alert">
            <Icono nombre="alerta" tamano={22} />
            <div className="aviso__contenido">
              <strong>No se pudo cargar el listado</strong>
              <p>{errorCarga}</p>
              <button
                type="button"
                className="boton boton--secundario boton--pequeno"
                onClick={() => void recargar()}
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        <PersonaTable
          personas={personasFiltradas}
          total={personas.length}
          cargando={cargando}
          onEditar={abrirEdicion}
          onEliminar={setPersonaAEliminar}
          onCrear={abrirCreacion}
        />
      </section>

      <PersonaForm
        abierto={formularioAbierto}
        persona={personaEditando}
        guardando={guardando}
        onCerrar={cerrarFormulario}
        onGuardar={manejarGuardar}
      />

      <ConfirmDialog
        abierto={personaAEliminar !== null}
        titulo="Eliminar persona"
        mensaje={
          personaAEliminar
            ? `¿Seguro que quieres eliminar a ${nombreCompleto(personaAEliminar)}? Esta acción no se puede deshacer.`
            : ''
        }
        textoConfirmar="Eliminar persona"
        peligro
        cargando={eliminando}
        onConfirmar={() => void confirmarEliminacion()}
        onCancelar={() => setPersonaAEliminar(null)}
      />

      <ConfirmDialog
        abierto={confirmarRestablecimiento}
        titulo="Restablecer datos mock"
        mensaje="Se eliminarán todas las personas actuales y se volverán a insertar los 10 registros de ejemplo. Esta acción no se puede deshacer."
        textoConfirmar="Restablecer datos"
        peligro
        cargando={restableciendo}
        onConfirmar={() => void confirmarRestablecer()}
        onCancelar={() => setConfirmarRestablecimiento(false)}
      />

      <NotificacionFlotante notificacion={notificacion} onCerrar={cerrar} />
    </>
  )
}
