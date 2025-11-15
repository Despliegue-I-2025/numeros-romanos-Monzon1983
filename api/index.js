// api/index.js

// Usamos el módulo 'url' para parsear la URL y el módulo 'querystring' para los parámetros.
const url = require("url");
const querystring = require("querystring");

// Importa las funciones de conversión desde el módulo romanos.js
// Asumimos que 'romanos.js' se encuentra un nivel arriba.
const { arabicToRoman, romanToArabic } = require("../romanos.js");

// Esta función es el handler (el Serverless Function) que Vercel ejecuta.
module.exports = async (req, res) => {
  
  // ===============================================
  // 1. CONFIGURACIÓN DE SEGURIDAD (CORS) Y MÉTODOS
  // ===============================================
  
  // Habilita solicitudes desde cualquier origen (*) para el evaluador (CORS manual)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  // Maneja la solicitud OPTIONS (necesaria para CORS preflight)
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // Rechaza cualquier método que no sea GET con 405
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        error: "Método no permitido. Use GET",
        success: false
      })
    );
  }

  // ===============================================
  // 2. OBTENER PARÁMETROS y ENRUTAR por PATH
  // ===============================================
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname; // Obtiene la ruta: /a2r, /r2a, o /
  
  // Vercel CLI no siempre parsea bien el query, así que lo forzamos.
  const query = querystring.parse(parsedUrl.query);
  const arabic = query.arabic || query.number;
  const roman = query.roman;

  // --- HANDLER ARÁBIGO A ROMANO (/a2r) ---
  if (pathname === '/a2r') {
    
    // Manejo de Error 400: Parámetro ausente
    if (!arabic) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            error: "Falta el parámetro 'arabic' (número) requerido."
        }));
    }
    
    // 1. VALIDACIÓN ESTRICTA (para evitar error con "12abc" o negativos)
    // El profesor debe probar esto.
    if (!/^\d+$/.test(arabic) || parseInt(arabic, 10) < 1 || parseInt(arabic, 10) > 3999) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            error: "El valor arábigo debe ser un entero positivo entre 1 y 3999 y contener solo dígitos."
        }));
    }

    const num = parseInt(arabic, 10);
    
    // 2. Ejecutar la lógica de conversión dentro de try-catch
    try {
        const romanResult = arabicToRoman(num);
        
        // RESPUESTA 200 OK (Formato JSON correcto)
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            arabic: num,
            roman: romanResult,
            success: true
        }));
        
    } catch (error) {
        // Captura el error de la lógica (ej: número fuera de rango)
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            error: error.message,
            received: num,
            success: false
        }));
    }
  }

  // --- HANDLER ROMANO A ARÁBIGO (/r2a) ---
  else if (pathname === '/r2a') {
      
    // Manejo de Error 400: Parámetro ausente
    if (!roman) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            error: "Falta el parámetro 'roman' (cadena romana) requerido."
        }));
    }
    
    const romanInput = roman.toUpperCase();
    
    // Ejecutar la lógica de conversión dentro de try-catch
    try {
        const arabicResult = romanToArabic(romanInput);
        
        // RESPUESTA 200 OK (Formato JSON correcto)
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            roman: romanInput,
            arabic: arabicResult,
            success: true
        }));
        
    } catch (error) {
        // Captura el error de la lógica (ej: formato inválido)
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            error: error.message,
            received: romanInput,
            success: false
        }));
    }
  }

  // ===============================================
  // 3. ERROR 404/400: Parámetro Faltante o Ruta Incorrecta
  // ===============================================
  
  // Si no se encuentra /a2r ni /r2a, devuelve el error 400.
  res.writeHead(400, { "Content-Type": "application/json" });
  return res.end(
    JSON.stringify({
      error: "Ruta o parámetro principal faltante. Use /a2r o /r2a.",
      example: "Ej: /a2r?arabic=123 o /r2a?roman=CXXIII",
      success: false
    })
  );
};