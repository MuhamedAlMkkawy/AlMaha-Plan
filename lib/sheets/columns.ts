import { normalizeArabic } from '../arabic';

export interface ColumnIndexMap {
  zone: number;
  block: number;
  plotNo: number;
  usage: number;
  area: number;
  pricePerM2: number;
  landValue: number;
  brokerage: number;
  brokerageStatus: number;
  availableFlag: number;
  status: number;
  buyerName: number;
  buyerId: number;
  buyerPhone: number;
  deedNo: number;
  deedDate: number;
  invoice: number;
  currentState: number;
  retTax: number;
  handoverStatus: number;
  handoverDate: number;
  notes: number;
}

/**
 * Standard column headers mapping and aliases.
 * Normalized Arabic matching is used to match regardless of spacing/tatweel/Alef variants.
 */
const HEADER_PATTERNS: Record<keyof ColumnIndexMap, (string | RegExp)[]> = {
  zone: ['رقم الزون', 'الزون', 'zone', 'zone no'],
  block: ['block no.', 'block no', 'رقم البلك', 'البلك', 'block'],
  plotNo: ['plot no.', 'plot no', 'رقم القطعة', 'رقم القطعه', 'القطعة', 'القطعه', 'plot'],
  usage: ['usage', 'الاستخدام', 'نوع الاستخدام'],
  area: ['plot area (m²)', 'plot area', 'المساحة', 'المساحه', 'مساحة القطعة', 'area'],
  pricePerM2: ['سعر بيع م2', 'سعر بيع المتر', 'سعر المتر', 'price/m2', 'price per m2', 'price'],
  landValue: ['قيمة الارض', 'قيمة الأرض', 'قيمة الارض بدون ضريبة', 'land value'],
  brokerage: ['السعي شامل الضريبة', 'السعي', 'قيمة السعي', 'brokerage'],
  brokerageStatus: ['حالة السعي', 'brokerage status'],
  availableFlag: ['available for sale', 'available', 'متاح'],
  status: ['status', 'الحالة', 'حالة البيع'],
  buyerName: ['اسم المشتري', 'المشتري', 'buyer name', 'buyer'],
  buyerId: ['الهوية / السجل', 'رقم الهوية', 'السجل المدني', 'buyer id', 'id / cr'],
  buyerPhone: ['رقم الجوال', 'الجوال', 'الهاتف', 'buyer phone', 'phone'],
  deedNo: ['رقم صك القطع', 'رقم الصك', 'الصك', 'deed no', 'deed number'],
  deedDate: ['تاريخ الصك', 'deed date'],
  invoice: ['الفاتورة الضريبية', 'رقم الفاتورة', 'tax invoice', 'invoice'],
  currentState: ['الوضع الحالي', 'current state'],
  retTax: ['قيمة ضريبة التصرفات العقارية', 'ضريبة التصرفات', 'تصرفات عقارية', 'rett', 'ret tax'],
  handoverStatus: ['حالة الافراغ', 'تم الافراغ', 'handover status'],
  handoverDate: ['تاريخ الافراغ', 'تاريخ الإفراغ', 'handover date'],
  notes: ['الملاحظات', 'ملاحظات', 'notes', 'remarks'],
};

/**
 * Builds a dynamic column-index map from the header row.
 * Handles duplicate names (e.g. "الحالة" for Status vs HandoverStatus by column order/position).
 */
export function buildColumnIndexMap(headerRow: string[]): ColumnIndexMap {
  const map: Partial<ColumnIndexMap> = {};
  const normalizedHeaders = headerRow.map((h) => normalizeArabic(h || '').toLowerCase().trim());

  // First pass: match exact unambiguous patterns
  for (let colIdx = 0; colIdx < normalizedHeaders.length; colIdx++) {
    const raw = headerRow[colIdx] || '';
    const norm = normalizedHeaders[colIdx];
    if (!norm) continue;

    for (const [key, patterns] of Object.entries(HEADER_PATTERNS) as [keyof ColumnIndexMap, (string | RegExp)[]][]) {
      if (map[key] !== undefined) continue;

      for (const pattern of patterns) {
        if (typeof pattern === 'string') {
          const normPattern = normalizeArabic(pattern).toLowerCase();
          if (norm === normPattern) {
            map[key] = colIdx;
            break;
          }
        } else if (pattern.test(raw)) {
          map[key] = colIdx;
          break;
        }
      }
    }
  }

  // Handle ambiguous "الحالة" column:
  // Column L is Status (متاح للبيع / محجوز / مباع), Column U is HandoverStatus (تم الافراغ)
  if (map.status === undefined) {
    for (let i = 0; i < normalizedHeaders.length; i++) {
      if (normalizedHeaders[i] === 'الحاله' || normalizedHeaders[i] === 'status') {
        map.status = i;
        break;
      }
    }
  }

  // If handoverStatus wasn't matched uniquely and there's a second "الحالة" after column L
  if (map.handoverStatus === undefined) {
    for (let i = (map.status !== undefined ? map.status + 1 : 15); i < normalizedHeaders.length; i++) {
      if (normalizedHeaders[i] === 'الحاله' || normalizedHeaders[i].includes('افراغ')) {
        map.handoverStatus = i;
        break;
      }
    }
  }

  // Default fallback to standard columns A..W (0-indexed: A=0, B=1, ... W=22) if not found
  const fallback: ColumnIndexMap = {
    zone: map.zone ?? 0,              // A
    block: map.block ?? 1,            // B
    plotNo: map.plotNo ?? 2,          // C
    usage: map.usage ?? 3,            // D
    area: map.area ?? 4,              // E
    pricePerM2: map.pricePerM2 ?? 5,  // F
    landValue: map.landValue ?? 6,    // G
    brokerage: map.brokerage ?? 7,    // H
    brokerageStatus: map.brokerageStatus ?? 8, // I
    availableFlag: map.availableFlag ?? 10,   // K
    status: map.status ?? 11,         // L
    buyerName: map.buyerName ?? 12,   // M
    buyerId: map.buyerId ?? 13,       // N
    buyerPhone: map.buyerPhone ?? 14, // O
    deedNo: map.deedNo ?? 15,         // P
    deedDate: map.deedDate ?? 16,     // Q
    invoice: map.invoice ?? 17,       // R
    currentState: map.currentState ?? 18, // S
    retTax: map.retTax ?? 19,         // T
    handoverStatus: map.handoverStatus ?? 20, // U
    handoverDate: map.handoverDate ?? 21,   // V
    notes: map.notes ?? 22,           // W
  };

  return fallback;
}

