# Feature 002 — Plan de Implementación

## Objetivo

Añadir la capacidad de consultar películas populares (`--type "popular"`) **reutilizando** el flujo ya creado en la feature 001. El único cambio de código necesario es registrar el tipo en los mapas de constantes.

## Estrategia de llamadas a `lib/api.js`

1. **Sin cambios de lógica**: `fetchMovies(type)` ya resuelve cualquier endpoint presente en `ENDPOINT_BY_TYPE`.
2. Al agregar `popular: '/movie/popular'`, la misma función queda funcional sin modificaciones.
3. La consulta usará `language=en-US&page=1` por la URL base construida en `lib/api.js`.

## Estrategia de formateo con `lib/formatter.js`

1. **Sin cambios de lógica**: `displayMovies(movies, typeTitle)` formatea cualquier lista de `results`.
2. La única modificación es registrar `TYPE_TITLES.popular = 'POPULAR MOVIES'` en `consts/messages.js`.

## Flujo de `app.js` (top-level)

1. **Sin cambios**: lee la API key, valida `--type`, encadena `fetchMovies(...).then(displayMovies).catch(exit(1))`.

## Cambios en constantes (única modificación de código)

| Archivo | Cambio |
|---|---|
| `consts/api.js` | `ENDPOINT_BY_TYPE.popular = '/movie/popular'` |
| `consts/messages.js` | `TYPE_TITLES.popular = 'POPULAR MOVIES'` |

## Verificación

```bash
TMDB_API_KEY=dummy node app.js --type bad       # valores válidos ahora incluyen popular
TMDB_API_KEY=<real> node app.js --type popular  # imprime películas populares
```

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Duplicar lógica por tipo | Enfoque de mapa `ENDPOINT_BY_TYPE` (única fuente de verdad). |
| Romper la feature 001 | Se añade solo una clave nueva; no se toca `playing`. |
| Desalinear `args.js` con `api.js` | `lib/args.js` valida contra `Object.keys(ENDPOINT_BY_TYPE)`. |