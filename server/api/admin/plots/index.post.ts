import { defineEventHandler, readBody, createError } from 'h3';
import { requirePermission } from '../../../utils/auth';
import { PlotsRepository } from '../../../services/plots/plots.repository';
import { PlotInputSchema } from '../../../../schemas/plot';

export default defineEventHandler(async (event) => {
  const user = await requirePermission(event, 'create_plots');
  const body = await readBody(event);

  const parseResult = PlotInputSchema.safeParse(body);
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'بيانات غير صالحة',
      data: parseResult.error.flatten(),
    });
  }

  if (user.role === 'employee' && !user.permissions?.includes('edit_contracts')) {
    parseResult.data.buyerName = undefined;
    parseResult.data.buyerId = undefined;
    parseResult.data.buyerPhone = undefined;
    parseResult.data.deedNo = undefined;
    parseResult.data.deedDate = undefined;
    parseResult.data.invoice = undefined;
    parseResult.data.notes = undefined;
  }

  const clientIp = event.node.req.socket.remoteAddress || '';
  const actorEmail = user.name ? `${user.name} (${user.email})` : user.email;

  try {
    const created = await PlotsRepository.createPlot(parseResult.data, actorEmail, clientIp);
    return {
      success: true,
      message: 'تم إضافة القطعة بنجاح',
      data: created,
    };
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'حدث خطأ أثناء إضافة القطعة',
    });
  }
});
