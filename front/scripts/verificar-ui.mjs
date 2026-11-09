/**
 * Verificación de la interfaz de PruebasOpenCode1 con un navegador real.
 *
 * Requiere que el backend (8080) y el frontend (5173) estén en marcha.
 * Usa el Chrome instalado en el sistema a través de playwright-core, sin
 * descargar navegadores adicionales.
 *
 * Uso (desde /front):
 *   npm run test:ui
 */

import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { chromium, request } from 'playwright-core'

const FRONT_URL = process.env.FRONT_URL ?? 'http://127.0.0.1:5173'
const API_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:5173/api/v1'
const AUTH_USERNAME = process.env.VITE_AUTH_USERNAME ?? process.env.APP_AUTH_USERNAME ?? 'demo'
const AUTH_PASSWORD = process.env.VITE_AUTH_PASSWORD ?? process.env.APP_AUTH_PASSWORD ?? 'demo1234'

/** Edad esperada según la fecha de nacimiento y la fecha actual. */
function edadEsperada(fechaNacimientoIso) {
  const nacimiento = new Date(`${fechaNacimientoIso}T00:00:00`)
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mesActual = hoy.getMonth()
  const diaActual = hoy.getDate()
  if (mesActual < nacimiento.getMonth() || (mesActual === nacimiento.getMonth() && diaActual < nacimiento.getDate())) {
    edad -= 1
  }
  return edad
}

const candidatosNavegador = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter((ruta) => typeof ruta === 'string')

const executablePath = candidatosNavegador.find((ruta) => existsSync(ruta))

if (!executablePath) {
  throw new Error(
    'No se ha encontrado Chrome ni Edge. Define la variable CHROME_PATH con la ruta del navegador.',
  )
}

let totalPasos = 0
function paso(nombre) {
  totalPasos += 1
  console.log(`  \u2713 ${nombre}`)
}

/**
 * Restablece los datos mock con un token propio, sin compartir estado con el
 * navegador. Así la visita a /personas puede verificar el autologin real.
 */
async function restablecerDatos() {
  const api = await request.newContext()
  let respuesta
  try {
    const login = await api.post(`${API_URL}/auth/login`, {
      data: { usuario: AUTH_USERNAME, contrasena: AUTH_PASSWORD },
    })
    if (!login.ok()) {
      throw new Error(
        `No se pudo autenticar para restablecer los datos (HTTP ${login.status()}).`,
      )
    }
    const { token } = await login.json()
    respuesta = await api.post(`${API_URL}/personas/reset`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } finally {
    await api.dispose()
  }
  if (!respuesta.ok) {
    throw new Error(`No se pudo restablecer la base de datos (HTTP ${respuesta.status}).`)
  }
}

const navegador = await chromium.launch({ executablePath, headless: true })
const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: 'es-ES',
  colorScheme: 'light',
})
const pagina = await contexto.newPage()
const erroresConsola = []

pagina.on('console', (mensaje) => {
  if (mensaje.type() === 'error') {
    erroresConsola.push(mensaje.text())
  }
})
pagina.on('pageerror', (error) => {
  erroresConsola.push(error.message)
})

async function esperarPersonas(cantidad) {
  await pagina.waitForFunction(
    (total) => document.querySelectorAll('.persona-celda__nombre').length === total,
    cantidad,
    { timeout: 15000 },
  )
}

