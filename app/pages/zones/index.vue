<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          زونات المخطط
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          توزيع قطع مخطط المها على الزونات الرئيسية (A1, A2, B1, B2)
        </p>
      </div>

      <NuxtLink
        to="/plots"
        class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 shadow-xs flex items-center gap-2 self-start"
      >
        <i class="pi pi-th-large text-[#7030A0]"></i>
        <span>عرض جدول القطع الشامل</span>
      </NuxtLink>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Zones Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="z in zones"
        :key="z.zone"
        :to="`/plots?zone=${encodeURIComponent(z.zone)}`"
        class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-[#7030A0] hover:shadow-md transition-all group flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7030A0] to-[#532277] text-white flex items-center justify-center font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
                {{ z.zone }}
              </div>
              <div>
                <h3 class="font-black text-slate-900 text-lg group-hover:text-[#7030A0] transition-colors">
                  زون {{ z.zone }}
                </h3>
                <span class="text-xs text-slate-500 font-medium">{{ z.totalPlots }} قطعة أرض</span>
              </div>
            </div>
            <i class="pi pi-arrow-left text-slate-300 group-hover:text-[#7030A0] group-hover:-translate-x-1 transition-all"></i>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center text-xs py-2.5 my-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div class="font-bold text-emerald-700 text-base">{{ z.availableCount }}</div>
              <div class="text-slate-400 text-2xs">متاح</div>
            </div>
            <div>
              <div class="font-bold text-amber-700 text-base">{{ z.reservedCount }}</div>
              <div class="text-slate-400 text-2xs">محجوز</div>
            </div>
            <div>
              <div class="font-bold text-rose-700 text-base">{{ z.soldCount }}</div>
              <div class="text-slate-400 text-2xs">مباع</div>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>المساحة: <strong class="text-slate-800">{{ formatCurrencyNumber(z.totalArea) }} م²</strong></div>
          <div class="text-[#7030A0] font-bold">استعراض القطع ←</div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '../../../lib/format';
import type { ZoneSummary } from '../../shared/types/plot';

const { data: response, pending } = await useFetch<{ success: boolean; data: ZoneSummary[] }>('/api/zones');
const zones = computed(() => response.value?.data || []);
</script>

