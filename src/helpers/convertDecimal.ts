export default function convertDecimal(value: string | number): string {
  if (!value) {
    return "0";
  }

  if (typeof value === "number") {
    return value.toString();
  }

  const stringValue = value.toString();

  if (stringValue.trim() === "") {
    return "0";
  }

  const cleanValue = stringValue.replace(/\./g, "").replace(/,/g, ".");

  const numericValue = parseFloat(cleanValue);
  if (isNaN(numericValue)) {
    return "0";
  }

  return numericValue.toString();
}
