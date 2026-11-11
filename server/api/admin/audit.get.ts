import { defineEventHandler } from 'h3';
import { requireAdmin } from '../../utils/auth';
import { AuditService } from '../../services/audit/audit.service';

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const logs = await AuditService.getRecentLogs(100);
  return {
    success: true,
    count: logs.length,
    data: logs,
  };
});

