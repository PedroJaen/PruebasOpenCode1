import { Link, NavLink } from 'react-router-dom'
import { Icono } from './Icono'
import { useTema } from '../hooks/useTema'

const claseNavegacion = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav__enlace nav__enlace--activo' : 'nav__enlace'

export function Header() {
  const { oscuro, alternar } = useTema()
  const etiquetaTema = oscuro ? 'Activar tema claro' : 'Activar tema oscuro'

  return (
    <header className="cabecera">
      <div className="contenedor cabecera__contenido">
        <Link className="marca" to="/" aria-label="PruebasOpenCode1, ir al inicio">
          <span className="marca__logo" aria-hidden="true">
            P
          </span>
          <span className="marca__texto">
            <span className="marca__nombre">PruebasOpenCode1</span>
            <span className="marca__subtitulo">Gestión de personas</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Navegación principal">
          <NavLink className={claseNavegacion} to="/" end>
            Inicio
          </NavLink>
          <NavLink className={claseNavegacion} to="/personas">
            Personas
          </NavLink>
          <NavLink className={claseNavegacion} to="/documentacion">
            Documentación
          </NavLink>
        </nav>

        <button
          type="button"
          className="boton-tema"
          onClick={alternar}
          aria-label={etiquetaTema}
          title={etiquetaTema}
        >
          <Icono nombre={oscuro ? 'sol' : 'luna'} tamano={18} />
        </button>
      </div>
    </header>
  )
}
