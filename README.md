Conversor de Números Romanos

Este proyecto convierte números romanos a árabes y al revés. También valida si un número romano es válido. Tiene una interfaz web para probarlo y pruebas automáticas. Está hecho en TypeScript.

Funciones:

- Convierte números romanos a árabes (por ejemplo: XIV = 14)
- Convierte números árabes a romanos (por ejemplo: 14 = XIV)
- Valida si un número romano es correcto
- Tiene una página web para probarlo
- Tiene pruebas automáticas con casos comunes

Ejemplos:

convertirRomano("XIV") // 14  
convertirArabigo(14) // "XIV"  
esRomanoValido("IC") // false

Estructura del proyecto:

- romano.ts : funciones principales  
- romano.test.ts : pruebas automáticas  
- index.html : página web para probar  
- README.md : este archivo

Cómo probarlo:

Está subido en Vercel =>

https://numeros-romanos-monzon1983.vercel.app

Para probarlo en el visual :

npm install  
npm test

Las pruebas están hechas con Jest y cubren casos válidos, inválidos y límites.
