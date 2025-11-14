// 20251113 - Forzar actualización de Vercel
function arabicToRoman(num) {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("Debe proporcionar un número válido");
  }

  if (num < 1 || num > 3999) {
    throw new Error("El número debe estar entre 1 y 3999");
  }

  if (!Number.isInteger(num)) {
    throw new Error("El número debe ser entero");
  }

  const conversions = [
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" }
  ];

  let result = "";
  let remaining = num;

  for (const { value, symbol } of conversions) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
}

function isValidRoman(roman) {
  if (typeof roman !== "string" || roman.length === 0) {
    return false;
  }

  const pattern = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  return pattern.test(roman);
}

function romanToArabic(roman) {
  const input = roman.toUpperCase();

  if (!isValidRoman(input)) {
    throw new Error(`Número romano inválido: ${input}`);
  }

  const map = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  };

  let i = 0;
  let result = 0;

  while (i < input.length) {
    const two = input.substring(i, i + 2);
    const one = input.substring(i, i + 1);

    if (map[two]) {
      result += map[two];
      i += 2;
    } else if (map[one]) {
      result += map[one];
      i += 1;
    } else {
      // Esta línea teóricamente no se debería alcanzar si isValidRoman funciona bien,
      // pero se mantiene como una barrera de seguridad.
      throw new Error("Símbolo romano inválido"); 
    }
  }

  return result;
}

module.exports = {
  arabicToRoman,
  romanToArabic,
  isValidRoman
};