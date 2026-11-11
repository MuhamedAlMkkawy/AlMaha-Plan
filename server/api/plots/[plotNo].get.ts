import { defineEventHandler, getRouterParam, createError } from 'h3';
import { PlotsRepository } from '../../services/plots/plots.repository';
import { getAdminSession } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const plotNoParam = getRouterParam(event, 'plotNo');
  const plotNo = parseInt(plotNoParam || '', 10);

  if (!plotNo || isNaN(plotNo)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'رقم القطعة غير صالح',
    });
  }

  const admin = getAdminSession(event);
  const plot = admin
    ? await PlotsRepository.getPlotByNumber(plotNo)
    : await PlotsRepository.getPublicPlotByNumber(plotNo);

  if (!plot) {
    throw createError({
      statusCode: 404,
      statusMessage: `القطعة رقم ${plotNo} غير موجودة`,
    });
  }

  return {
    success: true,
    data: plot,
    isAdmin: !!admin,
  };
});