try {
  await restablecerDatos()

  console.log('\n[1] Pantalla de bienvenida')

  await pagina.goto(FRONT_URL, { waitUntil: 'networkidle' })
  const tituloInicio = await pagina.getByRole('heading', { level: 1 }).innerText()
  assert.match(tituloInicio, /Gestiona personas/, 'El hero debe mostrar el título principal')
  assert.ok(
    await pagina.getByRole('link', { name: /Gestionar personas/ }).first().isVisible(),
    'Debe existir el acceso a la gestión de personas',
  )
  paso('La pantalla de bienvenida carga y muestra el acceso a personas')

  console.log('\n[2] Listado inicial y autologin transparente')

  const respuestaAutologin = pagina.waitForResponse(
    (respuesta) =>
      respuesta.url().includes('/api/v1/auth/login') && respuesta.request().method() === 'POST',
    { timeout: 15000 },
  )
  await pagina.goto(`${FRONT_URL}/personas`, { waitUntil: 'networkidle' })
  assert.equal(
    (await respuestaAutologin).status(),
    200,
    'El autologin transparente debe completarse con 200',
  )
  await esperarPersonas(10)
  const filasIniciales = await pagina.locator('.persona-celda__nombre').count()
  assert.equal(filasIniciales, 10, 'El listado debe mostrar las 10 personas mock')
  assert.ok(
    await pagina.getByText('Sergio Castro', { exact: true }).isVisible(),
    'El listado debe mostrar datos reales del backend',
  )
  paso('El listado muestra las 10 personas servidas por la API')

  assert.equal(
    await pagina.locator('input[type="password"]').count(),
    0,
    'El autologin no debe mostrar ningún campo de contraseña',
  )
  assert.equal(
    await pagina.getByText('Iniciar sesión', { exact: true }).count(),
    0,
    'El autologin no debe mostrar la acción de iniciar sesión',
  )
  paso('El autologin se ejecuta sin mostrar formulario ni credenciales al usuario')

  console.log('\n[3] Búsqueda')

  const buscador = pagina.getByLabel('Buscar personas')
  await buscador.fill('Lucía')
  await esperarPersonas(1)
  assert.equal(await pagina.locator('.persona-celda__nombre').innerText(), 'Lucía Fernández')
  paso('La búsqueda filtra el listado en tiempo real')

  await buscador.fill('zzzz')
  await pagina.getByText('Sin coincidencias', { exact: true }).waitFor()
  paso('La búsqueda sin resultados muestra un estado vacío específico')

  await buscador.fill('')
  await esperarPersonas(10)

  console.log('\n[4] Creación desde el formulario')

  await pagina.getByRole('button', { name: 'Nueva persona', exact: true }).click()
  await pagina.getByRole('heading', { name: 'Nueva persona', exact: true }).waitFor()
  await pagina.locator('#campo-nombre').fill('Prueba')
  await pagina.locator('#campo-apellido').fill('UI')
  await pagina.locator('#campo-sexo').selectOption('OTRO')
  await pagina.locator('#campo-direccion').fill('Calle de la Interfaz 10, Madrid')
  await pagina.locator('#campo-fecha').fill('1998-06-15')
  await pagina.getByRole('button', { name: 'Crear persona', exact: true }).click()

  await pagina.getByText('Se ha creado a Prueba UI.', { exact: true }).waitFor()
  await esperarPersonas(11)
  assert.ok(
    await pagina.getByText('Prueba UI', { exact: true }).isVisible(),
    'La nueva persona debe aparecer en la tabla',
  )
  const filaCreada = pagina.locator('tr', { hasText: 'Prueba UI' })
  assert.ok(
    await filaCreada.getByText(`${edadEsperada('1998-06-15')} años`, { exact: true }).isVisible(),
    'La tabla debe mostrar la edad calculada desde la fecha de nacimiento',
  )
  paso('El formulario crea una persona y la tabla muestra su edad calculada')

  console.log('\n[5] Edición')

  await pagina.getByRole('button', { name: 'Editar a Prueba UI', exact: true }).click()
  await pagina.getByRole('heading', { name: 'Editar persona', exact: true }).waitFor()
  assert.equal(await pagina.locator('#campo-nombre').inputValue(), 'Prueba')
  await pagina.locator('#campo-apellido').fill('UI Actualizada')
  await pagina.getByRole('button', { name: 'Guardar cambios', exact: true }).click()

  await pagina.getByText('Se ha actualizado a Prueba UI Actualizada.', { exact: true }).waitFor()
  await pagina.getByText('Prueba UI Actualizada', { exact: true }).waitFor()
  paso('El formulario de edición persiste los cambios')

  console.log('\n[6] Eliminación')

  await pagina.getByRole('button', { name: 'Eliminar a Prueba UI Actualizada', exact: true }).click()
  await pagina.getByRole('heading', { name: 'Eliminar persona', exact: true }).waitFor()
  await pagina.getByRole('button', { name: 'Eliminar persona', exact: true }).click()

  await pagina.getByText('Se ha eliminado a Prueba UI Actualizada.', { exact: true }).waitFor()
  await esperarPersonas(10)
  assert.equal(
    await pagina.getByText('Prueba UI Actualizada', { exact: true }).count(),
    0,
    'La persona eliminada no debe seguir en la tabla',
  )
  paso('La confirmación de borrado elimina la persona')

  console.log('\n[7] Restablecimiento de datos mock')

  await pagina.getByRole('button', { name: 'Restablecer datos mock', exact: true }).click()
  await pagina.getByRole('heading', { name: 'Restablecer datos mock', exact: true }).waitFor()
  await pagina.getByRole('button', { name: 'Restablecer datos', exact: true }).click()

  await pagina
    .getByText('Se han restablecido los 10 registros mock iniciales.', { exact: true })
    .waitFor()
  await esperarPersonas(10)
  paso('El restablecimiento pide confirmación y deja los 10 registros mock')

  console.log('\n[8] Validación del formulario')

  await pagina.getByRole('button', { name: 'Nueva persona', exact: true }).click()
  await pagina.getByRole('heading', { name: 'Nueva persona', exact: true }).waitFor()
  await pagina.getByRole('button', { name: 'Crear persona', exact: true }).click()

  await pagina.getByText('El nombre es obligatorio.', { exact: true }).waitFor()
  assert.ok(
    await pagina.getByText('La fecha de nacimiento es obligatoria.', { exact: true }).isVisible(),
    'Debe mostrarse el error de fecha de nacimiento',
  )
  assert.ok(
    await pagina.getByText('Selecciona el sexo.', { exact: true }).isVisible(),
    'Debe mostrarse el error de sexo',
  )
  paso('El formulario muestra validaciones en español antes de enviar')

  await pagina.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await pagina.getByRole('heading', { name: 'Nueva persona', exact: true }).waitFor({ state: 'hidden' })
  paso('El modal se cierra sin guardar')

  console.log('\n[9] Preferencias de tema')

  assert.equal(
    await pagina.locator('html').getAttribute('data-tema'),
    'claro',
    'El tema inicial debe ser claro salvo preferencia del sistema',
  )
  await pagina.getByRole('button', { name: 'Activar tema oscuro', exact: true }).click()
  await pagina.waitForFunction(() => document.documentElement.dataset.tema === 'oscuro')
  assert.equal(
    await pagina.evaluate(() => localStorage.getItem('pruebasopencode1.tema')),
    'oscuro',
    'La preferencia de tema debe guardarse en localStorage',
  )
  paso('El botón de tema activa el modo oscuro y guarda la preferencia')

  await pagina.reload({ waitUntil: 'networkidle' })
  assert.equal(
    await pagina.locator('html').getAttribute('data-tema'),
    'oscuro',
    'El tema oscuro debe persistir tras recargar la página',
  )
  assert.ok(
    await pagina.getByRole('button', { name: 'Activar tema claro', exact: true }).isVisible(),
    'El botón debe ofrecer volver al tema claro',
  )
  paso('El tema oscuro persiste tras recargar la página')

  assert.deepEqual(erroresConsola, [], `Errores en la consola del navegador:\n${erroresConsola.join('\n')}`)
  paso('No hay errores en la consola del navegador')

  console.log(`\n\u2714 Interfaz verificada correctamente (${totalPasos} comprobaciones).\n`)
} catch (error) {
  console.error('\n\u2716 Falló la verificación de la interfaz:', error.message)
  process.exitCode = 1
} finally {
  try {
    await restablecerDatos()
  } catch {
    // La limpieza es best-effort.
  }
  await contexto.close()
  await navegador.close()
}
