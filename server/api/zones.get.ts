import { defineEventHandler } from 'h3';
import { PlotsRepository } from '../services/plots/plots.repository';

export default defineEventHandler(async () => {
  const zones = await PlotsRepository.getZoneSummaries();
  return {
    success: true,
    count: zones.length,
    data: zones,
  };
});

