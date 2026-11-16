import { defineEventHandler } from 'h3';
import { PlotsRepository } from '../services/plots/plots.repository';
import { requirePermission } from '../utils/auth';

export default defineEventHandler(async (event) => {
  // Unauthenticated requests receive 401; employees without 'view_plots' or 'view_zone_page' receive 403
  await requirePermission(event, 'view_plots');

  const zones = await PlotsRepository.getZoneSummaries();
  return {
    success: true,
    count: zones.length,
    data: zones,
  };
});
