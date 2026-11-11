<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          بلوكات المخطط
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          استعراض جميع بلوكات مخطط المها ({{ blocks.length }} بلك معتمد) مع نسب وحالات المبيعات
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
      <div v-for="i in 12" :key="i" class="h-44 bg-slate-100 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Blocks Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <NuxtLink
        v-for="b in blocks"
        :key="b.block"
        :to="`/blocks/${b.block}`"
        class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-[#7030A0] hover:shadow-md transition-all group flex flex-col justify-between"
      >
        <div>
          <!-- Top Card Row -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center font-black text-base group-hover:scale-105 transition-transform">
                {{ b.block }}
              </div>
              <div>
                <h3 class="font-black text-slate-900 text-base group-hover:text-[#7030A0] transition-colors">
                  بلك رقم {{ b.block }}
                </h3>
                <span class="text-xs text-slate-500 font-medium">{{ b.totalPlots }} قطعة أرض</span>
              </div>
            </div>
            <span class="text-xs font-bold text-[#7030A0] bg-purple-50 px-2 py-0.5 rounded-full">
              {{ b.soldPercent }}% مباع
            </span>
          </div>

          <!-- Sales Status Counts -->
          <div class="grid grid-cols-3 gap-2 text-center text-xs py-2 my-2 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div class="font-bold text-emerald-700 text-sm">{{ b.availableCount }}</div>
              <div class="text-slate-400 text-2xs">متاح</div>
            </div>
            <div>
              <div class="font-bold text-amber-700 text-sm">{{ b.reservedCount }}</div>
              <div class="text-slate-400 text-2xs">محجوز</div>
            </div>
            <div>
              <div class="font-bold text-rose-700 text-sm">{{ b.soldCount }}</div>
              <div class="text-slate-400 text-2xs">مباع</div>
            </div>
          </div>
        </div>

        <!-- Mini Progress Bar -->
        <div class="mt-3">
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div
              :style="{ width: `${(b.soldCount / b.totalPlots) * 100}%` }"
              class="bg-rose-500 h-full"
              title="مباع"
            ></div>
            <div
              :style="{ width: `${(b.reservedCount / b.totalPlots) * 100}%` }"
              class="bg-amber-400 h-full"
              title="محجوز"
            ></div>
            <div
              :style="{ width: `${(b.availableCount / b.totalPlots) * 100}%` }"
              class="bg-emerald-500 h-full"
              title="متاح"
            ></div>
          </div>
          <div class="flex items-center justify-between text-2xs text-slate-400 mt-2">
            <span>المساحة: {{ formatCurrencyNumber(b.totalArea) }} م²</span>
            <span class="text-[#7030A0] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
              <span>عرض البلك</span>
              <i class="pi pi-arrow-left text-2xs"></i>
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '../../../lib/format';
import type { BlockSummary } from '../../shared/types/plot';

const { data: response, pending } = await useFetch<{ success: boolean; data: BlockSummary[] }>('/api/blocks');
const blocks = computed(() => response.value?.data || []);
</script>

