import { ColumnIndexMap } from './columns';
import { Plot, PublicPlot, toPublicPlot } from '../../schemas/plot';
import { calculatePlotPricing } from '../pricing';

/**
 * Safely parse numbers from formatted sheet strings (e.g. "510,000.00", " 1,700 ", "")
 */
export function parseSheetNumber(val: any, fallback = 0): number {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  const clean = String(val).replace(/,/g, '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? fallback : num;
}

/**
 * Safely parse integers from sheet values
 */
export function parseSheetInt(val: any, fallback = 0): number {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : Math.round(val);
  const clean = String(val).replace(/,/g, '').trim();
  const num = parseInt(clean, 10);
  return isNaN(num) ? fallback : num;
}

/**
 * Normalize status text to one of the 3 canonical statuses
 */
export function normalizeStatus(rawStatus: string | undefined, availableFlag?: string): string {
  const norm = (rawStatus || '').trim();
  if (norm.includes('مباع')) return 'مباع';
  if (norm.includes('محجوز')) return 'محجوز';
  if (norm.includes('متاح')) return 'متاح للبيع';

  // Fallback to legacy flag if status column is empty
  const flag = (availableFlag || '').toUpperCase().trim();
  if (flag === 'OK') return 'متاح للبيع';
  if (flag === 'NO') return 'مباع';

  return 'متاح للبيع';
}

/**
 * Generates a simple hash string for concurrency check
 */
export function generateRowHash(plot: Partial<Plot>): string {
  const keys = [
    plot.plotNo,
    plot.block,
    plot.zone,
    plot.area,
    plot.pricePerM2,
    plot.status,
    plot.buyerName,
    plot.buyerPhone,
    plot.deedNo,
  ];
  return keys.join('|');
}

/**
 * Maps a single row array into a strongly-typed Plot object
 */
export function mapRowToPlot(row: string[], colMap: ColumnIndexMap, rowNumber: number): Plot | null {
  const plotNo = parseSheetInt(row[colMap.plotNo]);
  if (!plotNo || plotNo <= 0) {
    return null; // Skip non-data or header/subtotal rows
  }

  const block = parseSheetInt(row[colMap.block]);
  const rawZone = (row[colMap.zone] || '').trim();
  const zone = rawZone || 'غير محدد'; // 43 rows have empty zone -> "غير محدد"

  const rawUsage = (row[colMap.usage] || '').trim();
  const usage = rawUsage || 'سكنى';

  const area = parseSheetNumber(row[colMap.area]);
  const pricePerM2 = parseSheetNumber(row[colMap.pricePerM2]);

  // Compute pricing formula values if missing/empty in sheet, or read sheet values
  const formulaCalcs = calculatePlotPricing({ area, pricePerM2 });
  const sheetLandValue = parseSheetNumber(row[colMap.landValue]);
  const landValue = sheetLandValue > 0 ? sheetLandValue : formulaCalcs.landValue;

  const sheetBrokerage = parseSheetNumber(row[colMap.brokerage]);
  const brokerage = sheetBrokerage > 0 ? sheetBrokerage : formulaCalcs.brokerage;

  const sheetRetTax = parseSheetNumber(row[colMap.retTax]);
  const retTax = sheetRetTax > 0 ? sheetRetTax : formulaCalcs.retTax;

  const rawBrokerageStatus = (row[colMap.brokerageStatus] || '').trim();
  const brokerageStatus = rawBrokerageStatus || 'كامل السعي';

  const availableFlag = (row[colMap.availableFlag] || '').trim();
  const status = normalizeStatus(row[colMap.status], availableFlag);

  // Sensitive & PII fields
  const buyerName = (row[colMap.buyerName] || '').trim();
  const buyerId = (row[colMap.buyerId] || '').trim();
  const buyerPhone = (row[colMap.buyerPhone] || '').trim(); // display as-is, don't drop leading zeros

  // Sensitive deed: always read as string, preserve spaces, never parse as float
  const deedNo = (row[colMap.deedNo] || '').toString().trim();
  const deedDate = (row[colMap.deedDate] || '').toString().trim();

  const invoice = (row[colMap.invoice] || '').trim();
  const currentState = (row[colMap.currentState] || '').trim();
  const handoverStatus = (row[colMap.handoverStatus] || '').trim();
  const handoverDate = (row[colMap.handoverDate] || '').trim();
  const notes = (row[colMap.notes] || '').trim();

  const plot: Plot = {
    zone,
    block,
    plotNo,
    usage,
    area,
    pricePerM2,
    landValue,
    brokerage,
    brokerageStatus,
    availableFlag,
    status,
    buyerName,
    buyerId,
    buyerPhone,
    deedNo,
    deedDate,
    invoice,
    currentState,
    retTax,
    handoverStatus,
    handoverDate,
    notes,
    rowNumber,
  };

  plot.hash = generateRowHash(plot);
  return plot;
}

/**
 * Maps entire Sheet rows (starting row 2 = header, row 3 = data) into Plot[]
 */
export function mapSheetRowsToPlots(allRows: string[][]): Plot[] {
  if (!allRows || allRows.length < 2) return [];

  // Row index 1 is row 2 of spreadsheet (0-indexed: index 0 is row 1 subtotals, index 1 is row 2 headers)
  // Let's inspect if index 0 or index 1 is the header row
  let headerIndex = 1;
  const firstRowStr = (allRows[0] || []).join(' ');
  const secondRowStr = (allRows[1] || []).join(' ');

  // If row 1 happens to have 'PLOT No.' or 'رقم القطعة', then header is row 0; otherwise row 1
  if (firstRowStr.includes('PLOT No') || firstRowStr.includes('رقم القطع') || firstRowStr.includes('BLOCK')) {
    headerIndex = 0;
  } else if (secondRowStr.includes('PLOT No') || secondRowStr.includes('رقم القطع') || secondRowStr.includes('BLOCK')) {
    headerIndex = 1;
  }

  const headerRow = allRows[headerIndex] || [];
  const colMap = buildColumnIndexMap(headerRow);

  const plots: Plot[] = [];
  // Data starts after headerRow
  for (let i = headerIndex + 1; i < allRows.length; i++) {
    const row = allRows[i];
    if (!row || row.length === 0) continue;
    const rowNumber = i + 1; // 1-based spreadsheet row number
    const plot = mapRowToPlot(row, colMap, rowNumber);
    if (plot) {
      plots.push(plot);
    }
  }

  return plots;
}

