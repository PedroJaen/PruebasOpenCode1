# Manual de usuario de PruebasOpenCode1

> Documento actualizado el 2026-11-09.

## 1. Qué es PruebasOpenCode1

PruebasOpenCode1 es una aplicación web para gestionar un listado de personas. Permite consultar,
buscar, crear, editar y eliminar personas, así como restablecer los datos de ejemplo.

La aplicación es de uso local y utiliza un autologin transparente: al entrar en la gestión de personas
el frontend obtiene un **token de acceso de corta duración** con un usuario de demostración, sin
mostrar ningún formulario de acceso. Las credenciales son fijas y no deben considerarse seguras para
producción.

## 2. Acceso

Con el backend y el frontend arrancados, abrir:

```text
http://localhost:5173
```

Si el frontend se ha compilado para otro entorno, usar la URL correspondiente.

La primera vez que se abre la gestión de personas, el frontend autentica la sesión de forma
transparente. El usuario no ve credenciales ni un formulario de login: el listado aparece directamente.
El token se conserva solo en memoria mientras la pestaña está abierta y se renueva automáticamente
antes de caducar. Si el backend se reinicia, la aplicación vuelve a autenticarse sin intervención del
usuario.

## 3. Pantalla de bienvenida

La pantalla inicial presenta PruebasOpenCode1 y da acceso a la gestión de personas.

- Pulsar **Gestionar personas** para abrir el listado.
- La cabecera permite volver a la pantalla de bienvenida.

## 4. Gestión de personas

### 4.1 Listado

La tabla muestra estas columnas:

| Columna | Contenido |
| --- | --- |
| Persona | Nombre completo, iniciales e identificador. |
| Edad | Edad calculada automáticamente desde la fecha de nacimiento. |
| Sexo | Femenino, Masculino u Otro. |
| Dirección | Dirección postal. |
| Nacimiento | Fecha de nacimiento en formato `dd/mm/aaaa`. |
| Acciones | Botones para editar y eliminar. |

La edad **no se introduce ni se guarda**: se calcula con la fecha de nacimiento y la fecha actual. Por
eso cambia automáticamente cuando llega el cumpleaños.

### 4.2 Buscar

El buscador filtra en tiempo real por nombre, apellido, dirección o sexo. No distingue mayúsculas de
minúsculas, pero sí tiene en cuenta los acentos.

- Si hay coincidencias, la tabla se actualiza.
- Si no hay ninguna, aparece el estado **Sin coincidencias**.
- Al borrar el texto, vuelve el listado completo.

### 4.3 Crear una persona

1. Pulsar **Nueva persona**.
2. Completar el formulario:
   - **Nombre**: obligatorio, máximo 80 caracteres.
   - **Apellido**: obligatorio, máximo 80 caracteres.
   - **Sexo**: obligatorio; seleccionar una opción.
   - **Fecha de nacimiento**: obligatoria y no puede ser futura.
   - **Dirección**: obligatoria, máximo 200 caracteres.
3. Pulsar **Crear persona**.

La edad no se pide: se calcula al guardar y aparece en la tabla. Si algún dato no es válido, el
formulario muestra el error junto al campo correspondiente.

### 4.4 Editar una persona

1. Pulsar el botón de editar de la fila deseada.
2. Modificar los campos necesarios.
3. Pulsar **Guardar cambios**.

El formulario carga los datos actuales. Si se cambia la fecha de nacimiento, la edad de la tabla se
actualiza automáticamente. Para descartar los cambios, pulsar **Cancelar**.

### 4.5 Eliminar una persona

1. Pulsar el botón de eliminar de la fila deseada.
2. Confirmar la operación en el diálogo.

La eliminación es inmediata e irreversible. Si se cancela, la persona permanece en el listado.

### 4.6 Restablecer los datos de ejemplo

1. Pulsar **Restablecer datos mock**.
2. Confirmar la operación.

