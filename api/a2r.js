export default function handler(req, res) {
  const { arabic } = req.query;
  if (!arabic || isNaN(arabic)) {
    return res.status(400).json({ error: 'Parámetro "arabic" inválido' });
  }

  const num = parseInt(arabic);
  const valores = [
    { valor: 1000, simbolo: 'M' },
    { valor: 900, simbolo: 'CM' },
    { valor: 500, simbolo: 'D' },
    { valor: 400, simbolo: 'CD' },
    { valor: 100, simbolo: 'C' },
    { valor: 90, simbolo: 'XC' },
    { valor: 50, simbolo: 'L' },
    { valor: 40, simbolo: 'XL' },
    { valor: 10, simbolo: 'X' },
    { valor: 9, simbolo: 'IX' },
    { valor: 5, simbolo: 'V' },
    { valor: 4, simbolo: 'IV' },
    { valor: 1, simbolo: 'I' },
  ];

  let resultado = '';
  let n = num;
  for (let i = 0; i < valores.length; i++) {
    while (n >= valores[i].valor) {
      resultado += valores[i].simbolo;
      n -= valores[i].valor;
    }
  }

  res.status(200).json({ roman: resultado });
}
