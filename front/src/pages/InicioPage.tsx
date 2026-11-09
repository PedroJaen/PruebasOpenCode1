import { Link } from 'react-router-dom'
import { Icono, type NombreIcono } from '../components/Icono'

interface Caracteristica {
  icono: NombreIcono
  titulo: string
  texto: string
}

const CARACTERISTICAS: Caracteristica[] = [
  {
    icono: 'usuarios',
    titulo: 'Gestión completa',
    texto: 'Consulta, crea, edita y elimina personas desde una única pantalla clara y rápida.',
  },
  {
    icono: 'codigo',
    titulo: 'API REST real',
    texto: 'Todos los datos viajan entre React y Spring Boot mediante endpoints REST documentados.',
  },
  {
    icono: 'baseDatos',
    titulo: 'Persistencia H2',
    texto: 'La información se guarda en una base de datos H2, no en el navegador.',
  },
  {
    icono: 'escudo',
    titulo: 'Validación doble',
    texto: 'El formulario valida en el cliente y el backend vuelve a validar cada petición.',
  },
  {
    icono: 'rayo',
    titulo: 'Desarrollo ágil',
    texto: 'Vite ofrece recarga instantánea y el backend incluye datos de prueba listos para usar.',
  },
  {
    icono: 'restablecer',
    titulo: 'Datos de ejemplo',
    texto: 'Restablece los diez registros mock iniciales con una sola acción y confirmación previa.',
  },
]

const PASOS = [
  {
    numero: '01',
    titulo: 'Explora el listado',
    texto: 'Consulta las personas guardadas en H2, busca por nombre o dirección y revisa sus datos.',
  },
  {
    numero: '02',
    titulo: 'Gestiona la información',
    texto: 'Añade nuevas personas o modifica las existentes con formularios validados en español.',
  },
  {
    numero: '03',
    titulo: 'Vuelve al punto de partida',
    texto: 'Si lo necesitas, restablece los datos mock y recupera el conjunto de prueba original.',
  },
]

export function InicioPage() {
  return (
    <>
      <section className="hero">
        <div className="hero__contenido">
          <span className="hero__etiqueta">
            <span className="punto-verde" aria-hidden="true" />
            Aplicación web full stack
          </span>
          <h1 className="hero__titulo">
            Gestiona personas con una experiencia <span className="texto-degradado">simple y real</span>
          </h1>
          <p className="hero__descripcion">
            <strong>PruebasOpenCode1</strong> conecta una interfaz moderna en React con una API REST
            en Spring Boot. Sin datos inventados en el navegador: cada cambio se guarda en la base de
            datos H2 del backend.
          </p>

          <div className="hero__acciones">
            <Link className="boton boton--primario boton--grande" to="/personas">
              Gestionar personas
              <Icono nombre="flecha" tamano={19} />
            </Link>
            <a className="boton boton--secundario boton--grande" href="#caracteristicas">
              Descubrir funciones
            </a>
          </div>

          <dl className="hero__metricas">
            <div>
              <dt>10</dt>
              <dd>personas de ejemplo</dd>
            </div>
            <div>
              <dt>6</dt>
              <dd>operaciones REST</dd>
            </div>
            <div>
              <dt>100%</dt>
              <dd>en español</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="visual__halo" />
          <div className="visual__tarjeta visual__tarjeta--frontend">
            <span className="visual__icono visual__icono--indigo">
              <Icono nombre="codigo" tamano={22} />
            </span>
            <div>
              <p className="visual__etiqueta">Frontend</p>
              <p className="visual__valor">React + TypeScript</p>
            </div>
            <span className="visual__chip">Vite</span>
          </div>

          <div className="visual__conector" />

          <div className="visual__tarjeta visual__tarjeta--api">
            <span className="visual__icono visual__icono--teal">
              <Icono nombre="rayo" tamano={22} />
            </span>
            <div>
              <p className="visual__etiqueta">Backend</p>
              <p className="visual__valor">API REST · Spring Boot</p>
            </div>
            <span className="visual__chip visual__chip--activo">Online</span>
          </div>

          <div className="visual__conector" />

          <div className="visual__tarjeta visual__tarjeta--datos">
            <span className="visual__icono visual__icono--ambar">
              <Icono nombre="baseDatos" tamano={22} />
            </span>
            <div>
              <p className="visual__etiqueta">Datos</p>
              <p className="visual__valor">H2 · Hibernate</p>
            </div>
            <span className="visual__chip">JPA</span>
          </div>
        </div>
      </section>

      <section className="seccion" id="caracteristicas">
        <div className="seccion__cabecera">
          <span className="seccion__etiqueta">Funcionalidades</span>
          <h2 className="seccion__titulo">Todo lo necesario para gestionar personas</h2>
          <p className="seccion__descripcion">
            Una aplicación completa, pensada para demostrar una integración real entre frontend,
            backend y base de datos.
          </p>
        </div>

        <div className="rejilla-caracteristicas">
          {CARACTERISTICAS.map((caracteristica) => (
            <article className="tarjeta-caracteristica" key={caracteristica.titulo}>
              <span className="tarjeta-caracteristica__icono">
                <Icono nombre={caracteristica.icono} tamano={22} />
              </span>
              <h3>{caracteristica.titulo}</h3>
              <p>{caracteristica.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seccion">
        <div className="seccion__cabecera">
          <span className="seccion__etiqueta">Cómo funciona</span>
          <h2 className="seccion__titulo">Tres pasos para empezar</h2>
        </div>

        <div className="rejilla-pasos">
          {PASOS.map((paso) => (
            <article className="paso" key={paso.numero}>
              <span className="paso__numero">{paso.numero}</span>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="llamada-final">
        <div>
          <span className="seccion__etiqueta seccion__etiqueta--clara">Listo para probar</span>
          <h2>El listado de personas te está esperando</h2>
          <p>Accede a la gestión, crea una persona nueva y comprueba cómo se guarda de verdad.</p>
        </div>
        <Link className="boton boton--claro boton--grande" to="/personas">
          Ir a la gestión
          <Icono nombre="flecha" tamano={19} />
        </Link>
      </section>
    </>
  )
}
