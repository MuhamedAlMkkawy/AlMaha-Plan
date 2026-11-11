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
    <div v-if="pending" class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="i in 2" :key="i" class="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Summary KPIs -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-500">عدد الزونات</span>
            <span class="w-8 h-8 rounded-lg bg-purple-50 text-[#7030A0] flex items-center justify-center">
              <i class="pi pi-map text-sm"></i>
            </span>
          </div>
          <div class="text-2xl font-black text-slate-900">{{ formatInteger(zones.length) }}</div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-500">إجمالي القطع</span>
            <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <i class="pi pi-map-marker text-sm"></i>
            </span>
          </div>
          <div class="text-2xl font-black text-slate-900">{{ formatInteger(totals.plots) }}</div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-500">إجمالي المساحة (م²)</span>
            <span class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <i class="pi pi-compass text-sm"></i>
            </span>
          </div>
          <div class="text-2xl font-black text-slate-900">{{ formatCurrencyNumber(totals.area) }}</div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-500">نسبة المتاح</span>
            <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <i class="pi pi-check-circle text-sm"></i>
            </span>
          </div>
          <div class="text-2xl font-black text-slate-900">{{ formatPercent(pct(totals.available, totals.plots)) }}</div>
        </div>
      </div>

      <!-- Charts -->
      <div v-if="zones.length" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <h3 class="text-base font-bold text-slate-900">حالة القطع في كل زون</h3>
          <p class="text-xs text-slate-500 mt-0.5 mb-4">عدد القطع — اضغط على أي عمود لعرض قطع الزون</p>
          <div class="h-72"><canvas ref="statusCanvas"></canvas></div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <h3 class="text-base font-bold text-slate-900">توزيع المساحة على الزونات</h3>
          <p class="text-xs text-slate-500 mt-0.5 mb-4">النسبة من إجمالي مساحة المخطط</p>
          <div class="relative h-72">
            <canvas ref="areaCanvas"></canvas>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span class="text-2xl font-black text-slate-900 leading-none">{{ formatCurrencyNumber(totals.area) }}</span>
              <span class="text-xs text-slate-500 font-medium mt-1">م²</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Zone cards -->
      <div>
        <h2 class="text-base font-bold text-slate-900 mb-3">تفاصيل الزونات</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="(z, i) in zones"
            :key="z.zone"
            :to="`/plots?zone=${encodeURIComponent(z.zone)}`"
            class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-[#7030A0] hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">

                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="w-12 h-12 shrink-0 text-center rounded-xl flex items-center justify-center font-black shadow-xs transition-transform group-hover:scale-105"
                    :class="
                      !z.zone || z.zone === 'غير محدد'
                        ? 'bg-slate-100 text-slate-500 text-xs border border-slate-200'
                        : 'text-white text-xl text-center'
                    "
                    :style="
                      z.zone && z.zone !== 'غير محدد'
                        ? { backgroundColor: zoneColor(i) }
                        : {}
                    "
                  >
                    {{ z.zone || 'غير محدد' }}
                  </div>

                  <div class="min-w-0">
                    <h3
                      class="font-black text-lg transition-colors"
                      :class="
                        !z.zone || z.zone === 'غير محدد'
                          ? 'text-slate-600'
                          : 'text-slate-900 group-hover:text-[#7030A0]'
                      "
                    >
                      {{ z.zone === 'غير محدد' || !z.zone ? 'غير محدد' : `زون ${z.zone}` }}
                    </h3>

                    <span class="text-xs text-slate-500 font-medium">
                      {{ formatInteger(z.totalPlots) }} قطعة أرض
                    </span>
                  </div>
                </div>

                </div>
                <i class="pi pi-arrow-left text-slate-300 group-hover:text-[#7030A0] group-hover:-translate-x-1 transition-all"></i>
              </div>

              <!-- Stacked status bar -->
              <div class="flex h-2.5 rounded-full overflow-hidden bg-slate-100 mb-3">
                <div class="h-full bg-emerald-500" :style="{ width: pct(z.availableCount, z.totalPlots) + '%' }"></div>
                <div class="h-full bg-amber-500" :style="{ width: pct(z.reservedCount, z.totalPlots) + '%' }"></div>
                <div class="h-full bg-rose-500" :style="{ width: pct(z.soldCount, z.totalPlots) + '%' }"></div>
              </div>

              <div class="grid grid-cols-3 gap-2 text-center text-xs py-2.5 my-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div class="font-bold text-emerald-700 text-base">{{ z.availableCount }}</div>
                  <div class="text-slate-400 text-[11px]">متاح · {{ formatPercent(pct(z.availableCount, z.totalPlots)) }}</div>
                </div>
                <div>
                  <div class="font-bold text-amber-700 text-base">{{ z.reservedCount }}</div>
                  <div class="text-slate-400 text-[11px]">محجوز · {{ formatPercent(pct(z.reservedCount, z.totalPlots)) }}</div>
                </div>
                <div>
                  <div class="font-bold text-rose-700 text-base">{{ z.soldCount }}</div>
                  <div class="text-slate-400 text-[11px]">مباع · {{ formatPercent(pct(z.soldCount, z.totalPlots)) }}</div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chart as ChartType } from 'chart.js';
import { formatCurrencyNumber, formatInteger, formatPercent } from '../../../lib/format';
import type { ZoneSummary } from '../../shared/types/plot';

const { data: response, pending } = await useFetch<{ success: boolean; data: ZoneSummary[] }>('/api/zones');
const zones = computed(() => response.value?.data || []);

