import { projectConfig } from '../config/project';

export interface PlotPricingInput {
  area: number;
  pricePerM2: number;
}

export interface PlotPricingCalculation {
  landValue: number;
  brokerage: number;
  retTax: number;
  totalWithTax: number; // landValue + brokerage + retTax
}

/**
 * Calculates standard pricing values for a plot:
 * - landValue = area * pricePerM2
 * - brokerage = landValue * commissionRate (2.5%) * (1 + vatRate (15%))
 * - retTax = landValue * rettRate (5%)
 * All rounded to 2 decimal places.
 */
export function calculatePlotPricing(input: PlotPricingInput): PlotPricingCalculation {
  const area = Number(input.area) || 0;
  const pricePerM2 = Number(input.pricePerM2) || 0;

  const rawLandValue = area * pricePerM2;
  const landValue = Math.round(rawLandValue * 100) / 100;

  const rawBrokerage = landValue * projectConfig.commissionRate * (1 + projectConfig.vatRate);
  const brokerage = Math.round(rawBrokerage * 100) / 100;

  const rawRetTax = landValue * projectConfig.rettRate;
  const retTax = Math.round(rawRetTax * 100) / 100;

  const totalWithTax = Math.round((landValue + brokerage + retTax) * 100) / 100;

  return {
    landValue,
    brokerage,
    retTax,
    totalWithTax,
  };
}

export interface QuotationSummary {
  totalArea: number;
  totalLandValue: number;
  totalBrokerage: number;
  totalRetTax: number;
  grandTotal: number;
  plotsCount: number;
}

/**
 * Computes quotation totals over an array of plots or items
 */
export function calculateQuotationSummary(
  items: Array<{ area: number; pricePerM2: number }>
): QuotationSummary {
  let totalArea = 0;
  let totalLandValue = 0;
  let totalBrokerage = 0;
  let totalRetTax = 0;

  for (const item of items) {
    const calc = calculatePlotPricing(item);
    totalArea += Number(item.area) || 0;
    totalLandValue += calc.landValue;
    totalBrokerage += calc.brokerage;
    totalRetTax += calc.retTax;
  }

  totalArea = Math.round(totalArea * 100) / 100;
  totalLandValue = Math.round(totalLandValue * 100) / 100;
  totalBrokerage = Math.round(totalBrokerage * 100) / 100;
  totalRetTax = Math.round(totalRetTax * 100) / 100;
  const grandTotal = Math.round((totalLandValue + totalBrokerage + totalRetTax) * 100) / 100;

  return {
    totalArea,
    totalLandValue,
    totalBrokerage,
    totalRetTax,
    grandTotal,
    plotsCount: items.length,
  };
}

