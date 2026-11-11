import { normalizeArabic } from '../../../lib/arabic';
import { Plot, PublicPlot, CreatePlotInput, UpdatePlotInput } from '../../../shared/types/plot';
import { PricingService } from '../pricing/pricing.service';

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

const HEADER_PATTERNS: Record<keyof ColumnIndexMap, (string | RegExp)[]> = {
  zone: ['رقم الزون', 'الزون', 'zone', 'zone no'],
  block: ['block no.', 'block no', 'رقم البلك', 'البلك', 'block'],
  plotNo: ['plot no.', 'plot no', 'رقم القطعة', 'رقم القطعه', 'القطعة', 'القطعه', 'plot'],
  usage: ['usage', 'الاستخدام', 'نوع الاستخدام'],
  area: ['plot area (m²)', 'plot area', 'المساحة', 'المساحه', 'area'],
  pricePerM2: ['سعر بيع م2', 'سعر بيع المتر', 'سعر المتر', 'price/m2', 'price per m2'],
  landValue: ['قيمة الارض', 'قيمة الأرض', 'land value'],
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

export class PlotsMapper {
  /**
   * Cleans formatted numbers (e.g. "1,241.17", " 360٬456٫72 ", "(660,177,944.72)")
   */
  public static parseNumber(val: any, fallback = 0): number {
    if (val === undefined || val === null || val === '') return fallback;
    if (typeof val === 'number') return isNaN(val) ? fallback : val;
    const clean = String(val)
      .replace(/,/g, '')
      .replace(/\u066C/g, '') // Arabic thousands separator
      .replace(/\u066B/g, '.') // Arabic decimal separator
      .replace(/\s+/g, '')
      .replace(/[()]/g, '')
      .trim();
    const num = parseFloat(clean);
    return isNaN(num) ? fallback : num;
  }

  public static parseInt(val: any, fallback = 0): number {
    if (val === undefined || val === null || val === '') return fallback;
    if (typeof val === 'number') return isNaN(val) ? fallback : Math.round(val);
    const clean = String(val)
      .replace(/,/g, '')
      .replace(/\u066C/g, '')
      .replace(/\s+/g, '')
      .trim();
    const num = parseInt(clean, 10);
    return isNaN(num) ? fallback : num;
  }

  public static normalizeStatus(rawStatus?: string, availableFlag?: string): string {
    const s = (rawStatus || '').trim();
    if (s.includes('مباع')) return 'مباع';
    if (s.includes('محجوز')) return 'محجوز';
    if (s.includes('متاح')) return 'متاح للبيع';

    const flag = (availableFlag || '').toUpperCase().trim();
    if (flag === 'OK') return 'متاح للبيع';
    if (flag === 'NO') return 'مباع';

    return 'متاح للبيع';
  }

  public static generateHash(plot: Partial<Plot>): string {
    const parts = [
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
    return parts.map((p) => String(p ?? '')).join('|');
  }

  public static buildColumnMap(headerRow: string[]): ColumnIndexMap {
    const map: Partial<ColumnIndexMap> = {};
    const normHeaders = headerRow.map((h) => normalizeArabic(h || '').toLowerCase().trim());

    for (let idx = 0; idx < normHeaders.length; idx++) {
      const norm = normHeaders[idx];
      if (!norm) continue;

      for (const [key, patterns] of Object.entries(HEADER_PATTERNS) as [keyof ColumnIndexMap, (string | RegExp)[]][]) {
        if (map[key] !== undefined) continue;

        for (const p of patterns) {
          if (typeof p === 'string') {
            if (norm === normalizeArabic(p).toLowerCase().trim()) {
              map[key] = idx;
              break;
            }
          } else if (p.test(headerRow[idx] || '')) {
            map[key] = idx;
            break;
          }
        }
      }
    }

    // Default column fallback matching master sheet columns A..W
    return {
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
  }

  public static rowToPlot(row: string[], colMap: ColumnIndexMap, rowNumber: number): Plot | null {
    const plotNo = this.parseInt(row[colMap.plotNo]);
    if (!plotNo || plotNo <= 0) return null;

    const block = this.parseInt(row[colMap.block]);
    const rawZone = (row[colMap.zone] || '').trim();
    const zone = rawZone || 'غير محدد';
    const usage = (row[colMap.usage] || '').trim() || 'سكنى';

    const area = this.parseNumber(row[colMap.area]);
    const pricePerM2 = this.parseNumber(row[colMap.pricePerM2]);

    const calcs = PricingService.calculatePlot({ area, pricePerM2 });
    const sheetLandValue = this.parseNumber(row[colMap.landValue]);
    const landValue = sheetLandValue > 0 ? sheetLandValue : calcs.landValue;

    const sheetBrokerage = this.parseNumber(row[colMap.brokerage]);
    const brokerage = sheetBrokerage > 0 ? sheetBrokerage : calcs.brokerage;

    const sheetRetTax = this.parseNumber(row[colMap.retTax]);
    const retTax = sheetRetTax > 0 ? sheetRetTax : calcs.retTax;

    const brokerageStatus = (row[colMap.brokerageStatus] || '').trim() || 'كامل السعي';
    const availableFlag = (row[colMap.availableFlag] || '').trim();
    const status = this.normalizeStatus(row[colMap.status], availableFlag);

    // Sensitive buyer & deed data: preserved as formatted string, spaces intact
    const buyerName = (row[colMap.buyerName] || '').trim();
    const buyerId = (row[colMap.buyerId] || '').trim();
    const buyerPhone = (row[colMap.buyerPhone] || '').trim();
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

    plot.hash = this.generateHash(plot);
    return plot;
  }

  public static sheetRowsToPlots(allRows: string[][]): Plot[] {
    if (!allRows || allRows.length < 2) return [];

    let headerIndex = 1;
    const r0 = (allRows[0] || []).join(' ');
    const r1 = (allRows[1] || []).join(' ');

    if (r0.includes('PLOT No') || r0.includes('رقم القطع') || r0.includes('BLOCK')) {
      headerIndex = 0;
    } else if (r1.includes('PLOT No') || r1.includes('رقم القطع') || r1.includes('BLOCK')) {
      headerIndex = 1;
    }

    const headerRow = allRows[headerIndex] || [];
    const colMap = this.buildColumnMap(headerRow);

    const plots: Plot[] = [];
    for (let i = headerIndex + 1; i < allRows.length; i++) {
      const row = allRows[i];
      if (!row || row.length === 0) continue;
      const plot = this.rowToPlot(row, colMap, i + 1);
      if (plot) {
        plots.push(plot);
      }
    }

    return plots;
  }

  /**
   * Prepares spreadsheet row values for creating a new plot row.
   * Generates formula strings for LandValue (G), Brokerage (H), and RETT (T).
   */
  public static plotToRowValuesForCreate(input: CreatePlotInput, rowNum: number): string[] {
    // Columns: A=Zone, B=Block, C=Plot, D=Usage, E=Area, F=Price, G=Formula, H=Formula, I=BrokerageStatus,
    // J='', K=Flag, L=Status, M=Buyer, N=ID, O=Phone, P=DeedNo, Q=DeedDate, R=Invoice, S=CurrentState,
    // T=Formula, U=HandoverStatus, V=HandoverDate, W=Notes
    const row = new Array(23).fill('');
    row[0] = input.zone && input.zone !== 'غير محدد' ? input.zone : '';
    row[1] = String(input.block);
    row[2] = String(input.plotNo);
    row[3] = input.usage || 'سكنى';
    row[4] = String(input.area);
    row[5] = String(input.pricePerM2);
    // Formulas:
    row[6] = `=E${rowNum}*F${rowNum}`; // Land Value
    row[7] = `=G${rowNum}*2.5%*1.15`;   // Brokerage with 15% VAT
    row[8] = input.brokerageStatus || 'كامل السعي';
    row[9] = '';
    row[10] = input.status === 'متاح للبيع' ? 'OK' : 'NO';
    row[11] = input.status || 'متاح للبيع';
    row[12] = input.buyerName || '';
    row[13] = input.buyerId || '';
    row[14] = input.buyerPhone || '';
    row[15] = input.deedNo || '';
    row[16] = input.deedDate || '';
    row[17] = input.invoice || '';
    row[18] = input.currentState || '';
    row[19] = `=G${rowNum}*5%`;        // RETT (5%)
    row[20] = input.handoverStatus || '';
    row[21] = input.handoverDate || '';
    row[22] = input.notes || '';
    return row;
  }

  /**
   * Strips all PII and sensitive data for public viewing.
   */
  public static toPublic(plot: Plot): PublicPlot {
    return {
      zone: plot.zone || 'غير محدد',
      block: plot.block,
      plotNo: plot.plotNo,
      usage: plot.usage,
      area: plot.area,
      pricePerM2: plot.pricePerM2,
      landValue: plot.landValue,
      brokerage: plot.brokerage,
      brokerageStatus: plot.brokerageStatus || 'كامل السعي',
      status: plot.status,
      currentState: plot.currentState || '',
      retTax: plot.retTax,
      handoverStatus: plot.handoverStatus || '',
      handoverDate: plot.handoverDate || '',
    };
  }
}

