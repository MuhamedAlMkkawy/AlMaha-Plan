import fs from 'node:fs';
import path from 'node:path';
import { GoogleSheetsClient } from '../../utils/google-sheets/client';
import { PlotsRepository } from '../plots/plots.repository';
import { AuditService } from '../audit/audit.service';
import type { Plot } from '../../../shared/types/plot';

export interface ContractData {
  plotNo: number;
  contractNo: string;
  contractDate: string;
  buyerName: string;
  buyerId: string;
  buyerBirthDate: string;
  buyerPhone: string;
  contractNote: string;
  contractTerms: string[] | null;
  updatedAt?: string;
}

const CONTRACTS_FILE = path.resolve(process.cwd(), 'server/data/contracts.json');
const SHEET_ID = process.env.SHEET_ID || '1ssX3tDc_2g1VBhckLHyewPhk2aQB0sQlTxHuKdwT75A';
const CONTRACTS_TAB = 'Contracts';

let inMemoryContracts: Map<number, ContractData> | null = null;
let lastLoadedTime = 0;
const CACHE_TTL_MS = 60 * 1000;

export class ContractsRepository {
  private static loadFromFile(): Map<number, ContractData> {
    const map = new Map<number, ContractData>();
    try {
      if (fs.existsSync(CONTRACTS_FILE)) {
        const raw = fs.readFileSync(CONTRACTS_FILE, 'utf8');
        const list: ContractData[] = JSON.parse(raw);
        for (const item of list) {
          if (item && item.plotNo) {
            map.set(item.plotNo, item);
          }
        }
      }
    } catch (err) {
      console.warn('[ContractsRepository] Error reading local contracts file:', err);
    }
    return map;
  }

  private static saveToFile(map: Map<number, ContractData>) {
    try {
      const list = Array.from(map.values());
      const dir = path.dirname(CONTRACTS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CONTRACTS_FILE, JSON.stringify(list, null, 2), 'utf8');
    } catch (err) {
      console.warn('[ContractsRepository] Error saving local contracts file:', err);
    }
  }

  public static async getAllContracts(force = false): Promise<Map<number, ContractData>> {
    const now = Date.now();
    if (!force && inMemoryContracts && now - lastLoadedTime < CACHE_TTL_MS) {
      return inMemoryContracts;
    }

    const map = this.loadFromFile();
    const client = GoogleSheetsClient.getClient();

    if (client) {
      try {
        await GoogleSheetsClient.ensureTabExists(SHEET_ID, CONTRACTS_TAB);
        const rows = await GoogleSheetsClient.getValues(SHEET_ID, `${CONTRACTS_TAB}!A2:J`);
        if (rows && rows.length > 0) {
          for (const row of rows) {
            const plotNo = parseInt(row[0], 10);
            if (!plotNo || isNaN(plotNo)) continue;

            let contractTerms: string[] | null = null;
            if (row[5]) {
              try {
                contractTerms = JSON.parse(row[5]);
              } catch {
                contractTerms = null;
              }
            }

            map.set(plotNo, {
              plotNo,
              contractNo: row[1] || String(plotNo),
              contractDate: row[2] || '',
              buyerBirthDate: row[3] || '',
              contractNote: row[4] || '',
              contractTerms,
              updatedAt: row[6] || '',
              buyerName: row[7] || '',
              buyerId: row[8] || '',
              buyerPhone: row[9] || '',
            });
          }
        }
      } catch (err) {
        console.warn('[ContractsRepository] Error loading from Google Sheets, using local/cache:', err);
      }
    }

    inMemoryContracts = map;
    lastLoadedTime = now;
    return map;
  }

  public static async getContract(plotNo: number, plotFallback?: Plot | null): Promise<ContractData> {
    const map = await this.getAllContracts();
    const existing = map.get(plotNo);

    const plot = plotFallback ?? (await PlotsRepository.getPlotByNumber(plotNo));

    return {
      plotNo,
      contractNo: existing?.contractNo || String(plotNo),
      contractDate: existing?.contractDate || plot?.deedDate || '',
      buyerName: existing?.buyerName || plot?.buyerName || '',
      buyerId: existing?.buyerId || plot?.buyerId || '',
      buyerBirthDate: existing?.buyerBirthDate || '',
      buyerPhone: existing?.buyerPhone || plot?.buyerPhone || '',
      contractNote: existing?.contractNote || plot?.notes || '',
      contractTerms: existing?.contractTerms ?? null,
      updatedAt: existing?.updatedAt || '',
    };
  }

