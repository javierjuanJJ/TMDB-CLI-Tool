# Feature 002 — Popular Movies · Documentación de implementación

## Qué hace

`tmdb-app --type "popular"` (o `node app.js --type "popular"`) consulta `/movie/popular` de TMDB y lista las películas populares del momento con título, puntuación (`vote_average`) y fecha de estreno (`release_date`).

## Cómo se implementó

### 1. Especificación (Spec-Driven Development)

Se crearon los tres documentos de la feature en `spec/features/002-popular-movies/`:

- `spec.md` — Comando, endpoint `/movie/popular` y criterios de aceptación.
- `plan.md` — Estrategia de **reutilización**: el código de `lib/` no cambia de lógica.
- `tasks.md` — Checklist con trazabilidad contra la spec.

### 2. Código fuente (cambio mínimo y dirigido)

La feature 001 dejó un diseño impulsado por **mapas de constantes**, de modo que añadir una feature nueva se reduce a **registrar el tipo**:

- **`consts/api.js`**: se añadió la entrada `popular: '/movie/popular'` a `ENDPOINT_BY_TYPE`.
- **`consts/messages.js`**: se añadió `TYPE_TITLES.popular = 'POPULAR MOVIES'`.

Ningún archivo de `lib/` ni `app.js` requirió cambios lógicos, porque:

- `lib/api.js::fetchMovies(type)` resuelve el endpoint leyendo `ENDPOINT_BY_TYPE[type]` (genérico por diseño).
- `lib/args.js::parseArguments` valida el `--type` contra `Object.keys(ENDPOINT_BY_TYPE)`, por lo que `popular` se acepta automáticamente.
- `lib/formatter.js::displayMovies` formatea cualquier lista de `results`.

### 3. Decisión técnica clave: "única fuente de verdad"

Mantener el mapa de endpoints en `consts/api.js` y validar contra sus claves evita que `lib/args.js` y `lib/api.js` se desincronicen. Añadir una feature = modificar un único mapa.

### 4. Verificación

```bash
TMDB_API_KEY=<real> node app.js --type popular  # imprime películas populares
node app.js --type bad                          # lista de válidos ahora incluye popular
```

## Cómo volver atrás (rollback)

La feature 002 se entregó en un commit dedicado con el prefijo `feat(002)`.

```bash
# Localizar el commit
git log --oneline -- tmdb-cli/spec/features/002-popular-movies

# Revertir (commit inverso) o descartar si aún es HEAD
git revert <hash-del-commit-002>
git reset --hard HEAD~1
```

> Nota: al revertir la 002 se eliminan las dos líneas añadidas en `consts/api.js` y `consts/messages.js`. Las features 003/004 aún no existen en ese punto del historial, así que no hay conflicto si reviertes en orden.

## Estado

- [x] Completado
- [x] Commiteado como `feat(002)`
- [x] Documentado