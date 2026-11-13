import { defineEventHandler, getQuery, createError } from 'h3';
import { PlotsRepository } from '../../services/plots/plots.repository';
import { getLiveAuthSession } from '../../utils/auth';
import { normalizeArabic } from '../../../lib/arabic';
import { userCan, userCanAny } from '../../../shared/access';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const session = await getLiveAuthSession(event);

  if (
    session?.role === 'employee' &&
    !userCanAny(session, ['view_plots', 'view_contracts', 'edit_plots', 'edit_contracts'])
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: 'غير مصرح - ليس لديك صلاحية استعراض القطع',
    });
  }

  const canViewFull =
    userCan(session, 'view_contracts') ||
    userCan(session, 'edit_plots') ||
    userCan(session, 'edit_contracts');

  const rawPlots = canViewFull
    ? await PlotsRepository.getAllPlots()
    : await PlotsRepository.getAllPublicPlots();

  let filtered = rawPlots;

  if (query.block) {
    const blockNum = parseInt(String(query.block), 10);
    if (!isNaN(blockNum)) {
      filtered = filtered.filter((p) => p.block === blockNum);
    }
  }

  if (query.zone) {
    const zoneStr = String(query.zone).trim();
    if (zoneStr) {
      filtered = filtered.filter((p) => p.zone === zoneStr);
    }
  }

  if (query.usage) {
    const usageStr = String(query.usage).trim();
    if (usageStr) {
      filtered = filtered.filter((p) => p.usage === usageStr);
    }
  }

  if (query.status) {
    const statusStr = String(query.status).trim();
    if (statusStr) {
      filtered = filtered.filter((p) => p.status === statusStr);
    }
  }

  if (query.search) {
    const s = normalizeArabic(String(query.search).trim()).toLowerCase();
    filtered = filtered.filter((p) => {
      const plotMatch = String(p.plotNo).includes(s);
      const blockMatch = `بلك ${p.block}`.includes(s) || String(p.block) === s;
      const zoneMatch = normalizeArabic(p.zone).toLowerCase().includes(s);
      const usageMatch = normalizeArabic(p.usage).toLowerCase().includes(s);

      let buyerMatch = false;
      if (canViewFull && 'buyerName' in p && p.buyerName) {
        buyerMatch = normalizeArabic(p.buyerName).toLowerCase().includes(s);
      }
      let phoneMatch = false;
      if (canViewFull && 'buyerPhone' in p && p.buyerPhone) {
        phoneMatch = p.buyerPhone.includes(s);
      }

      return plotMatch || blockMatch || zoneMatch || usageMatch || buyerMatch || phoneMatch;
    });
  }

  const sortBy = (query.sortBy as string) || 'plotNo';
  const sortOrder = (query.sortOrder as string) || 'asc';
  const orderMultiplier = sortOrder === 'desc' ? -1 : 1;

  filtered = [...filtered].sort((a: any, b: any) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * orderMultiplier;
    }
    return String(valA || '').localeCompare(String(valB || ''), 'ar') * orderMultiplier;
  });

  return {
    success: true,
    count: filtered.length,
    data: filtered,
  };
});
