const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts any numeric string or number with English digits (0-9) to Bengali digits (০-৯).
 */
export function toBengaliNumber(num: number | string): string {
  if (num === null || num === undefined) return '';
  return String(num).replace(/[0-9]/g, (d) => BENGALI_DIGITS[parseInt(d, 10)] || d);
}

/**
 * Formats a currency amount into Taka string (e.g. ৳1,980 or ৳১,৯৮০).
 */
export function formatPrice(amount: number, lang: 'bn' | 'en' = 'bn'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return lang === 'bn' ? '৳০' : '৳0';
  }
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const enFormatted = absAmount.toLocaleString('en-US');
  const sign = isNegative ? '-' : '';

  if (lang === 'bn') {
    return `${sign}৳${toBengaliNumber(enFormatted)}`;
  }
  return `${sign}৳${enFormatted}`;
}

/**
 * Formats a general number (e.g., quantities, percentages, weights) localized to Bengali or English.
 */
export function formatNumber(val: number | string, lang: 'bn' | 'en' = 'bn'): string {
  if (val === null || val === undefined) return '';
  const str = typeof val === 'number' ? val.toLocaleString('en-US') : String(val);
  if (lang === 'bn') {
    return toBengaliNumber(str);
  }
  return str;
}
