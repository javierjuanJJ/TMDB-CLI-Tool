# Feature 001 — Now Playing Movies

## Resumen

Permite consultar las películas actualmente en cartelera (en salas de cine) desde la TMDB API y mostrarlas formateadas en la terminal.

## Comando

```bash
node app.js --type "playing"
```

## Endpoint TMDB

- **Método:** `GET`
- **Endpoint:** `/movie/now_playing`
- **Base:** `https://api.themoviedb.org/3`
- **Autenticación:** header `Authorization: Bearer <TMDB_API_KEY>`

### Parámetros de consulta

- `language` (opcional, `en-US` por defecto)
- `page` (opcional, `1` por defecto)
- `region` (opcional, no usado en esta versión)

### Respuesta esperada (200)

```json
{
  "dates": { "maximum": "2026-...", "minimum": "2026-..." },
  "page": 1,
  "results": [
    {
      "title": "...",
      "vote_average": 7.8,
      "release_date": "2026-05-22"
    }
  ],
  "total_pages": 1,
  "total_results": 20
}
```

## Criterios de Aceptación

- [ ] `node app.js --type "playing"` imprime en terminal la lista de películas en cartelera con título, puntuación y fecha de estreno.
- [ ] La salida incluye un encabezado/título de sección y separadores para una lectura limpia.
- [ ] Se usa `process.env.TMDB_API_KEY` como credencial (bearer token).
- [ ] Si `TMDB_API_KEY` no está definida, el proceso termina con `process.exit(1)` y mensaje claro.
- [ ] Si el flag `--type` está ausente o no es `playing`, termina con `process.exit(1)` y lista de valores válidos.
- [ ] La lógica de llamada al API vive en `lib/api.js` y el formateo en `lib/formatter.js`.
- [ ] `app.js` es el único módulo con `try/catch` global; `lib/` propaga errores con mensajes informativos.

## Integración con el mapa de módulos

- `consts/api.js` aporta `BASE_URL` y el endpoint `playing → /movie/now_playing`.
- `consts/messages.js` aporta el título `NOW PLAYING MOVIES` y los mensajes de error.
- `lib/args.js::parseArguments` valida el `--type`.
- `lib/api.js::fetchMovies` resuelve endpoint, autentica y devuelve `results[]`.
- `lib/formatter.js::displayMovies` imprime la lista.