La aplicación elimina todas las personas actuales y vuelve a insertar exactamente las 10 personas de
ejemplo. Los identificadores no se reinician necesariamente, por lo que pueden cambiar respecto a un
arranque inicial.

## 5. Tema claro y oscuro

El botón de tema de la cabecera alterna entre claro y oscuro. La preferencia se guarda en el navegador
y se mantiene al recargar. Si nunca se ha elegido un tema, la aplicación respeta la preferencia del
sistema operativo.

## 6. Documentación

La opción **Documentación** del menú superior abre una página con el conocimiento del proyecto:

- **Prompt de reconstrucción:** instrucciones completas para recrear la aplicación, con botón para
  copiarlas.
- **Documentación general:** pestañas con el README y las guías de arquitectura, seguridad, API,
  ejecución, pruebas, manual, operación, despliegue y seguimiento.
- **AGENTS.md:** reglas de trabajo del proyecto.
- **Resultados de pruebas:** una tabla por tipo de prueba (unitarias, integración, extremo a extremo,
  interfaz, mutación y compilación del frontend).

El contenido se genera automáticamente desde los documentos, los tests y los informes reales. No se
edita desde la interfaz y siempre muestra el último estado publicado.

## 7. Estados y mensajes

| Situación | Qué muestra la aplicación |
| --- | --- |
| Cargando datos | Indicador de carga en la tabla. |
| Sin personas | Estado vacío con acceso para crear la primera persona. |
| Búsqueda sin resultados | Estado **Sin coincidencias**. |
| Operación correcta | Notificación de confirmación. |
| Error de validación | Mensaje junto al campo afectado. |
| Error de conexión o del servidor | Aviso con el mensaje devuelto por la API. |
| Sesión renovada | Aviso de que el token se ha renovado; no hay que hacer nada. |
| Sesión caducada o backend reiniciado | Aviso de que se vuelve a autenticar; el flujo continúa solo. |
| Error de renderizado | Pantalla de recuperación con opción de recargar. |

Los avisos de sesión son informativos: la aplicación renueva el token o vuelve a autenticarse de forma
transparente, sin pedir credenciales.

## 8. Validaciones

| Campo | Reglas |
| --- | --- |
| Nombre | Obligatorio, máximo 80 caracteres. |
| Apellido | Obligatorio, máximo 80 caracteres. |
| Sexo | Obligatorio. |
| Fecha de nacimiento | Obligatoria y no futura. |
| Dirección | Obligatoria, máximo 200 caracteres. |

Las mismas reglas se aplican en el backend. Aunque se saltara la validación del navegador, la API
rechazaría los datos inválidos con un error `400`.

## 9. Accesibilidad y diseño

- La interfaz está en español.
- Los formularios tienen etiquetas asociadas a cada campo.
- Los errores se anuncian y se asocian al campo correspondiente.
- Los diálogos se pueden cerrar con el botón **Cancelar**, el botón de cierre, la tecla `Esc` o un
  clic fuera del cuadro.
- El diseño es responsive: en pantallas estrechas, los campos del formulario se apilan en una columna.
- Se respeta `prefers-reduced-motion` y la preferencia de tema del sistema.

## 10. Limitaciones

- El acceso usa un token de demostración con credenciales fijas; no hay gestión de usuarios ni
  registro.
- El token vive en memoria de la pestaña: recargar obliga a un nuevo autologin transparente.
- Los datos se guardan en una base H2 local; no están pensados para uso multiusuario.
- El restablecimiento elimina todos los datos actuales sin posibilidad de deshacer.
- La aplicación no está preparada para producción sin revisar seguridad, base de datos, copias de
  seguridad y despliegue.

## 11. Más información

- [Ejecución local](EJECUCION.md)
- [Seguridad](SEGURIDAD.md)
- [API REST](API.md)
- [Arquitectura](ARQUITECTURA.md)
- [Operación y mantenimiento](OPERACION.md)
- [Pruebas](PRUEBAS.md)
- [Prompt de reconstrucción](PROMPT.md)
