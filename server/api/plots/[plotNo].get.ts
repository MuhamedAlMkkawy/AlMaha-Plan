import { defineEventHandler, getRouterParam, createError } from 'h3';
import { PlotsRepository } from '../../services/plots/plots.repository';
import { PlotsMapper } from '../../services/plots/plots.mapper';
import { ContractsRepository } from '../../services/contracts/contracts.repository';
import { getLiveAuthSession } from '../../utils/auth';
import { userCan, userCanAny } from '../../../shared/access';

export default defineEventHandler(async (event) => {
  const plotNoParam = getRouterParam(event, 'plotNo');
  const plotNo = parseInt(plotNoParam || '', 10);

  if (!plotNo || isNaN(plotNo)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'رقم القطعة غير صالح',
    });
  }

  const plot = await PlotsRepository.getPlotByNumber(plotNo);
  if (!plot) {
    throw createError({
      statusCode: 404,
      statusMessage: `القطعة رقم ${plotNo} غير موجودة`,
    });
  }

  const session = await getLiveAuthSession(event);
  const isAdmin = session?.role === 'admin';

  if (
    session?.role === 'employee' &&
    !userCanAny(session, [
      'view_plots',
      'view_contracts',
      'edit_plots',
      'edit_contracts',
      'create_plots',
      'delete_plots',
    ])
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: 'غير مصرح - ليس لديك صلاحية استعراض هذه القطعة',
    });
  }

  const canSeePii =
    isAdmin ||
    userCan(session, 'view_contracts') ||
    userCan(session, 'edit_contracts');
  const canEditContract = isAdmin || userCan(session, 'edit_contracts');
  const canEditPlot = isAdmin || userCan(session, 'edit_plots');

  if (!canSeePii) {
    return {
      success: true,
      isAdmin,
      canEditContract: !!canEditContract,
      canEditPlot: !!canEditPlot,
      canSeePii: false,
      user: session,
      data: PlotsMapper.toPublic(plot),
    };
  }

  const contract = await ContractsRepository.getContract(plotNo, plot);

  return {
    success: true,
    isAdmin,
    canEditContract: !!canEditContract,
    canEditPlot: !!canEditPlot,
    canSeePii: true,
    user: session,
    data: {
      ...plot,
      buyerName: contract.buyerName || plot.buyerName || '',
      buyerId: contract.buyerId || plot.buyerId || '',
      buyerPhone: contract.buyerPhone || plot.buyerPhone || '',
      buyerBirthDate: contract.buyerBirthDate || '',
      contractNo: contract.contractNo || String(plot.plotNo),
      contractDate: contract.contractDate || plot.deedDate || '',
      contractNote: contract.contractNote || plot.notes || '',
      contractTerms: contract.contractTerms,
    },
  };
});
