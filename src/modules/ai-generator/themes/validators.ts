/**
 * @deprecated This file is deprecated. Use utils/validation.ts instead.
 * This file is kept for backwards compatibility.
 */

// Re-export everything from the new consolidated validation module
export {
  ensureCondition,
  ensureString,
  ensureExactLength,
  ensureMaxLength,
  ensureArray,
  ensureLengthBetween,
  ensureMatchesRegex,
  validateLengthWithWarning,
  validateMaxLengthWithWarning,
} from "../utils/validation";
