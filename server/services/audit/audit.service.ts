import fs from 'node:fs';
import path from 'node:path';
import { AuditLogEntry } from '../../../shared/types/audit';
import { GoogleSheetsClient } from '../../utils/google-sheets/client';

const AUDIT_FILE = path.resolve(process.cwd(), 'server/data/audit.json');
let inMemoryAuditLogs: AuditLogEntry[] = [];

function loadLocalAudit(): AuditLogEntry[] {
  try {
    if (fs.existsSync(AUDIT_FILE)) {
      const raw = fs.readFileSync(AUDIT_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[AuditService] Failed to read local audit file:', err);
  }
  return [];
}

function saveLocalAudit(logs: AuditLogEntry[]) {
  try {
    const dir = path.dirname(AUDIT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs.slice(0, 500), null, 2), 'utf8');
  } catch (err) {
    console.warn('[AuditService] Failed to write local audit file:', err);
  }
}

export class AuditService {
  private static SHEET_ID = process.env.SHEET_ID || '1ssX3tDc_2g1VBhckLHyewPhk2aQB0sQlTxHuKdwT75A';
  private static AUDIT_TAB = 'AuditLog';

  public static async log(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      userName: entry.userName || entry.adminEmail,
      userRole: entry.userRole || 'admin',
    };

    if (inMemoryAuditLogs.length === 0) {
      inMemoryAuditLogs = loadLocalAudit();
    }

    inMemoryAuditLogs.unshift(fullEntry);
    if (inMemoryAuditLogs.length > 500) {
      inMemoryAuditLogs = inMemoryAuditLogs.slice(0, 500);
    }
    saveLocalAudit(inMemoryAuditLogs);

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
        fullEntry.plotNo ? String(fullEntry.plotNo) : '',
        fullEntry.beforeData || '',
        fullEntry.afterData || '',
        fullEntry.ipAddress || '',
        fullEntry.userName || '',
        fullEntry.userRole || 'admin',
        fullEntry.target || '',
      ];

      await GoogleSheetsClient.appendValues(this.SHEET_ID, `${this.AUDIT_TAB}!A:J`, [row]);
    } catch (err) {
      console.error('[AuditService] Failed to append audit log to sheet:', err);
    }
  }

  public static async getRecentLogs(limit = 200): Promise<AuditLogEntry[]> {
    if (inMemoryAuditLogs.length === 0) {
      inMemoryAuditLogs = loadLocalAudit();
    }

    const client = GoogleSheetsClient.getClient();
    if (!client) {
      return inMemoryAuditLogs.slice(0, limit);
    }

    try {
      const rows = await GoogleSheetsClient.getValues(this.SHEET_ID, `${this.AUDIT_TAB}!A2:J`);
      if (!rows || rows.length === 0) {
        return inMemoryAuditLogs.slice(0, limit);
      }

      const entries: AuditLogEntry[] = rows.map((r, i) => ({
        id: `audit-${i}`,
        timestamp: r[0] || '',
        adminEmail: r[1] || '',
        action: r[2] || 'UPDATE',
        plotNo: r[3] ? parseInt(r[3], 10) : undefined,
        beforeData: r[4] || '',
        afterData: r[5] || '',
        ipAddress: r[6] || '',
        userName: r[7] || r[1] || '',
        userRole: (r[8] as any) || 'admin',
        target: r[9] || (r[3] ? `قطعة ${r[3]}` : ''),
      }));

      // Combine with any newer in-memory items if present
      const sheetIds = new Set(entries.map((e) => e.timestamp + e.adminEmail + e.action));
      for (const mem of inMemoryAuditLogs) {
        if (!sheetIds.has(mem.timestamp + mem.adminEmail + mem.action)) {
          entries.push(mem);
        }
      }

      entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return entries.slice(0, limit);
    } catch (err) {
      console.warn('[AuditService] Failed to read audit log from sheet, using local:', err);
      return inMemoryAuditLogs.slice(0, limit);
    }
  }
}
