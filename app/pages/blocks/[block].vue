<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="pb-6 border-b border-slate-200 space-y-6">
      <NuxtLink
        to="/blocks"
        class="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#7030A0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40 rounded-lg"
      >
        <i class="pi pi-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300 motion-reduce:transition-none"></i>
        <span>جميع البلوكات</span>
      </NuxtLink>

      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div class="flex items-center gap-5">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#7030A0] text-white flex items-center justify-center shrink-0">
            <span class="text-3xl sm:text-4xl font-black">{{ blockNum }}</span>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-[#7030A0]">مخطط المها</div>
            <h1 class="mt-1 text-2xl sm:text-4xl font-black text-slate-900">
              قطع بلك رقم {{ blockNum }}
            </h1>
            <p class="text-base text-slate-500 mt-1.5">
              إجمالي <span class="font-bold text-slate-800">{{ blockPlots.length }}</span> قطعة في هذا البلك
            </p>
          </div>
        </div>

        <!-- Status filter -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="f in filters"
            :key="f.key"
            type="button"
            class="inline-flex items-center gap-2 h-11 px-4 rounded-full border text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40 focus-visible:ring-offset-2"
            :class="activeFilter === f.key
              ? 'bg-[#7030A0] border-[#7030A0] text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:border-[#7030A0]/40 hover:text-[#7030A0]'"
            :aria-pressed="activeFilter === f.key"
            @click="activeFilter = f.key"
          >
            <span v-if="f.dot" class="w-2.5 h-2.5 rounded-full" :class="f.dot"></span>
            <span>{{ f.label }}</span>
            <span
              class="min-w-6 px-1.5 py-0.5 rounded-full text-xs leading-none text-center font-bold"
              :class="activeFilter === f.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'"
            >{{ f.count }}</span>
          </button>
        </div>
      </div>

      <!-- Distribution bar -->
      <div v-if="blockPlots.length" class="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex gap-px">
        <div :style="{ width: pct(soldCount) }" class="bg-rose-500 h-full transition-all duration-700" title="مباع"></div>
        <div :style="{ width: pct(reservedCount) }" class="bg-amber-400 h-full transition-all duration-700" title="محجوز"></div>
        <div :style="{ width: pct(availableCount) }" class="bg-emerald-500 h-full transition-all duration-700" title="متاح"></div>
      </div>
    </header>

    <!-- Loading skeleton -->
    <div v-if="pending" class="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      <div v-for="i in 12" :key="i" class="h-60 rounded-2xl bg-slate-100 animate-pulse"></div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!visiblePlots.length"
      class="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center"
    >
      <div class="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
        <i class="pi pi-inbox text-xl"></i>
      </div>
      <p class="mt-4 text-base font-bold text-slate-800">لا توجد قطع مطابقة</p>
      <p class="mt-1 text-sm text-slate-500">جرّب اختيار حالة أخرى من الأعلى</p>
    </div>

    <!-- Plots grid -->
    <div v-else class="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      <NuxtLink
        v-for="plot in visiblePlots"
        :key="plot.plotNo"
        :to="`/plots/${plot.plotNo}`"
        class="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7030A0]/40 hover:shadow-[0_16px_32px_-18px_rgba(76,29,115,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/50 focus-visible:ring-offset-2"
      >
        <!-- Status edge -->
        <span class="h-1.5 w-full" :class="tone(plot.status).bar"></span>

        <div class="flex flex-col flex-1 p-5">
          <!-- Usage + status -->
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-medium text-slate-600 truncate">{{ plot.usage }}</span>
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-bold shrink-0"
              :class="[tone(plot.status).text, tone(plot.status).soft]"
            >
              <span class="w-2 h-2 rounded-full" :class="tone(plot.status).dot"></span>
              {{ tone(plot.status).label }}
            </span>
          </div>

          <!-- Plot number -->
          <div class="mt-5 mb-6">
            <div class="text-sm text-slate-500 font-medium">قطعة رقم</div>
            <div class="mt-1 text-5xl font-black text-slate-900 leading-none transition-colors duration-300 group-hover:text-[#7030A0]">
              {{ plot.plotNo }}
            </div>
          </div>

          <!-- Details -->
          <dl class="mt-auto grid grid-cols-2 divide-x divide-x-reverse divide-slate-200 rounded-xl bg-slate-50 py-3">
            <div class="px-4">
              <dt class="text-sm text-slate-500">المساحة</dt>
              <dd class="mt-0.5 text-base font-bold text-slate-900">{{ plot.area }} م²</dd>
            </div>
            <div class="px-4">
              <dt class="text-sm text-slate-500">سعر المتر</dt>
              <dd class="mt-0.5 text-base font-bold text-slate-900">{{ plot.pricePerM2 }}</dd>
            </div>
          </dl>

          <!-- Action -->
          <div class="mt-4 flex items-center justify-between text-base font-bold text-[#7030A0]">
            <span>عرض السعر</span>
            <i class="pi pi-arrow-left text-sm group-hover:-translate-x-1 transition-transform duration-300 motion-reduce:transition-none"></i>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PublicPlot } from '../../shared/types/plot';

const route = useRoute();
const blockNum = computed(() => parseInt(route.params.block as string, 10));

const { data: response, pending } = await useFetch<{ success: boolean; data: PublicPlot[] }>(
  `/api/plots?block=${blockNum.value}`
);

const blockPlots = computed(() => response.value?.data || []);

const availableCount = computed(() => blockPlots.value.filter((p) => p.status === 'متاح للبيع').length);
const reservedCount = computed(() => blockPlots.value.filter((p) => p.status === 'محجوز').length);
const soldCount = computed(() => blockPlots.value.filter((p) => p.status === 'مباع').length);

const pct = (n: number) => `${blockPlots.value.length ? (n / blockPlots.value.length) * 100 : 0}%`;

// ---------- Status styling ----------
const tone = (status: string) => {
  if (status.includes('مباع')) {
    return { key: 'sold', label: 'مباع', bar: 'bg-rose-500', dot: 'bg-rose-500', text: 'text-rose-700', soft: 'bg-rose-50' };
  }
  if (status.includes('محجوز')) {
    return { key: 'reserved', label: 'محجوز', bar: 'bg-amber-400', dot: 'bg-amber-500', text: 'text-amber-700', soft: 'bg-amber-50' };
  }
  return { key: 'available', label: 'متاح', bar: 'bg-emerald-500', dot: 'bg-emerald-500', text: 'text-emerald-700', soft: 'bg-emerald-50' };
};

// ---------- Filter ----------
type FilterKey = 'all' | 'available' | 'reserved' | 'sold';
const activeFilter = ref<FilterKey>('all');

const filters = computed(() => [
  { key: 'all' as FilterKey, label: 'الكل', count: blockPlots.value.length, dot: '' },
  { key: 'available' as FilterKey, label: 'متاح', count: availableCount.value, dot: 'bg-emerald-500' },
  { key: 'reserved' as FilterKey, label: 'محجوز', count: reservedCount.value, dot: 'bg-amber-400' },
  { key: 'sold' as FilterKey, label: 'مباع', count: soldCount.value, dot: 'bg-rose-500' },
]);

const visiblePlots = computed(() =>
  activeFilter.value === 'all'
    ? blockPlots.value
    : blockPlots.value.filter((p) => tone(p.status).key === activeFilter.value)
);
</script>