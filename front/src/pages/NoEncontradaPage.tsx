import { Link } from 'react-router-dom'
import { Icono } from '../components/Icono'

export function NoEncontradaPage() {
  return (
    <section className="no-encontrada">
      <span className="no-encontrada__codigo">404</span>
      <h1>Esta página no existe</h1>
      <p>La dirección que has introducido no corresponde a ninguna pantalla de PruebasOpenCode1.</p>
      <div className="no-encontrada__acciones">
        <Link className="boton boton--primario" to="/">
          <Icono nombre="volver" tamano={18} />
          Volver al inicio
        </Link>
        <Link className="boton boton--secundario" to="/personas">
          Gestionar personas
        </Link>
      </div>
    </section>
  )
}
