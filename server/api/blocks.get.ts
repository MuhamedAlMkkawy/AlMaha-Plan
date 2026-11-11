import { defineEventHandler } from 'h3';
import { PlotsRepository } from '../services/plots/plots.repository';

export default defineEventHandler(async () => {
  const blocks = await PlotsRepository.getBlockSummaries();
  return {
    success: true,
    count: blocks.length,
    data: blocks,
  };
});

