# Feature 003 — Plan de Implementación

## Objetivo

Añadir la capacidad de consultar películas mejor valoradas (`--type "top"`) **reutilizando** el flujo existente. Igual que la feature 002, solo se requiere registrar el nuevo tipo en los mapas de constantes.

## Estrategia de llamadas a `lib/api.js`

1. **Sin cambios de lógica**: `fetchMovies(type)` resuelve cualquier endpoint del mapa `ENDPOINT_BY_TYPE`.
2. Al agregar `top: '/movie/top_rated'`, la función queda operativa sin modificaciones.

## Estrategia de formateo con `lib/formatter.js`

1. **Sin cambios de lógica**: `displayMovies(movies, typeTitle)` formatea cualquier lista de `results`.
2. Se registra `TYPE_TITLES.top = 'TOP RATED MOVIES'` en `consts/messages.js`.

## Flujo de `app.js` (top-level)

1. **Sin cambios**: guardia de API key, `try/catch` de `parseArguments`, encadenado de promesas con `exit(1)`.

## Cambios en constantes (única modificación de código)

| Archivo | Cambio |
|---|---|
| `consts/api.js` | `ENDPOINT_BY_TYPE.top = '/movie/top_rated'` |
| `consts/messages.js` | `TYPE_TITLES.top = 'TOP RATED MOVIES'` |

## Verificación

```bash
TMDB_API_KEY=dummy node app.js --type bad       # valores válidos ahora incluyen top
TMDB_API_KEY=<real> node app.js --type top      # imprime películas mejor valoradas
# Regresión de features previas
TMDB_API_KEY=<real> node app.js --type playing
TMDB_API_KEY=<real> node app.js --type popular
```

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Romper features previas | Se añade una clave nueva; no se modifican las existentes. |
| Desalineación de tipos | `lib/args.js` valida contra `Object.keys(ENDPOINT_BY_TYPE)`. |