# tmdb-cli

CLI de Node.js sin dependencias para consultar información de películas desde **The Movie Database (TMDB) API** y mostrarla formateada en la terminal.

Desarrollada con **Spec Driven Development**: cada functionality está precedida por su especificación, plan y lista de tareas en `spec/`, y documentada en `docs/` con instrucciones de rollback.

```bash
node app.js --type popular
```

```
POPULAR MOVIES
────────────────────────────────────────────────────────────
1. Dune: Part Two
   Rating: 8.2/10
   Release: 2024-03-01

2. Inside Out 2
   Rating: 7.6/10
   Release: 2024-06-14

3. The Batman
   Rating: 7.7/10
   Release: 2022-03-04

────────────────────────────────────────────────────────────
```

<div align="center">

![Node](https://img.shields.io/badge/node-%3E%3D18-5FA04E)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-informational)

</div>

## Índice

1. [Descripción](#descripción)
2. [Cómo funciona](#cómo-funciona)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos de instalación](#requisitos-de-instalación)
5. [Instalación](#instalación)
6. [Dominio de datos](#dominio-de-datos)
7. [Referencia de comandos](#referencia-de-comandos)
8. [Manejo de errores](#manejo-de-errores)
9. [Ejemplos de uso](#ejemplos-de-uso)
10. [Tests](#tests)
11. [Limitaciones y pendientes](#limitaciones-y-pendientes)
12. [Documentación técnica](#documentación-técnica)
13. [Licencia](#licencia)

---

## Descripción

| | |
|---|---|
| **Tipo** | CLI (aplicación de línea de comandos) |
| **Runtime** | Node.js `>= 18` (usa `fetch` nativo, sin polyfills) |
| **Lenguaje** | JavaScript (CommonJS) |
| **Dependencias** | 0 — no requiere `npm install` |
| **Autenticación** | Bearer token de TMDB v3 vía variable de entorno |
| **Salida** | Texto con códigos ANSI a `stdout`; errores a `stderr` |

La CLI consulta uno de cuatro listados de películas de TMDB (`now_playing`, `popular`, `top_rated`, `upcoming`), cada uno de los cuales corresponde a una *feature* independiente del ciclo Spec Driven Development, e imprime título, puntuación y fecha de estreno de cada película.

El proyecto aplica una constitución técnica estricta definida en `spec/constitution/`: `app.js` es el único módulo con `try/catch` global, los módulos de `lib/` propagan errores con contexto en lugar de tragárselos, y `consts/` centraliza URLs, endpoints y textos.

## Cómo funciona

El flujo es lineal: argumentos → variable de entorno → petición HTTP → formateo en terminal. Los argumentos se validan primero, de modo que `--help` y `--version` funcionan sin configurar `TMDB_API_KEY`.

```mermaid
flowchart TD
    A["node app.js --type popular"] --> C["lib/args.js<br/>parseArguments"]
    C --> K{"¿--help / -h?"}
    K -- "sí" --> OK1["stdout: usage<br/>exit 0"]
    K -- "--version / -v" --> OK2["stdout: tmdb-cli v1.0.0<br/>exit 0"]
    K -- "no" --> D{"--type presente,<br/>sin flags ni posicionales<br/>y valor válido?"}
    D -- "no" --> E2["stderr: [ERROR] missingType /<br/>invalidType / unknownFlag /<br/>unexpectedArgument · exit 1"]
    D -- "sí" --> B{"TMDB_API_KEY<br/>definida?"}
    B -- "no" --> E1["stderr: [ERROR] missingApiKey<br/>exit 1"]
    B -- "sí" --> F["lib/api.js<br/>fetchMovies"]
    F --> G{"GET api.themoviedb.org/3<br/>/movie/&#123;endpoint&#125;"}
    G -- "fallo de red" --> E3["stderr: [ERROR] networkError<br/>exit 1"]
    G -- "HTTP !ok" --> E4["stderr: [ERROR] httpError<br/>+ status_message<br/>exit 1"]
    G -- "200" --> H{"payload.results<br/>es un array?"}
    H -- "no" --> E5["stderr: [ERROR] invalidResponse<br/>exit 1"]
    H -- "sí" --> I["lib/formatter.js<br/>displayMovies"]
    I --> J["stdout: encabezado + lista<br/>con ANSI · exit 0"]

    style E1 fill:#ffdddd,stroke:#c00
    style E2 fill:#ffdddd,stroke:#c00
    style E3 fill:#ffdddd,stroke:#c00
    style E4 fill:#ffdddd,stroke:#c00
    style E5 fill:#ffdddd,stroke:#c00
    style J fill:#ddffdd,stroke:#0a0
    style OK1 fill:#ddffdd,stroke:#0a0
    style OK2 fill:#ddffdd,stroke:#0a0
```

### Secuencia de una ejecución correcta

```mermaid
sequenceDiagram
    actor U as Usuario
    participant CLI as app.js
    participant ARGS as lib/args.js
    participant API as lib/api.js
    participant TMDB as api.themoviedb.org
    participant FMT as lib/formatter.js

    U->>CLI: node app.js --type popular
    CLI->>ARGS: parseArguments(argv)
    ARGS-->>CLI: { action: "list", type: "popular", typeTitle: "POPULAR MOVIES" }
    CLI->>CLI: comprueba process.env.TMDB_API_KEY
    CLI->>API: fetchMovies("popular")
    API->>API: resolveEndpoint → /movie/popular
    API->>TMDB: GET /movie/popular?language=en-US&page=1<br/>Authorization: Bearer $TMDB_API_KEY
    TMDB-->>API: 200 { page, results[], total_results }
    API-->>CLI: results[]
    CLI->>FMT: displayMovies(results, "POPULAR MOVIES")
    FMT-->>U: stdout con ANSI + exit 0
```

### Formato de salida

`lib/formatter.js` imprime siempre esta estructura, independientemente del tipo consultado:

| Elemento | Contenido |
|---|---|
| Encabezado | `TYPE_TITLES[type]` en **negrita + cian** (`\x1b[1m\x1b[36m`) |
| Separador | 60 caracteres `─` (U+2500) |
| Por cada película | `N.` + título en **negrita**, `Rating:` en **amarillo**, `Release:` en **verde**, y una línea en blanco |
| Cierre | Otros 60 caracteres `─` |

Campos con valores ausentes o de tipo inesperado se sustituyen por textos literales:

| Campo | Valor de TMDB | Si falta o no es válido |
|---|---|---|
| Título | `title` | `Untitled` |
| Puntuación | `vote_average` (número) | `N/A` — sin el sufijo `/10`. Si es numérico se formatea a 1 decimal: `8.2/10` |
| Fecha | `release_date` (string `YYYY-MM-DD`) | `Unknown date` |

Si `results` llega vacío, se imprime `No movies found.` en atenuado (`\x1b[2m`) y se sale con código `0`.

## Estructura del proyecto

```text
tmdb-cli/
├── app.js                          # Punto de entrada (top-level, sin async/await)
├── package.json                    # metadatos, bin y scripts npm
├── consts/
│   ├── api.js                      # URL base, env var, idioma/página y mapa de endpoints
│   └── messages.js                 # textos de error y títulos por tipo
├── lib/
│   ├── args.js                     # parsing y validación de --type
│   ├── api.js                      # petición HTTP autenticada a TMDB
│   └── formatter.js                # formateo e impresión en terminal
├── spec/
│   ├── constitution/               # mission.md, tech-stack.md, roadmap.md
│   └── features/
│       ├── 001-now-playing-movies/ # spec.md, plan.md, tasks.md
│       ├── 002-popular-movies/
│       ├── 003-top-rated-movies/
│       └── 004-upcoming-movies/
└── docs/                           # implementación y rollback por feature
```

### Mapa de módulos

```mermaid
graph TD
    subgraph Entrada
        APP["app.js<br/>orquestación + exit codes"]
    end
    subgraph Constantes
        CA["consts/api.js<br/>BASE_URL, ENDPOINT_BY_TYPE,<br/>API_KEY_ENV_VAR, LANGUAGE, PAGE"]
        CM["consts/messages.js<br/>ERROR_PREFIX, MESSAGES,<br/>TYPE_TITLES"]
    end
    subgraph Lógica
        ARGS["lib/args.js<br/>parseArguments"]
        API["lib/api.js<br/>fetchMovies"]
        FMT["lib/formatter.js<br/>displayMovies"]
    end
    EXT["api.themoviedb.org/3"]
    TERM["Terminal"]

    APP --> ARGS
    APP --> API
    APP --> FMT
    ARGS --> CA
    ARGS --> CM
    API --> CA
    API --> CM
    API -->|"fetch + Bearer"| EXT
    FMT --> CM
    FMT -->|"console.log"| TERM

    style APP fill:#ddeeff,stroke:#06c
    style CA fill:#fff4d6,stroke:#c90
    style CM fill:#fff4d6,stroke:#c90
```

### Responsabilidad de cada módulo

| Archivo | Exporta | Responsabilidad |
|---|---|---|
| `app.js` | — | Shebang, try/catch de argumentos, salida de `--help`/`--version`, guard de API key y orquestación `fetchMovies().then(displayMovies).catch(exit 1)` |
| `consts/api.js` | `BASE_URL`, `API_KEY_ENV_VAR`, `DEFAULT_LANGUAGE`, `DEFAULT_PAGE`, `ENDPOINT_BY_TYPE` | Constantes de dominio TMDB en `UPPER_SNAKE_CASE` |
| `consts/messages.js` | `ERROR_PREFIX`, `CLI_NAME`, `MESSAGES`, `TYPE_TITLES`, `versionLine()`, `helpText()` | Todos los textos visibles: errores, plantillas, títulos por tipo y el usage |
| `lib/args.js` | `parseArguments(argv)` | Tokeniza y valida `--type` (`--type x` y `--type=x`), detecta `--help`/`--version` y rechaza flags desconocidos y posicionales; devuelve `{ action, type, typeTitle }` o `{ action }`; **lanza** en error |
| `lib/api.js` | `fetchMovies(type)` | Resuelve endpoint, autentica, valida `response.ok` y `results[]`; **re-lanza** con contexto |
| `lib/formatter.js` | `displayMovies(movies, typeTitle)` | Imprime el bloque con códigos ANSI y aplica los fallbacks `Untitled` / `N/A` / `Unknown date` |

## Requisitos de instalación

| Requisito | Versión | Verificado en |
|---|---|---|
| Node.js | `>= 18` (por `fetch` nativo en `globalThis`) | v24.15.0 |
| Sistema operativo | Linux, macOS o Windows | Linux |
| Gestor de paquetes | Ninguno — **cero dependencias** | — |
| Cuenta de TMDB | Obligatoria para obtener una API key | — |
| Red | Salida HTTPS a `api.themoviedb.org:443` | — |

## Instalación

### 1. Obtener una API key de TMDB

1. Crea una cuenta en <https://www.themoviedb.org/signup>.
2. Entra en <https://www.themoviedb.org/settings/api>.
3. En la sección **API**, solicita una clave de tipo **Developer** (personal, gratis).
4. Copia tu **API Key (v3 auth)** — es el token que se usará como bearer.

> La API v3 se autentica con un **bearer token** mediante la cabecera `Authorization: Bearer <TMDB_API_KEY>` (decisión documentada en `spec/constitution/tech-stack.md`).

### 2. Configurar la variable de entorno

**Linux / macOS (bash/zsh):**

```bash
export TMDB_API_KEY="tu_api_key_aqui"
```

**Windows (PowerShell):**

```powershell
$env:TMDB_API_KEY="tu_api_key_aqui"
```

**Windows (cmd):**

```cmd
set TMDB_API_KEY=tu_api_key_aqui
```

Verificación rápida de que la variable está definida:

```bash
node -e "console.log(process.env.TMDB_API_KEY ? 'key presente' : 'key AUSENTE')"
```

### 3. Ejecutar

No hay nada que instalar. Clona el repositorio y ejecuta el punto de entrada con Node:

```bash
node app.js --type "playing"
node app.js --type "popular"
node app.js --type "top"
node app.js --type "upcoming"

# Sintaxis con igual, equivalente a --type popular
node app.js --type=popular

# Ayuda y versión (no requieren TMDB_API_KEY)
node app.js --help
node app.js --version
```

Alternativamente, mediante los scripts de `package.json`:

```bash
npm start          # equivalente a: node app.js --type popular
npm run popular
npm run now-playing
npm run top-rated
npm run upcoming
```

### Instalación global (binario `tmdb-app`)

`package.json` declara el binario `tmdb-app`, y `app.js` incluye el shebang `#!/usr/bin/env node`, por lo que `npm link` lo deja ejecutable en el `PATH`:

```bash
npm link                    # enlaza el binario en el PATH
tmdb-app --type popular     # listado de populares
tmdb-app --help             # ayuda
tmdb-app --version          # versión
```

Para desinstalarlo: `npm unlink -g tmdb-cli`.

## Dominio de datos

### Entradas

| Entrada | Tipo | Formato | Obligatoria | Validación |
|---|---|---|---|---|
| `argv[2..]` | Array de strings | `--type <valor>`, `--help`, `--version` | **Sí** (salvo `--help`/`--version`) | `lib/args.js` tokeniza el array: `--type x` y `--type=x`; cualquier otro flag lanza `unknownFlag` y cualquier posicional lanza `unexpectedArgument` |
| `--type <valor>` | String enumerado | `playing` \| `popular` \| `top` \| `upcoming` | **Sí** | Se normaliza con `toLowerCase()` (acepta `POPULAR`, `TOP`) y se contrasta contra las claves de `ENDPOINT_BY_TYPE` |
| `TMDB_API_KEY` | Variable de entorno | Token alfanumérico de TMDB | **Sí** | Se comprueba por truthiness: ausente **o string vacío** ⇒ error `missingApiKey` (`app.js`, `lib/api.js:26`). Se valida **después** de los argumentos, así que `--help` y `--version` funcionan sin key |

### Salidas

| Flujo | Formato | Contenido |
|---|---|---|
| `stdout` | Texto con ANSI | Encabezado + separadores de 60 chars + una línea por película + separador. Termina siempre en `0x0a` |
| `stdout` | Texto plano | Salida de `--help` (usage) y `--version` (`tmdb-cli v1.0.0`) |
| `stderr` | Texto plano | Mensajes `[ERROR] ...` (sin colores) |
| Código de salida | `0` | Ejecución correcta (**incluido** "no hay películas"), `--help` y `--version` |
| Código de salida | `1` | Cualquier error: argumentos inválidos, falta de key, fallo de red, error HTTP, respuesta inesperada |

### Petición HTTP emitida

```http
GET /movie/{endpoint}?language=en-US&page=1 HTTP/1.1
Host: api.themoviedb.org
accept: application/json
Authorization: Bearer <TMDB_API_KEY>
```

`language` y `page` se rellenan desde `DEFAULT_LANGUAGE` y `DEFAULT_PAGE` y **no son configurables** por flags (ver [Limitaciones y pendientes](#limitaciones-y-pendientes)).

### Datos devueltos por TMDB y usados

```json
{
  "page": 1,
  "results": [
    {
      "title": "Dune: Part Two",
      "vote_average": 8.2,
      "release_date": "2024-03-01"
    }
  ],
  "total_pages": 1,
  "total_results": 20
}
```

Solo se consumen `results[].title`, `results[].vote_average` y `results[].release_date`. Si la respuesta no contiene un array en `results`, se aborta con `invalidResponse`.

### Persistencia

**Ninguna.** La CLI no escribe archivos, no mantiene caché, no usa base de datos y no envía datos a ningún servicio más allá de la petición GET a TMDB. Es completamente stateless: cada invocación performs una única llamada de red.

## Referencia de comandos

### Parámetros

| Parámetro | Tipo | Obligatorio | Default | Valores válidos | Notas |
|---|---|---|---|---|---|
| `--type <valor>` | String enumerado | **Sí** | — | `playing`, `popular`, `top`, `upcoming` | Case-insensitive en el valor. Acepta `--type popular` y `--type=popular` |
| `--help`, `-h` | Boolean | No | — | — | Imprime el usage en `stdout` y sale con `0`. No requiere `TMDB_API_KEY` |
| `--version`, `-v` | Boolean | No | — | — | Imprime `tmdb-cli v1.0.0` en `stdout` y sale con `0`. No requiere `TMDB_API_KEY` |
| `TMDB_API_KEY` | Variable de entorno | **Sí** | — | Cualquier token válido de TMDB | Se valida **después** de los argumentos |
| — | — | — | — | — | Los posicionales y los flags desconocidos se **rechazan** (exit `1`) |

### Tipos de consulta disponibles

| Valor de `--type` | Significado | Endpoint TMDB | Feature |
|---|---|---|---|
| `playing` | Películas en cartelera | `/movie/now_playing` | 001 |
| `popular` | Películas populares | `/movie/popular` | 002 |
| `top` | Películas mejor valoradas | `/movie/top_rated` | 003 |
| `upcoming` | Próximos estrenos | `/movie/upcoming` | 004 |

### Matriz de pruebas

Todas las filas se ejecutaron realmente. `✔` = comportamiento correcto; `✘` = discrepancia detectada. La columna "Real" recoge la salida observada.

#### Ayuda y versión

| Comando | Parámetros | Resultado esperado | Resultado real | Estado |
|---|---|---|---|---|
| `app.js --help` | `--help`, sin `TMDB_API_KEY` | usage en `stdout`, exit 0 | `tmdb-cli v1.0.0 — List movies...` + secciones USAGE/OPTIONS/ENVIRONMENT/LISTINGS/EXAMPLES · exit 0 | ✔ |
| `app.js -h` | alias corto | igual que `--help` | mismo usage · exit 0 | ✔ |
| `app.js --version` | `--version`, sin `TMDB_API_KEY` | `tmdb-cli v1.0.0` | `tmdb-cli v1.0.0` · exit 0 | ✔ |
| `app.js -v` | alias corto | igual que `--version` | `tmdb-cli v1.0.0` · exit 0 | ✔ |
| `app.js --type foo --help` | ayuda + valor inválido | la ayuda tiene prioridad | usage · exit 0 | ✔ |
| `app.js --language es --help` | ayuda + flag desconocido | la ayuda tiene prioridad | usage · exit 0 | ✔ |
| `tmdb-app --help` | binario global | usage | usage · exit 0 | ✔ |
| `tmdb-app --version` | binario global | versión | `tmdb-cli v1.0.0` · exit 0 | ✔ |

#### Argumentos y validación

| Comando | Parámetros | Resultado esperado | Resultado real | Estado |
|---|---|---|---|---|
| `node app.js` | — | error: falta `--type` | `[ERROR] Missing required flag: --type <value>. Run with --help to see the usage.` · exit 1 | ✔ |
| `node app.js` | `TMDB_API_KEY=x` | error: falta `--type` | `[ERROR] Missing required flag: --type <value>...` · exit 1 | ✔ |
| `node app.js --type popular` | sin `TMDB_API_KEY` | error: falta la key | `[ERROR] TMDB_API_KEY environment variable is not set...` · exit 1 | ✔ |
| `app.js --type popular` | `--type popular` | listado de populares | `POPULAR MOVIES` + 3 películas · exit 0 | ✔ |
| `app.js --type playing` | `--type playing` | cartelera | `NOW PLAYING MOVIES` · exit 0 | ✔ |
| `app.js --type top` | `--type top` | mejor valoradas | `TOP RATED MOVIES` · exit 0 | ✔ |
| `app.js --type upcoming` | `--type upcoming` | próximos estrenos | `UPCOMING MOVIES` · exit 0 | ✔ |
| `app.js --type POPULAR` | mayúsculas | case-insensitive | equivalente a `popular` · exit 0 | ✔ |
| `app.js --type` | flag sin valor | error: falta valor | `Missing required flag: --type <value>` · exit 1 | ✔ |
| `app.js --type --page 2` | valor = flag | error: no consumir flags | `Missing required flag: --type <value>` · exit 1 | ✔ |
| `app.js --type ""` | string vacío | error: falta valor | `Missing required flag: --type <value>` · exit 1 | ✔ |
| `app.js --type foo` | valor inválido | error + lista de válidos | `Invalid --type value. Valid values are: playing, popular, top, upcoming...` · exit 1 | ✔ |
| `app.js --type " pop ular"` | espacios | error: inválido | `Invalid --type value...` · exit 1 | ✔ |
| `app.js --type "popular; rm -rf /"` | inyección shell | error: inválido, sin ejecución | `Invalid --type value...` · exit 1 | ✔ |
| `app.js --type '$(whoami)'` | subshell | error: inválido, sin ejecución | `Invalid --type value...` · exit 1 | ✔ |
| `app.js --type=popular` | sintaxis `=` | equivalente a `--type popular` | `POPULAR MOVIES` · exit 0 | ✔ |
| `app.js --type=TOP` | `=` + mayúsculas | case-insensitive | `TOP RATED MOVIES` · exit 0 | ✔ |
| `app.js --type=` | `=` sin valor | error: falta valor | `Missing required flag: --type <value>` · exit 1 | ✔ |
| `app.js --type=foo` | `=` con valor inválido | error: inválido | `Invalid --type value...` · exit 1 | ✔ |
| `app.js --Type popular` | flag con otra caja | error explícito de opción desconocida | `Unknown option: --Type. Supported options are: --type <value>, --help, --version.` · exit 1 | ✔ |
| `app.js --language es --type popular` | flag desconocido | error explícito | `Unknown option: --language...` · exit 1 | ✔ |
| `app.js -x --type popular` | alias corto desconocido | error explícito | `Unknown option: -x...` · exit 1 | ✔ |
| `app.js --type popular --bogus` | flag basura tras el válido | error explícito | `Unknown option: --bogus...` · exit 1 | ✔ |
| `app.js movies --type popular` | posicional extra | error explícito | `Unexpected argument: movies. This command only accepts options, no positional arguments.` · exit 1 | ✔ |
| `app.js --type popular --type top` | flag duplicado | primer valor gana | `POPULAR MOVIES` · exit 0 | ✔ |
| `app.js --type popular --type=top` | mix de sintaxis | primer valor gana | `POPULAR MOVIES` · exit 0 | ✔ |
| `app.js --type popular --type` | flag duplicado colgante | primer valor gana | `POPULAR MOVIES` · exit 0 | ✔ |
| `app.js --type popular --help` | ayuda tras el válido | la ayuda tiene prioridad | usage · exit 0 | ✔ |
| `app.js --type popular </dev/null` | stdin cerrado | funcionamiento normal | listado normal · exit 0 | ✔ |

\* Sin `--type` presente el fallo es correcto; cuando `--type` sí es válido, los flags desconocidos no producen ningún error visible.

#### Configuración y entorno

| Escenario | Resultado esperado | Resultado real | Estado |
|---|---|---|---|
| `TMDB_API_KEY` con valor válido | listado correcto | depende de red; petición correcta a `/movie/{endpoint}?language=en-US&page=1` | ✔ |
| `TMDB_API_KEY=""` (vacío) | error: key no configurada | `[ERROR] TMDB_API_KEY ... is not set` · exit 1 | ✔ |
| `TMDB_API_KEY` con key inválida | error HTTP 401 con detalle | `[ERROR] TMDB API responded with HTTP 401 (Unauthorized). Detail: Invalid API key: You must be granted a valid key. URL: ...` · exit 1 | ✔ |
| Node < 18 | fallar rápido | no verificable en este entorno; `engines` declara `>= 18` | ⚠ |

#### Respuestas HTTP y de red (simuladas con `fetch` interceptado)

| Respuesta simulada | Resultado esperado | Resultado real | Estado |
|---|---|---|---|
| `200` con `results[]` de 3 películas | listado con 3 entradas | 15 líneas, 10 secuencias ANSI · exit 0 | ✔ |
| `200` con `results: []` | mensaje "sin películas", sin error | `No movies found.` · exit 0 | ✔ |
| `200` con objetos sin `title`/`vote_average`/`release_date` | fallbacks | `Untitled`, `N/A`, `Unknown date` · exit 0 | ✔ |
| `200` con título con `<script>` y comillas | salida literal segura | impreso literal (inofensivo en terminal) · exit 0 | ✔ |
| `200` con unicode / emoji | salida legible | `🎬 Unicode ñ á é í` correcto · exit 0 | ✔ |
| `200` con body no-JSON | error `invalidResponse` | `[ERROR] TMDB API returned an unexpected or empty response.` · exit 1 | ✔ |
| `200` con body `null` | error `invalidResponse` | `[ERROR] TMDB API returned an unexpected or empty response.` · exit 1 | ✔ |
| `200` sin array `results` | error `invalidResponse` | `[ERROR] TMDB API returned an unexpected or empty response.` · exit 1 | ✔ |
| `401` con `status_message` | error con detalle | `HTTP 401 (Unauthorized). Detail: Invalid API key...` · exit 1 | ✔ |
| `404` con body HTML | error sin detalle | `HTTP 404 (Not Found). URL: ...` · exit 1 | ✔ |
| `500` con body vacío | error sin detalle | `HTTP 500 (Internal Server Error). URL: ...` · exit 1 | ✔ |
| `fetch` lanza `TypeError` | error de red | `[ERROR] Network error while reaching TMDB API: fetch failed` · exit 1 | ✔ |

#### Scripts de `package.json`

| Comando | Script | Resultado real | Estado |
|---|---|---|---|
| `npm start` | `node app.js --type popular` | `POPULAR MOVIES` · exit 0 | ✔ |
| `npm run now-playing` | `node app.js --type playing` | `NOW PLAYING MOVIES` · exit 0 | ✔ |
| `npm run popular` | `node app.js --type popular` | `POPULAR MOVIES` · exit 0 | ✔ |
| `npm run top-rated` | `node app.js --type top` | `TOP RATED MOVIES` · exit 0 | ✔ |
| `npm run upcoming` | `node app.js --type upcoming` | `UPCOMING MOVIES` · exit 0 | ✔ |
| `npm run <inexistente>` | error de npm | exit 1 | ✔ |
| `npm start -- --type=top` | parámetros extra a npm | el script manda: `POPULAR MOVIES` · exit 0 | ✔ |
| `npm link` + `tmdb-app --type popular` | listado correcto | `POPULAR MOVIES` · exit 0 | ✔ |
| `npm link` + `tmdb-app --type=top` | sintaxis `=` | exit 0 | ✔ |
| `npm link` + `tmdb-app` sin `--type` | error de argumentos | `[ERROR] Missing required flag...` · exit 1 | ✔ |

## Manejo de errores

Todos los fallos terminan con `process.exit(1)` y un mensaje en `stderr` precedido por `[ERROR]`. Los mensajes están centralizados en `consts/messages.js`.

| Caso | Mensaje | Exit |
|---|---|---|
| Falta `--type`, o sin valor, o con `--type=` vacío, o seguido de otro flag | `Missing required flag: --type <value>. Example: --type "playing". Run with --help to see the usage.` | 1 |
| `--type` inválido | `Invalid --type value. Valid values are: playing, popular, top, upcoming. Example: --type "playing".` | 1 |
| Flag desconocido (`--language`, `--Type`, `-x`, `--bogus`…) | `Unknown option: <flag>. Supported options are: --type <value>, --help, --version. Run with --help to see the usage.` | 1 |
| Argumento posicional inesperado | `Unexpected argument: <valor>. This command only accepts options, no positional arguments. Run with --help to see the usage.` | 1 |
| Falta `TMDB_API_KEY` (o está vacía) | `TMDB_API_KEY environment variable is not set. Set it before running the app. Example: TMDB_API_KEY=your_key node app.js --type "playing".` | 1 |
| Fallo de red / DNS / TLS | `Network error while reaching TMDB API: <motivo>` | 1 |
| Respuesta HTTP no 2xx | `TMDB API responded with HTTP <status> (<statusText>). Detail: <status_message de TMDB>. URL: <url completa>` | 1 |
| JSON inválido, `null` o sin array `results` | `TMDB API returned an unexpected or empty response.` | 1 |

Los errores de argumentos se evalúan **antes** que la variable de entorno: `node app.js` sin nada reporta el `--type` ausente, y sólo después se comprueba `TMDB_API_KEY`.

Casos que **no** son error (salida a `stdout`, exit `0`): `--help`, `-h`, `--version`, `-v`, y el listado sin resultados (`No movies found.`).

Ejemplo de captura de `stderr` manteniendo el código de salida:

```bash
output=$(node app.js --type popular 2>&1) || echo "falló con exit $?"
```

## Ejemplos de uso

Salida real capturada en las pruebas (con `--type playing`):

```
NOW PLAYING MOVIES
────────────────────────────────────────────────────────────
1. Dune: Part Two
   Rating: 8.2/10
   Release: 2024-03-01

2. Inside Out 2
   Rating: 7.6/10
   Release: 2024-06-14

3. The Batman
   Rating: 7.7/10
   Release: 2022-03-04

────────────────────────────────────────────────────────────
```

### Cartelera

```bash
export TMDB_API_KEY="tu_api_key_aqui"
node app.js --type playing
```

### Ayuda

```bash
$ node app.js --help
tmdb-cli v1.0.0 — List movies from The Movie Database straight into your terminal.

USAGE
  node app.js --type <value>
  tmdb-app    --type <value>

OPTIONS
  --type <value>   Listing to query. Required. Also accepts --type=<value>.
  --help, -h       Show this help and exit with code 0.
  --version, -v    Show the version and exit with code 0.

ENVIRONMENT
  TMDB_API_KEY     Required. TMDB API Key (v3 auth) bearer token.

LISTINGS
  NOW PLAYING MOVIES    --type playing
  POPULAR MOVIES        --type popular
  TOP RATED MOVIES      --type top
  UPCOMING MOVIES       --type upcoming

EXAMPLES
  export TMDB_API_KEY="your_api_key_here"
  node app.js --type popular
  node app.js --type top | sed 's/\x1b\[[0-9;]*m//g'

Errors are printed to stderr prefixed with [ERROR] and always exit with code 1.
```

### Versión

```bash
$ node app.js --version
tmdb-cli v1.0.0
```

### Sólo las 10 primeras líneas (encabezado + 2 películas)

```bash
node app.js --type popular | head -10
```

### Guardar el resultado en un archivo

```bash
node app.js --type top > top-rated.txt
```

### Quitar los códigos de color

```bash
node app.js --type upcoming | sed 's/\x1b\[[0-9;]*m//g'
```

### Usar un valor concreto sólo para una invocación

```bash
TMDB_API_KEY="tu_api_key_aqui" node app.js --type upcoming
```

### Comprobar la conectividad antes de lanzar

```bash
node app.js --type popular >/dev/null 2>&1 && echo "API accesible" || echo "revisa TMDB_API_KEY y la red"
```

## Tests

**No existe suite de tests automatizados.** `package.json` no define script `test` ni `lint`, y no hay dependencias de desarrollo. Las 62 pruebas de este README se ejecutaron de forma manual con este procedimiento:

```bash
cd tmdb-cli

# 1. Ayuda y versión (sin necesidad de red ni de key)
node app.js --help          # usage en stdout, exit 0
node app.js -h              # exit 0
node app.js --version       # tmdb-cli v1.0.0, exit 0
node app.js -v              # exit 0

# 2. Casos de error sin necesidad de red ni key
node app.js                                        # exit 1, falta --type
TMDB_API_KEY=x node app.js                         # exit 1, falta --type
TMDB_API_KEY=x node app.js --type foo              # exit 1, tipo inválido
TMDB_API_KEY=x node app.js --type=                 # exit 1, valor vacío
TMDB_API_KEY=x node app.js --language es --type top # exit 1, opción desconocida
TMDB_API_KEY=x node app.js movies --type top       # exit 1, argumento inesperado
node app.js --type popular                         # exit 1, falta la key

# 3. Casos de red (requiere key real)
TMDB_API_KEY=<real>  node app.js --type popular    # exit 0 + listado
TMDB_API_KEY=falsa   node app.js --type popular    # exit 1, HTTP 401 con detalle

# 4. Scripts npm
npm start && npm run now-playing && npm run top-rated && npm run upcoming

# 5. Binario global
npm link
tmdb-app --type popular   # exit 0 + listado
tmdb-app --help           # exit 0
npm unlink -g tmdb-cli
```

Para aislar la capa de red y probar el happy path sin una key válida, se puede interceptar `fetch` con un preload de Node:

```bash
TMDB_API_KEY=dummy node -r ./mock-fetch.js app.js --type popular
```

Los criterios de aceptación definidos en `spec/features/NNN-*/spec.md` cubren este mismo conjunto de escenarios como texto; no están automatizados.

## Limitaciones y pendientes

### Bugs corregidos

Detectados durante la verificación de esta CLI y ya arreglados:

| # | Severidad original | Problema | Corrección aplicada |
|---|---|---|---|
| 1 | **Crítica** | El binario `tmdb-app` no arrancaba: `package.json` declara `bin` pero `app.js` no tenía shebang, así que el kernel lo ejecutaba con bash y abortaba con `error sintáctico` y exit `2`. Las cuatro invocaciones `tmdb-app --type ...` documentadas no funcionaban | Añadido `#!/usr/bin/env node` y el bit de ejecución en `app.js` |
| 2 | Media | `tmdb-app --help`, `-h`, `--version` y `-v` devolvían el error de `--type` en lugar de un usage | `lib/args.js` detecta esas acciones y `app.js` imprime el usage o la versión con exit `0`, sin exigir `TMDB_API_KEY` |
| 3 | Baja | Los flags desconocidos y los argumentos posicionales se ignoraban en silencio, dando la falsa impresión de que el filtro se aplicaba | `lib/args.js` lanza `unknownFlag` o `unexpectedArgument` con exit `1` |
| 4 | Baja | `--type=popular` no se parseaba y devolvía `Missing required flag` | `lib/args.js` acepta tanto `--type popular` como `--type=popular` |
| 5 | Baja | Cuando faltaba `vote_average` se imprimía `N/A/10`, una puntuación imposible de leer | `lib/formatter.js` devuelve `N/A` sin el sufijo `/10` |

Como efecto secundario del arreglo 2, la validación de argumentos se evalúa **antes** que `TMDB_API_KEY`: `node app.js` sin nada ahora reporta el `--type` ausente en lugar de la variable de entorno.

### Pendientes

| # | Severidad | Problema | Detalle | Propuesta |
|---|---|---|---|---|
| 1 | Info | `language` y `page` fijos | `consts/api.js` los fija a `en-US` y `1`; siempre se devuelve la primera página (20 películas) y no hay forma de pedir actor, director o búsqueda por texto | Añadir flags `--language` y `--page` si se requiere |
| 2 | Info | `spec/` y `docs/` desactualizados | Los documentos de las features 001-004 describen el flujo anterior (validación de la key antes que los argumentos, sin `--help`) | Actualizar las specs y docs, o registrar este arreglo como feature 005 |
| 3 | Info | Sin suite de tests automatizados | La verificación es manual, tal y como permite la constitución ("ejecución manual del binario") | Añadir `npm test` con `node:test` si se quiere cobertura en CI |

## Documentación técnica

- **Constitución del proyecto** (misión, stack técnico, roadmap): `spec/constitution/`
- **Especificaciones por feature**: `spec/features/NNN-*/spec.md`, con `plan.md` y `tasks.md`
- **Detalle de implementación y rollback**: `docs/feature-001-now-playing.md` … `docs/feature-004-upcoming.md`
- **Referencia del API externo**: [TMDB API Reference](https://developer.themoviedb.org/reference)

### Historial de features

| Feature | Commit | Alcance |
|---|---|---|
| 001 | `feat(001)` | Flujo de cartelera (`--type playing`) |
| 002 | `feat(002)` | Flujo de populares (`--type popular`) |
| 003 | `feat(003)` | Flujo de mejor valoradas (`--type top`) |
| 004 | `feat(004)` | Flujo de próximos estrenos (`--type upcoming`) |

### Rollback de una feature

```bash
# Localizar el commit de la feature
git log --oneline -- tmdb-cli/spec/features/001-now-playing-movies

# Revertir creando un commit inverso
git revert <hash>

# O restaurar solo los archivos de código de esa feature
git checkout <hash>~1 -- tmdb-cli/app.js tmdb-cli/consts tmdb-cli/lib
```

> Las features 002/003/004 amplían `consts/api.js` y `lib/args.js` sobre la base de 001: si reviertes 001, vuelve a verificar la coherencia de `ENDPOINT_BY_TYPE` y `TYPE_TITLES` con las features restantes.

## Licencia

MIT — ver [package.json](package.json).