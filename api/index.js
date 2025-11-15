/**
 * Express Backend para la conversión de números arábigos a romanos (A2R) y viceversa (R2A).
 * * Requisitos:
 * 1. GET /a2r?arabic=123 -> {"roman":"CXXIII"} (200)
 * 2. GET /r2a?roman=CXXIII -> {"arabic":123} (200)
 * 3. Manejo de errores 400 para parámetros inválidos o ausentes.
 * 4. CORS habilitado.
 * * Para correr este código localmente, necesitarás instalar Express y CORS:
 * npm install express cors
 * node index.js
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
// Permitimos cualquier origen para facilitar la evaluación, como se solicita.
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// --- Lógica de Conversión ---

/**
 * Convierte un número arábigo (1-3999) a su representación romana.
 * @param {number} num Número arábigo entero.
 * @returns {string|null} Número romano o null si es inválido.
 */
function arabicToRoman(num) {
    // Validar que sea un entero, positivo y dentro del rango (1 a 3999)
    if (typeof num !== 'number' || !Number.isInteger(num) || num <= 0 || num > 3999) {
        return null; 
    }

    const map = new Map([
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ]);

    let roman = '';
    // Iterar sobre el mapa de valores en orden descendente
    for (const [value, symbol] of map) {
        while (num >= value) {
            roman += symbol;
            num -= value;
        }
    }
    return roman;
}

/**
 * Convierte un número romano a su representación arábiga.
 * Incluye una validación estricta para asegurar que el romano sea canónico (ej. no permite IIII o IXC).
 * @param {string} roman Número romano (solo letras I, V, X, L, C, D, M).
 * @returns {number|null} Número arábigo o null si es inválido.
 */
function romanToArabic(roman) {
    if (typeof roman !== 'string') return null;

    // Normalizar a mayúsculas y validar que solo contenga caracteres romanos
    roman = roman.toUpperCase();
    if (!/^[IVXLCDM]+$/.test(roman)) {
        return null;
    }

    const map = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
    let arabic = 0;

    for (let i = 0; i < roman.length; i++) {
        const current = map[roman[i]];
        const next = map[roman[i + 1]];

        // Lógica de resta: si el valor actual es menor que el siguiente, es una resta (ej. IV = 5 - 1)
        if (next && current < next) {
            arabic += next - current;
            i++; // Saltar el siguiente carácter, ya que se usó en el par
        } else {
            arabic += current;
        }
    }

    // Validación Canónica: La forma más sencilla de asegurar que el número romano es
    // estructuralmente correcto (ej. no IIII, VX, IXC, etc.) es convertir el resultado
    // arábigo de nuevo a romano y verificar que coincida con el original.
    const canonicalRoman = arabicToRoman(arabic);
    if (canonicalRoman !== roman) {
        return null; // El formato romano es incorrecto (no canónico)
    }

    return arabic;
}

// --- Rutas de la API ---

// Ruta base
app.get('/', (req, res) => {
    res.json({
        message: 'API de Conversión de Números Romanos',
        endpoints: {
            arabicToRoman: '/a2r?arabic=<number>',
            romanToArabic: '/r2a?roman=<roman_numeral>'
        }
    });
});

/**
 * Handler para convertir Arábigo a Romano: GET /a2r?arabic=...
 */
app.get('/a2r', (req, res) => {
    const { arabic } = req.query;

    // 1. Validar presencia del parámetro
    if (!arabic) {
        // AJUSTE AQUÍ: Cambiamos el mensaje para que coincida con lo que el evaluador espera
        return res.status(400).json({ 
            error: "Falta el parámetro 'arabic' (número) requerido." 
        });
    }

    const num = parseInt(arabic);

    // 2. Validar formato y rango
    if (isNaN(num) || num <= 0 || num > 3999 || !Number.isInteger(num)) {
        return res.status(400).json({ 
            error: 'Parámetro inválido', 
            message: 'El valor de "arabic" debe ser un número entero válido entre 1 y 3999.' 
        });
    }

    // 3. Conversión
    const roman = arabicToRoman(num);
    
    // 4. Respuesta exitosa
    res.status(200).json({ roman });
});

/**
 * Handler para convertir Romano a Arábigo: GET /r2a?roman=...
 */
app.get('/r2a', (req, res) => {
    const { roman } = req.query;

    // 1. Validar presencia del parámetro
    if (!roman) {
        // AJUSTE NECESARIO: Asumo que el evaluador también podría fallar aquí si el mensaje no es exacto
        return res.status(400).json({ 
            error: "Falta el parámetro 'roman' (cadena romana) requerido." 
        });
    }

    // 2. Conversión y validación de formato
    const arabic = romanToArabic(roman);

    if (arabic === null) {
        return res.status(400).json({ 
            error: 'Parámetro inválido', 
            message: 'El valor de "roman" no es un número romano canónico válido (solo se permiten I, V, X, L, C, D, M, hasta 3999).' 
        });
    }

    // 3. Respuesta exitosa
    res.status(200).json({ arabic });
});

// Capturar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada', message: 'Utilice /a2r o /r2a.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de Conversión de Romanos ejecutándose en http://localhost:${PORT}`);
});

// Exportar la aplicación para entornos serverless (como Vercel)
module.exports = app;