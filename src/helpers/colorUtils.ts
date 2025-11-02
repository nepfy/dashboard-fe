// Color utility functions for generating hero background gradients

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface GradientColors {
  dark: string;
  light: string;
}

/**
 * Converts a hex color to RGB object
 */
export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Darkens a color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = (100 - percent) / 100;
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Lightens a color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = percent / 100;
  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Get gradient colors for hero background based on main color
 * Uses a lookup table for known colors, falls back to dynamic calculation
 */
export function getHeroGradientColors(mainColor: string): GradientColors {
  // Lookup table for known colors (matching React component values)
  const colorMap: Record<string, GradientColors> = {
    "#4F21A1": { dark: "#200D42", light: "#A46EDB" },
    "#BE8406": { dark: "#2B1B01", light: "#CEA605" },
    "#9B3218": { dark: "#2B0707", light: "#BE4E3F" },
    "#05722C": { dark: "#072B14", light: "#4ABE3F" },
    "#182E9B": { dark: "#070F2B", light: "#443FBE" },
    "#212121": { dark: "#0D0D0D", light: "#3A3A3A" },
    // Handle lowercase versions too
    "#4f21a1": { dark: "#200D42", light: "#A46EDB" },
    "#be8406": { dark: "#2B1B01", light: "#CEA605" },
    "#9b3218": { dark: "#2B0707", light: "#BE4E3F" },
    "#05722c": { dark: "#072B14", light: "#4ABE3F" },
    "#182e9b": { dark: "#070F2B", light: "#443FBE" },
  };

  // Check if we have a known color mapping
  if (colorMap[mainColor]) {
    return colorMap[mainColor];
  }

  // Fallback: calculate colors dynamically
  return {
    dark: darkenColor(mainColor, 60),
    light: lightenColor(mainColor, 30),
  };
}
