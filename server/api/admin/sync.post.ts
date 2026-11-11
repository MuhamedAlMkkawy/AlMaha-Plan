import { defineEventHandler } from 'h3';
import { requireAdmin } from '../../utils/auth';
import { PlotsRepository } from '../../services/plots/plots.repository';

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  PlotsRepository.invalidateCache();
  const freshPlots = await PlotsRepository.getAllPlots(true);
  return {
    success: true,
    message: 'تم تحديث البيانات مباشرة من جدول Google Sheets بنجاح',
    totalPlots: freshPlots.length,
    timestamp: new Date().toLocaleTimeString('ar-SA'),
  };
});

