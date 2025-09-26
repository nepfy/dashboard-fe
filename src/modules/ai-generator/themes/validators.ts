import { z } from "zod";

export function ensureCondition(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

export function ensureString(value: unknown, field: string): string {
  return z
    .string({ invalid_type_error: `${field} must be a string` })
    .parse(value);
}

export function ensureExactLength(
  value: unknown,
  expected: number,
  field: string
): string {
  const str = ensureString(value, field);
  ensureCondition(
    str.length === expected,
    `${field} must have exactly ${expected} characters. Received ${str.length}.`
  );
  return str;
}

export function ensureMaxLength(
  value: unknown,
  max: number,
  field: string
): string {
  const str = ensureString(value, field);
  ensureCondition(
    str.length > 0 && str.length <= max,
    `${field} must have between 1 and ${max} characters. Received ${str.length}.`
  );
  return str;
}

export function ensureArray<T>(value: unknown, field: string): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }
  return value as T[];
}

export function ensureLengthBetween<T>(
  value: T[],
  min: number,
  max: number,
  field: string
): void {
  ensureCondition(
    value.length >= min && value.length <= max,
    `${field} must contain between ${min} and ${max} items. Received ${value.length}.`
  );
}

export function ensureMatchesRegex(
  value: unknown,
  regex: RegExp,
  field: string
): string {
  const str = ensureString(value, field);
  ensureCondition(regex.test(str), `${field} is invalid`);
  return str;
}
