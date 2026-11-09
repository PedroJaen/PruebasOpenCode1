import type { Notificacion } from '../hooks/useNotificacion'
import { Icono } from './Icono'

interface Props {
  notificacion: Notificacion | null
  onCerrar: () => void
}

export function NotificacionFlotante({ notificacion, onCerrar }: Props) {
  if (!notificacion) {
    return null
  }

  const esError = notificacion.tipo === 'error'

  return (
    <div
      className={`notificacion notificacion--${notificacion.tipo}`}
      role={esError ? 'alert' : 'status'}
      aria-live="polite"
    >
      <span className="notificacion__icono" aria-hidden="true">
        <Icono nombre={esError ? 'alerta' : 'check'} tamano={20} />
      </span>
      <p className="notificacion__texto">{notificacion.texto}</p>
      <button
        type="button"
        className="notificacion__cerrar"
        onClick={onCerrar}
        aria-label="Cerrar notificación"
      >
        <Icono nombre="cerrar" tamano={16} />
      </button>
    </div>
  )
}
