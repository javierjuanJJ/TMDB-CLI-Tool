---
name: create-readme-skill
description: Usar cuando el usuario pida crear, generar, actualizar o mejorar un README profesional de un programa o proyecto (por ejemplo "genera un README", "crea un README profesional", "documenta el proyecto", "README.md"). Detecta el tipo de proyecto y se adapta: en APIs documenta endpoints y sus parámetros, en frontends documenta la estructura de diseño y componentes, en CLIs disecciona todos los parámetros y combinaciones (con y sin parámetros) mediante pruebas de éxito y error, y produce un README completo con índice, funcionamiento, estructura con diagramas, instalación, dominio de datos, requisitos y referencia probada.
---

# create-readme-skill

Skill para crear READMEs profesionales de aplicaciones, APIs, frontends, CLIs o scripts. No escribas el README de memoria: primero estudia el programa real y verifica cada afirmación ejecutándolo.

## Cuándo usarla

Usa esta skill cuando el usuario pida documentar un proyecto con un README profesional. Detecta la petición por palabras como: `README`, `README.md`, `readme profesional`, `genera un README`, `crea un README`, `documenta el proyecto`, `documentar`, `manual del programa`, `documenta la API`, `documenta el frontend`.

## Flujo de trabajo obligatorio

Sigue estos pasos en orden. No los omitas. Antes de escribir cada sección del README, verifica los datos en el código o ejecutando el programa. El flujo se adapta al tipo de proyecto detectado.

### Paso 1 — Exploración del programa

1. Lista el contenido del proyecto con `list`/`glob` (raíz, no ignores `.gitignore`: fíjate qué se publica).
2. Identifica el punto de entrada:
   - Paquetes: `package.json` (`bin`, `main`, `scripts`), `pyproject.toml` (`[project.scripts]`, `entry-points`), `Cargo.toml`, `go.mod`, `setup.py`, `composer.json`, etc.
   - El archivo `main`, `cli`, `index`, `router`, `app` o script ejecutable.
3. Determina el lenguaje, runtime y versión mínima.
4. Lee el código para entender qué hace el programa (entradas → procesamiento → salidas), no te quedes solo en los metadatos.
5. Toma nota de dependencias, servicios externos (APIs, bases de datos, variables de entorno) y estructura de carpetas.

### Paso 2 — Detección del tipo de proyecto

Identifica a qué categoría pertenece el proyecto y documenta conforme a su tipo. Puede haber más de una:

- **API** (Express, FastAPI, Flask, Koa, NestJS, GraphQL, gRPC…): documenta **endpoints**.
- **Frontend** (React, Vue, Svelte, Angular, HTML/CSS, web standalone…): documenta la **estructura de diseño** (componentes, pantallas, routing, estado, estilos).
- **CLI / Script**: documenta **comandos y parámetros**.
- **Librería / módulo**: documenta la **API pública y exports**.
- **Backend / servicios / workers**: documenta **servicios, rutas y procesos en segundo plano**.
- **Base de datos / pipeline de datos**: documenta **esquemas, tablas y flujos de datos**.

Según el tipo, aplica el inventario correspondiente (Paso 2A/2B/2C).

#### Paso 2A — Si es API: inventario de endpoints

1. Localiza la definición de rutas (`app.get(...)`, `@app.route`, `@router.get`, decoradores, archivos de rutas). Puede haber varios archivos, una API central o una definición en `openapi.json` / Swagger.
2. Para cada endpoint registra:
   - Método HTTP (GET, POST, PUT, PATCH, DELETE, …) y ruta (incluye parámetros de ruta como `:id`).
   - Parámetros de ruta (`:id`), de consulta (`query`), de cabecera (`headers`) y del cuerpo (`body`). Tipo, formato, obligatorio/opcional, valores válidos, valor por defecto.
   - Autenticación/permisos exigidos (token, API key, sesión).
   - Respuesta de éxito: código de estado, estructura del cuerpo (schema).
   - Respuestas de error posibles: códigos (400, 404, 500…) y formato del error.
3. Haz una lista maestra de endpoints y sus modelos de entrada/salida.

#### Paso 2B — Si es frontend: inventario de la estructura de diseño

1. Localiza la estructura: carpetas de componentes, páginas/vistas, estilos, tema/diseño system.
2. Documenta:
   - **Pantallas/views**: qué vistas existen y qué rutas maneja cada una (routing).
   - **Componentes**: los componentes reutilizables, su nombre, props/inputs y propósito.
   - **Gestión de estado**: store/contexto/estado global, cómo fluyen los datos (props, API, estado local).
   - **Estilos y diseño**: preprocesadores, CSS modules, Tailwind, styled-components, librería de UI, tema/colores/tipografía, modo claro/oscuro.
   - **Patrones de diseño**: layout, wireframe/sitemap, diagrama de navegación entre pantallas.
