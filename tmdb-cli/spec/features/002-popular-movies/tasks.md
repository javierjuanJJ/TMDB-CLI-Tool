# Feature 002 — Lista de Tareas

## Checklist de implementación

- [x] Añadir `ENDPOINT_BY_TYPE.popular = '/movie/popular'` en `consts/api.js`.
- [x] Añadir `TYPE_TITLES.popular = 'POPULAR MOVIES'` en `consts/messages.js`.
- [x] Verificar que `lib/args.js` valida `popular` de forma automática (vs. `Object.keys(ENDPOINT_BY_TYPE)`).
- [x] Reutilizar `lib/api.js::fetchMovies` y `lib/formatter.js::displayMovies` sin duplicar lógica.
- [x] Verificar que `playing` sigue funcionando (no se rompió la feature 001).
- [x] Probar escenarios de error y éxito en la terminal.

## Criterios de Aceptación (de spec.md)

- [x] `node app.js --type "popular"` imprime título, puntuación y fecha de estreno.
- [x] Salida consistente con el resto de features.
- [x] Sin duplicación de código en `lib/`.
- [x] Guardada la coherencia del mapa de tipos válidos.