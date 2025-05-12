export const maskPhone = (phone: string): string => {
  if (!phone) return "";

  const numericValue = phone.replace(/\D/g, "");

  if (numericValue.length === 0) return "";
  if (numericValue.length <= 2) return `(${numericValue}`;
  if (numericValue.length <= 3)
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
  if (numericValue.length <= 7)
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      3
    )} ${numericValue.slice(3)}`;
  if (numericValue.length <= 11)
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      3
    )} ${numericValue.slice(3, 7)}-${numericValue.slice(7)}`;

  return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
    2,
    3
  )} ${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
};
