export interface QuotationItem {
  block: number;
  plotNo: number;
  area: number;
  pricePerM2: number;
  landValue: number;
  brokerage: number;
  retTax: number;
  totalWithTax: number;
  notes?: string;
}

export interface Quotation {
  quotationNo?: string;
  date: string;
  planNo: string;
  projectName: string;
  seller: string;
  marketer: string;
  buyerName?: string;
  buyerPhone?: string;
  items: QuotationItem[];
  totalArea: number;
  totalLandValue: number;
  totalBrokerage: number;
  totalRetTax: number;
  grandTotal: number;
  validityDays: number;
  expiryDate: string;
}

