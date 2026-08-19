# Feature 004 — Upcoming Movies

## Resumen

Permite consultar los próximos estrenos de cine según TMDB y mostrarlos formateados en la terminal.

## Comando

```bash
node app.js --type "upcoming"
```

## Endpoint TMDB

- **Método:** `GET`
- **Endpoint:** `/movie/upcoming`
- **Base:** `https://api.themoviedb.org/3`
- **Autenticación:** header `Authorization: Bearer <TMDB_API_KEY>`

### Parámetros de consulta

- `language` (opcional, `en-US` por defecto)
- `page` (opcional, `1` por defecto)

### Respuesta esperada (200)

```json
{
  "dates": { "maximum": "2026-...", "minimum": "2026-..." },
  "page": 1,
  "results": [
    {
      "title": "...",
      "vote_average": 0.0,
      "release_date": "2026-09-01"
    }
  ],
  "total_pages": 1,
  "total_results": 20
}
```

## Criterios de Aceptación

- [ ] `node app.js --type "upcoming"` imprime la lista de próximos estrenos con título, puntuación y fecha de estreno.
- [ ] La salida es consistente con el resto de features (encabezado + separador + posiciones).
- [ ] Reutiliza `lib/api.js::fetchMovies` y `lib/formatter.js::displayMovies` sin duplicar lógica.
- [ ] `ENDPOINT_BY_TYPE` y `TYPE_TITLES` incorporan la entrada `upcoming`.
- [ ] `--type` inválido lista los valores válidos actualizados (`playing, popular, top, upcoming`).
- [ ] Errores terminan con `process.exit(1)` y mensaje informativo.

## Integración con el mapa de módulos

- `consts/api.js` aporta `upcoming → /movie/upcoming`.
- `consts/messages.js` aporta el título `UPCOMING MOVIES`.
- El resto de módulos quedan inalterados en su comportamiento.