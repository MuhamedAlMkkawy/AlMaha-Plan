<template>
  <div class="space-y-6 mx-auto">
    <!-- Top Action & Navigation Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/plots"
          class="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
        >
          <i class="pi pi-arrow-right"></i>
          <span>العودة لجدول القطع</span>
        </NuxtLink>

        <!-- Previous / Next Plot Arrows -->
        <div class="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
          <button
            @click="goToPlot(currentPlotNo - 1)"
            :disabled="currentPlotNo <= 1"
            class="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-700"
            title="القطعة السابقة"
          >
            <i class="pi pi-chevron-right text-xs"></i>
          </button>
          <span class="text-xs font-bold text-slate-600 px-2">
            قطعة {{ currentPlotNo }}
          </span>
          <button
            @click="goToPlot(currentPlotNo + 1)"
            :disabled="currentPlotNo >= 973"
            class="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-700"
            title="القطعة التالية"
          >
            <i class="pi pi-chevron-left text-xs"></i>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Print / PDF Button -->
        <button
          @click="handlePrint"
          :disabled="printing"
          class="px-4 py-2.5 rounded-xl bg-[#126B58] hover:bg-[#174A40] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all disabled:opacity-60 disabled:pointer-events-none"
        >
          <i :class="printing ? 'pi pi-spin pi-spinner' : 'pi pi-print'"></i>
          <span>طباعة / حفظ PDF</span>
        </button>

        <!-- Copy Link Button -->
        <button
          @click="copyShareLink"
          class="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-colors"
          :title="copied ? 'تم النسخ!' : 'نسخ رابط عرض السعر'"
        >
          <i :class="copied ? 'pi pi-check text-emerald-600' : 'pi pi-copy text-slate-500'"></i>
          <span class="hidden sm:inline">{{ copied ? 'تم النسخ' : 'نسخ الرابط' }}</span>
        </button>

        <NuxtLink
          v-if="canSeePii"
          :to="`/contracts/${currentPlotNo}`"
          class="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2"
        >
          <i class="pi pi-file"></i>
          <span class="hidden sm:inline">العقد</span>
        </NuxtLink>

        <NuxtLink
          v-if="canEditPlot"
          :to="`/admin/plots/${currentPlotNo}/edit`"
          class="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2"
        >
          <i class="pi pi-pencil"></i>
          <span class="hidden sm:inline">تعديل القطعة</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="space-y-6 animate-fadeIn print:hidden" aria-busy="true">
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="space-y-2">
            <FeaturesAppSkeleton width="12rem" height="1.75rem" rounded="lg" />
            <FeaturesAppSkeleton width="8rem" height="1rem" rounded="md" />
          </div>
          <FeaturesAppSkeleton width="3rem" height="3rem" rounded="2xl" />
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="p-4 bg-slate-50/70 rounded-2xl space-y-2">
            <FeaturesAppSkeleton width="50%" height="0.875rem" rounded="md" />
            <FeaturesAppSkeleton width="75%" height="1.5rem" rounded="lg" />
          </div>
        </div>
        <FeaturesAppSkeleton width="100%" height="18rem" rounded="2xl" />
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error || !plot"
      class="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-800 print:hidden"
    >
      <i class="pi pi-exclamation-triangle text-3xl mb-2"></i>
      <h3 class="font-bold text-lg mb-1">تعذر العثور على القطعة رقم {{ currentPlotNo }}</h3>
      <p class="text-xs sm:text-sm mb-4">يرجى التحقق من صحة رقم القطعة في الرابط</p>
      <NuxtLink to="/plots" class="px-4 py-2 bg-[#126B58] text-white rounded-xl text-sm font-semibold">
        العودة لجدول القطع
      </NuxtLink>
    </div>

    <!-- Plot Content (everything inside .print-area is what gets printed / saved as PDF) -->
    <div v-else class="print-area space-y-6">
      <!-- 1. The Official Quotation Card (Sheet1 View) -->
      <div class="print-card">
        <PlotsQuotationView
          :items="quotationItems"
          :buyer-name="canSeePii ? plot.buyerName : ''"
          :buyer-phone="canSeePii ? plot.buyerPhone : ''"
        />
      </div>

      <!-- 2. Plot Facts Section (بيانات القطعة الإضافية) -->
      <div class="print-card bg-white rounded-2xl border border-slate-200 p-6 shadow-xs print:shadow-none space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <i class="pi pi-info-circle text-[#126B58]"></i>
            <span>بيانات ومعلومات القطعة</span>
          </h3>
          <PlotsStatusBadge :status="plot.status" />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-slate-500 text-xs mb-1">الزون</div>
            <div class="font-bold text-slate-900">{{ plot.zone }}</div>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-slate-500 text-xs mb-1">الاستخدام</div>
            <div class="font-bold text-slate-900">{{ plot.usage }}</div>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-slate-500 text-xs mb-1">حالة السعي</div>
            <div class="font-bold text-slate-900">{{ plot.brokerageStatus || 'كامل السعي' }}</div>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-slate-500 text-xs mb-1">الوضع الحالي</div>
            <div class="font-bold text-slate-900">{{ plot.currentState || '—' }}</div>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-slate-500 text-xs mb-1">حالة الإفراغ</div>
            <div class="font-bold text-slate-900">{{ plot.handoverStatus || '—' }}</div>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-slate-500 text-xs mb-1">تاريخ الإفراغ</div>
            <div class="font-bold text-slate-900">{{ plot.handoverDate || '—' }}</div>
          </div>

          <div class="col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-slate-500 text-xs mb-1">الملاحظات</div>
            <div class="font-medium text-slate-800">{{ plot.notes || 'لا توجد ملاحظات عامة' }}</div>
          </div>
        </div>
      </div>

      <!-- 3. Admin-Only Secure Panel (PII, Deed) — never printed -->
      <div
        v-if="canSeePii"
        class="bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl p-6 shadow-xs print:hidden space-y-4"
      >
        <div class="flex items-center justify-between border-b border-emerald-200 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-[#126B58] text-white flex items-center justify-center text-sm font-bold">
              <i class="pi pi-shield"></i>
            </div>
            <div>
              <h3 class="font-bold text-emerald-900 text-base">لوحة بيانات الإدارة الحصرية (سري)</h3>
              <p class="text-xs text-emerald-700">هذه البيانات مشفرة وتظهر فقط للمسؤولين المعتمدين</p>
            </div>
          </div>
          <NuxtLink
            v-if="canEditPlot"
            :to="`/admin/plots/${currentPlotNo}/edit`"
            class="px-3 py-1.5 rounded-lg bg-[#126B58] text-white text-xs font-bold hover:bg-[#174A40]"
          >
            تعديل السجل
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div class="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
            <div class="text-slate-500 text-xs mb-1">اسم المشتري</div>
            <div class="font-bold text-slate-900">{{ plot.buyerName || '—' }}</div>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
            <div class="text-slate-500 text-xs mb-1">الهوية / السجل التجاري</div>
            <div class="font-bold text-slate-900">{{ plot.buyerId || '—' }}</div>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
            <div class="text-slate-500 text-xs mb-1">رقم الجوال</div>
            <div class="font-bold text-slate-900 dir-ltr text-end">{{ plot.buyerPhone || '—' }}</div>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
            <div class="text-slate-500 text-xs mb-1">رقم صك القطعة</div>
            <div class="font-bold text-slate-900 tracking-wider">{{ plot.deedNo || '—' }}</div>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
            <div class="text-slate-500 text-xs mb-1">تاريخ الصك</div>
            <div class="font-bold text-slate-900">{{ plot.deedDate || '—' }}</div>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
            <div class="text-slate-500 text-xs mb-1">الفاتورة الضريبية</div>
            <div class="font-bold text-slate-900">{{ plot.invoice || '—' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plot } from '../../shared/types/plot';

const route = useRoute();
const currentPlotNo = computed(() => parseInt(route.params.plotNo as string, 10));

const { data: response, pending, error } = await useFetch<{
  success: boolean;
  data: Plot;
  isAdmin: boolean;
  canEditPlot?: boolean;
  canSeePii?: boolean;
}>(`/api/plots/${currentPlotNo.value}`);

const plot = computed(() => response.value?.data);
const isAdmin = computed(() => response.value?.isAdmin);
const canEditPlot = computed(() => !!response.value?.canEditPlot || !!response.value?.isAdmin);
const canSeePii = computed(() => !!response.value?.canSeePii || !!response.value?.isAdmin);

const quotationItems = computed(() => {
  if (!plot.value) return [];
  return [
    {
      block: plot.value.block,
      plotNo: plot.value.plotNo,
      area: plot.value.area,
      pricePerM2: plot.value.pricePerM2,
      landValue: plot.value.landValue,
      brokerage: plot.value.brokerage,
      retTax: plot.value.retTax,
    },
  ];
});

const goToPlot = (num: number) => {
  if (num >= 1 && num <= 973) {
    navigateTo(`/plots/${num}`);
  }
};

// Print / Save as PDF
const printing = ref(false);

const handlePrint = async () => {
  if (!import.meta.client || printing.value || !plot.value) return;

  printing.value = true;

  // The browser uses document.title as the suggested PDF file name.
  const previousTitle = document.title;
  document.title = `عرض سعر - قطعة ${currentPlotNo.value}`;

  const restore = () => {
    document.title = previousTitle;
    printing.value = false;
    window.removeEventListener('afterprint', restore);
  };

  window.addEventListener('afterprint', restore);

  try {
    // Make sure web fonts (Arabic) are loaded before the print snapshot.
    await (document as any).fonts?.ready;
  } catch {
    /* ignore */
  }

  await nextTick();

  // Small delay so the DOM/styles settle before the print dialog opens.
  setTimeout(() => {
    window.print();

    // Fallback for browsers that don't fire `afterprint` reliably.
    setTimeout(restore, 1500);
  }, 50);
};

const copied = ref(false);
const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy URL:', err);
  }
};
</script>

<!-- Not scoped on purpose: print styles must reach the layout and child components -->
<style>
@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }

  html,
  body {
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
    background: #fff !important;
  }

  /* Hide the whole app (sidebar, navbar, footer, etc.) ... */
  body * {
    visibility: hidden !important;
  }

  /* ... except the print area */
  .print-area,
  .print-area * {
    visibility: visible !important;
  }

  .print-area {
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Keep backgrounds, colors, borders exactly as on screen */
  .print-area,
  .print-area * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Don't split cards across pages */
  .print-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Avoid animations/transitions affecting the snapshot */
  .print-area * {
    animation: none !important;
    transition: none !important;
  }
}
</style>