3. Si no existe una estructura de diseño clara, documéntala a partir del código real (no la inventes).

#### Paso 2C — Si es CLI / librería: inventario de comandos y exports

1. Identifica el/los comandos principales (binarios, subcomandos, flags, argumentos posicionales y opciones). En librerías, identifica la API pública (módulos exportados, funciones, tipos, firma de cada función).
2. Ejecuta el programa **sin parámetros** y con `--help` / `-h` / `--version` / `-v` (usa lo que exista según lo que veas en el código).
3. Lee la implementación del parseo de argumentos (argparse, commander, clap, getopt, etc.) para descubrir:
   - Cada parámetro/flag y su tipo (boolean, número, string, enumerado).
   - Valores por defecto, valores obligatorios y opcionales.
   - Alias cortos/largos.
4. Haz una lista maestra de parámetros con: nombre, alias, tipo, valor por defecto, obligatorio/opcional, descripción.

### Paso 3 — Pruebas de todas las combinaciones según el tipo

Prueba el proyecto, no lo asumas. Para esto puedes usar la herramienta `bash` (si es ejecutable localmente) o `task`/`webfetch` si es remoto.

#### Paso 3A — Pruebas de API (endpoints)

1. **Sin parámetros**: llama a cada endpoint tal cual (default, sin query/body) cuando el servidor esté levantado.
2. **Cada parámetro por separado**: para cada endpoint prueba:
   - Parámetros de consulta y de ruta con valores válidos, bordes (vacío, extremos) e inválidos.
   - Cuerpo con payload válido, incompleto y malformado.
   - Sin autenticación y con autenticación válida/inválida.
3. **Combinaciones**: combina parámetros de consulta entre sí y con body; verifica interdependencias (parámetro que exige otro, rutas que comparten query).
4. **Casos de error**: endpoint inexistente (404), método no permitido (405), validación fallida (400), auth fallida (401/403), servidor (500).
5. Registra cada prueba en una tabla: `endpoint | método | parámetros/body | código esperado | código y respuesta real | ✔ / ✘`.

#### Paso 3B — Pruebas de frontend (estructura de diseño)

1. Arranca el proyecto (dev/build) y verifica que compila y arranca.
2. Recorre **cada pantalla/ruta** y comprueba que renderiza y que la navegación entre pantallas funciona.
3. Verifica cada **componente** con sus distintas combinaciones de props/estados (vacío, normal, error, loading).
4. Comprueba el **tema/estilos** (claro/oscuro si los hay, responsividad, breakpoints).
5. Prueba casos de error del frontend: ruta inexistente, componente con datos incompletos, llamada a API fallida.
6. Registra las pruebas en una tabla: `pantalla/componente | ruta/props probadas | resultado esperado | resultado real | ✔ / ✘`.

#### Paso 3C — Pruebas de CLI / librería (parámetros)

1. **Sin parámetros**: ejecuta el comando tal cual. Registra salida y código de salida.
2. **Cada parámetro por separado**: ejecuta con un solo parámetro a la vez, incluyendo valores válidos, bordes (vacío, extremos) e inválidos.
3. **Combinaciones**: agrupa parámetros por parejas y luego por grupos lógicos (flags que suelen usarse juntos). Comprueba interdependencias: si un flag exige otro, si son excluyentes, si cambian el comportamiento.
4. **Casos de error**: pruebas que deben fallar (parámetro inexistente, valor fuera de rango, combinación prohibida, archivo que no existe). Registra qué código de salida y mensaje devuelve.
5. Registra cada prueba en una tabla: `comando probado | parámetros | resultado esperado | resultado real | ✔ pasa / ✘ falla`.
6. Anota cuáles son las pruebas de acierto (éxito esperado y confirmado) y las de error (fallo esperado y confirmado). Si el comportamiento real no coincide con lo esperado, refleja SIEMPRE el real en el README.

Estas tablas de pruebas son la fuente de la sección de referencia del README (endpoints, diseño o comandos según el tipo).

### Paso 4 — Dominio de datos

1. Identifica qué datos entran al proyecto (argumentos, stdin, parámetros de API, payloads, archivos de configuración, variables de entorno, props, servicios externos).
2. Identifica qué salidas produce (stdout, stderr, archivos generados, respuestas de API, JSON/YAML/texto, HTML renderizado).
3. Identifica estado/almacenamiento: bases de datos, cachés, archivos de estado, formatos y esquemas. En frontends, el estado de la interfaz (store, contexto, formularios).
4. Documenta tipos, formatos y rangos válidos de cada dato.

### Paso 5 — Redacción del README

Genera el `README.md` en la raíz del proyecto (pregunta si debe ir en otra ruta). El README DEBE contener, en este orden, y adaptado al tipo de proyecto:

