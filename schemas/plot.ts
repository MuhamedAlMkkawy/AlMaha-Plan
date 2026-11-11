import { z } from 'zod';

export const PlotUsageSchema = z.enum(['سكنى', 'تجارى', 'مرافق']);
export type PlotUsage = z.infer<typeof PlotUsageSchema>;

export const PlotStatusSchema = z.enum(['متاح للبيع', 'محجوز', 'مباع']);
export type PlotStatus = z.infer<typeof PlotStatusSchema>;

export const BrokerageStatusSchema = z.enum(['كامل السعي', 'لايوجد']);
export type BrokerageStatus = z.infer<typeof BrokerageStatusSchema>;

/**
 * PublicPlot: Safe for public / staff viewing without authentication.
 * Completely excludes PII (buyerName, buyerId, buyerPhone, deedNo, invoice, notes, deedsFolderUrl).
 */
export const PublicPlotSchema = z.object({
  zone: z.string().default('غير محدد'),
  block: z.number().int().positive(),
  plotNo: z.number().int().positive(),
  usage: z.string(),
  area: z.number().positive(),
  pricePerM2: z.number().nonnegative(),
  landValue: z.number().nonnegative(),
  brokerage: z.number().nonnegative(),
  brokerageStatus: z.string().default('كامل السعي'),
  status: z.string(),
  currentState: z.string().optional().default(''),
  retTax: z.number().nonnegative(),
  handoverStatus: z.string().optional().default(''),
  handoverDate: z.string().optional().default(''),
});

export type PublicPlot = z.infer<typeof PublicPlotSchema>;

/**
 * Full Plot: Accessible only by authenticated administrators.
 * Includes all sheet fields and admin metadata.
 */
export const PlotSchema = PublicPlotSchema.extend({
  availableFlag: z.string().optional().default(''),
  buyerName: z.string().optional().default(''),
  buyerId: z.string().optional().default(''),
  buyerPhone: z.string().optional().default(''),
  deedNo: z.string().optional().default(''),
  deedDate: z.string().optional().default(''),
  invoice: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  deedsFolderUrl: z.string().optional().default(''),
  rowNumber: z.number().int().positive().optional(),
  hash: z.string().optional(),
});

export type Plot = z.infer<typeof PlotSchema>;

/**
 * PlotInputSchema: For creating or updating plots from the admin form.
 * Note: Formula fields (landValue, brokerage, retTax) are omitted because they are calculated.
 */
export const PlotInputSchema = z.object({
  zone: z.string().default('غير محدد'),
  block: z.number().int().positive('رقم البلك مطلوب ويجب أن يكون رقماً صحيحاً موجباً'),
  plotNo: z.number().int().positive('رقم القطعة مطلوب ويجب أن يكون فريداً ورقم صحيح'),
  usage: z.string().min(1, 'نوع الاستخدام مطلوب'),
  area: z.number().positive('المساحة يجب أن تكون أكبر من صفر'),
  pricePerM2: z.number().nonnegative('سعر المتر يجب ألا يكون سالباً'),
  brokerageStatus: z.string().default('كامل السعي'),
  status: z.string().default('متاح للبيع'),
  buyerName: z.string().optional().default(''),
  buyerId: z.string().optional().default(''),
  buyerPhone: z.string().optional().default(''),
  deedNo: z.string().optional().default(''),
  deedDate: z.string().optional().default(''),
  invoice: z.string().optional().default(''),
  currentState: z.string().optional().default(''),
  handoverStatus: z.string().optional().default(''),
  handoverDate: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  expectedHash: z.string().optional(),
});

export type PlotInput = z.infer<typeof PlotInputSchema>;

/**
 * Helper to strip PII and return PublicPlot from a full Plot
 */
export function toPublicPlot(plot: Plot): PublicPlot {
  return {
    zone: plot.zone || 'غير محدد',
    block: plot.block,
    plotNo: plot.plotNo,
    usage: plot.usage,
    area: plot.area,
    pricePerM2: plot.pricePerM2,
    landValue: plot.landValue,
    brokerage: plot.brokerage,
    brokerageStatus: plot.brokerageStatus || 'كامل السعي',
    status: plot.status,
    currentState: plot.currentState || '',
    retTax: plot.retTax,
    handoverStatus: plot.handoverStatus || '',
    handoverDate: plot.handoverDate || '',
  };
}

