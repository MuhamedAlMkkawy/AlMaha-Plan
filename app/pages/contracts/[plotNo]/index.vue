
<template>
  <div class="space-y-6 w-full">

    <!-- Top action & navigation bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div class="flex items-center gap-3">

        <NuxtLink
          to="/plots"
          class="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
        >
          <i class="pi pi-arrow-right"></i>
          <span>العودة لجدول القطع</span>
        </NuxtLink>

        <div class="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
          <button
            @click="goToPlot(currentPlotNo - 1)"
            :disabled="currentPlotNo <= 1"
            class="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-700"
            title="العقد السابق"
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
            title="العقد التالي"
          >
            <i class="pi pi-chevron-left text-xs"></i>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">

        <button
          @click="handlePrint"
          class="px-4 py-2.5 rounded-xl bg-[#7030A0] hover:bg-[#532277] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
        >
          <i class="pi pi-print"></i>
          <span>طباعة / حفظ PDF</span>
        </button>

        <button
          @click="copyShareLink"
          class="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-colors"
          :title="copied ? 'تم النسخ!' : 'نسخ رابط العقد'"
        >
          <i
            :class="copied
              ? 'pi pi-check text-emerald-600'
              : 'pi pi-copy text-slate-500'"
          ></i>

          <span class="hidden sm:inline">
            {{ copied ? 'تم النسخ' : 'نسخ الرابط' }}
          </span>
        </button>

        <NuxtLink
          :to="`/plots/${currentPlotNo}`"
          class="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-colors"
        >
          <i class="pi pi-tag text-slate-500"></i>
          <span class="hidden sm:inline">عرض السعر</span>
        </NuxtLink>

        <!-- Admin: edit contract -->
        <NuxtLink
          v-if="isAdmin"
          :to="`/contracts/${currentPlotNo}/edit`"
          class="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2"
        >
          <i class="pi pi-file-edit"></i>
          <span class="hidden sm:inline">تعديل العقد</span>
        </NuxtLink>

        <!-- Admin: edit plot -->
        <NuxtLink
          v-if="isAdmin"
          :to="`/admin/plots/${currentPlotNo}/edit`"
          class="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2"
        >
          <i class="pi pi-pencil text-slate-500"></i>
          <span class="hidden sm:inline">تعديل القطعة</span>
        </NuxtLink>

      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="pending"
      class="bg-white rounded-2xl p-12 text-center text-slate-500 animate-pulse"
    >
      <i class="pi pi-spin pi-spinner text-3xl text-[#7030A0] mb-3"></i>

      <div class="font-bold">
        جاري تحميل العقد للقطعة {{ currentPlotNo }}...
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error || !plot"
      class="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-800"
    >
      <i class="pi pi-exclamation-triangle text-3xl mb-2"></i>

      <h3 class="font-bold text-lg mb-1">
        تعذر العثور على القطعة رقم {{ currentPlotNo }}
      </h3>

      <p class="text-xs sm:text-sm mb-4">
        يرجى التحقق من صحة رقم القطعة في الرابط
      </p>

      <NuxtLink
        to="/plots"
        class="px-4 py-2 bg-[#7030A0] text-white rounded-xl text-sm font-semibold"
      >
        العودة لجدول القطع
      </NuxtLink>
    </div>

    <!-- Contract -->
    <div v-else class="space-y-4">

      <p
        v-if="!isAdmin"
        class="text-xs text-slate-500 print:hidden"
      >
        بيانات المشتري لا تظهر إلا للمسؤولين، وستجد الحقول فارغة لتعبئتها يدويًا عند الطباعة.
      </p>

      <ContractSheet
        :plot="plot"
        :buyer="buyer"
        :contract-no="contractNo"
        :contract-date="contractDate"
        :special-note="specialNote"
        :terms="terms"
        :format="formatCurrencyNumber"
      />

    </div>
  </div>
</template>

<script setup lang="ts">

import { formatCurrencyNumber } from '../../../../lib/format';

import {
  defaultContractTerms,
  type ContractPlot,
} from '../../../../server/utils/contractTerms';

const route = useRoute();

// Current plot number
const currentPlotNo = computed(() =>
  Number.parseInt(route.params.plotNo as string, 10)
);

// Reactive API request
const {
  data: response,
  pending,
  error,
} = await useFetch<{
  success: boolean;
  data: ContractPlot;
  isAdmin: boolean;
}>(
  () => `/api/plots/${currentPlotNo.value}`,
  {
    watch: [currentPlotNo],
  }
);

// Plot information
const plot = computed(() => response.value?.data ?? null);

// Admin permission
const isAdmin = computed(() => !!response.value?.isAdmin);

// Buyer information (admin only)
const buyer = computed(() => {
  const p = plot.value;

  if (!p || !isAdmin.value) {
    return {
      name: '',
      id: '',
      birthDate: '',
      phone: '',
    };
  }

  return {
    name: p.buyerName || '',
    id: p.buyerId || '',
    birthDate: p.buyerBirthDate || '',
    phone: p.buyerPhone || '',
  };
});

// Contract number
const contractNo = computed(() =>
  isAdmin.value ? plot.value?.contractNo || '' : ''
);

// Contract date
const contractDate = computed(() =>
  isAdmin.value ? plot.value?.contractDate || '' : ''
);

// Special note
const specialNote = computed(() =>
  isAdmin.value ? plot.value?.contractNote || '' : ''
);

// Contract terms
const terms = computed(() =>
  plot.value?.contractTerms?.length
    ? plot.value.contractTerms
    : defaultContractTerms
);

// Navigate between plots
const goToPlot = async (num: number) => {
  if (num >= 1 && num <= 973) {
    await navigateTo(`/contracts/${num}`);
  }
};

// Print contract
const handlePrint = () => {
  window.print();
};

// Copy contract URL
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
