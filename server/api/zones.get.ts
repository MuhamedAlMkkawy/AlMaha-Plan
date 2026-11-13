import { defineEventHandler } from 'h3';
import { PlotsRepository } from '../services/plots/plots.repository';
import { enforceEmployeePermissionIfLoggedIn } from '../utils/auth';

export default defineEventHandler(async (event) => {
  await enforceEmployeePermissionIfLoggedIn(event, 'view_plots');
  const zones = await PlotsRepository.getZoneSummaries();
  return {
    success: true,
    count: zones.length,
    data: zones,
  };
});

