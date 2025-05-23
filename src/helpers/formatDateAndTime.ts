/**
 * Formats dates for the table display with relative time indicators
 */

/**
 * Portuguese month names (abbreviated)
 */
const MONTH_NAMES_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

/**
 * Formats a date string to "DD Mon YYYY" format in Portuguese
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDateToDDMonYYYY = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = MONTH_NAMES_PT[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Gets the start of day for a given date in local timezone
 * @param date - Date object
 * @returns New Date object set to start of day (00:00:00.000)
 */
const getStartOfDay = (date: Date): Date => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * Gets the end of day for a given date in local timezone
 * @param date - Date object
 * @returns New Date object set to end of day (23:59:59.999)
 */
const getEndOfDay = (date: Date): Date => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

/**
 * Formats a date with relative time indicators (for visualization dates)
 * @param dateString - ISO date string
 * @returns Formatted date string with relative indicators
 */
export const formatVisualizationDate = (
  dateString: string | null | undefined
): string => {
  if (!dateString) {
    return "Não visualizado";
  }

  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  // Calculate time difference in milliseconds
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  // Check if it's a future date
  if (diffMs < 0) {
    return formatDateToDDMonYYYY(dateString);
  }

  // Within 1 hour (60 minutes)
  if (diffMinutes <= 60) {
    return "Agora mesmo";
  }

  // Check if it's today (same calendar day in local timezone)
  const todayStart = getStartOfDay(now);
  const todayEnd = getEndOfDay(now);

  if (date >= todayStart && date <= todayEnd) {
    return "Hoje";
  }

  // Check if it's yesterday (previous calendar day in local timezone)
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStart = getStartOfDay(yesterday);
  const yesterdayEnd = getEndOfDay(yesterday);

  if (date >= yesterdayStart && date <= yesterdayEnd) {
    return "Ontem";
  }

  // Within 7 days (last week) - count from start of today
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (date >= sevenDaysAgo && date < todayStart) {
    return "Semana passada";
  }

  // Default to formatted date for older dates
  return formatDateToDDMonYYYY(dateString);
};

/**
 * Formats a validity date to "DD Mon YYYY" format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatValidityDate = (
  dateString: string | null | undefined
): string => {
  if (!dateString) {
    return "Sem validade definida";
  }

  return formatDateToDDMonYYYY(dateString);
};
