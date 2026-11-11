export interface AuditLogEntry {
  id?: string;
  timestamp: string;
  adminEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ARCHIVE' | 'STATUS_CHANGE';
  plotNo: number;
  beforeData?: string;
  afterData?: string;
  ipAddress?: string;
}

