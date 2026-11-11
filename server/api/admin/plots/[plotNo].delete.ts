import { defineEventHandler, getRouterParam, createError } from 'h3';
import { requireAdmin } from '../../../utils/auth';
import { PlotsRepository } from '../../../services/plots/plots.repository';

export default defineEventHandler(async (event) => {
  const admin = requireAdmin(event);
  const plotNoParam = getRouterParam(event, 'plotNo');
  const plotNo = parseInt(plotNoParam || '', 10);

  if (!plotNo || isNaN(plotNo)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'رقم القطعة غير صالح',
    });
  }

  const clientIp = event.node.req.socket.remoteAddress || '';
  try {
    const archived = await PlotsRepository.archivePlot(plotNo, admin.email, clientIp);
    return {
      success: true,
      message: `تم أرشفة القطعة رقم ${plotNo} بنجاح`,
      data: archived,
    };
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'حدث خطأ أثناء أرشفة القطعة',
    });
  }
});

