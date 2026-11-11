<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          صانع عروض الأسعار التفاعلي
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          إنشاء وتخصيص عرض سعر رسمي لعميل يضم من 1 إلى 10 قطع أراضي مع إمكانية تعديل سعر المتر لكل قطعة
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="handlePrint"
          :disabled="quotationItems.length === 0"
          class="px-4 py-2.5 rounded-xl bg-[#7030A0] hover:bg-[#532277] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 disabled:opacity-40 transition-all"
        >
          <i class="pi pi-print"></i>
          <span>طباعة / حفظ PDF</span>
        </button>

        <button
          @click="resetForm"
          class="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs"
        >
          إعادة ضبط
        </button>
      </div>
    </div>

    <!-- Builder Setup Form (Hidden on Print) -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 print:hidden">
      <h2 class="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
        <i class="pi pi-user-edit text-[#7030A0]"></i>
        <span>بيانات العميل والقطع المختارة</span>
      </h2>

      <!-- Buyer Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">اسم المشتري / العميل الموقر</label>
          <input
            v-model="buyerName"
            type="text"
            placeholder="مثال: شركة النخبة للاستثمار / محمد بن خالد"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7030A0] text-sm"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">رقم الجوال</label>
          <input
            v-model="buyerPhone"
            type="text"
            placeholder="مثال: 0501234567"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7030A0] text-sm dir-ltr text-end"
          />
        </div>
      </div>

      <!-- Search & Add Plots -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">
          إضافة قطعة إلى العرض (الحد الأقصى 10 قطع)
        </label>
        <div class="flex gap-2">
          <input
            v-model="plotSearchInput"
            @keyup.enter="addPlotByNumber"
            type="number"
            placeholder="أدخل رقم القطعة (1 - 973) واضغط إضافة..."
            class="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7030A0] text-sm"
          />
          <button
            @click="addPlotByNumber"
            class="px-5 py-2.5 bg-[#7030A0] text-white rounded-xl font-bold text-sm hover:bg-[#532277] transition-colors"
          >
            إضافة القطعة
          </button>
        </div>
        <p v-if="addError" class="text-xs text-rose-600 mt-1 font-semibold">{{ addError }}</p>
      </div>

      <!-- Selected Plots Table with Editable Price/M² -->
      <div v-if="selectedPlotsList.length > 0" class="overflow-x-auto">
        <table class="w-full text-center border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <th class="px-3 py-2.5">رقم القطعة</th>
              <th class="px-3 py-2.5">البلك</th>
              <th class="px-3 py-2.5">المساحة (م²)</th>
              <th class="px-3 py-2.5 w-36">سعر المتر المخصص</th>
              <th class="px-3 py-2.5">قيمة الأرض</th>
              <th class="px-3 py-2.5">السعي (15% ضريبة)</th>
              <th class="px-3 py-2.5">التصرفات (5%)</th>
              <th class="px-3 py-2.5 w-12">حذف</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(p, idx) in selectedPlotsList" :key="p.plotNo">
              <td class="px-3 py-2.5 font-bold text-[#7030A0]">{{ p.plotNo }}</td>
              <td class="px-3 py-2.5 font-semibold text-slate-800">{{ p.block }}</td>
              <td class="px-3 py-2.5 font-medium">{{ p.area }}</td>
              <td class="px-3 py-2.5">
                <input
                  v-model.number="p.pricePerM2"
                  type="number"
                  step="10"
                  class="w-28 text-center py-1 px-2 rounded-lg border border-purple-200 bg-purple-50/50 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#7030A0]"
                />
              </td>
              <td class="px-3 py-2.5 font-bold text-slate-900">
                {{ formatCurrencyNumber(p.area * p.pricePerM2) }}
              </td>
              <td class="px-3 py-2.5 font-semibold text-slate-700">
                {{ formatCurrencyNumber(p.area * p.pricePerM2 * 0.025 * 1.15) }}
              </td>
              <td class="px-3 py-2.5 font-semibold text-slate-700">
                {{ formatCurrencyNumber(p.area * p.pricePerM2 * 0.05) }}
              </td>
              <td class="px-3 py-2.5">
                <button
                  @click="removePlot(idx)"
                  class="text-slate-400 hover:text-rose-600 p-1"
                  title="حذف"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Live Quotation Card Preview -->
    <div v-if="quotationItems.length > 0" class="space-y-4">
      <div class="flex items-center justify-between text-xs text-slate-500 font-semibold px-1 print:hidden">
        <span>معاينة حية لنموذج عرض السعر المعتمد (Sheet1):</span>
        <span class="text-[#7030A0]">جاهز للطباعة المباشرة على ورقة A4</span>
      </div>

      <PlotsQuotationView
        :items="quotationItems"
        :buyer-name="buyerName"
        :buyer-phone="buyerPhone"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
      <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-50 text-[#7030A0] flex items-center justify-center text-2xl">
        <i class="pi pi-file-edit"></i>
      </div>
      <h3 class="font-bold text-slate-900 text-lg mb-1">لم يتم إضافة أي قطع لعرض السعر حتى الآن</h3>
      <p class="text-xs sm:text-sm max-w-md mx-auto mb-4">
        أدخل رقم أي قطعة أعلاه، أو تصفح جدول القطع وحدد القطع المطلوبة ثم اضغط "عرض سعر"
      </p>
      <NuxtLink to="/plots" class="px-4 py-2 bg-[#7030A0] text-white rounded-xl text-sm font-semibold hover:bg-[#532277]">
        الذهاب لجدول القطع
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '../../../lib/format';
import type { PublicPlot } from '../../shared/types/plot';

const route = useRoute();

interface EditableQuotationPlot {
  plotNo: number;
  block: number;
  area: number;
  pricePerM2: number;
}

const buyerName = ref('');
const buyerPhone = ref('');
const plotSearchInput = ref<number | null>(null);
const addError = ref('');

const selectedPlotsList = ref<EditableQuotationPlot[]>([]);

// Preload all plots to allow quick lookup by plot number
const { data: allPlotsResponse } = await useFetch<{ success: boolean; data: PublicPlot[] }>('/api/plots');
const allPlots = computed(() => allPlotsResponse.value?.data || []);

// Check query param e.g. ?plots=1,2,3
onMounted(() => {
  const plotsQuery = route.query.plots as string;
  if (plotsQuery) {
    const ids = plotsQuery.split(',').map((id) => parseInt(id.trim(), 10)).filter(Boolean);
    for (const id of ids) {
      const match = allPlots.value.find((p) => p.plotNo === id);
      if (match && selectedPlotsList.value.length < 10) {
        selectedPlotsList.value.push({
          plotNo: match.plotNo,
          block: match.block,
          area: match.area,
          pricePerM2: match.pricePerM2,
        });
      }
    }
  }
});

const addPlotByNumber = () => {
  addError.value = '';
  if (!plotSearchInput.value) return;

  if (selectedPlotsList.value.length >= 10) {
    addError.value = 'الحد الأقصى لعدد القطع في عرض السعر الواحد هو 10 قطع';
    return;
  }

  if (selectedPlotsList.value.some((p) => p.plotNo === plotSearchInput.value)) {
    addError.value = `القطعة رقم ${plotSearchInput.value} مضافة مسبقاً في العرض`;
    return;
  }

  const match = allPlots.value.find((p) => p.plotNo === plotSearchInput.value);
  if (!match) {
    addError.value = `تعذر العثور على القطعة رقم ${plotSearchInput.value}`;
    return;
  }

  selectedPlotsList.value.push({
    plotNo: match.plotNo,
    block: match.block,
    area: match.area,
    pricePerM2: match.pricePerM2,
  });

  plotSearchInput.value = null;
};

const removePlot = (index: number) => {
  selectedPlotsList.value.splice(index, 1);
};

const resetForm = () => {
  buyerName.value = '';
  buyerPhone.value = '';
  selectedPlotsList.value = [];
  addError.value = '';
};

const quotationItems = computed(() => {
  return selectedPlotsList.value.map((p) => {
    const landValue = Math.round(p.area * p.pricePerM2 * 100) / 100;
    const brokerage = Math.round(landValue * 0.025 * 1.15 * 100) / 100;
    const retTax = Math.round(landValue * 0.05 * 100) / 100;
    return {
      block: p.block,
      plotNo: p.plotNo,
      area: p.area,
      pricePerM2: p.pricePerM2,
      landValue,
      brokerage,
      retTax,
    };
  });
});

const handlePrint = () => {
  window.print();
};
</script>