/* ---------- Helpers ---------- */
const STATUS_DEFS = [
  { key: 'availableCount', label: 'متاح للبيع', color: '#10b981' },
  { key: 'reservedCount', label: 'محجوز', color: '#f59e0b' },
  { key: 'soldCount', label: 'مباع', color: '#f43f5e' },
] as const;

const ZONE_COLORS = ['#7030A0', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#64748b'];
const zoneColor = (i: number) => ZONE_COLORS[i % ZONE_COLORS.length];

const pct = (part: number, total: number) => (total ? (Number(part) / Number(total)) * 100 : 0);

const totals = computed(() => {
  const z = zones.value;
  return {
    plots: z.reduce((s, x) => s + (Number(x.totalPlots) || 0), 0),
    area: z.reduce((s, x) => s + (Number(x.totalArea) || 0), 0),
    available: z.reduce((s, x) => s + (Number(x.availableCount) || 0), 0),
  };
});

/* ---------- Chart.js (client only) ---------- */
const statusCanvas = ref<HTMLCanvasElement | null>(null);
const areaCanvas = ref<HTMLCanvasElement | null>(null);
const mixCanvas = ref<HTMLCanvasElement | null>(null);

let charts: ChartType[] = [];
let ChartCtor: typeof ChartType | null = null;

const destroyCharts = () => {
  charts.forEach((c) => c.destroy());
  charts = [];
};

const baseOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { rtl: true, position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 8, font: { size: 12 } } },
    tooltip: { rtl: true, textDirection: 'rtl' as const, titleAlign: 'right' as const, bodyAlign: 'right' as const },
  },
});

const goToZone = (index: number) => {
  const z = zones.value[index];
  if (z) navigateTo(`/plots?zone=${encodeURIComponent(z.zone)}`);
};

const pointer = (e: any, els: any[]) => {
  const t = e.native?.target as HTMLElement | undefined;
  if (t) t.style.cursor = els.length ? 'pointer' : 'default';
};

const buildCharts = async () => {
  if (!import.meta.client || !zones.value.length) return;
  await nextTick();

  if (!ChartCtor) {
    const mod = await import('chart.js/auto');
    ChartCtor = mod.Chart as unknown as typeof ChartType;
    ChartCtor.defaults.font.family = 'inherit';
    ChartCtor.defaults.color = '#475569';
  }
  destroyCharts();

  const labels = zones.value.map((z) => `زون ${z.zone}`);

  // 1) Plots by status per zone (stacked columns)
  if (statusCanvas.value) {
    charts.push(
      new ChartCtor!(statusCanvas.value, {
        type: 'bar',
        data: {
          labels,
          datasets: STATUS_DEFS.map((s) => ({
            label: s.label,
            data: zones.value.map((z) => Number(z[s.key]) || 0),
            backgroundColor: s.color,
            borderRadius: 6,
            borderSkipped: false,
          })),
        },
        options: {
          ...baseOptions(),
          onClick: (_e, els) => els.length && goToZone(els[0].index),
          onHover: pointer,
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
          },
          plugins: {
            ...baseOptions().plugins,
            tooltip: {
              ...baseOptions().plugins.tooltip,
              callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatInteger(ctx.parsed.y as number)} قطعة` },
            },
          },
        },
      })
    );
  }

  // 2) Area share per zone (doughnut)
  if (areaCanvas.value) {
    charts.push(
      new ChartCtor!(areaCanvas.value, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: zones.value.map((z) => Number(z.totalArea) || 0),
            backgroundColor: zones.value.map((_, i) => zoneColor(i)),
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverOffset: 8,
          }],
        },
        options: {
          ...baseOptions(),
          cutout: '62%',
          onClick: (_e, els) => els.length && goToZone(els[0].index),
          onHover: pointer,
          plugins: {
            ...baseOptions().plugins,
            tooltip: {
              ...baseOptions().plugins.tooltip,
              callbacks: {
                label: (ctx) => {
                  const v = ctx.parsed as number;
                  return ` ${formatCurrencyNumber(v)} م² (${formatPercent(pct(v, totals.value.area))})`;
                },
              },
            },
          },
        },
      })
    );
  }

  // 3) Status mix per zone (100% horizontal stacked)
  if (mixCanvas.value) {
    charts.push(
      new ChartCtor!(mixCanvas.value, {
        type: 'bar',
        data: {
          labels,
          datasets: STATUS_DEFS.map((s) => ({
            label: s.label,
            data: zones.value.map((z) => pct(Number(z[s.key]) || 0, Number(z.totalPlots) || 0)),
            backgroundColor: s.color,
            borderRadius: 6,
            borderSkipped: false,
          })),
        },
        options: {
          ...baseOptions(),
          indexAxis: 'y',
          onClick: (_e, els) => els.length && goToZone(els[0].index),
          onHover: pointer,
          scales: {
            x: { stacked: true, min: 0, max: 100, ticks: { callback: (v) => `${v}%` } },
            y: { stacked: true, grid: { display: false } },
          },
          plugins: {
            ...baseOptions().plugins,
            tooltip: {
              ...baseOptions().plugins.tooltip,
              callbacks: {
                label: (ctx) => {
                  const z = zones.value[ctx.dataIndex];
                  const key = STATUS_DEFS[ctx.datasetIndex].key;
                  return ` ${ctx.dataset.label}: ${formatInteger(Number(z[key]) || 0)} قطعة (${formatPercent(ctx.parsed.x as number)})`;
                },
              },
            },
          },
        },
      })
    );
  }
};

onMounted(buildCharts);
watch(zones, buildCharts);
onBeforeUnmount(destroyCharts);
</script>