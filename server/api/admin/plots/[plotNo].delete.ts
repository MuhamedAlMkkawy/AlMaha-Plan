import { defineEventHandler, getRouterParam, createError } from 'h3';
import { requirePermission } from '../../../utils/auth';
import { PlotsRepository } from '../../../services/plots/plots.repository';

export default defineEventHandler(async (event) => {
  const user = await requirePermission(event, 'delete_plots');
  const plotNoParam = getRouterParam(event, 'plotNo');
  const plotNo = parseInt(plotNoParam || '', 10);

  if (!plotNo || isNaN(plotNo)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'رقم القطعة غير صالح',
    });
  }

  const clientIp = event.node.req.socket.remoteAddress || '';
  const actorEmail = user.name ? `${user.name} (${user.email})` : user.email;

  try {
    const archived = await PlotsRepository.archivePlot(plotNo, actorEmail, clientIp);
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
