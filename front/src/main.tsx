import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { inicializarTema } from './theme'
import './styles.css'

inicializarTema()

const contenedor = document.getElementById('root')

if (!contenedor) {
  throw new Error('No se ha encontrado el elemento raíz de PruebasOpenCode1.')
}

createRoot(contenedor).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
