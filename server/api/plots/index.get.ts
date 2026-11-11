import { defineEventHandler, getQuery } from 'h3';
import { PlotsRepository } from '../../services/plots/plots.repository';
import { getAdminSession } from '../../utils/auth';
import { normalizeArabic } from '../../../lib/arabic';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const admin = getAdminSession(event);

  // If authenticated admin, return full plots; otherwise return sanitized PublicPlots
  const rawPlots = admin ? await PlotsRepository.getAllPlots() : await PlotsRepository.getAllPublicPlots();

  let filtered = rawPlots;

  // Filter by block
  if (query.block) {
    const blockNum = parseInt(String(query.block), 10);
    if (!isNaN(blockNum)) {
      filtered = filtered.filter((p) => p.block === blockNum);
    }
  }

  // Filter by zone
  if (query.zone) {
    const zoneStr = String(query.zone).trim();
    if (zoneStr) {
      filtered = filtered.filter((p) => p.zone === zoneStr);
    }
  }

  // Filter by usage
  if (query.usage) {
    const usageStr = String(query.usage).trim();
    if (usageStr) {
      filtered = filtered.filter((p) => p.usage === usageStr);
    }
  }

  // Filter by status
  if (query.status) {
    const statusStr = String(query.status).trim();
    if (statusStr) {
      filtered = filtered.filter((p) => p.status === statusStr);
    }
  }

  // Search by plot number, block, or normalized text
  if (query.search) {
    const s = normalizeArabic(String(query.search).trim()).toLowerCase();
    filtered = filtered.filter((p) => {
      const plotMatch = String(p.plotNo).includes(s);
      const blockMatch = `بلك ${p.block}`.includes(s) || String(p.block) === s;
      const zoneMatch = normalizeArabic(p.zone).toLowerCase().includes(s);
      const usageMatch = normalizeArabic(p.usage).toLowerCase().includes(s);

      // If admin, also allow search by buyerName and buyerPhone
      let buyerMatch = false;
      if (admin && 'buyerName' in p && p.buyerName) {
        buyerMatch = normalizeArabic(p.buyerName).toLowerCase().includes(s);
      }
      let phoneMatch = false;
      if (admin && 'buyerPhone' in p && p.buyerPhone) {
        phoneMatch = p.buyerPhone.includes(s);
      }

      return plotMatch || blockMatch || zoneMatch || usageMatch || buyerMatch || phoneMatch;
    });
  }

  // Sort
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

