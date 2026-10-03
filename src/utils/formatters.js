/**
 * Format a number into currency representation with proper commas
 * Supports Indian Rupee (Lakhs/Crores) when currency symbol is ₹, or standard formatting
 */
export function formatCurrency(amount, symbol = '₹') {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0`;
  }

  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  let formattedNumber;
  try {
    if (symbol === '₹') {
      formattedNumber = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: absNum % 1 !== 0 ? 2 : 0,
      }).format(absNum);
    } else {
      formattedNumber = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: absNum % 1 !== 0 ? 2 : 0,
      }).format(absNum);
    }
  } catch (e) {
    formattedNumber = absNum.toLocaleString();
  }

  return `${isNegative ? '-' : ''}${symbol}${formattedNumber}`;
}

/**
 * Format ISO date string (YYYY-MM-DD) into readable format, e.g. "02 Oct 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Get human-friendly date tag (e.g. "Today", "Yesterday", or "02 Oct")
 */
export function getRelativeDateTag(dateStr) {
  if (!dateStr) return '';
  const today = new Date().toISOString().slice(0, 10);
  if (dateStr === today) return 'Today';

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateStr === yesterday) return 'Yesterday';

  return formatDate(dateStr);
}

/**
 * Safe percentage calculation
 */
export function calculatePercentage(part, total) {
  if (!total || total <= 0) return 0;
  const pct = (part / total) * 100;
  return Math.min(Math.max(pct, 0), 100);
}
