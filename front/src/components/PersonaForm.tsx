import { useEffect, useState, type FormEvent } from 'react'
import { ApiError, mensajeDeError } from '../api/client'
import {
  OPCIONES_SEXO,
  hoyIso,
  type Persona,
  type PersonaInput,
  type Sexo,
  type ValidacionesApi,
} from '../types/persona'
import { Icono } from './Icono'
import { Modal } from './Modal'

interface Formulario {
  nombre: string
  apellido: string
  sexo: '' | Sexo
  direccion: string
  fechaNacimiento: string
}

type Campo = keyof Formulario
type Errores = Partial<Record<Campo, string>>

const FORMULARIO_VACIO: Formulario = {
  nombre: '',
  apellido: '',
  sexo: '',
  direccion: '',
  fechaNacimiento: '',
}

function formularioDesde(persona: Persona | null): Formulario {
  if (!persona) {
    return { ...FORMULARIO_VACIO }
  }
  return {
    nombre: persona.nombre,
    apellido: persona.apellido,
    sexo: persona.sexo,
    direccion: persona.direccion,
    fechaNacimiento: persona.fechaNacimiento,
  }
}

function validar(formulario: Formulario): Errores {
  const errores: Errores = {}

  if (!formulario.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.'
  } else if (formulario.nombre.trim().length > 80) {
    errores.nombre = 'El nombre no puede superar los 80 caracteres.'
  }

  if (!formulario.apellido.trim()) {
    errores.apellido = 'El apellido es obligatorio.'
  } else if (formulario.apellido.trim().length > 80) {
    errores.apellido = 'El apellido no puede superar los 80 caracteres.'
  }

  if (!formulario.sexo) {
    errores.sexo = 'Selecciona el sexo.'
  }

  if (!formulario.direccion.trim()) {
    errores.direccion = 'La dirección es obligatoria.'
  } else if (formulario.direccion.trim().length > 200) {
    errores.direccion = 'La dirección no puede superar los 200 caracteres.'
  }

  if (!formulario.fechaNacimiento) {
    errores.fechaNacimiento = 'La fecha de nacimiento es obligatoria.'
  } else if (formulario.fechaNacimiento > hoyIso()) {
    errores.fechaNacimiento = 'La fecha de nacimiento no puede ser futura.'
  }

  return errores
}

interface Props {
  abierto: boolean
  persona: Persona | null
  guardando: boolean
  onCerrar: () => void
  onGuardar: (datos: PersonaInput) => Promise<void>
}

