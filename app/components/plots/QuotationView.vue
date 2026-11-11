<template>
  <div class="quotation-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800 print:border-none print:shadow-none print:rounded-none">
    <!-- Purple Header Bar (Exact match to Sheet1 reference #7030A0) -->
    <div class="bg-[#7030A0] text-white px-6 py-5 flex items-center justify-between border-b-4 border-[#532277] print:py-3 print:px-4">
      <div class="text-start">
        <div class="text-xs text-purple-200 font-medium">التاريخ:</div>
        <div class="text-sm font-bold tracking-wide">{{ formattedDate }}</div>
      </div>

      <div class="text-center">
        <h1 class="text-2xl sm:text-3xl font-black tracking-wider text-white">
          عــــرض ســـعــــر
        </h1>
        <div class="text-xs text-purple-200 mt-0.5">PRICE QUOTATION</div>
      </div>

      <div class="text-end flex items-center gap-2">
        <div class="text-start hidden sm:block">
          <div class="text-xs text-purple-200">المسوق الحصري</div>
          <div class="text-sm font-bold">{{ projectConfig.marketer }}</div>
        </div>
        <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20">
          <i class="pi pi-verified text-xl"></i>
        </div>
      </div>
    </div>

    <!-- Project & Parties Facts Banner -->
    <div class="bg-purple-50/70 border-b border-purple-100 px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-700 flex flex-wrap items-center justify-between gap-y-2">
      <div class="flex items-center gap-1.5">
        <span class="text-slate-500">المخطط:</span>
        <span class="text-[#7030A0] font-bold">{{ projectConfig.planNo }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-slate-500">المشروع:</span>
        <span class="text-slate-900 font-bold">{{ projectConfig.name }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-slate-500">البائع:</span>
        <span class="text-slate-900 font-bold">{{ projectConfig.seller }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-slate-500">المسوق:</span>
        <span class="text-[#7030A0] font-bold">{{ projectConfig.marketer }}</span>
      </div>
    </div>

    <!-- Buyer Details (if provided) -->
    <div v-if="buyerName || buyerPhone" class="bg-slate-50/80 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-700">
      <div class="flex items-center gap-2">
        <span class="text-slate-500 font-medium">اسم المشتري:</span>
        <span class="font-bold text-slate-900">{{ buyerName || 'السادة الكرام / العميل الموقر' }}</span>
      </div>
      <div v-if="buyerPhone" class="flex items-center gap-2">
        <span class="text-slate-500 font-medium">رقم الجوال:</span>
        <span class="font-bold text-slate-900 dir-ltr">{{ buyerPhone }}</span>
      </div>
    </div>

    <!-- Plots Items Table -->
    <div class="overflow-x-auto p-4 sm:p-6 print:p-2">
      <table class="w-full text-center border-collapse border border-slate-300 text-xs sm:text-sm">
        <thead>
          <tr class="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
            <th class="border border-slate-300 px-3 py-3 w-16">رقم البلك</th>
            <th class="border border-slate-300 px-3 py-3 w-16">رقم القطعة</th>
            <th class="border border-slate-300 px-3 py-3">المساحة (م²)</th>
            <th class="border border-slate-300 px-3 py-3">سعر بيع المتر</th>
            <th class="border border-slate-300 px-3 py-3">قيمة الأرض (ر.س)</th>
            <th class="border border-slate-300 px-3 py-3">السعي شامل الضريبة (ر.س)</th>
            <th class="border border-slate-300 px-3 py-3">ضريبة التصرفات (5%)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="(item, idx) in items" :key="idx" class="hover:bg-slate-50/60 transition-colors">
            <td class="border border-slate-300 px-3 py-2.5 font-bold text-slate-900">{{ item.block }}</td>
            <td class="border border-slate-300 px-3 py-2.5 font-bold text-[#7030A0] text-sm sm:text-base">{{ item.plotNo }}</td>
            <td class="border border-slate-300 px-3 py-2.5 font-medium">{{ formatCurrencyNumber(item.area) }}</td>
            <td class="border border-slate-300 px-3 py-2.5 font-medium">{{ formatCurrencyNumber(item.pricePerM2) }}</td>
            <td class="border border-slate-300 px-3 py-2.5 font-bold text-slate-900">{{ formatCurrencyNumber(item.landValue) }}</td>
            <td class="border border-slate-300 px-3 py-2.5 font-semibold text-slate-800">{{ formatCurrencyNumber(item.brokerage) }}</td>
            <td class="border border-slate-300 px-3 py-2.5 font-semibold text-slate-800">{{ formatCurrencyNumber(item.retTax) }}</td>
          </tr>
        </tbody>
        <!-- Table Total Row -->
        <tfoot>
          <tr class="bg-purple-100/60 font-bold text-slate-900 border-t-2 border-purple-300">
            <td colspan="2" class="border border-slate-300 px-3 py-3 text-center font-black text-sm">
              الإجمـــالــــــــي
            </td>
            <td class="border border-slate-300 px-3 py-3 text-center font-bold">
              {{ formatCurrencyNumber(summary.totalArea) }} م²
            </td>
            <td class="border border-slate-300 px-3 py-3 text-center text-slate-400">—</td>
            <td class="border border-slate-300 px-3 py-3 text-center font-black text-slate-900">
              {{ formatCurrencyNumber(summary.totalLandValue) }}
            </td>
            <td class="border border-slate-300 px-3 py-3 text-center font-black text-[#7030A0]">
              {{ formatCurrencyNumber(summary.totalBrokerage) }}
            </td>
            <td class="border border-slate-300 px-3 py-3 text-center font-black text-slate-900">
              {{ formatCurrencyNumber(summary.totalRetTax) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Financial Distribution & Checks Breakdown (Reference Sheet1 lines) -->
    <div class="px-4 sm:px-6 pb-6 print:px-2 print:pb-2">
      <div class="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 bg-slate-50/50">
        <!-- Check #1: Land Value -->
        <div class="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <div class="font-bold text-slate-900 text-sm sm:text-base">
                قيمة الأرض:
                <span class="text-[#7030A0] font-black ms-2">{{ formatCurrency(summary.totalLandValue) }}</span>
              </div>
              <div class="text-xs text-slate-600 mt-0.5">
                {{ projectConfig.texts.checkLand }}
              </div>
            </div>
          </div>
          <span class="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md self-start sm:self-center font-semibold">
            شيك مصدق
          </span>
        </div>

        <!-- Check #2: Brokerage -->
        <div class="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <div class="font-bold text-slate-900 text-sm sm:text-base">
                سعي البيع (شامل ضريبة 15%):
                <span class="text-[#7030A0] font-black ms-2">{{ formatCurrency(summary.totalBrokerage) }}</span>
              </div>
              <div class="text-xs text-slate-600 mt-0.5">
                {{ projectConfig.texts.checkBrokerage }}
              </div>
            </div>
          </div>
          <span class="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md self-start sm:self-center font-semibold">
            شيك مصدق
          </span>
        </div>

        <!-- RETT Tax Direct Payment -->
        <div class="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <div class="font-bold text-slate-900 text-sm sm:text-base">
                ضريبة التصرفات العقارية (5%):
                <span class="text-emerald-700 font-black ms-2">{{ formatCurrency(summary.totalRetTax) }}</span>
              </div>
              <div class="text-xs text-slate-600 mt-0.5">
                {{ projectConfig.texts.rettPayment }}
              </div>
            </div>
          </div>
          <span class="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md self-start sm:self-center font-semibold">
            سداد حكومي مباشر
          </span>
        </div>

        <!-- Grand Total Banner -->
        <div class="p-4 bg-gradient-to-r from-purple-900 to-[#7030A0] text-white flex items-center justify-between">
          <div class="text-sm sm:text-base font-bold">
            الإجمالي الشامل المطلوب سداده (أرض + سعي + ضريبة):
          </div>
          <div class="text-xl sm:text-2xl font-black tracking-tight">
            {{ formatCurrency(summary.grandTotal) }}
          </div>
        </div>
      </div>

      <!-- Legal Notes & Attachments -->
      <div class="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm space-y-2 text-slate-700">
        <div class="flex items-start gap-2">
          <i class="pi pi-file text-amber-700 mt-0.5 shrink-0"></i>
          <div>
            <strong class="text-amber-950 font-bold">المرفقات المطلوبة:</strong>
            {{ projectConfig.texts.attachments }}
          </div>
        </div>
        <div class="flex items-start gap-2">
          <i class="pi pi-clock text-amber-700 mt-0.5 shrink-0"></i>
          <div>
            <strong class="text-amber-950 font-bold">ملحوظة هامة:</strong>
            {{ projectConfig.texts.validityNote }}
          </div>
        </div>
      </div>

      <!-- Footer Stamp / Signature -->
      <div class="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>
          تاريخ الطباعة: {{ new Date().toLocaleString('ar-SA') }}
        </div>
        <div class="font-bold text-slate-700 text-sm">
          {{ projectConfig.marketer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { projectConfig } from '../../config/project';
import { calculateQuotationSummary } from '../../../lib/pricing';
import { formatCurrency, formatCurrencyNumber } from '../../../lib/format';

interface QuotationRowItem {
  block: number;
  plotNo: number;
  area: number;
  pricePerM2: number;
  landValue: number;
  brokerage: number;
  retTax: number;
}

const props = withDefaults(
  defineProps<{
    items: QuotationRowItem[];
    buyerName?: string;
    buyerPhone?: string;
    quotationDate?: string;
  }>(),
  {
    items: () => [],
    buyerName: '',
    buyerPhone: '',
    quotationDate: '',
  }
);

const formattedDate = computed(() => {
  if (props.quotationDate) return props.quotationDate;
  return new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const summary = computed(() => {
  return calculateQuotationSummary(props.items);
});
</script>

<style scoped>
@media print {
  .quotation-card {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>

