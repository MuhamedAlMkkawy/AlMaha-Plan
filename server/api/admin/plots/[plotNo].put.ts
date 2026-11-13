import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { requirePermission } from '../../../utils/auth';
import { PlotsRepository } from '../../../services/plots/plots.repository';

export default defineEventHandler(async (event) => {
  const user = await requirePermission(event, 'edit_plots');
  const plotNoParam = getRouterParam(event, 'plotNo');
  const plotNo = parseInt(plotNoParam || '', 10);

  if (!plotNo || isNaN(plotNo)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'رقم القطعة غير صالح',
    });
  }

  const body = await readBody(event);

  if (user.role === 'employee' && !user.permissions?.includes('edit_contracts')) {
    delete body.buyerName;
    delete body.buyerId;
    delete body.buyerPhone;
    delete body.deedNo;
    delete body.deedDate;
    delete body.invoice;
    delete body.notes;
  }
  const clientIp = event.node.req.socket.remoteAddress || '';
  const actorEmail = user.name ? `${user.name} (${user.email})` : user.email;

  try {
    const updated = await PlotsRepository.updatePlot(plotNo, body, actorEmail, clientIp);
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
