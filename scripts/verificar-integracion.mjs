/**
 * Verificación de integración de PruebasOpenCode1.
 *
 * Comprueba el flujo completo frontend -> proxy de Vite -> API REST v1 -> H2,
 * incluyendo el autologin con token Bearer, los errores RFC 9457 y la
 * auditoría básica de las personas.
 * Requiere que el backend (8080) y el frontend (5173) estén en marcha.
 *
 * Uso:
 *   node scripts/verificar-integracion.mjs
 */

import assert from 'node:assert/strict'

const API_BASE = process.env.API_BASE_URL ?? 'http://127.0.0.1:5173/api/v1'
const FRONT_URL = process.env.FRONT_URL ?? 'http://127.0.0.1:5173'
const BACK_URL = process.env.BACK_URL ?? 'http://localhost:8080'
const AUTH_USERNAME = process.env.APP_AUTH_USERNAME ?? 'demo'
const AUTH_PASSWORD = process.env.APP_AUTH_PASSWORD ?? 'demo1234'

let creadaId = null
let tokenSesion = null
let totalPasos = 0

function paso(nombre) {
  totalPasos += 1
  console.log(`  \u2713 ${nombre}`)
}

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

async function peticion(ruta, opciones = {}) {
  const { sinSesion = false, ...resto } = opciones
  const cabeceras = { 'Content-Type': 'application/json', ...resto.headers }
  if (tokenSesion && !sinSesion) {
    cabeceras.Authorization = `Bearer ${tokenSesion}`
  }

  const respuesta = await fetch(`${API_BASE}${ruta}`, {
    ...resto,
    headers: cabeceras,
  })
  let cuerpo = null
  const texto = await respuesta.text()
  if (texto) {
    try {
      cuerpo = JSON.parse(texto)
    } catch {
      cuerpo = texto
    }
  }
  return { respuesta, cuerpo }
}

/** Comprueba que un error cumple el formato RFC 9457. */
function asertaProblemDetail(cuerpo, { estado, titulo, detalle, instancia, tipo }) {
  assert.equal(cuerpo.status, estado, 'El problema debe incluir el estado HTTP')
  assert.equal(cuerpo.title, titulo, 'El problema debe incluir el título')
  assert.equal(cuerpo.instance, instancia, 'El problema debe incluir la instancia')
  assert.match(cuerpo.type, tipo, 'El problema debe incluir el tipo de error')
  if (detalle) {
    assert.match(cuerpo.detail, detalle, 'El problema debe incluir el detalle')
  }
}

/**
 * Realiza el autologin igual que el frontend y conserva el token Bearer en
 * memoria para el resto de peticiones autenticadas.
 */
async function autologin() {
  const { respuesta, cuerpo } = await peticion('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario: AUTH_USERNAME, contrasena: AUTH_PASSWORD }),
    sinSesion: true,
  })
  assert.equal(respuesta.status, 200, 'El autologin debe devolver 200')
  assert.equal(cuerpo.tipo, 'Bearer', 'El login debe emitir un token Bearer')
  assert.ok(cuerpo.token && cuerpo.token.length >= 20, 'El login debe devolver un token opaco')
  assert.ok(cuerpo.segundosRestantes > 0, 'El token debe tener una expiración futura')
  assert.equal(cuerpo.usuario, AUTH_USERNAME)
  assert.equal(cuerpo.rol, 'ROLE_USER')

  tokenSesion = cuerpo.token
  return cuerpo
}

async function restablecer() {
  const { respuesta } = await peticion('/personas/reset', { method: 'POST' })
  assert.equal(respuesta.status, 200, 'El reset debe devolver 200')
}

