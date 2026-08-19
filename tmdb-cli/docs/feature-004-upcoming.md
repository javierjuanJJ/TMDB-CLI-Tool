# Feature 004 — Upcoming Movies · Documentación de implementación

## Qué hace

`tmdb-app --type "upcoming"` (o `node app.js --type "upcoming"`) consulta `/movie/upcoming` de TMDB y lista los próximos estrenos previstos con título, puntuación (`vote_average`) y fecha de estreno (`release_date`).

## Cómo se implementó

### 1. Especificación (Spec-Driven Development)

Se crearon los tres documentos de la feature en `spec/features/004-upcoming-movies/`:

- `spec.md` — Comando, endpoint `/movie/upcoming` y criterios de aceptación.
- `plan.md` — Estrategia de **reutilización** del flujo existente.
- `tasks.md` — Checklist con trazabilidad contra la spec.

### 2. Código fuente (cambio mínimo y dirigido)

Mismo patrón que 002 y 003: registrar el tipo en los mapas de constantes.

- **`consts/api.js`**: se añadió `upcoming: '/movie/upcoming'` a `ENDPOINT_BY_TYPE`.
- **`consts/messages.js`**: se añadió `TYPE_TITLES.upcoming = 'UPCOMING MOVIES'`.

Ningún archivo de `lib/` ni `app.js` requirió cambios, gracias al diseño basado en mapas.

Con esta feature el **roadmap queda completo**: los cuatro comandos (`playing`, `popular`, `top`, `upcoming`) son funcionales.

### 3. Verificación

```bash
TMDB_API_KEY=<real> node app.js --type upcoming   # imprime próximos estrenos
node app.js --type bad                            # lista de válidos incluye los 4
```

Se ejecutó regresión completa sobre las cuatro features.

## Cómo volver atrás (rollback)

La feature 004 se entregó en un commit dedicado con el prefijo `feat(004)`.

```bash
git log --oneline -- tmdb-cli/spec/features/004-upcoming-movies
git revert <hash-del-commit-004>
# o, si aún es HEAD:
git reset --hard HEAD~1
```

> Según el histórico lineal (`scaffold → 001 → 002 → 003 → 004`), la forma más limpia de deshacer varias features es revertir en orden inverso (004, 003, 002, 001), o `git reset --hard` solo si los commits aún no se han enviado/necesitas perder el historial. Consulta también `docs/feature-003-top-rated.md` para la nota sobre coherencia de `ENDPOINT_BY_TYPE`.

## Estado

- [x] Completado
- [x] Commiteado como `feat(004)`
- [x] Documentado