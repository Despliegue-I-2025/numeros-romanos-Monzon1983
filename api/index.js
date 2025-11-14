// Importa las funciones de conversión desde el módulo romanos.js
const { arabicToRoman, romanToArabic } = require("../romanos");
const url = require("url");

// Esta función es la que Vercel ejecutará
module.exports = async (req, res) => {
  // ===============================================
  // 1. CONFIGURACIÓN DE SEGURIDAD (CORS)
  // ===============================================
  // Habilita solicitudes desde cualquier origen (*) para el evaluador
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  // Maneja la solicitud OPTIONS (necesaria para CORS preflight)
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // Rechaza cualquier método que no sea GET
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        error: "Método no permitido. Use GET",
        success: false,
      })
    );
  }

  // ===============================================
  // 2. OBTENER PARÁMETROS y ENRUTAR por parámetro
  // ===============================================
  const parsedUrl = url.parse(req.url, true);
  const { arabic, roman } = parsedUrl.query;

// --- ARÁBIGO A ROMANO (Se activa si el parámetro 'arabic' existe) ---
if (arabic) {
    
    // 1. VALIDACIÓN ESTRICTA: Rechaza entradas mixtas (ej: "12abc")
    // Verifica que la cadena SÓLO contenga dígitos (0-9).
    if (!/^\d+$/.test(arabic)) {
        return res.status(400).json({ 
            error: "El valor arábigo solo debe contener dígitos (0-9).",
            received: arabic,
            success: false
        });
    }

    // 2. CONVERSIÓN SEGURA a número (Una vez que la cadena es validada)
    const num = parseInt(arabic, 10); 

    // Manejo de Error 400: Número fuera de rango o lógico (como ya lo tienes)
    if (num < 1 || num > 3999) { 
        return res.status(400).json({ 
            error: "El número debe estar entre 1 y 3999.",
            received: num,
            success: false
        });
    }
    
    // 3. Ejecutar la lógica de conversión dentro de try-catch
    try {
      const romanResult = arabicToRoman(num);
      return res.status(200).json({
        arabic: num,
        roman: romanResult,
        success: true
      });
    } catch (error) {
      // Captura cualquier error de la lógica de conversión
      return res.status(400).json({
        error: error.message, 
        received: num,
        success: false
      });
    }
}

  // --- ROMANO A ARÁBIGO (Se activa si el parámetro 'roman' existe) ---
  if (roman) {
    const romanInput = roman.toUpperCase();

    try {
      const arabicResult = romanToArabic(romanInput);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ 
        arabic: arabicResult 
      }));
    } catch (error) {
      // Captura el error lanzado por la función (ej: letras inválidas o formato)
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: error.message,
          received: romanInput,
          success: false,
        })
      );
    }
  }

  // ===============================================
  // 3. ERROR 400: Parámetro Faltante o Inválido
  // ===============================================
  // Si no se proporcionó ni 'arabic' ni 'roman'.
  res.writeHead(400, { "Content-Type": "application/json" });
  return res.end(
    JSON.stringify({
      error: "Falta un parámetro requerido: use 'arabic' o 'roman'.",
      example: "Ej: /api?arabic=123 o /api?roman=CXXIII",
      success: false,
    })
  );
};