  public static async saveContract(
    plotNo: number,
    input: Partial<ContractData>,
    adminEmail: string,
    ipAddress?: string
  ): Promise<ContractData> {
    const current = await this.getContract(plotNo);
    const beforeData = JSON.stringify(current);

    const updated: ContractData = {
      plotNo,
      contractNo: input.contractNo ?? current.contractNo ?? String(plotNo),
      contractDate: input.contractDate ?? current.contractDate ?? '',
      buyerName: input.buyerName ?? current.buyerName ?? '',
      buyerId: input.buyerId ?? current.buyerId ?? '',
      buyerBirthDate: input.buyerBirthDate ?? current.buyerBirthDate ?? '',
      buyerPhone: input.buyerPhone ?? current.buyerPhone ?? '',
      contractNote: input.contractNote ?? current.contractNote ?? '',
      contractTerms: input.contractTerms !== undefined ? input.contractTerms : current.contractTerms,
      updatedAt: new Date().toISOString(),
    };

    // 1. Update the Master sheet with buyer details
    try {
      await PlotsRepository.updatePlot(
        plotNo,
        {
          buyerName: updated.buyerName,
          buyerId: updated.buyerId,
          buyerPhone: updated.buyerPhone,
          notes: updated.contractNote || undefined,
        },
        adminEmail,
        ipAddress
      );
    } catch (err) {
      console.warn('[ContractsRepository] Failed to update plot master sheet row:', err);
    }

    // 2. Persist contract row to Google Sheets Contracts tab
    const client = GoogleSheetsClient.getClient();
    if (client) {
      try {
        await GoogleSheetsClient.ensureTabExists(SHEET_ID, CONTRACTS_TAB);

        // Check if row 1 headers exist, if not initialize
        const headerRange = await GoogleSheetsClient.getValues(SHEET_ID, `${CONTRACTS_TAB}!A1:J1`);
        if (!headerRange || headerRange.length === 0 || !headerRange[0] || headerRange[0].length === 0) {
          await GoogleSheetsClient.updateValues(SHEET_ID, `${CONTRACTS_TAB}!A1:J1`, [
            [
              'رقم القطعة',
              'رقم العقد',
              'تاريخ العقد',
              'تاريخ ميلاد المشتري',
              'بيان خاص',
              'الشروط والأحكام',
              'تاريخ التحديث',
              'اسم المشتري',
              'رقم الهوية',
              'رقم الجوال',
            ],
          ]);
        }

        const rows = await GoogleSheetsClient.getValues(SHEET_ID, `${CONTRACTS_TAB}!A:A`);
        let foundRowIndex = -1;
        for (let i = 1; i < rows.length; i++) {
          if (parseInt(rows[i]?.[0], 10) === plotNo) {
            foundRowIndex = i + 1; // 1-based index
            break;
          }
        }

        const rowValues = [
          [
            String(plotNo),
            updated.contractNo,
            updated.contractDate,
            updated.buyerBirthDate,
            updated.contractNote,
            updated.contractTerms ? JSON.stringify(updated.contractTerms) : '',
            updated.updatedAt,
            updated.buyerName,
            updated.buyerId,
            updated.buyerPhone,
          ],
        ];

        if (foundRowIndex > 0) {
          await GoogleSheetsClient.updateValues(SHEET_ID, `${CONTRACTS_TAB}!A${foundRowIndex}:J${foundRowIndex}`, rowValues);
        } else {
          await GoogleSheetsClient.appendValues(SHEET_ID, `${CONTRACTS_TAB}!A:J`, rowValues);
        }
      } catch (err) {
        console.error('[ContractsRepository] Error writing contract to Google Sheets:', err);
      }
    }

    // 3. Update in-memory map & local file
    const map = await this.getAllContracts();
    map.set(plotNo, updated);
    this.saveToFile(map);

    // 4. Invalidate plots repository cache
    PlotsRepository.invalidateCache();

    // 5. Audit log
    await AuditService.log({
      adminEmail,
      action: 'UPDATE',
      plotNo,
      beforeData,
      afterData: JSON.stringify(updated),
      ipAddress,
    });

    return updated;
  }
}

