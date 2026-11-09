import { useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icono } from './Icono'

interface Props {
  abierto: boolean
  titulo: string
  descripcion?: string
  ancho?: 'normal' | 'grande'
  onCerrar: () => void
  children: ReactNode
}

export function Modal({ abierto, titulo, descripcion, ancho = 'normal', onCerrar, children }: Props) {
  const idTitulo = useId()
  const idDescripcion = useId()

  useEffect(() => {
    if (!abierto) {
      return
    }

    const alPulsarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        onCerrar()
      }
    }

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', alPulsarTecla)

    return () => {
      document.removeEventListener('keydown', alPulsarTecla)
      document.body.style.overflow = overflowAnterior
    }
  }, [abierto, onCerrar])

  if (!abierto) {
    return null
  }

  return createPortal(
    <div
      className="modal-fondo"
      role="presentation"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          onCerrar()
        }
      }}
    >
      <div
        className={`modal${ancho === 'grande' ? ' modal--grande' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={descripcion ? idDescripcion : undefined}
      >
        <div className="modal__cabecera">
          <div>
            <h2 className="modal__titulo" id={idTitulo}>
              {titulo}
            </h2>
            {descripcion && (
              <p className="modal__descripcion" id={idDescripcion}>
                {descripcion}
              </p>
            )}
          </div>
          <button
            type="button"
            className="boton-icono modal__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar ventana"
          >
            <Icono nombre="cerrar" tamano={20} />
          </button>
        </div>
        <div className="modal__cuerpo">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
