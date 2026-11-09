import {
  ETIQUETA_SEXO,
  formatearFecha,
  iniciales,
  nombreCompleto,
  type Persona,
} from '../types/persona'
import { Icono } from './Icono'

interface Props {
  personas: Persona[]
  total: number
  cargando: boolean
  onEditar: (persona: Persona) => void
  onEliminar: (persona: Persona) => void
  onCrear: () => void
}

export function PersonaTable({ personas, total, cargando, onEditar, onEliminar, onCrear }: Props) {
  return (
    <div className="tabla-envoltorio">
      <table className="tabla">
        <thead>
          <tr>
            <th scope="col">Persona</th>
            <th scope="col">Edad</th>
            <th scope="col">Sexo</th>
            <th scope="col">Dirección</th>
            <th scope="col">Nacimiento</th>
            <th scope="col" className="tabla__acciones-cabecera">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={6}>
                <div className="estado-tabla" role="status">
                  <span className="cargador" aria-hidden="true" />
                  <p className="estado-tabla__titulo">Cargando personas…</p>
                  <p className="estado-tabla__texto">Consultando la API de PruebasOpenCode1.</p>
                </div>
              </td>
            </tr>
          ) : personas.length === 0 ? (
            <tr>
              <td colSpan={6}>
                {total === 0 ? (
                  <div className="estado-tabla">
                    <span className="estado-tabla__icono" aria-hidden="true">
                      <Icono nombre="usuarios" tamano={28} />
                    </span>
                    <p className="estado-tabla__titulo">Todavía no hay personas</p>
                    <p className="estado-tabla__texto">
                      Crea la primera persona o restablece los datos de ejemplo para empezar.
                    </p>
                    <button type="button" className="boton boton--primario" onClick={onCrear}>
                      <Icono nombre="mas" tamano={18} />
                      Crear la primera persona
                    </button>
                  </div>
                ) : (
                  <div className="estado-tabla">
                    <span className="estado-tabla__icono" aria-hidden="true">
                      <Icono nombre="buscar" tamano={28} />
                    </span>
                    <p className="estado-tabla__titulo">Sin coincidencias</p>
                    <p className="estado-tabla__texto">
                      Ninguna persona coincide con los criterios de búsqueda.
                    </p>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            personas.map((persona) => (
              <tr key={persona.id}>
                <td>
                  <div className="persona-celda">
                    <span
                      className={`avatar avatar--${persona.sexo.toLowerCase()}`}
                      aria-hidden="true"
                    >
                      {iniciales(persona)}
                    </span>
                    <div>
                      <p className="persona-celda__nombre">{nombreCompleto(persona)}</p>
                      <p className="persona-celda__id">ID #{persona.id}</p>
                    </div>
                  </div>
                </td>
                <td>{persona.edad} años</td>
                <td>
                  <span className={`insignia insignia--${persona.sexo.toLowerCase()}`}>
                    {ETIQUETA_SEXO[persona.sexo]}
                  </span>
                </td>
                <td className="tabla__direccion">{persona.direccion}</td>
                <td>{formatearFecha(persona.fechaNacimiento)}</td>
                <td>
                  <div className="acciones-fila">
                    <button
                      type="button"
                      className="boton-icono"
                      onClick={() => onEditar(persona)}
                      aria-label={`Editar a ${nombreCompleto(persona)}`}
                      title="Editar"
                    >
                      <Icono nombre="editar" tamano={17} />
                    </button>
                    <button
                      type="button"
                      className="boton-icono boton-icono--peligro"
                      onClick={() => onEliminar(persona)}
                      aria-label={`Eliminar a ${nombreCompleto(persona)}`}
                      title="Eliminar"
                    >
                      <Icono nombre="eliminar" tamano={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
