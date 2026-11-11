export type PlotUsage = 'سكنى' | 'تجارى' | 'مرافق';
export type PlotStatus = 'متاح للبيع' | 'محجوز' | 'مباع' | 'مؤرشف';
export type BrokerageStatus = 'كامل السعي' | 'لايوجد';

/**
 * PublicPlot: Safe for public and staff viewing.
 * Absolutely NO PII fields (buyerName, buyerId, buyerPhone, deedNo, invoice, notes, deedsFolderUrl).
 */
export interface PublicPlot {
  zone: string;
  block: number;
  plotNo: number;
  usage: PlotUsage | string;
  area: number;
  pricePerM2: number;
  landValue: number;
  brokerage: number;
  brokerageStatus: string;
  status: PlotStatus | string;
  currentState?: string;
  retTax: number;
  handoverStatus?: string;
  handoverDate?: string;
}

/**
 * AdminPlot / Plot: Full model containing sensitive buyer and deed fields.
 * Restricted to authenticated administrators.
 */
export interface Plot extends PublicPlot {
  availableFlag?: string;
  buyerName?: string;
  buyerId?: string;
  buyerPhone?: string;
  deedNo?: string;
  deedDate?: string;
  invoice?: string;
  notes?: string;
  deedsFolderUrl?: string;
  rowNumber?: number;
  hash?: string;
}

export type AdminPlot = Plot;

export interface CreatePlotInput {
  zone?: string;
  block: number;
  plotNo: number;
  usage: string;
  area: number;
  pricePerM2: number;
  brokerageStatus?: string;
  status?: string;
  buyerName?: string;
  buyerId?: string;
  buyerPhone?: string;
  deedNo?: string;
  deedDate?: string;
  invoice?: string;
  currentState?: string;
  handoverStatus?: string;
  handoverDate?: string;
  notes?: string;
}

export interface UpdatePlotInput extends Partial<CreatePlotInput> {
  expectedHash?: string;
}

export interface PlotStatistics {
  totalPlots: number;
  totalArea: number;
  totalLandValue: number;
  averagePricePerM2: number;
  soldCount: number;
  reservedCount: number;
  availableCount: number;
  usageStats: {
    usage: string;
    count: number;
    area: number;
    value: number;
    avgPrice: number;
    sharePercent: number;
  }[];
  statusStats: {
    status: string;
    count: number;
    area: number;
    value: number;
    avgPrice: number;
    sharePercent: number;
  }[];
  matrix: {
    usage: string;
    status: string;
    count: number;
    area: number;
    value: number;
    avgPrice: number;
    sharePercent: number;
  }[];
  blocksCount: number;
  zonesCount: number;
  lastUpdated: string;
}

export interface BlockSummary {
  block: number;
  totalPlots: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  totalArea: number;
  totalValue: number;
  soldPercent: number;
}

export interface ZoneSummary {
  zone: string;
  totalPlots: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  totalArea: number;
  totalValue: number;
}

