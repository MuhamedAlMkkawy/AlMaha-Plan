const currencyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const areaFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Format currency with 2 decimal places and thousands separators (Western digits)
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || '0'));
  if (isNaN(num)) return '0.00 ر.س';
  return `${currencyFormatter.format(num)} ر.س`;
}

/**
 * Format currency number without currency label
 */
export function formatCurrencyNumber(amount: number | string | null | undefined): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || '0'));
  if (isNaN(num)) return '0.00';
  return currencyFormatter.format(num);
}

/**
 * Format plot area in m²
 */
export function formatArea(area: number | string | null | undefined): string {
  const num = typeof area === 'number' ? area : parseFloat(String(area || '0'));
  if (isNaN(num)) return '0 م²';
  return `${areaFormatter.format(num)} م²`;
}

/**
 * Format plain integer
 */
export function formatInteger(val: number | string | null | undefined): string {
  const num = typeof val === 'number' ? val : parseInt(String(val || '0'), 10);
  if (isNaN(num)) return '0';
  return integerFormatter.format(num);
}

/**
 * Format percentage
 */
export function formatPercent(val: number | string | null | undefined): string {
  const num = typeof val === 'number' ? val : parseFloat(String(val || '0'));
  if (isNaN(num)) return '0%';
  return `${num.toFixed(1)}%`;
}

