# Feature 001 — Lista de Tareas

## Checklist de implementación

- [x] Crear `consts/api.js` con `BASE_URL`, `API_KEY_ENV_VAR` y `ENDPOINT_BY_TYPE.playing`.
- [x] Crear `consts/messages.js` con `MESSAGES.*` de error y `TYPE_TITLES.playing`.
- [x] Crear `lib/args.js::parseArguments` que extrae y valida `--type`.
- [x] Crear `lib/api.js::fetchMovies(type)` usando `fetch` nativo + bearer token.
- [x] Crear `lib/formatter.js::displayMovies(movies, typeTitle)` con salida limpia y ANSI.
- [x] Crear `app.js` con orquestación top-level, `try/catch` global y `process.exit(1)` en errores.
- [x] No usar `async function` ni `main()/run()` en `app.js`.
- [x] `lib/` propaga errores sin `try/catch` silencioso.
- [x] Verificar escenarios de error (API key, `--type` inválido, falta de flag) en la terminal.

## Criterios de Aceptación (de spec.md)

- [x] `node app.js --type "playing"` imprime título, puntuación y fecha de estreno.
- [x] La salida es legible: encabezado, separadores, posiciones.
- [x] Uso de `process.env.TMDB_API_KEY` como bearer token.
- [x] Errores terminan con `process.exit(1)` y mensaje informativo.
- [x] Responsabilidades modulares en `consts/`, `lib/` y `app.js`.