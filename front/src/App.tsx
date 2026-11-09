import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { DocumentacionPage } from './pages/DocumentacionPage'
import { InicioPage } from './pages/InicioPage'
import { NoEncontradaPage } from './pages/NoEncontradaPage'
import { PersonasPage } from './pages/PersonasPage'

export default function App() {
  return (
    <BrowserRouter>
      <a className="saltar-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <div className="aplicacion">
        <Header />
        <main className="contenido" id="contenido">
          <div className="contenedor">
            <Routes>
              <Route path="/" element={<InicioPage />} />
              <Route path="/personas" element={<PersonasPage />} />
              <Route path="/documentacion" element={<DocumentacionPage />} />
              <Route path="*" element={<NoEncontradaPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
