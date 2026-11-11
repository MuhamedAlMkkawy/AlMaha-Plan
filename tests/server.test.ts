import { describe, it, expect } from 'vitest';
import { PlotsMapper } from '../server/services/plots/plots.mapper';
import { PlotsRepository } from '../server/services/plots/plots.repository';
import { PricingService } from '../server/services/pricing/pricing.service';
import { Plot } from '../shared/types/plot';

describe('PlotsMapper Unit Tests', () => {
  it('should parse Arabic and English formatted numbers correctly', () => {
    // English formats
    expect(PlotsMapper.parseNumber('1,241.17')).toBe(1241.17);
    expect(PlotsMapper.parseNumber(' 3,102,925.10 ')).toBe(3102925.1);

    // Arabic separator formats (٬ and ٫)
    expect(PlotsMapper.parseNumber('1٬241٫17')).toBe(1241.17);
    expect(PlotsMapper.parseNumber('360٬456٫72')).toBe(360456.72);
  });

  it('should preserve deed numbers as formatted strings without loss of precision', () => {
    const rawDeed = '3022754992000000';
    const headerRow = [
      'رقم الزون', 'BLOCK No.', 'PLOT No.', 'USAGE', 'PLOT AREA (M²)',
      'سعر بيع م2', 'قيمة الارض', 'السعي شامل الضريبة', 'حالة السعي', '',
      'Available For Sale', 'Status', 'اسم المشتري', 'الهوية / السجل',
      'رقم الجوال', 'رقم صك القطع', 'تاريخ الصك', 'الفاتورة الضريبية',
      'الوضع الحالي', 'قيمة ضريبة التصرفات العقارية', 'الحالة', 'تاريخ الافراغ', 'الملاحظات'
    ];
    const colMap = PlotsMapper.buildColumnMap(headerRow);

    const row = [
      'A1', '1', '1', 'تجارى', '1241.17', '2500', '', '', 'كامل السعي', '',
      'OK', 'محجوز', 'فهد البليهد', '1010101010', '0503311855', rawDeed, '6/7/2026', '', '', '', '', '', ''
    ];

    const plot = PlotsMapper.rowToPlot(row, colMap, 3);
    expect(plot).not.toBeNull();
    expect(plot?.deedNo).toBe(rawDeed);
    expect(typeof plot?.deedNo).toBe('string');
  });

  it('should strictly strip all PII in PublicPlot', () => {
    const fullPlot: Plot = {
      zone: 'A1',
      block: 1,
      plotNo: 1,
      usage: 'تجارى',
      area: 1241.17,
      pricePerM2: 2500,
      landValue: 3102925,
      brokerage: 89209.1,
      brokerageStatus: 'كامل السعي',
      status: 'محجوز',
      retTax: 155146.25,
      buyerName: 'سري للغاية',
      buyerId: '1099887766',
      buyerPhone: '0501234567',
      deedNo: '3022754992000000',
      invoice: 'INV-1234',
      notes: 'ملاحظة داخلية خاصة بالعميل',
    };

    const publicPlot = PlotsMapper.toPublic(fullPlot);

    // Verify public properties exist
    expect(publicPlot.plotNo).toBe(1);
    expect(publicPlot.area).toBe(1241.17);
    expect(publicPlot.landValue).toBe(3102925);

    // Verify sensitive PII fields are COMPLETELY stripped
    expect((publicPlot as any).buyerName).toBeUndefined();
    expect((publicPlot as any).buyerId).toBeUndefined();
    expect((publicPlot as any).buyerPhone).toBeUndefined();
    expect((publicPlot as any).deedNo).toBeUndefined();
    expect((publicPlot as any).invoice).toBeUndefined();
    expect((publicPlot as any).notes).toBeUndefined();
  });

  it('should generate formula strings for new plot creation', () => {
    const input = {
      block: 5,
      plotNo: 980,
      usage: 'سكنى',
      area: 400,
      pricePerM2: 2000,
      status: 'متاح للبيع',
    };

    const row = PlotsMapper.plotToRowValuesForCreate(input, 982);
    expect(row[6]).toBe('=E982*F982'); // Land Value
    expect(row[7]).toBe('=G982*2.5%*1.15'); // Brokerage
    expect(row[19]).toBe('=G982*5%'); // RETT
  });
});

describe('PlotsRepository Data & Statistics Tests', () => {
  it('should load all 973 plots from seed snapshot', async () => {
    const plots = await PlotsRepository.getAllPlots();
    expect(plots.length).toBe(973);

    const publicPlots = await PlotsRepository.getAllPublicPlots();
    expect(publicPlots.length).toBe(973);

    // Verify no PII leak in public plots
    for (const p of publicPlots) {
      expect((p as any).buyerName).toBeUndefined();
      expect((p as any).buyerPhone).toBeUndefined();
      expect((p as any).deedNo).toBeUndefined();
    }
  });

  it('should compute exact project statistics matching the master workbook', async () => {
    const stats = await PlotsRepository.getStatistics();

    expect(stats.totalPlots).toBe(973);
    expect(stats.blocksCount).toBe(40);
    expect(stats.totalLandValue).toBeGreaterThan(600000000);
    expect(stats.totalArea).toBeGreaterThan(350000);

    // Verify status distributions
    expect(stats.soldCount + stats.reservedCount + stats.availableCount).toBe(973);

    // Verify blocks breakdown
    const blocks = await PlotsRepository.getBlockSummaries();
    expect(blocks.length).toBe(40);
    const sumBlockPlots = blocks.reduce((acc, b) => acc + b.totalPlots, 0);
    expect(sumBlockPlots).toBe(973);

    // Verify zones breakdown
    const zones = await PlotsRepository.getZoneSummaries();
    expect(zones.length).toBeGreaterThanOrEqual(4);
  });
});
