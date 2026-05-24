export const sanitizeString = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>]/g, "");
};

export const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

export const isSafeText = (value) => {
  if (!isNonEmptyString(value)) return false;
  return !/[<>]/.test(value);
};

export const isPositiveInteger = (value) => {
  const str = String(value).trim();
  return /^\d+$/.test(str) && Number(str) > 0;
};

export const isNonNegativeInteger = (value) => {
  const str = String(value).trim();
  return /^\d+$/.test(str) && Number(str) >= 0;
};

export const isFloat = (value) => {
  const str = String(value).trim();
  return /^\d+(\.\d+)?$/.test(str);
};

export const isPositiveFloat = (value) => {
  const str = String(value).trim();
  return /^\d+(\.\d+)?$/.test(str) && Number(str) > 0;
};

export const isValidYear = (value) => {
  const str = String(value).trim();
  if (!/^\d{4}$/.test(str)) return false;
  const year = Number(str);
  const currentYear = new Date().getFullYear();
  return year >= 1000 && year <= currentYear;
};

export const isValidUrl = (value) => {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const sanitizeStateAbbreviation = (value) => {
  if (typeof value !== "string") return "";
  return value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
};
