export default function handler(req, res) {
  const { arabic } = req.query;

  if (!arabic || isNaN(arabic)) {
    return res.status(400).json({ error: "Parámetro 'arabic' inválido" });
  }

  const num = parseInt(arabic, 10);
  const valores = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];

  let romano = "";
  for (const [valor, letra] of valores) {
    while (num >= valor) {
      romano += letra;
      num -= valor;
    }
  }

  res.status(200).json({ romano });
}