export function PersonaForm({ abierto, persona, guardando, onCerrar, onGuardar }: Props) {
  const [formulario, setFormulario] = useState<Formulario>(() => formularioDesde(persona))
  const [errores, setErrores] = useState<Errores>({})
  const [erroresServidor, setErroresServidor] = useState<ValidacionesApi>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)

  const esEdicion = persona !== null

  useEffect(() => {
    if (abierto) {
      setFormulario(formularioDesde(persona))
      setErrores({})
      setErroresServidor({})
      setErrorServidor(null)
    }
  }, [abierto, persona])

  function actualizarCampo(campo: Campo, valor: string) {
    setFormulario((previo) => ({ ...previo, [campo]: valor }))
    setErrores((previos) => {
      if (!previos[campo]) {
        return previos
      }
      const copia = { ...previos }
      delete copia[campo]
      return copia
    })
    setErroresServidor((previos) => {
      if (!previos[campo]) {
        return previos
      }
      const copia = { ...previos }
      delete copia[campo]
      return copia
    })
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const erroresValidacion = validar(formulario)
    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length > 0) {
      return
    }

    setErrorServidor(null)
    setErroresServidor({})

    try {
      await onGuardar({
        nombre: formulario.nombre.trim(),
        apellido: formulario.apellido.trim(),
        sexo: formulario.sexo as Sexo,
        direccion: formulario.direccion.trim(),
        fechaNacimiento: formulario.fechaNacimiento,
      })
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorServidor(error.message)
        if (error.validaciones) {
          setErroresServidor(error.validaciones)
        }
      } else {
        setErrorServidor(mensajeDeError(error))
      }
    }
  }

  const cerrar = guardando ? () => undefined : onCerrar

  return (
    <Modal
      abierto={abierto}
      titulo={esEdicion ? 'Editar persona' : 'Nueva persona'}
      descripcion={
        esEdicion
          ? 'Actualiza los datos de la persona seleccionada.'
          : 'Completa los datos para añadir una nueva persona al listado.'
      }
      onCerrar={cerrar}
      ancho="grande"
    >
      <form className="formulario" onSubmit={manejarEnvio} noValidate>
        {errorServidor && (
          <div className="aviso aviso--error" role="alert">
            <Icono nombre="alerta" tamano={20} />
            <span>{errorServidor}</span>
          </div>
        )}

        <div className="formulario__rejilla">
          <div className="campo">
            <label htmlFor="campo-nombre">
              Nombre <span className="campo__obligatorio">*</span>
            </label>
            <input
              id="campo-nombre"
              className={`campo__control${errores.nombre || erroresServidor.nombre ? ' campo__control--error' : ''}`}
              type="text"
              value={formulario.nombre}
              onChange={(evento) => actualizarCampo('nombre', evento.target.value)}
              maxLength={80}
              autoComplete="given-name"
              placeholder="Ej. Lucía"
              aria-invalid={Boolean(errores.nombre || erroresServidor.nombre)}
              aria-describedby={errores.nombre || erroresServidor.nombre ? 'error-nombre' : undefined}
              autoFocus
            />
            {(errores.nombre || erroresServidor.nombre) && (
              <p className="campo__error" id="error-nombre">
                {errores.nombre ?? erroresServidor.nombre}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="campo-apellido">
              Apellido <span className="campo__obligatorio">*</span>
            </label>
            <input
              id="campo-apellido"
              className={`campo__control${errores.apellido || erroresServidor.apellido ? ' campo__control--error' : ''}`}
              type="text"
              value={formulario.apellido}
              onChange={(evento) => actualizarCampo('apellido', evento.target.value)}
              maxLength={80}
              autoComplete="family-name"
              placeholder="Ej. Fernández"
              aria-invalid={Boolean(errores.apellido || erroresServidor.apellido)}
              aria-describedby={
                errores.apellido || erroresServidor.apellido ? 'error-apellido' : undefined
              }
            />
            {(errores.apellido || erroresServidor.apellido) && (
              <p className="campo__error" id="error-apellido">
                {errores.apellido ?? erroresServidor.apellido}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="campo-sexo">
              Sexo <span className="campo__obligatorio">*</span>
            </label>
            <select
              id="campo-sexo"
              className={`campo__control${errores.sexo || erroresServidor.sexo ? ' campo__control--error' : ''}`}
              value={formulario.sexo}
              onChange={(evento) => actualizarCampo('sexo', evento.target.value)}
              aria-invalid={Boolean(errores.sexo || erroresServidor.sexo)}
              aria-describedby={errores.sexo || erroresServidor.sexo ? 'error-sexo' : undefined}
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              {OPCIONES_SEXO.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
            {(errores.sexo || erroresServidor.sexo) && (
              <p className="campo__error" id="error-sexo">
                {errores.sexo ?? erroresServidor.sexo}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="campo-fecha">
              Fecha de nacimiento <span className="campo__obligatorio">*</span>
            </label>
            <input
              id="campo-fecha"
              className={`campo__control${errores.fechaNacimiento || erroresServidor.fechaNacimiento ? ' campo__control--error' : ''}`}
              type="date"
              value={formulario.fechaNacimiento}
              max={hoyIso()}
              onChange={(evento) => actualizarCampo('fechaNacimiento', evento.target.value)}
              aria-invalid={Boolean(errores.fechaNacimiento || erroresServidor.fechaNacimiento)}
              aria-describedby={
                errores.fechaNacimiento || erroresServidor.fechaNacimiento
                  ? 'error-fechaNacimiento'
                  : undefined
              }
            />
            {(errores.fechaNacimiento || erroresServidor.fechaNacimiento) && (
              <p className="campo__error" id="error-fechaNacimiento">
                {errores.fechaNacimiento ?? erroresServidor.fechaNacimiento}
              </p>
            )}
          </div>

          <div className="campo campo--ancho">
            <label htmlFor="campo-direccion">
              Dirección <span className="campo__obligatorio">*</span>
            </label>
            <input
              id="campo-direccion"
              className={`campo__control${errores.direccion || erroresServidor.direccion ? ' campo__control--error' : ''}`}
              type="text"
              value={formulario.direccion}
              onChange={(evento) => actualizarCampo('direccion', evento.target.value)}
              maxLength={200}
              autoComplete="street-address"
              placeholder="Ej. Calle Mayor 12, 3ºB, Madrid"
              aria-invalid={Boolean(errores.direccion || erroresServidor.direccion)}
              aria-describedby={
                errores.direccion || erroresServidor.direccion ? 'error-direccion' : undefined
              }
            />
            {(errores.direccion || erroresServidor.direccion) && (
              <p className="campo__error" id="error-direccion">
                {errores.direccion ?? erroresServidor.direccion}
              </p>
            )}
          </div>
        </div>

        <p className="formulario__nota">
          Los campos marcados con <span className="campo__obligatorio">*</span> son obligatorios. La
          edad se calcula automáticamente a partir de la fecha de nacimiento.
        </p>

        <div className="modal__acciones">
          <button type="button" className="boton boton--secundario" onClick={cerrar} disabled={guardando}>
            Cancelar
          </button>
          <button type="submit" className="boton boton--primario" disabled={guardando}>
            {guardando ? (
              <>
                <span className="cargador cargador--pequeno" aria-hidden="true" />
                Guardando…
              </>
            ) : (
              <>
                <Icono nombre={esEdicion ? 'check' : 'mas'} tamano={18} />
                {esEdicion ? 'Guardar cambios' : 'Crear persona'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
