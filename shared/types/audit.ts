export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ARCHIVE'
  | 'STATUS_CHANGE'
  | 'CONTRACT_EDIT'
  | 'LOGIN'
  | 'EMPLOYEE_CREATE'
  | 'EMPLOYEE_UPDATE'
  | 'EMPLOYEE_DELETE';

export interface AuditLogEntry {
  id?: string;
  timestamp: string;
  adminEmail: string; // kept for compatibility, represents actor identity (email/username)
  userName?: string;
  userRole?: 'admin' | 'employee';
  action: AuditAction | string;
  plotNo?: number;
  target?: string;
  beforeData?: string;
  afterData?: string;
  ipAddress?: string;
}
