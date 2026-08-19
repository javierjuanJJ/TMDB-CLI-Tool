# tmdb-cli

CLI sencilla y limpia para consultar información de películas desde **The Movie Database (TMDB) API** y mostrarla formateada en la terminal.

Desarrollada con **Spec Driven Development**: cada feature está precedida por su especificación, plan y lista de tareas en `spec/`, y documentada en `docs/` con instrucciones de cómo volver atrás.

## Requisitos

- [Node.js](https://nodejs.org) **>= 18** (incluye `fetch` nativo).
- No se requieren dependencias externas.

## Obtener una API Key de TMDB

1. Crea una cuenta en <https://www.themoviedb.org/signup>.
2. Entra en <https://www.themoviedb.org/settings/api>.
3. En la sección **API**, solicita una clave: tipo **Developer** (personal, gratis).
4. Copia tu **API Key (v3 auth)** — es el token que usaremos.

> La API v3 se autentica con un **bearer token** mediante el header `Authorization: Bearer <TMDB_API_KEY>` (ver `spec/constitution/tech-stack.md`).

## Configurar la variable de entorno

El proyecto lee la clave de `process.env.TMDB_API_KEY`.

**Linux / macOS (bash/zsh):**

```bash
export TMDB_API_KEY="tu_api_key_aqui"
```

**Windows (PowerShell):**

```powershell
$env:TMDB_API_KEY="tu_api_key_aqui"
```

## Instalación y ejecución

Este proyecto no requiere `npm install` (cero dependencias). Puedes ejecutarlo de dos formas:

### 1. Con el binario `tmdb-app` (tras instalarlo globalmente)

```bash
npm link          # enlaza el binario en el PATH
tmdb-app --type "playing"
tmdb-app --type "popular"
tmdb-app --type "top"
tmdb-app --type "upcoming"
```

### 2. Con Node directamente (sin instalación)

```bash
node app.js --type "playing"
node app.js --type "popular"
node app.js --type "top"
node app.js --type "upcoming"
```

O usando los scripts de `package.json`:

```bash
npm run now-playing
npm run popular
npm run top-rated
npm run upcoming
```

## Comandos disponibles

| Comando | Objetivo | Endpoint TMDB | Feature |
|---|---|---|---|
| `tmdb-app --type "playing"` | Películas en cartelera | `/movie/now_playing` | 001 |
| `tmdb-app --type "popular"` | Películas populares | `/movie/popular` | 002 |
| `tmdb-app --type "top"` | Películas mejor valoradas | `/movie/top_rated` | 003 |
| `tmdb-app --type "upcoming"` | Próximos estrenos | `/movie/upcoming` | 004 |

## Ejemplo de salida

```
NOW PLAYING MOVIES
────────────────────────────────────────────────────────────
1. Dune: Part Two
   Rating: 8.2/10
   Release: 2024-03-01
...
────────────────────────────────────────────────────────────
```

## Manejo de errores

Todos los fallos terminan con `process.exit(1)` y un mensaje claro precedido por `[ERROR]`:

| Caso | Mensaje |
|---|---|
| Falta `TMDB_API_KEY` | `[ERROR] TMDB_API_KEY environment variable is not set...` |
| Falta `--type` | `[ERROR] Missing required flag: --type <value>...` |
| `--type` inválido | `[ERROR] Invalid --type value. Valid values are: playing, popular, top, upcoming...` |
| Error de red | `[ERROR] Network error while reaching TMDB API: ...` |
| Error HTTP (401, 404...) | `[ERROR] TMDB API responded with HTTP ...` |

## Estructura del proyecto

```text
tmdb-cli/
├── spec/
│   ├── constitution/          # Misión, stack técnico y roadmap
│   └── features/NNN-*/        # spec.md, plan.md, tasks.md por feature
├── docs/                      # Cómo se implementó cada feature y cómo volver atrás
├── consts/
│   ├── api.js                 # URL base, endpoints y constantes TMDB
│   └── messages.js            # Textos, errores y títulos de la CLI
├── lib/
│   ├── api.js                 # fetch a TMDB
│   ├── args.js                # parsing/validación de --type
│   └── formatter.js           # formateo de salida en terminal
├── app.js                     # Punto de entrada (top-level, sin async/await)
└── package.json
```

## Documentación técnica

- **Especificaciones**: `spec/constitution/` y `spec/features/NNN-*/`.
- **Detalle por feature + rollback**: `docs/feature-001-now-playing.md` … `docs/feature-004-upcoming.md`.
- **Referencia confirmada**: [TMDB API Reference](https://developer.themoviedb.org/reference).

## Licencia

MIT.