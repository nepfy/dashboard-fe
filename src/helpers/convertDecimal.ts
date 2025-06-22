export default function convertDecimal(value: string | number): string {
  if (!value) {
    return "0";
  }

  if (typeof value === "number") {
    if (!isFinite(value) || value < 0) {
      return "0";
    }

    const maxValue = 9999999999999.99;
    if (value > maxValue) {
      console.warn(
        `Value ${value} exceeds maximum allowed (${maxValue}). Capping to maximum.`
      );
      return maxValue.toString();
    }

    return value.toString();
  }

  const stringValue = value.toString().trim();

  if (stringValue === "") {
    return "0";
  }

  let cleanValue = stringValue;

  if (cleanValue.includes(".") && cleanValue.includes(",")) {
    cleanValue = cleanValue.replace(/\./g, "").replace(",", ".");
  } else if (cleanValue.includes(",") && !cleanValue.includes(".")) {
    cleanValue = cleanValue.replace(",", ".");
  } else if (cleanValue.includes(".")) {
    const dotCount = (cleanValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      cleanValue = cleanValue.replace(/\./g, "");
    }
  }

  const numericValue = parseFloat(cleanValue);

  if (isNaN(numericValue) || numericValue < 0) {
    return "0";
  }

  const maxValue = 9999999999999.99;
  if (numericValue > maxValue) {
    console.warn(
      `Converted value ${numericValue} exceeds maximum allowed (${maxValue}). Capping to maximum.`
    );
    return maxValue.toString();
  }

  const roundedValue = Math.round(numericValue * 100) / 100;

  return roundedValue.toString();
}
