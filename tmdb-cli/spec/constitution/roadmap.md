# Roadmap

Registro del estado de las features del proyecto **tmdb-cli**.

## Estado global

| Prioridad | Feature | Estado | Endpoint |
|---|---|---|---|
| 1 | `001-now-playing-movies` | [Completado] | `/movie/now_playing` |
| 2 | `002-popular-movies` | [Completado] | `/movie/popular` |
| 3 | `003-top-rated-movies` | [Completado] | `/movie/top_rated` |
| 4 | `004-upcoming-movies` | [Completado] | `/movie/upcoming` |

## Detalle por feature

- **001-now-playing-movies** — `tmdb-app --type "playing"` — Películas en cartelera. Especificación, plan, tareas y documentación completas.
- **002-popular-movies** — `tmdb-app --type "popular"` — Películas populares (lista diaria). Especificación, plan, tareas y documentación completas.
- **003-top-rated-movies** — `tmdb-app --type "top"` — Películas mejor valoradas. Especificación, plan, tareas y documentación completas.
- **004-upcoming-movies** — `tmdb-app --type "upcoming"` — Próximos estrenos. Especificación, plan, tareas y documentación completas.

## Antecedentes de trabajo

| Fecha | Hito | Commit |
|---|---|---|
| 2026-08-19 | Constitución y estructura base del proyecto | Inicial |
| 2026-08-19 | Feature 001 implementada y documentada | Por feature |
| 2026-08-19 | Feature 002 implementada y documentada | Por feature |
| 2026-08-19 | Feature 003 implementada y documentada | Por feature |
| 2026-08-19 | Feature 004 implementada y documentada | Por feature |

## Backlog / Mejoras futuras (no planificadas)

- Soporte de banderas adicionales: `--page`, `--language`, `--region`.
- Salida en JSON con `--json` para scripting.
- Paginación interactiva.
- Soporte de series TV (`/tv/...`).