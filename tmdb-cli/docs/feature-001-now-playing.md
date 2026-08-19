# Feature 001 — Now Playing Movies · Documentación de implementación

> Objetivo de esta carpeta: registrar **cómo se implementó** cada feature y **cómo volver atrás** (rollback) si en el futuro necesitas revertir o retomar el trabajo.

## Qué hace

`tmdb-app --type "playing"` (o `node app.js --type "playing"`) consulta el endpoint `/movie/now_playing` de TMDB y lista en la terminal las películas en cartelera con título, puntuación (`vote_average`) y fecha de estreno (`release_date`).

## Cómo se implementó

### 1. Especificación (Spec-Driven Development)

Primero se escribieron los documentos de constitución en `spec/constitution/` (misión, stack técnico, roadmap) y, en `spec/features/001-now-playing-movies/`, tres archivos que guían el trabajo **antes** de tocar código:

- `spec.md` — Definición del comando, endpoint y **criterios de aceptación**.
- `plan.md` — Estrategia concreta: cómo `lib/api.js` llama al API y cómo `lib/formatter.js` imprime.
- `tasks.md` — Checklist de implementación y trazabilidad contra la spec.

### 2. Código fuente

Se siguieron las reglas de la constitución:

- **`consts/api.js`** define constantes de dominio TMDB: `BASE_URL`, `API_KEY_ENV_VAR`, `DEFAULT_LANGUAGE`, `DEFAULT_PAGE` y el mapa `ENDPOINT_BY_TYPE` (feature 001 → `playing: '/movie/now_playing'`). Nombres en `UPPER_SNAKE_CASE`.
- **`consts/messages.js`** centraliza los textos de la CLI: mensajes de error (`MESSAGES`) y títulos por tipo (`TYPE_TITLES`).
- **`lib/args.js::parseArguments(argv)`** busca el flag `--type`, valida presencia y valor, y devuelve `{ type, typeTitle }`. En valor inválido **lanza** (no captura).
- **`lib/api.js::fetchMovies(type)`** resuelve el endpoint, lee `process.env.TMDB_API_KEY`, hace `fetch` nativo con header `Authorization: Bearer <key>`, y retorna `results[]`. El `try/catch` solo **re-propaga** con contexto (red/HTTP), nunca traga el error.
- **`lib/formatter.js::displayMovies(movies, typeTitle)`** imprime encabezado + separador + lista (título negrita, rating, fecha) con códigos ANSI.
- **`app.js`** es el **Padre**: arranque 100% **top-level**, sin `async function` y sin invocar `run()` ni `main()`. Hace la guardia de API key, un `try/catch` para `parseArguments`, y encadena `fetchMovies(...).then(displayMovies).catch(...)` con `console.error` y `process.exit(1)`.

### 3. Decisión técnica clave: autenticación

Según la referencia oficial de TMDB (endpoint de validación de key), la API v3 usa **bearer token** en el header `Authorization`. Se eligió `Authorization: Bearer <TMDB_API_KEY>` y se documenta en `spec/constitution/tech-stack.md`.

### 4. Verificación

```bash
# Error esperado 1: sin API key
node app.js --type playing                      # → [ERROR] TMDB_API_KEY environment variable is not set...
# Error esperado 2: tipo inválido
TMDB_API_KEY=x node app.js --type bad           # → [ERROR] Invalid --type value...
# Error esperado 3: flag ausente
TMDB_API_KEY=x node app.js                      # → [ERROR] Missing required flag...
# Éxito (requiere key real)
TMDB_API_KEY=<real> node app.js --type playing
```

## Cómo volver atrás (rollback)

La feature 001 se entregó en un commit dedicado con el prefijo `feat(001)`.

### Opción A — Revertir con git (recomendada)

```bash
# Localizar el commit de la feature 001
git log --oneline -- tmdb-cli/spec/features/001-now-playing-movies

# Revertir ese commit (crea un commit inverso indenvertible en el historial)
git revert <hash-del-commit-001>

# O descartarlo sin dejar rastro si aún es tu HEAD
git reset --hard HEAD~1
```

### Opción B — Retroceder solo los archivos de la feature

```bash
git checkout <hash-del-commit-001>~1 -- tmdb-cli/app.js tmdb-cli/consts tmdb-cli/lib
```

### Nota importante

Como las features 002/003/004 amplían `consts/api.js` y `lib/args.js` sobre la base de 001, si reviertes la 001 debes re-verificar que `ENDPOINT_BY_TYPE` y `TYPE_TITLES` sigan coherentes con las features restantes.

## Estado

- [x] Completado
- [x] Commiteado como `feat(001)`
- [x] Documentado