const { romanToArabic, arabicToRoman } = require('../romanos.js');

module.exports = (req, res) => {
  const { query } = req;

  if (query.roman) {
    const result = romanToArabic(query.roman.toUpperCase());
    if (!result) {
      return res.status(400).json({ error: 'Número romano inválido' });
    }
    return res.status(200).json({ input: query.roman, result });
  }

  if (query.number) {
    const num = parseInt(query.number);
    if (isNaN(num) || num < 1 || num > 3999) {
      return res.status(400).json({ error: 'Número arábigo inválido (1-3999)' });
    }
    const result = arabicToRoman(num);
    return res.status(200).json({ input: num, result });
  }

  return res.status(400).json({
    error: 'Usa ?roman=XX o ?number=20'
  });
};
