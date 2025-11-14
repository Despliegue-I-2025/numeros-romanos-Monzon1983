const { arabicToRoman, romanToArabic, isValidRoman } = require("../romanos");

describe("arabicToRoman", () => {
  test("convierte números básicos", () => {
    expect(arabicToRoman(1)).toBe("I");
    expect(arabicToRoman(5)).toBe("V");
    expect(arabicToRoman(10)).toBe("X");
    expect(arabicToRoman(50)).toBe("L");
    expect(arabicToRoman(100)).toBe("C");
    expect(arabicToRoman(500)).toBe("D");
    expect(arabicToRoman(1000)).toBe("M");
  });

  test("convierte números con restas", () => {
    expect(arabicToRoman(4)).toBe("IV");
    expect(arabicToRoman(9)).toBe("IX");
    expect(arabicToRoman(40)).toBe("XL");
    expect(arabicToRoman(90)).toBe("XC");
    expect(arabicToRoman(400)).toBe("CD");
    expect(arabicToRoman(900)).toBe("CM");
  });

  test("convierte números compuestos", () => {
    expect(arabicToRoman(3)).toBe("III");
    expect(arabicToRoman(58)).toBe("LVIII");
    expect(arabicToRoman(1994)).toBe("MCMXCIV");
    expect(arabicToRoman(2024)).toBe("MMXXIV");
    expect(arabicToRoman(3999)).toBe("MMMCMXCIX");
  });

  test("rechaza números fuera de rango", () => {
    expect(() => arabicToRoman(0)).toThrow("El número debe estar entre 1 y 3999");
    expect(() => arabicToRoman(4000)).toThrow("El número debe estar entre 1 y 3999");
    expect(() => arabicToRoman(-5)).toThrow("El número debe estar entre 1 y 3999");
  });
});

describe("romanToArabic", () => {
  test("convierte números romanos válidos", () => {
    expect(romanToArabic("I")).toBe(1);
    expect(romanToArabic("IV")).toBe(4);
    expect(romanToArabic("XL")).toBe(40);
    expect(romanToArabic("MCMXCIV")).toBe(1994);
    expect(romanToArabic("MMXXIV")).toBe(2024);
    expect(romanToArabic("MMMCMXCIX")).toBe(3999);
  });

  test("rechaza números romanos inválidos", () => {
    expect(() => romanToArabic("IIII")).toThrow("Número romano inválido");
    expect(() => romanToArabic("IC")).toThrow("Número romano inválido");
    expect(() => romanToArabic("VX")).toThrow("Número romano inválido");
    expect(() => romanToArabic("")).toThrow("Número romano inválido");
  });
});

describe("isValidRoman", () => {
  test("valida correctamente números romanos válidos", () => {
    expect(isValidRoman("I")).toBe(true);
    expect(isValidRoman("IV")).toBe(true);
    expect(isValidRoman("XL")).toBe(true);
    expect(isValidRoman("MCMXCIV")).toBe(true);
  });

  test("detecta correctamente números romanos inválidos", () => {
    expect(isValidRoman("IIII")).toBe(false);
    expect(isValidRoman("IC")).toBe(false);
    expect(isValidRoman("VX")).toBe(false);
    expect(isValidRoman("")).toBe(false);
  });
});
