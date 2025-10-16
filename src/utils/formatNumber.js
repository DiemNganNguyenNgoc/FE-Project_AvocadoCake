/**
 * Format number to compact format (e.g., 1000 -> 1K, 1000000 -> 1M)
 */
export function compactFormat(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Format number with thousand separators
 */
export function standardFormat(num) {
  return new Intl.NumberFormat("vi-VN").format(num);
}

/**
 * Format currency (VND)
 */
export function formatCurrency(num) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
}
