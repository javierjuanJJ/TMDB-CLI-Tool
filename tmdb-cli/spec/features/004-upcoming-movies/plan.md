# Feature 004 — Plan de Implementación

## Objetivo

Añadir la capacidad de consultar próximos estrenos (`--type "upcoming"`) **reutilizando** el flujo existente. Última feature del roadmap: al terminar, los cuatro comandos quedan funcionales.

## Estrategia de llamadas a `lib/api.js`

1. **Sin cambios de lógica**: `fetchMovies(type)` resuelve cualquier endpoint del mapa `ENDPOINT_BY_TYPE`.
2. Al agregar `upcoming: '/movie/upcoming'`, la función queda operativa sin modificaciones.

## Estrategia de formateo con `lib/formatter.js`

1. **Sin cambios de lógica**: `displayMovies(movies, typeTitle)` formatea cualquier lista de `results`.
2. Se registra `TYPE_TITLES.upcoming = 'UPCOMING MOVIES'` en `consts/messages.js`.

## Flujo de `app.js` (top-level)

1. **Sin cambios**: guardia de API key, `try/catch` de `parseArguments`, encadenado de promesas con `exit(1)`.

## Cambios en constantes (única modificación de código)

| Archivo | Cambio |
|---|---|
| `consts/api.js` | `ENDPOINT_BY_TYPE.upcoming = '/movie/upcoming'` |
| `consts/messages.js` | `TYPE_TITLES.upcoming = 'UPCOMING MOVIES'` |

## Verificación

```bash
TMDB_API_KEY=dummy node app.js --type bad            # valores válidos incluyen los 4
TMDB_API_KEY=<real> node app.js --type upcoming      # imprime próximos estrenos
# Regresión de todas las features
TMDB_API_KEY=<real> node app.js --type playing
TMDB_API_KEY=<real> node app.js --type popular
TMDB_API_KEY=<real> node app.js --type top
```

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Romper features previas | Se añade una clave nueva; no se modifican las existentes. |
| Desalineación de tipos | `lib/args.js` valida contra `Object.keys(ENDPOINT_BY_TYPE)`. |