
# AGENTS.md - Proyecto PruebasOpenCode1

## 1. Objetivo del proyecto

Desarrollar una aplicación web completa denominada PruebasOpenCode1 para gestionar personas.

El proyecto servirá como entorno de pruebas para evaluar las capacidades de desarrollo autónomo de agentes de programación mediante OpenCode.

La aplicación estará formada por:

- Backend: Java 21 y Spring Boot.
- Frontend: React, TypeScript y Vite.
- Base de datos: H2.
- Comunicación entre frontend y backend mediante API REST.

## 2. Normas generales

- Leer y respetar las instrucciones del AGENTS.md global del usuario.
- Respetar también las instrucciones de este archivo.
- No introducir tecnologías diferentes de las especificadas sin autorización.
- No utilizar Angular.
- No realizar cambios innecesarios fuera del alcance solicitado.
- Mantener el código limpio, modular, mantenible y documentado.
- No dejar implementaciones simuladas cuando se haya solicitado funcionalidad real.
- No dar por terminada una tarea sin verificar su funcionamiento.
- Utilizar las herramientas disponibles en OpenCode para leer, crear, modificar y comprobar archivos.
- No asumir que una operación se ha realizado correctamente sin verificar su resultado.

## 3. Estructura del proyecto

La raíz del proyecto es PruebasOpenCode1.

Organizar el proyecto en los siguientes directorios:

- /back: aplicación backend.
- /front: aplicación frontend.
- /docs: documentación general.

## 4. Backend

Tecnologías obligatorias:

- Java 21.
- Spring Boot.
- Spring Web.
- Spring Data JPA.
- Hibernate.
- H2.
- Maven.

Requisitos:

- Implementar una API REST.
- Utilizar una arquitectura por capas: Controller, Service y Repository.
- Separar entidades JPA de los DTO utilizados en la API.
- Implementar operaciones CRUD completas.
- Aplicar validaciones en los datos recibidos.
- Gestionar adecuadamente los errores y devolver respuestas HTTP coherentes.
- Configurar CORS para permitir la comunicación con el frontend.
- Utilizar H2 como base de datos.
- Configurar la creación automática del esquema de base de datos.
- Incluir datos iniciales de prueba (mock data).
- Permitir consultar la consola H2 durante el desarrollo.
- Mantener una configuración sencilla para ejecutar localmente.

### Entidad Persona

La aplicación gestionará personas con los siguientes atributos:

- id: identificador único.
- nombre.
- apellido.
- edad: calculada a partir de fechaNacimiento y la fecha actual; no se almacena en la tabla.
- sexo.
- direccion.
- fechaNacimiento.

### Operaciones

Implementar:

- Obtener todas las personas.
- Obtener una persona por su identificador.
- Crear una persona.
- Modificar una persona.
- Eliminar una persona.
- Restablecer los datos de prueba iniciales.

La operación de restablecimiento deberá eliminar los datos existentes y volver a insertar exclusivamente los datos mock iniciales.

## 5. Frontend

Tecnologías obligatorias:

- React.
- TypeScript.
- Vite.

Requisitos:

- Aplicación SPA.
- Interfaz clara, moderna y sencilla.
- Código organizado por componentes.
- Separación de servicios de comunicación HTTP.
- Consumir exclusivamente la API REST del backend para gestionar los datos.
- Gestionar los estados de carga y los errores.
- Mostrar mensajes de confirmación y error cuando corresponda.
- Utilizar formularios con validaciones.
- No almacenar los datos de personas como sustituto de la base de datos del backend.

### Vistas

Implementar:

1. Pantalla de bienvenida.
   - Presentación de PruebasOpenCode1.
   - Acceso a la gestión de personas.

2. Gestión de personas.
   - Listado de personas.
   - Crear persona.
   - Editar persona.
   - Eliminar persona.
   - Restablecer datos mock.

El botón de restablecimiento deberá solicitar confirmación antes de ejecutarse.

3. Documentación viva.
   - Prompt completo para reconstruir la aplicación en su estado actual.
   - Contenido de `AGENTS.md` y de la documentación general del proyecto.
   - Una tabla de resultados por cada tipo de prueba.
   - El contenido debe generarse desde las fuentes reales y actualizarse automáticamente cuando estas cambien.

## 6. Pruebas y calidad

- Verificar que el backend compila.
- Verificar que el frontend compila.
- Implementar pruebas unitarias razonables para la lógica de negocio.
- Comprobar las operaciones CRUD.
- Comprobar la integración entre frontend y backend.
- No considerar una funcionalidad terminada si no se ha podido verificar.

## 7. Ejecución local

El proyecto debe poder ejecutarse localmente de forma independiente:

- Backend desde Eclipse.
- Frontend desde Visual Studio Code.

Documentar los comandos necesarios para instalar dependencias y ejecutar ambas aplicaciones.

## 8. Preparación para despliegues futuros

Aunque inicialmente se ejecutará en local, la arquitectura deberá facilitar su futura contenerización y despliegue.

Preparar la documentación y estructura necesarias para una futura ejecución mediante:

- Docker.
- Kubernetes.
- Entornos PRE y PRO.

No implementar ni simular despliegues reales en PRE o PRO en esta fase.

Evitar configuraciones que obliguen a modificar el código fuente para cambiar de entorno.

## 9. Documentación y seguimiento

Mantener actualizados:

- /docs/SEGUIMIENTO.md: tareas realizadas, pendientes, incidencias y decisiones.
- /docs/ARQUITECTURA.md: estructura y decisiones arquitectónicas.
- /docs/EJECUCION.md: instrucciones para ejecutar el proyecto.
- /docs/API.md: documentación de los endpoints.
- /docs/PROMPT.md: prompt de reconstrucción de la aplicación.
- /docs/PRUEBAS.md: estrategia, suites y resultados esperados.

La página `/documentacion` del frontend se genera a partir de `AGENTS.md`, `docs/*.md`, los tests y los
informes de pruebas. No duplicar su contenido a mano: tras cambiar cualquier fuente, ejecutar
`npm run docs` (o `npm run build`) en `/front` para que la página refleje el último estado.

Utilizar siempre PruebasOpenCode1 como nombre del proyecto en la documentación.

## 10. Forma de trabajar

- Analizar primero los requisitos y la estructura existente.
- Elaborar un plan antes de comenzar.
- Dividir el trabajo en tareas pequeñas y verificables.
- Implementar progresivamente.
- Verificar cada bloque antes de continuar.
- Actualizar el seguimiento después de cada bloque significativo.
- No ocultar errores ni asumir que una operación ha funcionado si no se ha comprobado.
- Informar de los cambios realizados, las pruebas ejecutadas y los problemas encontrados.
