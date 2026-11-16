import { defineEventHandler } from 'h3';
import { PlotsRepository } from '../services/plots/plots.repository';
import { requirePermission } from '../utils/auth';

export default defineEventHandler(async (event) => {
  // Unauthenticated requests receive 401; employees without 'view_stats' receive 403
  await requirePermission(event, 'view_stats');

  const stats = await PlotsRepository.getStatistics();
  return {
    success: true,
    data: stats,
  };
});
