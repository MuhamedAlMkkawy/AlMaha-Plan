import fs from 'fs';
import path from 'path';
import { Plot, PublicPlot, CreatePlotInput, UpdatePlotInput, PlotStatistics, BlockSummary, ZoneSummary } from '../../../shared/types/plot';
import { GoogleSheetsClient } from '../../utils/google-sheets/client';
import { PlotsMapper } from './plots.mapper';
import { AuditService } from '../audit/audit.service';
import { PricingService } from '../pricing/pricing.service';

interface CacheEntry {
  plots: Plot[];
  cachedAt: number;
}

let memoryCache: CacheEntry | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export class PlotsRepository {
  private static SHEET_ID = process.env.SHEET_ID || '1ssX3tDc_2g1VBhckLHyewPhk2aQB0sQlTxHuKdwT75A';
  private static FINAL_TAB = process.env.SHEET_TAB_FINAL || 'Final';

  public static invalidateCache(): void {
    memoryCache = null;
  }

  /**
   * Load seed snapshot as fallback if Google Sheets credentials are not configured or on network error
   */
  private static loadSeedPlots(): Plot[] {
    try {
      const seedPath = path.resolve(process.cwd(), 'server/data/plots-seed.json');
      if (fs.existsSync(seedPath)) {
        const data = fs.readFileSync(seedPath, 'utf8');
        return JSON.parse(data) as Plot[];
      }
    } catch (err) {
      console.error('[PlotsRepository] Failed to read seed file:', err);
    }
    return [];
  }

  /**
   * Fetches all plots from Google Sheet (or cache / fallback snapshot)
   */
  public static async getAllPlots(forceRefresh = false): Promise<Plot[]> {
    const now = Date.now();
    if (!forceRefresh && memoryCache && now - memoryCache.cachedAt < CACHE_TTL_MS) {
      return memoryCache.plots;
    }

    const client = GoogleSheetsClient.getClient();
    if (client) {
      try {
        const rows = await GoogleSheetsClient.getValues(this.SHEET_ID, `${this.FINAL_TAB}!A2:W`);
        if (rows && rows.length >= 2) {
          const plots = PlotsMapper.sheetRowsToPlots(rows);
          if (plots.length > 0) {
            memoryCache = { plots, cachedAt: now };
            return plots;
          }
        }
      } catch (err) {
        console.warn('[PlotsRepository] Failed to fetch live from Google Sheets, falling back to seed:', err);
      }
    }

    // Fallback: load seed plots
    const seedPlots = this.loadSeedPlots();
    memoryCache = { plots: seedPlots, cachedAt: now };
    return seedPlots;
  }

  /**
   * Returns all public plots with PII removed.
   */
  public static async getAllPublicPlots(forceRefresh = false): Promise<PublicPlot[]> {
    const plots = await this.getAllPlots(forceRefresh);
    return plots.map((p) => PlotsMapper.toPublic(p));
  }

  /**
   * Get full Plot by plot number (admin only)
   */
  public static async getPlotByNumber(plotNo: number): Promise<Plot | null> {
    const plots = await this.getAllPlots();
    return plots.find((p) => p.plotNo === plotNo) || null;
  }

  /**
   * Get PublicPlot by plot number
   */
  public static async getPublicPlotByNumber(plotNo: number): Promise<PublicPlot | null> {
    const plot = await this.getPlotByNumber(plotNo);
    return plot ? PlotsMapper.toPublic(plot) : null;
  }

  public static async getPlotsByBlock(block: number): Promise<PublicPlot[]> {
    const plots = await this.getAllPublicPlots();
    return plots.filter((p) => p.block === block);
  }

  public static async getPlotsByZone(zone: string): Promise<PublicPlot[]> {
    const plots = await this.getAllPublicPlots();
    return plots.filter((p) => p.zone === zone);
  }

  /**
   * Generates comprehensive statistics, identical to the Rep tab business calculations
   */
  public static async getStatistics(): Promise<PlotStatistics> {
    const plots = await this.getAllPlots();

    let totalArea = 0;
    let totalLandValue = 0;
    let soldCount = 0;
    let reservedCount = 0;
    let availableCount = 0;

    const usageMap = new Map<string, { count: number; area: number; value: number }>();
    const statusMap = new Map<string, { count: number; area: number; value: number }>();
    const matrixMap = new Map<string, { count: number; area: number; value: number }>();
    const blocksSet = new Set<number>();
    const zonesSet = new Set<string>();

    for (const plot of plots) {
      totalArea += plot.area;
      totalLandValue += plot.landValue;

      if (plot.status === 'مباع') soldCount++;
      else if (plot.status === 'محجوز') reservedCount++;
      else availableCount++;

      blocksSet.add(plot.block);
      zonesSet.add(plot.zone || 'غير محدد');

      // Usage stats
      const u = plot.usage || 'سكنى';
      const uCurrent = usageMap.get(u) || { count: 0, area: 0, value: 0 };
      uCurrent.count++;
      uCurrent.area += plot.area;
      uCurrent.value += plot.landValue;
      usageMap.set(u, uCurrent);

      // Status stats
      const s = plot.status || 'متاح للبيع';
      const sCurrent = statusMap.get(s) || { count: 0, area: 0, value: 0 };
      sCurrent.count++;
      sCurrent.area += plot.area;
      sCurrent.value += plot.landValue;
      statusMap.set(s, sCurrent);

      // Matrix key: usage × status
      const matrixKey = `${u}__${s}`;
      const mCurrent = matrixMap.get(matrixKey) || { count: 0, area: 0, value: 0 };
      mCurrent.count++;
      mCurrent.area += plot.area;
      mCurrent.value += plot.landValue;
      matrixMap.set(matrixKey, mCurrent);
    }

    const totalPlots = plots.length;
    const averagePricePerM2 = totalArea > 0 ? Math.round((totalLandValue / totalArea) * 100) / 100 : 0;

    const usageStats = Array.from(usageMap.entries()).map(([usage, data]) => ({
      usage,
      count: data.count,
      area: Math.round(data.area * 100) / 100,
      value: Math.round(data.value * 100) / 100,
      avgPrice: data.area > 0 ? Math.round((data.value / data.area) * 100) / 100 : 0,
      sharePercent: totalArea > 0 ? Math.round((data.area / totalArea) * 1000) / 10 : 0,
    }));

    const statusStats = Array.from(statusMap.entries()).map(([status, data]) => ({
      status,
      count: data.count,
      area: Math.round(data.area * 100) / 100,
      value: Math.round(data.value * 100) / 100,
      avgPrice: data.area > 0 ? Math.round((data.value / data.area) * 100) / 100 : 0,
      sharePercent: totalArea > 0 ? Math.round((data.area / totalArea) * 1000) / 10 : 0,
    }));

    const matrix: PlotStatistics['matrix'] = [];
    const allUsages = ['سكنى', 'تجارى', 'مرافق'];
    const allStatuses = ['متاح للبيع', 'محجوز', 'مباع'];

    for (const u of allUsages) {
      for (const s of allStatuses) {
        const key = `${u}__${s}`;
        const data = matrixMap.get(key) || { count: 0, area: 0, value: 0 };
        if (data.count > 0 || usageMap.has(u)) {
          matrix.push({
            usage: u,
            status: s,
            count: data.count,
            area: Math.round(data.area * 100) / 100,
            value: Math.round(data.value * 100) / 100,
            avgPrice: data.area > 0 ? Math.round((data.value / data.area) * 100) / 100 : 0,
            sharePercent: totalArea > 0 ? Math.round((data.area / totalArea) * 1000) / 10 : 0,
          });
        }
      }
    }

    return {
      totalPlots,
      totalArea: Math.round(totalArea * 100) / 100,
      totalLandValue: Math.round(totalLandValue * 100) / 100,
      averagePricePerM2,
      soldCount,
      reservedCount,
      availableCount,
      usageStats,
      statusStats,
      matrix,
      blocksCount: blocksSet.size,
      zonesCount: zonesSet.size,
      lastUpdated: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };
  }

  /**
   * Block summaries
   */
  public static async getBlockSummaries(): Promise<BlockSummary[]> {
    const plots = await this.getAllPublicPlots();
    const map = new Map<number, BlockSummary>();

    for (const plot of plots) {
      let b = map.get(plot.block);
      if (!b) {
        b = {
          block: plot.block,
          totalPlots: 0,
          availableCount: 0,
          reservedCount: 0,
          soldCount: 0,
          totalArea: 0,
          totalValue: 0,
          soldPercent: 0,
        };
        map.set(plot.block, b);
      }
      b.totalPlots++;
      b.totalArea += plot.area;
      b.totalValue += plot.landValue;
      if (plot.status === 'مباع') b.soldCount++;
      else if (plot.status === 'محجوز') b.reservedCount++;
      else b.availableCount++;
    }

    for (const b of map.values()) {
      b.totalArea = Math.round(b.totalArea * 100) / 100;
      b.totalValue = Math.round(b.totalValue * 100) / 100;
      b.soldPercent = b.totalPlots > 0 ? Math.round((b.soldCount / b.totalPlots) * 100) : 0;
    }

    return Array.from(map.values()).sort((a, b) => a.block - b.block);
  }

  /**
   * Zone summaries
   */
  public static async getZoneSummaries(): Promise<ZoneSummary[]> {
    const plots = await this.getAllPublicPlots();
    const map = new Map<string, ZoneSummary>();

    for (const plot of plots) {
      const z = plot.zone || 'غير محدد';
      let entry = map.get(z);
      if (!entry) {
        entry = {
          zone: z,
          totalPlots: 0,
          availableCount: 0,
          reservedCount: 0,
          soldCount: 0,
          totalArea: 0,
          totalValue: 0,
        };
        map.set(z, entry);
      }
      entry.totalPlots++;
      entry.totalArea += plot.area;
      entry.totalValue += plot.landValue;
      if (plot.status === 'مباع') entry.soldCount++;
      else if (plot.status === 'محجوز') entry.reservedCount++;
      else entry.availableCount++;
    }

    return Array.from(map.values()).sort((a, b) => a.zone.localeCompare(b.zone));
  }

  /**
   * Creates a new plot record in Google Sheet
   */
  public static async createPlot(input: CreatePlotInput, adminEmail: string, ipAddress?: string): Promise<Plot> {
    const existing = await this.getPlotByNumber(input.plotNo);
    if (existing) {
      throw new Error(`رقم القطعة ${input.plotNo} موجود مسبقاً، لا يمكن تكراره.`);
    }

    const client = GoogleSheetsClient.getClient();
    let rowNum = 975; // default fallback row

    if (client) {
      // Re-read sheet to get current total rows
      const rows = await GoogleSheetsClient.getValues(this.SHEET_ID, `${this.FINAL_TAB}!A:C`);
      rowNum = rows.length + 1;

      const rowValues = PlotsMapper.plotToRowValuesForCreate(input, rowNum);
      await GoogleSheetsClient.appendValues(this.SHEET_ID, `${this.FINAL_TAB}!A:W`, [rowValues]);
    } else {
      // Offline fallback: update local seed memory
      const current = await this.getAllPlots();
      const calcs = PricingService.calculatePlot({ area: input.area, pricePerM2: input.pricePerM2 });
      const newPlot: Plot = {
        zone: input.zone || 'غير محدد',
        block: input.block,
        plotNo: input.plotNo,
        usage: input.usage || 'سكنى',
        area: input.area,
        pricePerM2: input.pricePerM2,
        landValue: calcs.landValue,
        brokerage: calcs.brokerage,
        brokerageStatus: input.brokerageStatus || 'كامل السعي',
        status: input.status || 'متاح للبيع',
        currentState: input.currentState || '',
        retTax: calcs.retTax,
        handoverStatus: input.handoverStatus || '',
        handoverDate: input.handoverDate || '',
        buyerName: input.buyerName || '',
        buyerId: input.buyerId || '',
        buyerPhone: input.buyerPhone || '',
        deedNo: input.deedNo || '',
        deedDate: input.deedDate || '',
        invoice: input.invoice || '',
        notes: input.notes || '',
        rowNumber: current.length + 3,
      };
      newPlot.hash = PlotsMapper.generateHash(newPlot);
      current.push(newPlot);
      memoryCache = { plots: current, cachedAt: Date.now() };
    }

    this.invalidateCache();

    await AuditService.log({
      adminEmail,
      action: 'CREATE',
      plotNo: input.plotNo,
      afterData: JSON.stringify(input),
      ipAddress,
    });

    const created = await this.getPlotByNumber(input.plotNo);
    return created!;
  }

  /**
   * Updates an existing plot in Google Sheet, protecting formulas G, H, T.
   */
  public static async updatePlot(
    plotNo: number,
    input: UpdatePlotInput,
    adminEmail: string,
    ipAddress?: string
  ): Promise<Plot> {
    // 1. Re-read the spreadsheet to find current row
    const current = await this.getPlotByNumber(plotNo);
    if (!current) {
      throw new Error(`القطعة رقم ${plotNo} غير موجودة.`);
    }

    // 2. Concurrency check
    if (input.expectedHash && current.hash && current.hash !== input.expectedHash) {
      const err = new Error('تم تعديل هذا السجل من قبل مستخدم آخر، يرجى إعادة تحميل الصفحة.');
      (err as any).statusCode = 409;
      throw err;
    }

    const beforeData = JSON.stringify(current);
    const client = GoogleSheetsClient.getClient();

    if (client) {
      // Find row index by re-scanning column C (PLOT No.)
      const rows = await GoogleSheetsClient.getValues(this.SHEET_ID, `${this.FINAL_TAB}!C:C`);
      let foundRow = -1;
      for (let i = 0; i < rows.length; i++) {
        if (parseInt(rows[i]?.[0], 10) === plotNo) {
          foundRow = i + 1; // 1-based index
          break;
        }
      }

      if (foundRow === -1) {
        throw new Error(`تعذر العثور على سطر القطعة ${plotNo} في جدول البيانات.`);
      }

      // Update input fields:
      // Note: Col A=Zone, B=Block, C=PlotNo, D=Usage, E=Area, F=PricePerM2
      // G & H are formulas! DO NOT OVERWRITE!
      // Col I=BrokerageStatus, K=Flag, L=Status, M=Buyer, N=ID, O=Phone, P=Deed, Q=DeedDate, R=Invoice, S=CurrentState
      // T is formula! DO NOT OVERWRITE!
      // Col U=HandoverStatus, V=HandoverDate, W=Notes

      const rangeAtoF = `${this.FINAL_TAB}!A${foundRow}:F${foundRow}`;
      const valsAtoF = [
        [
          input.zone ?? current.zone ?? '',
          input.block ?? current.block,
          plotNo,
          input.usage ?? current.usage,
          input.area ?? current.area,
          input.pricePerM2 ?? current.pricePerM2,
        ],
      ];
      await GoogleSheetsClient.updateValues(this.SHEET_ID, rangeAtoF, valsAtoF);

      // Range I:S
      const rangeItoS = `${this.FINAL_TAB}!I${foundRow}:S${foundRow}`;
      const statusVal = input.status ?? current.status ?? 'متاح للبيع';
      const valsItoS = [
        [
          input.brokerageStatus ?? current.brokerageStatus ?? 'كامل السعي',
          '', // J
          statusVal === 'متاح للبيع' ? 'OK' : 'NO', // K
          statusVal, // L
          input.buyerName ?? current.buyerName ?? '',
          input.buyerId ?? current.buyerId ?? '',
          input.buyerPhone ?? current.buyerPhone ?? '',
          input.deedNo ?? current.deedNo ?? '',
          input.deedDate ?? current.deedDate ?? '',
          input.invoice ?? current.invoice ?? '',
          input.currentState ?? current.currentState ?? '',
        ],
      ];
      await GoogleSheetsClient.updateValues(this.SHEET_ID, rangeItoS, valsItoS);

      // Range U:W
      const rangeUtoW = `${this.FINAL_TAB}!U${foundRow}:W${foundRow}`;
      const valsUtoW = [
        [
          input.handoverStatus ?? current.handoverStatus ?? '',
          input.handoverDate ?? current.handoverDate ?? '',
          input.notes ?? current.notes ?? '',
        ],
      ];
      await GoogleSheetsClient.updateValues(this.SHEET_ID, rangeUtoW, valsUtoW);
    } else {
      // Offline fallback: update memory cache
      const plots = await this.getAllPlots();
      const idx = plots.findIndex((p) => p.plotNo === plotNo);
      if (idx !== -1) {
        const area = input.area ?? plots[idx].area;
        const pricePerM2 = input.pricePerM2 ?? plots[idx].pricePerM2;
        const calcs = PricingService.calculatePlot({ area, pricePerM2 });

        plots[idx] = {
          ...plots[idx],
          zone: input.zone ?? plots[idx].zone,
          block: input.block ?? plots[idx].block,
          usage: input.usage ?? plots[idx].usage,
          area,
          pricePerM2,
          landValue: calcs.landValue,
          brokerage: calcs.brokerage,
          retTax: calcs.retTax,
          brokerageStatus: input.brokerageStatus ?? plots[idx].brokerageStatus,
          status: input.status ?? plots[idx].status,
          buyerName: input.buyerName ?? plots[idx].buyerName,
          buyerId: input.buyerId ?? plots[idx].buyerId,
          buyerPhone: input.buyerPhone ?? plots[idx].buyerPhone,
          deedNo: input.deedNo ?? plots[idx].deedNo,
          deedDate: input.deedDate ?? plots[idx].deedDate,
          invoice: input.invoice ?? plots[idx].invoice,
          currentState: input.currentState ?? plots[idx].currentState,
          handoverStatus: input.handoverStatus ?? plots[idx].handoverStatus,
          handoverDate: input.handoverDate ?? plots[idx].handoverDate,
          notes: input.notes ?? plots[idx].notes,
        };
        plots[idx].hash = PlotsMapper.generateHash(plots[idx]);
        memoryCache = { plots, cachedAt: Date.now() };
      }
    }

    this.invalidateCache();

    await AuditService.log({
      adminEmail,
      action: 'UPDATE',
      plotNo,
      beforeData,
      afterData: JSON.stringify(input),
      ipAddress,
    });

    const updated = await this.getPlotByNumber(plotNo);
    return updated!;
  }

  /**
   * Soft-deletes a plot by setting status to 'مؤرشف'
   */
  public static async archivePlot(plotNo: number, adminEmail: string, ipAddress?: string): Promise<Plot> {
    return this.updatePlot(plotNo, { status: 'مؤرشف' }, adminEmail, ipAddress);
  }
}

