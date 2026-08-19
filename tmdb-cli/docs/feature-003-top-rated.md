# Feature 003 — Top Rated Movies · Documentación de implementación

## Qué hace

`tmdb-app --type "top"` (o `node app.js --type "top"`) consulta `/movie/top_rated` de TMDB y lista las películas mejor valoradas con título, puntuación (`vote_average`) y fecha de estreno (`release_date`).

## Cómo se implementó

### 1. Especificación (Spec-Driven Development)

Se crearon los tres documentos de la feature en `spec/features/003-top-rated-movies/`:

- `spec.md` — Comando, endpoint `/movie/top_rated` y criterios de aceptación.
- `plan.md` — Estrategia de **reutilización** del flujo existente.
- `tasks.md` — Checklist con trazabilidad contra la spec.

### 2. Código fuente (cambio mínimo y dirigido)

Mismo patrón que la feature 002: registrar el tipo en los mapas de constantes.

- **`consts/api.js`**: se añadió `top: '/movie/top_rated'` a `ENDPOINT_BY_TYPE`.
- **`consts/messages.js`**: se añadió `TYPE_TITLES.top = 'TOP RATED MOVIES'`.

Ningún archivo de `lib/` ni `app.js` requirió cambios, gracias al diseño basado en mapas (`fetchMovies` resuelve el endpoint de forma genérica y `parseArguments` valida contra las claves del mapa).

### 3. Verificación

```bash
TMDB_API_KEY=<real> node app.js --type top      # imprime películas mejor valoradas
node app.js --type bad                          # lista de válidos incluye top
```

También se ejecutó regresión sobre `playing` y `popular`.

## Cómo volver atrás (rollback)

La feature 003 se entregó en un commit dedicado con el prefijo `feat(003)`.

```bash
git log --oneline -- tmdb-cli/spec/features/003-top-rated-movies
git revert <hash-del-commit-003>
# o, si aún es HEAD:
git reset --hard HEAD~1
```

> Nota: si reviertes solo la 003 (manteniendo la 004 ya aplicada), la entrada `top` desaparece del mapa mientras que 004 sigue presente. `lib/args.js` y `lib/api.js` siguen siendo coherentes porque ambos consultan el mismo mapa; simplemente `--type top` dejará de ser válido. Si prefieres conservarla, revierte 004 y 003 en orden inverso.

## Estado

- [x] Completado
- [x] Commiteado como `feat(003)`
- [x] Documentado