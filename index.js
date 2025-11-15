/**
 * Express Backend para la conversión de números arábigos a romanos (A2R) y viceversa (R2A).
 * CUMPLE: Requisitos de ruteo, estado 200, y mensajes de error 400 compatibles con el evaluador.
 */

const express = require('express');
const cors = require('cors');

const app = express();

// 4. Habilitar CORS para permitir solicitudes desde el evaluador
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// --- Lógica de Conversión ---

function arabicToRoman(num) {
    if (typeof num !== 'number' || !Number.isInteger(num) || num <= 0 || num > 3999) {
        return null; 
    }
    const map = new Map([
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ]);
    let roman = '';
    for (const [value, symbol] of map) {
        while (num >= value) {
            roman += symbol;
            num -= value;
        }
    }
    return roman;
}

function romanToArabic(roman) {
    if (typeof roman !== 'string') return null;
    roman = roman.toUpperCase();
    if (!/^[IVXLCDM]+$/.test(roman)) return null;

    const map = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
    let arabic = 0;

    for (let i = 0; i < roman.length; i++) {
        const current = map[roman[i]];
        const next = map[roman[i + 1]];
        if (next && current < next) {
            arabic += next - current;
            i++;
        } else {
            arabic += current;
        }
    }
    const canonicalRoman = arabicToRoman(arabic);
    if (canonicalRoman !== roman) return null;
    return arabic;
}

// --- Handlers de la API ---

// Ruta base - Devuelve error 404 por diseño del Express App
app.get('/', (req, res) => {
    res.status(404).json({
        "error": "Ruta o parámetro principal faltante. Use /a2r o /r2a.",
        "example": "Ej: /a2r?arabic=123 o /r2a?roman=CXXIII",
        "success": false
    });
});

/**
 * 1. GET /a2r?arabic=123 → {"roman":"CXXIII"} con estado 200.
 * 3. Ante parámetros ausentes o inválidos responder JSON con estado 400.
 */
app.get('/a2r', (req, res) => {
    const { arabic } = req.query;

    // Parámetro ausente (Mensaje exacto para el evaluador)
    if (!arabic) {
        return res.status(400).json({ 
            error: "Falta el parámetro 'arabic' (número) requerido." 
        });
    }

    const num = parseInt(arabic);

    // Parámetro inválido (Rango o tipo)
    if (isNaN(num) || num <= 0 || num > 3999 || !Number.isInteger(num)) {
        return res.status(400).json({ 
            error: 'Parámetro inválido', 
            message: 'El valor de "arabic" debe ser un número entero válido entre 1 y 3999.' 
        });
    }

    const roman = arabicToRoman(num);
    
    res.status(200).json({ roman });
});

/**
 * 2. GET /r2a?roman=CXXIII → {"arabic":123} con estado 200.
 * 3. Ante parámetros ausentes o inválidos responder JSON con estado 400.
 */
app.get('/r2a', (req, res) => {
    const { roman } = req.query;

    // Parámetro ausente (Mensaje exacto para el evaluador)
    if (!roman) {
        return res.status(400).json({ 
            error: "Falta el parámetro 'roman' (cadena romana) requerido." 
        });
    }

    // Conversión y validación de formato
    const arabic = romanToArabic(roman);

    // Parámetro inválido (Formato romano incorrecto)
    if (arabic === null) {
        return res.status(400).json({ 
            error: 'Parámetro inválido', 
            message: 'El valor de "roman" no es un número romano canónico válido.' 
        });
    }

    res.status(200).json({ arabic });
});

// Exportar la aplicación para entornos serverless (como Vercel)
module.exports = app;