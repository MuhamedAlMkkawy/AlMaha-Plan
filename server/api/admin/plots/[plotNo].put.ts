import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
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

  const body = await readBody(event);
  const clientIp = event.node.req.socket.remoteAddress || '';

  try {
    const updated = await PlotsRepository.updatePlot(plotNo, body, admin.email, clientIp);
    return {
      success: true,
      message: 'تم تحديث بيانات القطعة بنجاح',
      data: updated,
    };
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'حدث خطأ أثناء تحديث القطعة',
    });
  }
});

