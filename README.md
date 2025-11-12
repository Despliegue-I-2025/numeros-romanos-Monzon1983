# Conversor de Números Romanos

Este proyecto permite convertir números romanos a números arábigos y viceversa. Incluye validación de entradas, pruebas unitarias y una interfaz web para realizar pruebas visuales. Desarrollado en TypeScript.

Funciones:

- Conversión de números romanos a arábigos (ej. `"XIV"` → `14`)
- Conversión de números arábigos a romanos (ej. `14` → `"XIV"`)
- Validación de números romanos
- Interfaz web para pruebas interactivas
- Pruebas unitarias con casos representativos

Ejemplos:


convertirRomano("XIV");     // 14  
convertirArabigo(14);       // "XIV"
esRomanoValido("IC");       // false

Estructura del proyecto

romano.ts: funciones principales de conversión y validación  
romano.test.ts: pruebas unitarias con distintos casos  
index.html: interfaz web para probar el conversor  
README.md: documentación del proyecto

Como probarlo:

El proyecto está desplegado en Vercel y puede probarse directamente desde el siguiente enlace:

https://numeros-romanos-monzon1983.vercel.app

Ejecución local y tests

Para ejecutar el proyecto localmente y correr los tests:


npm install  
npm test


Las pruebas están escritas con Jest y cubren casos válidos, inválidos y límites.
