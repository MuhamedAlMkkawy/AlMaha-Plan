import { AuditLogEntry } from '../../../shared/types/audit';
import { GoogleSheetsClient } from '../../utils/google-sheets/client';

let inMemoryAuditLogs: AuditLogEntry[] = [];

export class AuditService {
  private static SHEET_ID = process.env.SHEET_ID || '1ssX3tDc_2g1VBhckLHyewPhk2aQB0sQlTxHuKdwT75A';
  private static AUDIT_TAB = 'AuditLog';

  public static async log(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
    const fullEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    inMemoryAuditLogs.unshift(fullEntry);
    if (inMemoryAuditLogs.length > 200) {
      inMemoryAuditLogs = inMemoryAuditLogs.slice(0, 200);
    }

    const client = GoogleSheetsClient.getClient();
    if (!client) {
      return;
    }

    try {
      await GoogleSheetsClient.ensureTabExists(this.SHEET_ID, this.AUDIT_TAB);
      const row = [
        fullEntry.timestamp,
        fullEntry.adminEmail,
        fullEntry.action,
        String(fullEntry.plotNo),
        fullEntry.beforeData || '',
        fullEntry.afterData || '',
        fullEntry.ipAddress || '',
      ];

      await GoogleSheetsClient.appendValues(this.SHEET_ID, `${this.AUDIT_TAB}!A:G`, [row]);
    } catch (err) {
      console.error('[AuditService] Failed to append audit log to sheet:', err);
    }
  }

  public static async getRecentLogs(limit = 100): Promise<AuditLogEntry[]> {
    const client = GoogleSheetsClient.getClient();
    if (!client) {
      return inMemoryAuditLogs.slice(0, limit);
    }

    try {
      const rows = await GoogleSheetsClient.getValues(this.SHEET_ID, `${this.AUDIT_TAB}!A2:G`);
      if (!rows || rows.length === 0) {
        return inMemoryAuditLogs.slice(0, limit);
      }

      const entries: AuditLogEntry[] = rows.map((r, i) => ({
        id: `audit-${i}`,
        timestamp: r[0] || '',
        adminEmail: r[1] || '',
        action: (r[2] as any) || 'UPDATE',
        plotNo: parseInt(r[3], 10) || 0,
        beforeData: r[4] || '',
        afterData: r[5] || '',
        ipAddress: r[6] || '',
      }));

      // Return newest first
      return entries.reverse().slice(0, limit);
    } catch (err) {
      console.warn('[AuditService] Failed to read audit log from sheet, using local:', err);
      return inMemoryAuditLogs.slice(0, limit);
    }
  }
}

