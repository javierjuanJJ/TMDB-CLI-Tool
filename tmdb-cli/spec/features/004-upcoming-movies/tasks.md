# Feature 004 — Lista de Tareas

## Checklist de implementación

- [x] Añadir `ENDPOINT_BY_TYPE.upcoming = '/movie/upcoming'` en `consts/api.js`.
- [x] Añadir `TYPE_TITLES.upcoming = 'UPCOMING MOVIES'` en `consts/messages.js`.
- [x] Verificar que `lib/args.js` valida `upcoming` de forma automática.
- [x] Reutilizar `lib/api.js::fetchMovies` y `lib/formatter.js::displayMovies` sin duplicar lógica.
- [x] Regresión completa: `playing`, `popular`, `top` y `upcoming` operativos.
- [x] Probar escenarios de error y éxito en la terminal.

## Criterios de Aceptación (de spec.md)

- [x] `node app.js --type "upcoming"` imprime título, puntuación y fecha de estreno.
- [x] Salida consistente con el resto de features.
- [x] Sin duplicación de código en `lib/`.
- [x] Mapa de tipos válidos actualizado con los 4 valores.