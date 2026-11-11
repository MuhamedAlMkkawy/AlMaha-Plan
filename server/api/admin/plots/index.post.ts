import { defineEventHandler, readBody, createError } from 'h3';
import { requireAdmin } from '../../../utils/auth';
import { PlotsRepository } from '../../../services/plots/plots.repository';
import { PlotInputSchema } from '../../../../schemas/plot';

export default defineEventHandler(async (event) => {
  const admin = requireAdmin(event);
  const body = await readBody(event);

  const parseResult = PlotInputSchema.safeParse(body);
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'بيانات غير صالحة',
      data: parseResult.error.flatten(),
    });
  }

  const clientIp = event.node.req.socket.remoteAddress || '';
  try {
    const created = await PlotsRepository.createPlot(parseResult.data, admin.email, clientIp);
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

