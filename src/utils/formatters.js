// Currency and number formatters for Indian Gold Jewellers

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const numeric = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric);
};

export const formatCurrencyWithDecimals = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  const numeric = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
};

export const formatWeight = (grams, unit = 'g') => {
  if (grams === undefined || grams === null || isNaN(grams)) return `0.000 ${unit}`;
  return `${Number(grams).toFixed(3)} ${unit}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
};

export const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return '—';
  const cleaned = aadhaar.replace(/\s+/g, '').replace(/-/g, '');
  if (cleaned.length !== 12) return aadhaar;
  return `XXXX-XXXX-${cleaned.slice(8)}`;
};

export const formatMobile = (mobile) => {
  if (!mobile) return '—';
  const cleaned = mobile.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return mobile;
};

export const generateNextId = (prefix, existingItems, key = 'customer_code') => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `${prefix}-${currentYear}-`;
  
  const matchingCodes = (existingItems || [])
    .map(item => item[key] || item.id || '')
    .filter(code => code.startsWith(yearPrefix))
    .map(code => {
      const numPart = code.replace(yearPrefix, '');
      const parsed = parseInt(numPart, 10);
      return isNaN(parsed) ? 0 : parsed;
    });

  const maxNum = matchingCodes.length > 0 ? Math.max(...matchingCodes) : 0;
  const nextNum = String(maxNum + 1).padStart(3, '0');
  return `${yearPrefix}${nextNum}`;
};
