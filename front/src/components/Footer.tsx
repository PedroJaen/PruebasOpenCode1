export function Footer() {
  return (
    <footer className="pie">
      <div className="contenedor pie__contenido">
        <div>
          <p className="pie__titulo">PruebasOpenCode1</p>
          <p className="pie__texto">
            Aplicación de demostración para la gestión de personas. Datos servidos por una API REST
            real.
          </p>
        </div>
        <div className="pie__tecnologias" aria-label="Tecnologías utilizadas">
          <span>Java 21</span>
          <span>Spring Boot</span>
          <span>H2</span>
          <span>React</span>
          <span>TypeScript</span>
          <span>Vite</span>
        </div>
      </div>
      <div className="contenedor pie__legal">
        <span>© {new Date().getFullYear()} PruebasOpenCode1</span>
        <span>Entorno local de desarrollo</span>
      </div>
    </footer>
  )
}
