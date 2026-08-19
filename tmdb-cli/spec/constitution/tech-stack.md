# Stack Técnico y Constitución de Código

Este documento define las reglas técnicas que todo el código del proyecto debe respetar. Es la constitución vinculante para cualquier desarrollo futuro.

## Arquitectura y Estructura

```
app.js                     Punto de entrada (Padre). Única orquestación + captura global.
├── consts/
│   ├── api.js             Endpoints, URL base y constantes relativas a TMDB.
│   └── messages.js        Textos de la CLI, mensajes de error y plantillas visuales.
├── lib/
│   ├── args.js            Parsing y validación de argumentos de la CLI (--type).
│   ├── api.js             Peticiones HTTP / fetch a la TMDB API.
│   └── formatter.js       Formateo visual e impresión limpia en terminal.
└── docs/                  Documentación por feature (cómo se hizo y cómo volver atrás).
```

### Reglas de arquitectura

- **`app.js` es el Padre**: únicamente `app.js` ejecuta la orquestación principal y captura excepciones globales con bloques `try/catch`.
- **Los módulos de `lib/` NO capturan errores de forma silenciosa**: deben propagar errores con mensajes claros e informativos para que `app.js` los capture e informe al usuario.
- **Responsabilidad única y modularidad**: cada responsabilidad vive en funciones independientes y separadas por módulo.
- **Fronting**: la lógica de arranque de `app.js` vive en el **top-level** del módulo (no se inicia mediante `run()` ni `main()`).

## Stack Tecnológico

| Componente | Decisión |
|---|---|
| Runtime | Node.js `>= 18` (trae `fetch` global). |
| Sistema de módulos | CommonJS estándar (`require` / `module.exports`). |
| Cliente HTTP | `fetch` nativo de Node.js (sin librerías externas). |
| Parsing de argumentos | `process.argv` procesado en `lib/args.js`. |
| Pruebas/verificación | Ejecución manual del binario con escenarios de error y éxito. |

## Integración con TMDB (documentación de referencia)

Fuente oficial consultada: [TMDB API Reference](https://developer.themoviedb.org/reference).

- **Base URL**: `https://api.themoviedb.org/3`
- **Autenticación**: header `Authorization: Bearer <TMDB_API_KEY>` (bearer token) en todas las peticiones.
- **Endpoints usados**:

| Feature | Tipo CLI (`--type`) | Endpoint |
|---|---|---|
| `001-now-playing-movies` | `playing` | `/movie/now_playing` |
| `002-popular-movies` | `popular` | `/movie/popular` |
| `003-top-rated-movies` | `top` | `/movie/top_rated` |
| `004-upcoming-movies` | `upcoming` | `/movie/upcoming` |

- **Respuesta 200** (todas): objeto con `results[]`, `page`, `total_pages`, `total_results`. Cada elemento de `results` contiene `title`, `vote_average`, `release_date`, entre otros.
- **Errores HTTP**: respuestas `401` en credenciales inválidas, entre otras. La API devuelve `status_message` que debe propagarse al usuario.

## Manejo de Errores e Invariantes

- Fallos de red (DNS, timeout, conexión) se propagan con mensaje claro y descriptivo.
- API key inexistente o inválida (`TMDB_API_KEY`) se detecta y reporta antes de lanzar peticiones, o se propaga el `status_message` de TMDB.
- Argumentos inválidos (`--type` ausente o desconocido) se rechazan en `lib/args.js` con la lista de valores válidos.
- Todos los errores finalizan la ejecución con **`process.exit(1)`**.
- Los mensajes de usuario se escriben en `console.error` (errores) y `console.log` (salida normal).

## Convenciones de Código

- **Estilo de nombres**: `camelCase` para variables y funciones; `UPPER_SNAKE_CASE` para constantes.
- **Idioma**: código en **inglés**; **documentación en `spec/` y `docs/` en español**.
- **Sin dependencias**: ninguna dependencia externa en `dependencies`.
- **Límites duros**:
  - No se permite `async function` en `app.js`.
  - No se permite iniciar la app invocando `run()` ni `main()`; el arranque es top-level.
  - No se permite `try/catch` que trague errores dentro de `lib/`.

## Comandos Estándar

```bash
node app.js --type "playing"
node app.js --type "popular"
node app.js --type "top"
node app.js --type "upcoming"
```

Variable de entorno requerida: `TMDB_API_KEY`.