# Misión del Proyecto

Crear una herramienta de consola (CLI) sencilla y limpia para obtener información de películas desde The Movie Database API (TMDB) y desplegarla formateada en la terminal.

## Propósito

El objetivo es ofrecer un comando único, repetible y predecible (`tmdb-app --type <valor>`) capaz de consultar distinta información de cine —películas en cartelera, populares, mejor valoradas y próximos estrenos— y presentarla de forma legible directamente en la terminal, sin dependencias pesadas ni curva de aprendizaje.

## Público objetivo

- **Desarrolladores** que necesitan consultar datos de películas de forma rápida desde su entorno de trabajo.
- **Usuarios de terminal** que quieren información breve y formateada de cine sin abrir un navegador.

## Objetivos

1. Exponer una interfaz de consola minimalista y consistente.
2. Consumir la API v3 de TMDB con el `fetch` nativo de Node.js.
3. Formatear la salida (título, puntuación y fecha de estreno) de forma limpia.
4. Manejar errores de red, credenciales inválidas y argumentos incorrectos con mensajes claros.

## No objetivos (fuera de alcance)

- No se implementa persistencia ni base de datos local.
- No se incluye autenticación de usuarios ni sesiones de TMDB.
- No se soportan series, personas ni otros recursos de TMDB más allá de películas.

## Criterios de éxito

- Los cuatro comandos documentados funcionan con un único flujo en `app.js`.
- Cualquier fallo termina con mensaje informativo y código de salida `1`.
- El proyecto se puede inspeccionar, empaquetar y reutilizar sin dependencias externas.