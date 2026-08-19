# Feature 003 — Top Rated Movies

## Resumen

Permite consultar las películas mejor valoradas de TMDB y mostrarlas formateadas en la terminal.

## Comando

```bash
node app.js --type "top"
```

## Endpoint TMDB

- **Método:** `GET`
- **Endpoint:** `/movie/top_rated`
- **Base:** `https://api.themoviedb.org/3`
- **Autenticación:** header `Authorization: Bearer <TMDB_API_KEY>`

### Parámetros de consulta

- `page` (opcional, `1` por defecto)

### Respuesta esperada (200)

```json
{
  "page": 1,
  "results": [
    {
      "title": "...",
      "vote_average": 8.5,
      "release_date": "1994-09-23"
    }
  ],
  "total_pages": 1,
  "total_results": 20
}
```

## Criterios de Aceptación

- [ ] `node app.js --type "top"` imprime la lista de películas mejor valoradas con título, puntuación y fecha de estreno.
- [ ] La salida es consistente con el resto de features (encabezado + separador + posiciones).
- [ ] Reutiliza `lib/api.js::fetchMovies` y `lib/formatter.js::displayMovies` sin duplicar lógica.
- [ ] `ENDPOINT_BY_TYPE` y `TYPE_TITLES` incorporan la entrada `top`.
- [ ] `--type` inválido lista los valores válidos actualizados (`playing, popular, top`).
- [ ] Errores terminan con `process.exit(1)` y mensaje informativo.

## Integración con el mapa de módulos

- `consts/api.js` aporta `top → /movie/top_rated`.
- `consts/messages.js` aporta el título `TOP RATED MOVIES`.
- El resto de módulos quedan inalterados en su comportamiento.