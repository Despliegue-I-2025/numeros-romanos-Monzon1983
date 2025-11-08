const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Ruta: Romanos → Arábigos
app.get('/r2a', (req, res) => {
  const roman = req.query.roman;
  if (!roman) {
    return res.status(400).json({ error: 'Falta el parámetro roman.' });
  }

  const value = romanToArabic(roman);
  if (value === null) {
    return res.status(400).json({ error: 'Número romano inválido.' });
  }

  return res.json({ arabic: value });
});

// 🔹 Ruta: Arábigos → Romanos
app.get('/a2r', (req, res) => {
  const arabic = parseInt(req.query.arabic, 10);
  if (isNaN(arabic)) {
    return res.status(400).json({ error: 'Falta el parámetro arabic.' });
  }

  const roman = arabicToRoman(arabic);
  if (roman === null) {
    return res.status(400).json({ error: 'Número arábigo fuera de rango (1–3999).' });
  }

  return res.json({ roman });
});

// Función: Román → Arábigo
function romanToArabic(roman) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const pattern = /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

  if (!pattern.test(roman)) return null;

  let total = 0;
  let prev = 0;

  // Convertimos de derecha a izquierda
  for (let i = roman.toUpperCase().length - 1; i >= 0; i--) {
    const current = map[roman.toUpperCase()[i]];
    if (current < prev) total -= current;
    else total += current;
    prev = current;
  }

  return total;
}

//  Función: Arábigo → Román
function arabicToRoman(num) {
  if (num < 1 || num > 3999) return null;

  const values = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' },
  ];

  let roman = '';
  let remaining = num;

  for (const { value, symbol } of values) {
    while (remaining >= value) {
      roman += symbol;
      remaining -= value;
    }
  }

  return roman;
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor de conversión escuchando en el puerto ${PORT}`);
  });
}

module.exports = { app, romanToArabic, arabicToRoman };

