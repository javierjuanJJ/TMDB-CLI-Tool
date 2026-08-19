# Feature 002 — Popular Movies

## Resumen

Permite consultar las películas populares de TMDB (lista que se actualiza a diario) y mostrarlas formateadas en la terminal.

## Comando

```bash
node app.js --type "popular"
```

## Endpoint TMDB

- **Método:** `GET`
- **Endpoint:** `/movie/popular`
- **Base:** `https://api.themoviedb.org/3`
- **Autenticación:** header `Authorization: Bearer <TMDB_API_KEY>`

### Parámetros de consulta

- `page` (opcional, `1` por defecto)
- `language` (opcional, `en-US` por defecto)

### Respuesta esperada (200)

```json
{
  "page": 1,
  "results": [
    {
      "title": "Gangs of Lagos",
      "vote_average": 5.6,
      "release_date": "2023-04-07",
      "popularity": 1138.252
    }
  ],
  "total_pages": 38029,
  "total_results": 760569
}
```

## Criterios de Aceptación

- [ ] `node app.js --type "popular"` imprime la lista de películas populares con título, puntuación y fecha de estreno.
- [ ] La salida es consistente con el resto de features (encabezado + separador + posiciones).
- [ ] Reutiliza `lib/api.js::fetchMovies` y `lib/formatter.js::displayMovies` sin duplicar lógica.
- [ ] `ENDPOINT_BY_TYPE` y `TYPE_TITLES` incorporan la entrada `popular`.
- [ ] `--type` inválido sigue listando ahora `playing, popular` como valores válidos.
- [ ] Errores terminan con `process.exit(1)` y mensaje informativo.

## Integración con el mapa de módulos

- `consts/api.js` aporta `popular → /movie/popular`.
- `consts/messages.js` aporta el título `POPULAR MOVIES`.
- `lib/args.js`, `lib/api.js` y `lib/formatter.js` quedan inalterados en su comportamiento (solo cambian las constante de tipos válidos).