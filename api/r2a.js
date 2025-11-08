export default function handler(req, res) {
  const { roman } = req.query;
  if (!roman || typeof roman !== 'string') {
    return res.status(400).json({ error: 'Parámetro "roman" inválido' });
  }

  const valores = {
    I: 1, V: 5, X: 10, L: 50,
    C: 100, D: 500, M: 1000
  };

  const upper = roman.toUpperCase();
  let total = 0;

  for (let i = 0; i < upper.length; i++) {
    const actual = valores[upper[i]];
    const siguiente = valores[upper[i + 1]];
    if (!actual) {
      return res.status(400).json({ error: 'Número romano inválido' });
    }
    if (siguiente > actual) {
      total -= actual;
    } else {
      total += actual;
    }
  }

  res.status(200).json({ arabic: total });
}
