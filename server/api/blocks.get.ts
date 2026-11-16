import { defineEventHandler } from 'h3';
import { PlotsRepository } from '../services/plots/plots.repository';
import { requirePermission } from '../utils/auth';

export default defineEventHandler(async (event) => {
  // Unauthenticated requests receive 401; employees without 'view_plots' or 'view_block_page' receive 403
  await requirePermission(event, 'view_plots');

  const blocks = await PlotsRepository.getBlockSummaries();
  return {
    success: true,
    count: blocks.length,
    data: blocks,
  };
});
