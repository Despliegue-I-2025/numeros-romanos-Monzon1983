export default function handler(req, res) {
  const { roman } = req.query;
  if (!roman || typeof roman !== "string") {
    return res.status(400).json({ error: "Parámetro 'roman' inválido" });
  }

  const valores = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let previo = 0;

  for (let i = roman.length - 1; i >= 0; i--) {
    const actual = valores[roman[i].toUpperCase()];
    if (actual < previo) total -= actual;
    else total += actual;
    previo = actual;
  }

  res.status(200).json({ arabic: total });
}

