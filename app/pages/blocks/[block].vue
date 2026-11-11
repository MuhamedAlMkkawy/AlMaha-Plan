<template>
  <div class="space-y-6">
    <!-- Header with Back Link -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/blocks"
          class="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
        >
          <i class="pi pi-arrow-right"></i>
          <span>جميع البلوكات</span>
        </NuxtLink>

        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            قطع بلك رقم {{ blockNum }}
          </h1>
          <p class="text-xs text-slate-500">
            إجمالي {{ blockPlots.length }} قطعة في هذا البلك
          </p>
        </div>
      </div>

      <!-- Status Legend -->
      <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs shadow-xs">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span class="font-medium text-slate-700">متاح ({{ availableCount }})</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-amber-500"></span>
          <span class="font-medium text-slate-700">محجوز ({{ reservedCount }})</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-rose-500"></span>
          <span class="font-medium text-slate-700">مباع ({{ soldCount }})</span>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
      <div v-for="i in 18" :key="i" class="h-28 bg-slate-100 rounded-xl animate-pulse"></div>
    </div>

    <!-- Plots Visual Tile Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <NuxtLink
        v-for="plot in blockPlots"
        :key="plot.plotNo"
        :to="`/plots/${plot.plotNo}`"
        :class="[
          'rounded-2xl p-4 border transition-all text-center flex flex-col justify-between hover:shadow-md hover:scale-102 group relative overflow-hidden',
          getTileClasses(plot.status)
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 shadow-2xs">
            {{ plot.usage }}
          </span>
          <span :class="['w-2 h-2 rounded-full', getDotClass(plot.status)]"></span>
        </div>

        <div class="my-2">
          <div class="text-xs text-slate-500 font-medium">قطعة رقم</div>
          <div class="text-2xl font-black text-slate-900 group-hover:text-[#7030A0] transition-colors">
            {{ plot.plotNo }}
          </div>
        </div>

        <div class="pt-2 border-t border-slate-200/60 text-2xs space-y-0.5 text-slate-600">
          <div>المساحة: <strong class="text-slate-800">{{ plot.area }} م²</strong></div>
          <div>سعر المتر: <strong class="text-slate-800">{{ plot.pricePerM2 }}</strong></div>
          <div class="font-bold text-[#7030A0] pt-1">عرض السعر ←</div>
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

const getTileClasses = (status: string) => {
  if (status.includes('مباع')) return 'bg-rose-50/70 border-rose-200 hover:border-rose-400';
  if (status.includes('محجوز')) return 'bg-amber-50/70 border-amber-200 hover:border-amber-400';
  return 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400';
};

const getDotClass = (status: string) => {
  if (status.includes('مباع')) return 'bg-rose-500';
  if (status.includes('محجوز')) return 'bg-amber-500';
  return 'bg-emerald-500';
};
</script>

