// Date and time utility functions

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} format - The format type ('short', 'long', 'relative', 'time')
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = "short", locale = "en-US") => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    case "long":
      return dateObj.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });

    case "relative":
      return getRelativeTime(dateObj);

    case "time":
      return dateObj.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      });

    case "datetime":
      return dateObj.toLocaleString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    case "iso":
      return dateObj.toISOString();

    default:
      return dateObj.toLocaleDateString(locale);
  }
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string} date - The date to compare
 * @param {Date} baseDate - The base date to compare against (default: now)
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date, baseDate = new Date()) => {
  const dateObj = new Date(date);
  const baseDateObj = new Date(baseDate);

  if (isNaN(dateObj.getTime()) || isNaN(baseDateObj.getTime())) {
    return "Invalid Date";
  }

  const diffInSeconds = Math.floor((baseDateObj - dateObj) / 1000);
  const absDiff = Math.abs(diffInSeconds);
  const isPast = diffInSeconds > 0;

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(absDiff / interval.seconds);
    if (count >= 1) {
      const unit = count === 1 ? interval.label : `${interval.label}s`;
      return isPast ? `${count} ${unit} ago` : `in ${count} ${unit}`;
    }
  }

  return "just now";
};

/**
 * Check if a date is today
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  const dateObj = new Date(date);
  const today = new Date();

  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if a date is yesterday
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is yesterday
 */
export const isYesterday = (date) => {
  const dateObj = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return dateObj.toDateString() === yesterday.toDateString();
};

/**
 * Check if a date is this week
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is this week
 */
export const isThisWeek = (date) => {
  const dateObj = new Date(date);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return dateObj >= startOfWeek && dateObj <= endOfWeek;
};

/**
 * Get the start of day for a given date
 * @param {Date|string} date - The date
 * @returns {Date} Start of day
 */
export const startOfDay = (date) => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

/**
 * Get the end of day for a given date
 * @param {Date|string} date - The date
 * @returns {Date} End of day
 */
export const endOfDay = (date) => {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};

/**
 * Add days to a date
 * @param {Date|string} date - The base date
 * @param {number} days - Number of days to add (can be negative)
 * @returns {Date} New date with days added
 */
export const addDays = (date, days) => {
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

/**
 * Add months to a date
 * @param {Date|string} date - The base date
 * @param {number} months - Number of months to add (can be negative)
 * @returns {Date} New date with months added
 */
export const addMonths = (date, months) => {
  const dateObj = new Date(date);
  dateObj.setMonth(dateObj.getMonth() + months);
  return dateObj;
};

/**
 * Get the difference between two dates in days
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in days
 */
export const getDaysDifference = (date1, date2) => {
  const dateObj1 = new Date(date1);
  const dateObj2 = new Date(date2);
  const diffTime = Math.abs(dateObj2 - dateObj1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format duration in milliseconds to human readable string
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Human readable duration
 */
export const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Get age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} Age in years
 */
export const getAge = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Check if a date is in the past
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export const isPast = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if a date is in the future
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is in the future
 */
export const isFuture = (date) => {
  return new Date(date) > new Date();
};

/**
 * Get the current timestamp
 * @returns {number} Current timestamp in milliseconds
 */
export const now = () => Date.now();

/**
 * Get the current date as ISO string
 * @returns {string} Current date as ISO string
 */
export const nowISO = () => new Date().toISOString();

/**
 * Parse a date string and return a Date object
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Get the timezone offset in hours
 * @returns {number} Timezone offset in hours
 */
export const getTimezoneOffset = () => {
  return -new Date().getTimezoneOffset() / 60;
};

/**
 * Convert UTC date to local date
 * @param {Date|string} utcDate - UTC date
 * @returns {Date} Local date
 */
export const utcToLocal = (utcDate) => {
  const date = new Date(utcDate);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

/**
 * Convert local date to UTC
 * @param {Date|string} localDate - Local date
 * @returns {Date} UTC date
 */
export const localToUTC = (localDate) => {
  const date = new Date(localDate);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

// Common date formats
export const DATE_FORMATS = {
  SHORT: "short",
  LONG: "long",
  RELATIVE: "relative",
  TIME: "time",
  DATETIME: "datetime",
  ISO: "iso",
};

// Export all functions as default object
export default {
  formatDate,
  getRelativeTime,
  isToday,
  isYesterday,
  isThisWeek,
  startOfDay,
  endOfDay,
  addDays,
  addMonths,
  getDaysDifference,
  formatDuration,
  getAge,
  isPast,
  isFuture,
  now,
  nowISO,
  parseDate,
  getTimezoneOffset,
  utcToLocal,
  localToUTC,
  DATE_FORMATS,
};
