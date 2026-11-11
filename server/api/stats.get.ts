import { defineEventHandler } from 'h3';
import { PlotsRepository } from '../services/plots/plots.repository';

export default defineEventHandler(async () => {
  const stats = await PlotsRepository.getStatistics();
  return {
    success: true,
    data: stats,
  };
});

