import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Icono } from './Icono'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Límite de errores de React. Si un componente lanza una excepción durante el
 * renderizado, se muestra una pantalla de recuperación en lugar de dejar la
 * aplicación en blanco.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error no controlado en la interfaz de PruebasOpenCode1', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-boundary" role="alert">
          <div className="error-boundary__tarjeta">
            <span className="error-boundary__icono" aria-hidden="true">
              <Icono nombre="alerta" tamano={28} />
            </span>
            <h1>Se ha producido un error inesperado</h1>
            <p>
              La interfaz no ha podido continuar. Puedes recargar la página para volver a
              intentarlo.
            </p>
            <button
              type="button"
              className="boton boton--primario"
              onClick={() => window.location.reload()}
            >
              Recargar página
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
