# Feature 001 — Plan de Implementación

## Objetivo

Entregar el flujo end-to-end para `node app.js --type "playing"` usando el stack definido en la constitución (sin `async function` ni `main()/run()` en `app.js`).

## Estrategia de llamadas a `lib/api.js`

1. `fetchMovies(type)` resuelve el endpoint desde `ENDPOINT_BY_TYPE['playing']` en `consts/api.js`.
2. Lee `process.env[API_KEY_ENV_VAR]`; si falta, lanza `Error` con `MESSAGES.missingApiKey` (propagación, no captura silenciosa).
3. Construye la URL con `language=en-US` y `page=1`.
4. Ejecuta `fetch` nativo con header `Authorization: Bearer <apiKey>`.
5. `try/catch` solo rodea el `fetch` para **re-levantar** con `MESSAGES.networkError` (no se traga el error).
6. Valida `response.ok`; si falla, extrae `status_message` del cuerpo y lanza `MESSAGES.httpError`.
7. Devuelve `payload.results` como array de películas.

## Estrategia de formateo con `lib/formatter.js`

1. `displayMovies(movies, typeTitle)` se ejecuta tras resolverse la promesa de `fetchMovies`.
2. Muestra encabezado en negrita + dividir visual.
3. Itera `results` y por cada película imprime: posición, `title` (negrita), `vote_average` (Rating `x/10`) y `release_date` (Release).
4. Maneja el caso de array vacío con mensaje `No movies found.`.
5. Usa códigos ANSI de color (sin librerías externas).

## Flujo de `app.js` (top-level)

1. Lee `process.env[API_KEY_ENV_VAR]`; si falta → `console.error` + `process.exit(1)`.
2. `try/catch` que invoca `parseArguments(process.argv.slice(2))`; errores → `console.error` + `process.exit(1)`.
3. Encadena promesa: `fetchMovies(type).then(displayMovies).catch(console.error + exit(1))`.
4. Sin `async function`, sin `run()`, sin `main()`: el arranque es top-level.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Falta de API key | Guardia temprana + mensaje claro. |
| Network / DNS / timeout | `fetch` en `try/catch` que re-propaga con contexto. |
| HTTP error (401, etc.) | Se extrae `status_message` de TMDB para reportarlo. |
| Respuesta malformada | Validación de `payload.results` como array. |
| `--type` inválido | Validación en `lib/args.js` con lista de valores permitidos. |

## Verificación

```bash
TMDB_API_KEY=dummy node app.js --type bad       # debe fallar por tipo inválido
TMDB_API_KEY=dummy node app.js                    # debe fallar por falta de --type
node app.js --type playing                        # debe fallar por falta de API key
TMDB_API_KEY=<real> node app.js --type playing   # debe imprimir películas en cartelera
```