try {
  console.log('\n[1] Frontend y salud del backend')

  const html = await (await fetch(FRONT_URL)).text()
  assert.match(html, /PruebasOpenCode1/, 'El HTML debe contener el nombre del proyecto')
  assert.match(html, /id="root"/, 'El HTML debe contener el punto de montaje de React')
  paso('El frontend sirve la SPA de PruebasOpenCode1')

  const salud = await (await fetch(`${BACK_URL}/actuator/health`)).json()
  assert.equal(salud.status, 'UP', 'El backend debe estar UP')
  paso('El backend responde UP en /actuator/health')

  const preflight = await fetch(`${BACK_URL}/api/v1/personas`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'authorization,content-type',
    },
  })
  assert.equal(preflight.status, 200, 'El preflight CORS debe devolver 200')
  assert.equal(
    preflight.headers.get('access-control-allow-origin'),
    'http://localhost:5173',
    'CORS debe permitir el origen del frontend',
  )
  assert.match(
    preflight.headers.get('access-control-allow-headers') ?? '',
    /authorization/i,
    'CORS debe permitir la cabecera Authorization',
  )
  paso('CORS permite el origen del frontend y la cabecera Authorization')

  console.log('\n[2] Autologin con token Bearer')

  const sinSesion = await peticion('/personas', { sinSesion: true })
  assert.equal(sinSesion.respuesta.status, 401, 'Sin token, la API debe devolver 401')
  asertaProblemDetail(sinSesion.cuerpo, {
    estado: 401,
    titulo: 'No autenticado',
    detalle: /iniciar sesión/,
    instancia: '/api/v1/personas',
    tipo: /no-autenticado/,
  })
  paso('Sin token, GET /api/v1/personas devuelve 401 ProblemDetail')

  const sesion = await autologin()
  assert.equal(sesion.usuario, AUTH_USERNAME)
  assert.equal(sesion.rol, 'ROLE_USER')
  const consultaSesion = await peticion('/auth/sesion')
  assert.equal(consultaSesion.respuesta.status, 200)
  assert.equal(consultaSesion.cuerpo.autenticado, true)
  assert.equal(consultaSesion.cuerpo.usuario, AUTH_USERNAME)
  assert.ok(consultaSesion.cuerpo.expiraEn, 'La sesión debe informar de la expiración')
  paso('POST /api/v1/auth/login emite el token y GET /api/v1/auth/sesion lo confirma')

  console.log('\n[3] Restablecimiento y listado')

  await restablecer()
  const listadoInicial = await peticion('/personas')
  assert.equal(listadoInicial.respuesta.status, 200)
  assert.equal(listadoInicial.cuerpo.length, 10, 'Deben existir 10 personas mock')
  paso('POST /api/v1/personas/reset deja exactamente 10 personas')

  const listado = await peticion('/personas')
  assert.ok(Array.isArray(listado.cuerpo) && listado.cuerpo.length === 10)
  assert.ok(listado.cuerpo.every((persona) => persona.id && persona.nombre && persona.apellido))
  assert.ok(
    listado.cuerpo.every((persona) => persona.creadoEn && persona.creadoPor),
    'Las personas deben incluir la auditoría de creación',
  )
  paso('GET /api/v1/personas devuelve el listado con auditoría')

  console.log('\n[4] Creación')

  const nueva = {
    nombre: 'Verificación',
    apellido: 'Integración',
    sexo: 'OTRO',
    direccion: 'Calle de Pruebas 1, Madrid',
    fechaNacimiento: '1993-03-14',
  }

  const creacion = await peticion('/personas', {
    method: 'POST',
    body: JSON.stringify(nueva),
  })
  assert.equal(creacion.respuesta.status, 201, 'La creación debe devolver 201')
  assert.ok(creacion.respuesta.headers.get('location'), 'Debe incluir cabecera Location')
  assert.equal(creacion.cuerpo.nombre, 'Verificación')
  assert.equal(creacion.cuerpo.sexo, 'OTRO')
  assert.equal(
    creacion.cuerpo.edad,
    edadEsperada(nueva.fechaNacimiento),
    'La edad debe calcularse desde la fecha de nacimiento',
  )
  assert.ok(creacion.cuerpo.creadoEn, 'Debe registrar la fecha de creación')
  assert.ok(creacion.cuerpo.actualizadoEn, 'Debe registrar la fecha de modificación')
  assert.equal(creacion.cuerpo.creadoPor, AUTH_USERNAME, 'Debe registrar el usuario creador')
  assert.equal(creacion.cuerpo.actualizadoPor, AUTH_USERNAME, 'Debe registrar el usuario que modifica')
  creadaId = creacion.cuerpo.id
  paso(`POST /api/v1/personas crea la persona con id ${creadaId} y auditoría`)

  const trasCrear = await peticion('/personas')
  assert.equal(trasCrear.cuerpo.length, 11, 'Deben existir 11 personas tras crear')
  paso('El listado refleja la nueva persona')

  console.log('\n[5] Consulta por identificador')

  const consulta = await peticion(`/personas/${creadaId}`)
  assert.equal(consulta.respuesta.status, 200)
  assert.equal(consulta.cuerpo.id, creadaId)
  assert.equal(consulta.cuerpo.direccion, 'Calle de Pruebas 1, Madrid')
  paso('GET /api/v1/personas/{id} devuelve la persona creada')

  const inexistente = await peticion('/personas/999999')
  assert.equal(inexistente.respuesta.status, 404)
  asertaProblemDetail(inexistente.cuerpo, {
    estado: 404,
    titulo: 'Recurso no encontrado',
    detalle: /999999/,
    instancia: '/api/v1/personas/999999',
    tipo: /no-encontrado/,
  })
  paso('GET de un id inexistente devuelve 404 ProblemDetail')

  console.log('\n[6] Modificación')

  const modificada = {
    ...nueva,
    apellido: 'Integración Actualizada',
    direccion: 'Avenida de la Verificación 22, Toledo',
    fechaNacimiento: '1990-01-15',
  }

  const actualizacion = await peticion(`/personas/${creadaId}`, {
    method: 'PUT',
    body: JSON.stringify(modificada),
  })
  assert.equal(actualizacion.respuesta.status, 200)
  assert.equal(actualizacion.cuerpo.apellido, 'Integración Actualizada')
  assert.equal(
    actualizacion.cuerpo.edad,
    edadEsperada(modificada.fechaNacimiento),
    'La edad debe recalcularse al cambiar la fecha de nacimiento',
  )
  assert.equal(actualizacion.cuerpo.actualizadoPor, AUTH_USERNAME)

  const consultaActualizada = await peticion(`/personas/${creadaId}`)
  assert.equal(consultaActualizada.cuerpo.direccion, 'Avenida de la Verificación 22, Toledo')
  paso('PUT /api/v1/personas/{id} persiste los cambios y la auditoría')

  console.log('\n[7] Validaciones y errores')

  const invalida = await peticion('/personas', {
    method: 'POST',
    body: JSON.stringify({
      nombre: '',
      apellido: '',
      sexo: null,
      direccion: '',
      fechaNacimiento: '2999-01-01',
    }),
  })
  assert.equal(invalida.respuesta.status, 400)
  asertaProblemDetail(invalida.cuerpo, {
    estado: 400,
    titulo: 'Datos no válidos',
    instancia: '/api/v1/personas',
    tipo: /validacion/,
  })
  assert.equal(invalida.cuerpo.validaciones.nombre, 'El nombre es obligatorio')
  assert.ok(
    invalida.cuerpo.validaciones.fechaNacimiento,
    'Debe informar del error de fecha de nacimiento',
  )
  assert.equal(
    invalida.cuerpo.validaciones.edad,
    undefined,
    'La edad ya no debe validarse como dato de entrada',
  )
  paso('Los datos inválidos devuelven 400 ProblemDetail con validaciones por campo')

  const sexoInvalido = await peticion('/personas', {
    method: 'POST',
    body: JSON.stringify({ ...nueva, sexo: 'DESCONOCIDO' }),
  })
  assert.equal(sexoInvalido.respuesta.status, 400)
  paso('Un valor de sexo no permitido devuelve 400')

  console.log('\n[8] Eliminación')

  const borrado = await peticion(`/personas/${creadaId}`, { method: 'DELETE' })
  assert.equal(borrado.respuesta.status, 204)
  creadaId = null

  const trasBorrar = await peticion('/personas')
  assert.equal(trasBorrar.cuerpo.length, 10, 'Deben quedar 10 personas tras eliminar')
  paso('DELETE /api/v1/personas/{id} elimina la persona')

  const borradoInexistente = await peticion('/personas/999999', { method: 'DELETE' })
  assert.equal(borradoInexistente.respuesta.status, 404)
  paso('Eliminar un id inexistente devuelve 404')

  console.log('\n[9] Restablecimiento final')

  const resetFinal = await peticion('/personas/reset', { method: 'POST' })
  assert.equal(resetFinal.respuesta.status, 200)
  assert.equal(resetFinal.cuerpo.length, 10)
  paso('El reset final vuelve a dejar los 10 registros mock')

  console.log('\n[10] Logout y revocación del token')

  const tokenRevocado = tokenSesion
  const logout = await peticion('/auth/logout', { method: 'POST' })
  assert.equal(logout.respuesta.status, 204, 'El logout debe devolver 204')

  tokenSesion = tokenRevocado
  const trasLogout = await peticion('/personas')
  assert.equal(trasLogout.respuesta.status, 401, 'El token revocado ya no debe servir')
  asertaProblemDetail(trasLogout.cuerpo, {
    estado: 401,
    titulo: 'No autenticado',
    instancia: '/api/v1/personas',
    tipo: /no-autenticado/,
  })
  tokenSesion = null
  paso('POST /api/v1/auth/logout revoca el token y la API vuelve a responder 401')

  console.log(`\n\u2714 Integración verificada correctamente (${totalPasos} comprobaciones).\n`)
} catch (error) {
  console.error('\n\u2716 Falló la verificación de integración:', error.message)
  if (creadaId !== null) {
    try {
      await peticion(`/personas/${creadaId}`, { method: 'DELETE' })
      await restablecer()
    } catch {
      // La limpieza es best-effort.
    }
  }
  process.exitCode = 1
}