1. **Título + descripción breve** del proyecto y de su tipo (API / frontend / CLI / librería…).
2. **Badges** opcionales (build, versión, licencia) si el repo tiene CI/licencia conocida.
3. **Índice** con anclas a todas las secciones principales.
4. **Funcionamiento del programa**: qué hace, cómo funciona por dentro (flujo entrada → procesamiento → salida), limitaciones.
5. **Estructura del proyecto con diagramas**: árbol de archivos + diagrama Mermaid del flujo o de la arquitectura. Usa bloques ` ```mermaid ` (flowchart, sequenceDiagram o graph según convenga).
   - **Si es API**: diagrama de arquitectura de la API, flujo de una petición (secuencia cliente → servidor → base de datos).
   - **Si es frontend**: diagrama de la estructura de diseño (sitemap/árbol de pantallas, composición de componentes, flujo de datos).
6. **Requisitos de instalación**: runtime, versión mínima, dependencias del sistema (node, python, librerías nativas), SO soportados.
7. **Instalación**: pasos exactos (instalar dependencias, compilar, build, variables de entorno necesarias, comandos probados). Incluye comandos para arrancar (dev/server) si procede.
8. **Dominio de datos**: entradas, salidas, configuración, persistencia, formatos.
9. **Referencia (según el tipo)**:
   - **API → Referencia de endpoints**: tabla completa de todos los endpoints y parámetros (método, ruta, query/path/body/headers, auth, respuesta de éxito, errores, ejemplo con `curl`), marcando el resultado de las pruebas (éxito/error).
   - **Frontend → Estructura de diseño**: pantallas y rutas, componentes y props, gestión de estado, estilos/tema, patrones de diseño, con los resultados de las pruebas de renderizado.
   - **CLI/Librería → Referencia de comandos**: tabla completa de todos los comandos y parámetros detallando `sin parámetros`, cada parámetro individual, y las combinaciones probadas, marcando el resultado (éxito/error). Incluye ejemplo de uso de cada caso.
10. **Ejemplos de uso** reales (copiados de las pruebas que funcionaron): un `curl` por endpoint, pantalla de ejemplo, o comando de ejemplo.
11. **Tests** (si existen): cómo ejecutarlos y qué cubren.
12. **Licencia y contribución** si procede.

Otras reglas de redacción:
- Escribe secciones verídicas: si no pudiste ejecutar algo, no lo inventes; márcalo como "no verificado".
- Usa diagramas Mermaid, no imágenes estáticas inventadas.
- El índice usa enlaces internos `[Sección](#seccion)` con anclas en minúsculas y guiones.
- Idioma: preferentemente el del usuario (si pide el README en español, escríbelo en español; si no especifica, usa el idioma del proyecto).

## Plantilla del índice (adaptar al contenido generado)

```markdown
## Índice

1. [Descripción](#descripcion)
2. [Funcionamiento](#funcionamiento)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos de instalación](#requisitos-de-instalacion)
5. [Instalación](#instalacion)
6. [Dominio de datos](#dominio-de-datos)
7. [Referencia de comandos / endpoints / estructura de diseño](#referencia-de-comandos-endpoints-estructura-de-diseño)
8. [Ejemplos de uso](#ejemplos-de-uso)
9. [Tests](#tests)
10. [Licencia](#licencia)
```

## Tablas de pruebas (plantillas según tipo)

**API:**

| Endpoint | Método | Parámetros / Body | Código y respuesta esperados | Resultado real | Estado |
| --- | --- | --- | --- | --- | --- |
| `/items` | GET | sin parámetros | 200 lista | <real> | ✔ |
| `/items/:id` | GET | `id=999` | 404 no encontrado | <real> | ✘ |
| `/items` | POST | body inválido | 400 validación | <real> | ✘ |

**Frontend:**

| Pantalla / Componente | Ruta / Props | Resultado esperado | Resultado real | Estado |
| --- | --- | --- | --- | --- |
| Lista de items | `/items` | renderiza y carga datos | <real> | ✔ |
| Detalle | `/items/:id` con id vacío | estado vacío sin errores | <real> | ✔ |
| Botón | `disabled=true` | deshabilitado visualmente | <real> | ✘ |

**CLI / Librería:**

| Comando | Parámetros | Combinación | Resultado esperado | Resultado real | Estado |
| --- | --- | --- | --- | --- | --- |
| `app` | — | sin parámetros | mostrar ayuda/uso | <salida> | ✔ |
| `app --param x` | `--param` | valor válido | <esperado> | <real> | ✔ |
| `app --param` | `--param` | sin valor | error: valor requerido | <real> | ✘ |

## Verificación final

Antes de dar el trabajo por terminado:
1. Relee el README y comprueba que todas las secciones obligatorias existen y el índice apunta bien.
2. Confirma que cada endpoint/componente/comando de la referencia fue realmente probado (no copiado de memoria).
3. Si el proyecto tiene linter/formateador de markdown (markdownlint, prettier), valida el archivo.