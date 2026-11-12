
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
          :class="[
            'group relative inline-flex items-center justify-center gap-2.5',
            'overflow-hidden rounded-xl px-4 py-2.5',
            'border font-bold text-xs sm:text-sm',
            'shadow-sm transition-all duration-300 ease-out',
            'hover:-translate-y-0.5 hover:shadow-lg',
            'active:translate-y-0 active:scale-[0.97]',
            'focus:outline-none focus-visible:ring-4',
            copied
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100 hover:bg-emerald-100 hover:shadow-emerald-200/60 focus-visible:ring-emerald-400/20'
              : 'border-purple-200/80 bg-gradient-to-br from-white via-white to-purple-50/70 text-[#7030A0] hover:border-purple-300 hover:from-purple-50 hover:to-purple-100/80 hover:shadow-purple-200/50 focus-visible:ring-purple-400/20'
          ]"
          :title="copied ? 'تم النسخ!' : 'نسخ رابط العقد'"
        >
          <!-- Animated background shine -->
          <span
            class="absolute inset-0 -translate-x-full skew-x-[-20deg]
                  bg-gradient-to-r from-transparent via-white/70 to-transparent
                  transition-transform duration-700
                  group-hover:translate-x-full"
          ></span>

          <!-- Icon -->
          <span
            class="relative flex h-7 w-7 items-center justify-center rounded-lg
                  transition-all duration-300"
            :class="copied
              ? 'bg-emerald-100 text-emerald-600 scale-105'
              : 'bg-purple-100 text-[#7030A0] group-hover:rotate-[-8deg] group-hover:scale-110'"
          >
            <i
              :class="copied
                ? 'pi pi-check'
                : 'pi pi-copy'"
              class="text-xs transition-all duration-300"
            ></i>
          </span>

          <!-- Label -->
          <span class="relative tracking-wide whitespace-nowrap">
            {{ copied ? 'تم النسخ بنجاح' : 'نسخ الرابط' }}
          </span>

          <!-- Success indicator -->
          <span
            v-if="copied"
            class="relative h-1.5 w-1.5 rounded-full bg-emerald-500
                  shadow-[0_0_8px_rgba(16,185,129,0.7)]"
          ></span>

          <i
            v-else
            class="pi pi-arrow-up-left relative text-[10px] opacity-50
                  transition-all duration-300
                  group-hover:-translate-y-0.5 group-hover:translate-x-0.5
                  group-hover:opacity-100"
          ></i>
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

// Buyer information (all data shown to users)
const buyer = computed(() => {
  const p = plot.value;

  if (!p) {
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
  plot.value?.contractNo != null ? String(plot.value.contractNo) : ''
);

// Contract date
const contractDate = computed(() =>
  plot.value?.contractDate || ''
);

// Special note
const specialNote = computed(() =>
  plot.value?.contractNote || ''
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
