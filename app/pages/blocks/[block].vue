<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="pb-6 border-b border-slate-200/70 space-y-5">
      <NuxtLink
        to="/blocks"
        class="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#7030A0] transition-colors"
      >
        <i class="pi pi-arrow-right text-[10px] group-hover:translate-x-1 transition-transform duration-300"></i>
        <span>جميع البلوكات</span>
      </NuxtLink>

      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div class="flex items-center gap-5">
          <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#7030A0] to-[#4c1d73] text-white flex items-center justify-center shadow-lg shadow-[#7030A0]/25">
            <span class="text-3xl sm:text-4xl font-black">{{ blockNum }}</span>
          </div>
          <div>
            <span class="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#7030A0]">
              <span class="w-6 h-px bg-[#7030A0]/50"></span>
              مخطط المها
            </span>
            <h1 class="mt-1.5 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              قطع بلك رقم {{ blockNum }}
            </h1>
            <p class="text-sm text-slate-500 mt-1.5">
              إجمالي <span class="font-semibold text-slate-700">{{ blockPlots.length }}</span> قطعة في هذا البلك
            </p>
          </div>
        </div>

        <!-- Status filter chips -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="f in filters"
            :key="f.key"
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-300"
            :class="activeFilter === f.key
              ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
            @click="activeFilter = f.key"
          >
            <span v-if="f.dot" class="w-2 h-2 rounded-full" :class="f.dot"></span>
            <span>{{ f.label }}</span>
            <span
              class="min-w-5 px-1.5 py-0.5 rounded-full text-[10px] leading-none text-center"
              :class="activeFilter === f.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'"
            >{{ f.count }}</span>
          </button>
        </div>
      </div>

      <!-- Distribution bar -->
      <div v-if="blockPlots.length" class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-px">
        <div :style="{ width: pct(soldCount) }" class="bg-rose-500/90 h-full rounded-full transition-all duration-700" title="مباع"></div>
        <div :style="{ width: pct(reservedCount) }" class="bg-amber-400 h-full rounded-full transition-all duration-700" title="محجوز"></div>
        <div :style="{ width: pct(availableCount) }" class="bg-emerald-500/90 h-full rounded-full transition-all duration-700" title="متاح"></div>
      </div>
    </header>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div v-for="i in 18" :key="i" class="h-44 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse"></div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!visiblePlots.length"
      class="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center"
    >
      <div class="mx-auto w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
        <i class="pi pi-inbox"></i>
      </div>
      <p class="mt-4 text-sm font-semibold text-slate-700">لا توجد قطع مطابقة</p>
      <p class="mt-1 text-xs text-slate-400">جرّب اختيار حالة أخرى من الأعلى</p>
    </div>

    <!-- Plots Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <NuxtLink
        v-for="plot in visiblePlots"
        :key="plot.plotNo"
        :to="`/plots/${plot.plotNo}`"
        class="group relative overflow-hidden flex flex-col justify-between rounded-3xl bg-white border border-slate-200/70 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:shadow-[0_18px_36px_-16px_rgba(15,23,42,0.22)] transition-all duration-300"
        :class="tone(plot.status).hoverBorder"
      >
        <!-- Status accent line -->
        <span class="absolute inset-x-0 top-0 h-1" :class="tone(plot.status).bar"></span>

        <!-- Top: usage + status -->
        <div class="flex items-center justify-between gap-2 pt-1">
          <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 truncate">
            {{ plot.usage }}
          </span>
          <span class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="tone(plot.status).text">
            <span class="w-1.5 h-1.5 rounded-full" :class="tone(plot.status).dot"></span>
            {{ tone(plot.status).label }}
          </span>
        </div>

        <!-- Plot number -->
        <div class="my-5 text-center">
          <div class="text-[11px] text-slate-400 font-medium">قطعة رقم</div>
          <div class="mt-1 text-4xl font-black text-slate-900 leading-none group-hover:text-[#7030A0] transition-colors duration-300">
            {{ plot.plotNo }}
          </div>
        </div>

        <!-- Details -->
        <div class="pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
          <div class="flex items-center justify-between text-slate-400">
            <span>المساحة</span>
            <span class="font-semibold text-slate-700">{{ plot.area }} م²</span>
          </div>
          <div class="flex items-center justify-between text-slate-400">
            <span>سعر المتر</span>
            <span class="font-semibold text-slate-700">{{ plot.pricePerM2 }}</span>
          </div>
          <div class="flex items-center justify-between pt-2 font-bold text-[#7030A0]">
            <span>عرض السعر</span>
            <i class="pi pi-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform duration-300"></i>
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
    return { key: 'sold', label: 'مباع', bar: 'bg-rose-500', dot: 'bg-rose-500', text: 'text-rose-600', hoverBorder: 'hover:border-rose-300' };
  }
  if (status.includes('محجوز')) {
    return { key: 'reserved', label: 'محجوز', bar: 'bg-amber-400', dot: 'bg-amber-400', text: 'text-amber-600', hoverBorder: 'hover:border-amber-300' };
  }
  return { key: 'available', label: 'متاح', bar: 'bg-emerald-500', dot: 'bg-emerald-500', text: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300' };
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