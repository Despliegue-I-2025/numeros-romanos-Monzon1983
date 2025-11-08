const { arabicToRoman, romanToArabic, isValidRoman } = require("../romanos");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Método no permitido. Use GET",
      success: false
    });
  }

  const { number, roman } = req.query;

  if (number) {
    const num = parseInt(number, 10);

    if (isNaN(num)) {
      return res.status(400).json({
        error: "El parámetro debe ser un número válido",
        received: number,
        success: false
      });
    }

    try {
      const romanResult = arabicToRoman(num);
      return res.status(200).json({
        arabic: num,
        roman: romanResult,
        success: true
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
        received: num,
        success: false
      });
    }
  }

  if (roman) {
    const romanInput = roman.toUpperCase();

    try {
      const arabicResult = romanToArabic(romanInput);
      return res.status(200).json({
        roman: romanInput,
        arabic: arabicResult,
        success: true
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
        received: romanInput,
        success: false
      });
    }
  }

  return res.status(400).json({
    error: 'Falta el parámetro "number" o "roman"',
    example: "/api?number=2024 o /api?roman=MMXXIV",
    success: false
  });
};
