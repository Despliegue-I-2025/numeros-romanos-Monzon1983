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
    const num = parseInt(arabic, 10);

    try {
      // arabicToRoman contiene validaciones para NaN, entero y rango 1-3999
      const romanResult = arabicToRoman(num);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ 
        roman: romanResult 
      }));
    } catch (error) {
      // Captura el error lanzado por la función (ej: número fuera de rango)
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: error.message,
          received: arabic,
          success: false,
        })
      );
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