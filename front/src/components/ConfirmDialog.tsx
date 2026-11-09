import { Modal } from './Modal'
import { Icono } from './Icono'

interface Props {
  abierto: boolean
  titulo: string
  mensaje: string
  textoConfirmar: string
  peligro?: boolean
  cargando?: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  textoConfirmar,
  peligro = false,
  cargando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <Modal
      abierto={abierto}
      titulo={titulo}
      onCerrar={cargando ? () => undefined : onCancelar}
      ancho="normal"
    >
      <div className={`confirmacion${peligro ? ' confirmacion--peligro' : ''}`}>
        <span className="confirmacion__icono" aria-hidden="true">
          <Icono nombre={peligro ? 'alerta' : 'check'} tamano={24} />
        </span>
        <p className="confirmacion__mensaje">{mensaje}</p>
      </div>

      <div className="modal__acciones">
        <button type="button" className="boton boton--secundario" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </button>
        <button
          type="button"
          className={`boton ${peligro ? 'boton--peligro' : 'boton--primario'}`}
          onClick={onConfirmar}
          disabled={cargando}
        >
          {cargando ? 'Procesando…' : textoConfirmar}
        </button>
      </div>
    </Modal>
  )
}
