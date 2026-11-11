import { describe, it, expect } from 'vitest';
import { calculatePlotPricing, calculateQuotationSummary } from '../lib/pricing';
import { normalizeArabic, searchArabicMatch } from '../lib/arabic';
import { formatCurrency, formatArea, formatPercent } from '../lib/format';

describe('Pricing Formulas (Sheet1 Verification)', () => {
  it('should correctly calculate Plot 673 (300 m² @ 1,700/m²)', () => {
    const calc = calculatePlotPricing({
      area: 300,
      pricePerM2: 1700,
    });

    expect(calc.landValue).toBe(510000);
    expect(calc.brokerage).toBe(14662.5);
    expect(calc.retTax).toBe(25500);
    expect(calc.totalWithTax).toBe(550162.5);
  });

  it('should correctly calculate Plot 881 (325 m² @ 1,800/m²)', () => {
    const calc = calculatePlotPricing({
      area: 325,
      pricePerM2: 1800,
    });

    expect(calc.landValue).toBe(585000);
    expect(calc.brokerage).toBe(16818.75);
    expect(calc.retTax).toBe(29250);
    expect(calc.totalWithTax).toBe(631068.75);
  });

  it('should correctly aggregate quotation summary over multiple plots', () => {
    const summary = calculateQuotationSummary([
      { area: 300, pricePerM2: 1700 }, // Plot 673
      { area: 325, pricePerM2: 1800 }, // Plot 881
    ]);

    expect(summary.plotsCount).toBe(2);
    expect(summary.totalArea).toBe(625);
    expect(summary.totalLandValue).toBe(1095000);
    expect(summary.totalBrokerage).toBe(31481.25);
    expect(summary.totalRetTax).toBe(54750);
    expect(summary.grandTotal).toBe(1181231.25);
  });
});

describe('Arabic Text Normalization', () => {
  it('should strip tatweel / kashida', () => {
    expect(normalizeArabic('مـحـمـد')).toBe('محمد');
  });

  it('should normalize Alef forms (أ, إ, آ -> ا)', () => {
    expect(normalizeArabic('أحمد إبراهيم آمنة')).toBe('احمد ابراهيم امنه');
  });

  it('should normalize Alef Maqsura and Taa Marbuta', () => {
    expect(normalizeArabic('القادسية الأولى')).toBe('القادسيه الاولي');
  });

  it('should match search query irrespective of variants and spaces', () => {
    expect(searchArabicMatch('فهد البليهد ', 'البليهد')).toBe(true);
    expect(searchArabicMatch('شركة القادسية الاولى', 'القادسيه')).toBe(true);
    expect(searchArabicMatch('مـحـجـوز', 'محجوز')).toBe(true);
  });
});

describe('Formatting Utilities', () => {
  it('should format currency with Western digits and 2 decimals', () => {
    expect(formatCurrency(510000)).toBe('510,000.00 ر.س');
    expect(formatCurrency(14662.5)).toBe('14,662.50 ر.س');
  });

  it('should format area with m²', () => {
    expect(formatArea(300)).toBe('300 م²');
    expect(formatArea(325.5)).toBe('325.5 م²');
  });

  it('should format percentage', () => {
    expect(formatPercent(5.23)).toBe('5.2%');
  });
});

