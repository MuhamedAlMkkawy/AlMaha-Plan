import { defineEventHandler, getQuery, readBody, createError } from 'h3';
import { PlotsRepository } from '../services/plots/plots.repository';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const body = await readBody(event).catch(() => ({}));

  const secret = query.secret || body?.secret;
  const expectedSecret = process.env.REVALIDATE_SECRET || 'maha-revalidate-secret';

  if (secret !== expectedSecret) {
    throw createError({
      statusCode: 401,
      statusMessage: 'رمز المصادقة غير صحيح',
    });
  }

  PlotsRepository.invalidateCache();
  const refreshed = await PlotsRepository.getAllPlots(true);

  return {
    revalidated: true,
    totalPlots: refreshed.length,
    timestamp: new Date().toISOString(),
  };
});

