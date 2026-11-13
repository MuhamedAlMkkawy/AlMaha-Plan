import { defineEventHandler } from 'h3';
import { PlotsRepository } from '../services/plots/plots.repository';
import { enforceEmployeePermissionIfLoggedIn } from '../utils/auth';

export default defineEventHandler(async (event) => {
  await enforceEmployeePermissionIfLoggedIn(event, 'view_stats');
  const stats = await PlotsRepository.getStatistics();
  return {
    success: true,
    data: stats,
  };
});

