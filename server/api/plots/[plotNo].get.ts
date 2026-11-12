import { defineEventHandler, getRouterParam, createError } from 'h3';
import { PlotsRepository } from '../../services/plots/plots.repository';
import { ContractsRepository } from '../../services/contracts/contracts.repository';
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

  const plot = await PlotsRepository.getPlotByNumber(plotNo);
  if (!plot) {
    throw createError({
      statusCode: 404,
      statusMessage: `القطعة رقم ${plotNo} غير موجودة`,
    });
  }

  const admin = getAdminSession(event);
  const isAdmin = !!admin;

  // Retrieve contract data (which merges custom contract metadata with plot values)
  const contract = await ContractsRepository.getContract(plotNo, plot);

  return {
    success: true,
    isAdmin,
    data: {
      ...plot,
      // Ensure all contract & buyer fields are provided for the contract sheet view
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
