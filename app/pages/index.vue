<template>
  <div class="space-y-8">
    <!-- Top Hero / Welcome Banner -->
    <div class="bg-gradient-to-r from-[#7030A0] to-[#532277] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
      <div class="absolute -left-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-purple-100 text-xs font-semibold mb-3">
            <i class="pi pi-check-circle text-xs"></i>
            <span>مخطط معتمد برقم {{ projectConfig.planNo }}</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
            {{ projectConfig.name }}
          </h1>
          <p class="text-sm sm:text-base max-w-2xl leading-relaxed text-purple-100">
            لوحة الإحصائيات والمتابعة الحية لمبيعات الأراضي السكنية والتجارية والمرافق. البيانات متصلة مباشرة بجدول Google Sheets الرسمي.
          </p>
        </div>

        <div class="flex flex-col sm:flex-wrap items-center gap-3">
          <NuxtLink
            to="/plots"
            class="group px-5 py-3 w-full rounded-xl bg-white text-[#7030A0] border border-purple-100 hover:bg-[#7030A0] hover:text-white hover:border-[#7030A0] hover:shadow-lg hover:border-white hover:-translate-y-0.5 font-bold text-sm shadow-md transition-all duration-300 ease-out flex items-center justify-center gap-2"
          >
            <i class="pi pi-th-large transition-transform duration-300 group-hover:scale-110"></i>
            <span>استعراض جدول القطع</span>
          </NuxtLink>

          <NuxtLink
            to="/quote"
            class="px-5 py-3 w-full rounded-xl bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold text-sm shadow-md transition-all justify-center flex items-center gap-2"
          >
            <i class="pi pi-file-edit"></i>
            <span>إنشاء عرض سعر</span>
          </NuxtLink>

          <button
            @click="refreshData"
            :disabled="refreshing"
            class="p-3 rounded-xl w-full text-center bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/20 flex justify-center items-center gap-2"
            title="تحديث البيانات"
          >
            <i :class="['pi pi-sync', refreshing ? 'pi-spin' : '']"></i>
            <span class="hidden sm:inline">تحديث</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending && !stats" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="h-32 bg-slate-200/70 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else-if="stats" class="space-y-8">
      <!-- 4 Primary Metrics (kept as KPI cards: single numbers read best as numbers) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <NuxtLink
          to="/plots"
          class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-[#7030A0] hover:shadow-md transition-all group"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-500">إجمالي القطع</span>
            <div class="w-10 h-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="pi pi-map-marker text-lg"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-slate-900 mb-1">{{ formatInteger(stats.totalPlots) }}</div>
          <div class="text-xs text-slate-500 font-medium">
            موزعة على {{ stats.blocksCount }} بلك • {{ stats.zonesCount }} زون
          </div>
        </NuxtLink>

        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-500">إجمالي المساحة</span>
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <i class="pi pi-compass text-lg"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-slate-900 mb-1">{{ formatCurrencyNumber(stats.totalArea) }}</div>
          <div class="text-xs text-slate-500 font-medium">متر مربع (م²) مساحة الأراضي</div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-500">القيمة الإجمالية</span>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <i class="pi pi-wallet text-lg"></i>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-slate-900 mb-1">{{ formatCurrencyNumber(stats.totalLandValue) }}</div>
          <div class="text-xs text-slate-500 font-medium">ريال سعودي (بدون الضريبة والسعي)</div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-500">متوسط سعر المتر</span>
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <i class="pi pi-chart-line text-lg"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-slate-900 mb-1">{{ formatCurrencyNumber(stats.averagePricePerM2) }}</div>
          <div class="text-xs text-slate-500 font-medium">ر.س / م² متوسط لكامل المخطط</div>
        </div>
      </div>

      <!-- Sales status: doughnut chart + clickable legend cards -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div class="mb-4">
          <h2 class="text-lg font-bold text-slate-900">حالة المبيعات</h2>
          <p class="text-xs text-slate-500 mt-0.5">اضغط على أي جزء من الرسم أو على البطاقة لعرض القطع</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <!-- Doughnut -->
          <div class="relative h-72 w-full max-w-sm mx-auto">
            <canvas ref="statusCanvas"></canvas>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-4xl font-black text-slate-900 leading-none">{{ formatInteger(stats.totalPlots) }}</span>
              <span class="text-xs text-slate-500 font-medium mt-1.5">إجمالي القطع</span>
            </div>
          </div>

          <!-- Status rows -->
          <div class="flex flex-col gap-3">
            <NuxtLink
              v-for="s in statusCards"
              :key="s.status"
              :to="`/plots?status=${encodeURIComponent(s.status)}`"
              class="group relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 ps-5 overflow-hidden hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300 transition-all"
            >
              <!-- colour accent bar -->
              <span class="absolute inset-y-0 start-0 w-1.5" :style="{ backgroundColor: s.color }"></span>

              <!-- icon -->
              <div
                class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                :style="{ backgroundColor: s.color + '1A', color: s.color }"
              >
                <i :class="['pi text-lg', s.icon]"></i>
              </div>

              <!-- content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-bold text-slate-900 text-sm">{{ s.status }}</span>
                  <span
                    class="text-xs font-bold px-2 py-0.5 rounded-full"
                    :style="{ backgroundColor: s.color + '1A', color: s.color }"
                  >
                    {{ formatPercent(s.percent) }}
                  </span>
                </div>
                <div class="flex items-baseline gap-1.5 mt-0.5">
                  <span class="text-2xl font-black text-slate-900">{{ formatInteger(s.count) }}</span>
                  <span class="text-xs font-medium text-slate-500">قطعة</span>
                </div>
                <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-700"
                    :style="{ width: Math.max(s.percent, 1.5) + '%', backgroundColor: s.color }"
                  ></div>
                </div>
              </div>

              <i class="pi pi-arrow-left text-slate-300 group-hover:text-slate-600 group-hover:-translate-x-1 transition-all"></i>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Usage × Status: charts replacing the matrix table -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <h3 class="text-base font-bold text-slate-900">المساحة حسب الاستخدام والحالة</h3>
          <p class="text-xs text-slate-500 mt-0.5 mb-4">متر مربع (م²)</p>
          <div class="h-72"><canvas ref="areaCanvas"></canvas></div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <h3 class="text-base font-bold text-slate-900">القيمة الإجمالية حسب الاستخدام والحالة</h3>
          <p class="text-xs text-slate-500 mt-0.5 mb-4">ريال سعودي (ر.س)</p>
          <div class="h-72"><canvas ref="valueCanvas"></canvas></div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <h3 class="text-base font-bold text-slate-900">توزيع المساحة حسب الاستخدام</h3>
          <p class="text-xs text-slate-500 mt-0.5 mb-4">النسبة من إجمالي مساحة المخطط</p>
          <div class="h-72"><canvas ref="usageCanvas"></canvas></div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <h3 class="text-base font-bold text-slate-900">متوسط سعر المتر حسب الاستخدام والحالة</h3>
          <p class="text-xs text-slate-500 mt-0.5 mb-4">ر.س / م²</p>
          <div class="h-72"><canvas ref="priceCanvas"></canvas></div>
        </div>
      </div>

      <!-- Full data table kept (collapsed) so no figure is lost -->
      <details class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden group">
        <summary class="p-5 cursor-pointer flex items-center justify-between list-none hover:bg-slate-50 transition-colors">
          <div>
            <h2 class="text-base font-bold text-slate-900">جدول التفاصيل (تقرير الاستخدام × الحالة)</h2>
            <p class="text-xs text-slate-500 mt-0.5">
              مطابق لتقرير Rep في ملف الإكسل الأصلي — آخر مزامنة: {{ stats.lastUpdated }}
            </p>
          </div>
          <i class="pi pi-chevron-down text-slate-400 group-open:rotate-180 transition-transform"></i>
        </summary>

        <div class="overflow-x-auto border-t border-slate-100">
          <table class="w-full text-center border-collapse text-xs sm:text-sm">
            <thead>
              <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th class="px-4 py-3 text-start">الاستخدام</th>
                <th class="px-4 py-3">حالة البيع</th>
                <th class="px-4 py-3">عدد القطع</th>
                <th class="px-4 py-3">المساحة الإجمالية (م²)</th>
                <th class="px-4 py-3">متوسط سعر المتر (ر.س)</th>
                <th class="px-4 py-3">القيمة الإجمالية (ر.س)</th>
                <th class="px-4 py-3">النسبة من المساحة</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(row, idx) in stats.matrix"
                :key="idx"
                class="hover:bg-slate-50/70 transition-colors cursor-pointer"
                @click="navigateTo(`/plots?usage=${encodeURIComponent(row.usage)}&status=${encodeURIComponent(row.status)}`)"
              >
                <td class="px-4 py-3 text-start font-bold text-slate-900">
                  <span
                    :class="[
                      'inline-block px-2 py-0.5 rounded text-xs',
                      row.usage === 'سكنى' ? 'bg-blue-50 text-blue-700' :
                      row.usage === 'تجارى' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                    ]"
                  >
                    {{ row.usage }}
                  </span>
                </td>
                <td class="px-4 py-3"><PlotsStatusBadge :status="row.status" /></td>
                <td class="px-4 py-3 font-bold text-slate-900">{{ formatInteger(row.count) }}</td>
                <td class="px-4 py-3 font-medium">{{ formatCurrencyNumber(row.area) }}</td>
                <td class="px-4 py-3 font-medium text-slate-600">{{ formatCurrencyNumber(row.avgPrice) }}</td>
                <td class="px-4 py-3 font-bold text-slate-900">{{ formatCurrencyNumber(row.value) }}</td>
                <td class="px-4 py-3 font-semibold text-[#7030A0]">{{ formatPercent(row.sharePercent) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-purple-50/80 font-black text-slate-900 border-t-2 border-purple-200">
                <td colspan="2" class="px-4 py-3.5 text-start font-black text-sm">المجموع الكلي للمخطط</td>
                <td class="px-4 py-3.5 font-black text-sm">{{ formatInteger(stats.totalPlots) }}</td>
                <td class="px-4 py-3.5 font-black">{{ formatCurrencyNumber(stats.totalArea) }} م²</td>
                <td class="px-4 py-3.5 font-black">{{ formatCurrencyNumber(stats.averagePricePerM2) }}</td>
                <td class="px-4 py-3.5 font-black text-[#7030A0]">{{ formatCurrencyNumber(stats.totalLandValue) }} ر.س</td>
                <td class="px-4 py-3.5 font-black">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </details>

      <!-- Quick Exploration Shortcuts -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink
          to="/blocks"
          class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#7030A0] hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
              <i class="pi pi-objects-column"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-lg group-hover:text-[#7030A0] transition-colors">
                استعراض البلوكات ({{ stats.blocksCount }} بلك)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">تصفح البلوكات كبطاقات مرئية مع نسب المبيعات وحالة كل قطعة</p>
            </div>
          </div>
          <i class="pi pi-arrow-left text-slate-400 group-hover:text-[#7030A0] group-hover:-translate-x-1 transition-all"></i>
        </NuxtLink>

        <NuxtLink
          to="/zones"
          class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#7030A0] hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
              <i class="pi pi-map"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-lg group-hover:text-emerald-800 transition-colors">
                استعراض الزونات ({{ stats.zonesCount }} زون)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">توزيع القطع حسب المناطق والزونات A1, A2, B1, B2</p>
            </div>
          </div>
          <i class="pi pi-arrow-left text-slate-400 group-hover:text-emerald-800 group-hover:-translate-x-1 transition-all"></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chart as ChartType, ChartConfiguration } from 'chart.js';
import { projectConfig } from '../config/project';
import { formatCurrencyNumber, formatInteger, formatPercent } from '../../lib/format';
import type { PlotStatistics } from '../../shared/types/plot';

const { data: statsResponse, pending, refresh } = await useFetch<{ success: boolean; data: PlotStatistics }>('/api/stats');
const stats = computed(() => statsResponse.value?.data);

const refreshing = ref(false);
const refreshData = async () => {
  refreshing.value = true;
  await refresh();
  refreshing.value = false;
};

/* ---------- Constants ---------- */
const STATUSES = ['متاح للبيع', 'محجوز', 'مباع'] as const;
const STATUS_COLORS: Record<string, string> = {
  'متاح للبيع': '#10b981',
  'محجوز': '#f59e0b',
  'مباع': '#f43f5e',
};
const USAGE_COLORS = ['#3b82f6', '#7030A0', '#10b981', '#f59e0b', '#64748b'];

/* ---------- Derived data ---------- */
const statusCards = computed(() => {
  const s = stats.value;
  if (!s) return [];
  const total = s.totalPlots || 1;
  return [
    {
      status: 'متاح للبيع', count: s.availableCount, color: STATUS_COLORS['متاح للبيع'],
      percent: (s.availableCount / total) * 100, icon: 'pi-check-circle',
      cardClass: 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/70',
      titleClass: 'text-emerald-900', valueClass: 'text-emerald-950', badgeClass: 'text-emerald-800 border-emerald-200',
    },
    {
      status: 'محجوز', count: s.reservedCount, color: STATUS_COLORS['محجوز'],
      percent: (s.reservedCount / total) * 100, icon: 'pi-bookmark',
      cardClass: 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/70',
      titleClass: 'text-amber-900', valueClass: 'text-amber-950', badgeClass: 'text-amber-800 border-amber-200',
    },
    {
      status: 'مباع', count: s.soldCount, color: STATUS_COLORS['مباع'],
      percent: (s.soldCount / total) * 100, icon: 'pi-tag',
      cardClass: 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/70',
      titleClass: 'text-rose-900', valueClass: 'text-rose-950', badgeClass: 'text-rose-800 border-rose-200',
    },
  ];
});

const usages = computed(() => Array.from(new Set((stats.value?.matrix ?? []).map((r) => r.usage))));

const metricByUsageStatus = (metric: 'area' | 'value' | 'avgPrice' | 'count', status: string) =>
  usages.value.map((u) => {
    const row = stats.value?.matrix.find((r) => r.usage === u && r.status === status);
    return row ? Number(row[metric]) || 0 : 0;
  });

const areaByUsage = computed(() =>
  usages.value.map((u) =>
    (stats.value?.matrix ?? []).filter((r) => r.usage === u).reduce((sum, r) => sum + (Number(r.area) || 0), 0)
  )
);

/* ---------- Chart.js (client only) ---------- */
const statusCanvas = ref<HTMLCanvasElement | null>(null);
const areaCanvas = ref<HTMLCanvasElement | null>(null);
const valueCanvas = ref<HTMLCanvasElement | null>(null);
const usageCanvas = ref<HTMLCanvasElement | null>(null);
const priceCanvas = ref<HTMLCanvasElement | null>(null);

let charts: ChartType[] = [];
let ChartCtor: typeof ChartType | null = null;

const destroyCharts = () => {
  charts.forEach((c) => c.destroy());
  charts = [];
};

const compact = (v: number | string) =>
  new Intl.NumberFormat('ar-SA', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(v));

const baseOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { rtl: true, position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 8, font: { size: 12 } } },
    tooltip: { rtl: true, textDirection: 'rtl' as const, titleAlign: 'right' as const, bodyAlign: 'right' as const },
  },
});

const stackedBar = (canvas: HTMLCanvasElement, metric: 'area' | 'value' | 'avgPrice', stacked: boolean) => {
  const config: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: usages.value,
      datasets: STATUSES.map((s) => ({
        label: s,
        data: metricByUsageStatus(metric, s),
        backgroundColor: STATUS_COLORS[s],
        borderRadius: 6,
        borderSkipped: false,
      })),
    },
    options: {
      ...baseOptions(),
      scales: {
        x: { stacked, grid: { display: false } },
        y: { stacked, beginAtZero: true, ticks: { callback: (v) => compact(v as number) } },
      },
      plugins: {
        ...baseOptions().plugins,
        tooltip: {
          ...baseOptions().plugins.tooltip,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrencyNumber(ctx.parsed.y as number)}`,
          },
        },
      },
    },
  };
  return new ChartCtor!(canvas, config);
};

const buildCharts = async () => {
  if (!import.meta.client || !stats.value) return;
  await nextTick();

  if (!ChartCtor) {
    const mod = await import('chart.js/auto');
    ChartCtor = mod.Chart as unknown as typeof ChartType;
    ChartCtor.defaults.font.family = 'inherit';
    ChartCtor.defaults.color = '#475569';
  }
  destroyCharts();

  // 1) Status doughnut (click → filtered plots)
  if (statusCanvas.value) {
    charts.push(
      new ChartCtor!(statusCanvas.value, {
        type: 'doughnut',
        data: {
          labels: [...STATUSES],
          datasets: [{
            data: [stats.value.availableCount, stats.value.reservedCount, stats.value.soldCount],
            backgroundColor: STATUSES.map((s) => STATUS_COLORS[s]),
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverOffset: 8,
          }],
        },
        options: {
          ...baseOptions(),
          cutout: '68%',
          onClick: (_e, els) => {
            if (els.length) navigateTo(`/plots?status=${encodeURIComponent(STATUSES[els[0].index])}`);
          },
          onHover: (e, els) => {
            const t = e.native?.target as HTMLElement | undefined;
            if (t) t.style.cursor = els.length ? 'pointer' : 'default';
          },
          plugins: {
            ...baseOptions().plugins,
            tooltip: {
              ...baseOptions().plugins.tooltip,
              callbacks: {
                label: (ctx) => {
                  const total = stats.value!.totalPlots || 1;
                  const v = ctx.parsed as number;
                  return ` ${formatInteger(v)} قطعة (${formatPercent((v / total) * 100)})`;
                },
              },
            },
          },
        },
      })
    );
  }

  // 2) Area by usage × status (stacked)
  if (areaCanvas.value) charts.push(stackedBar(areaCanvas.value, 'area', true));

  // 3) Value by usage × status (stacked)
  if (valueCanvas.value) charts.push(stackedBar(valueCanvas.value, 'value', true));

  // 4) Area share by usage (doughnut)
  if (usageCanvas.value) {
    charts.push(
      new ChartCtor!(usageCanvas.value, {
        type: 'doughnut',
        data: {
          labels: usages.value,
          datasets: [{
            data: areaByUsage.value,
            backgroundColor: usages.value.map((_, i) => USAGE_COLORS[i % USAGE_COLORS.length]),
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverOffset: 8,
          }],
        },
        options: {
          ...baseOptions(),
          cutout: '55%',
          plugins: {
            ...baseOptions().plugins,
            tooltip: {
              ...baseOptions().plugins.tooltip,
              callbacks: {
                label: (ctx) => {
                  const total = areaByUsage.value.reduce((a, b) => a + b, 0) || 1;
                  const v = ctx.parsed as number;
                  return ` ${formatCurrencyNumber(v)} م² (${formatPercent((v / total) * 100)})`;
                },
              },
            },
          },
        },
      })
    );
  }

  // 5) Avg price per m² (grouped, not stacked)
  if (priceCanvas.value) charts.push(stackedBar(priceCanvas.value, 'avgPrice', false));
};

onMounted(buildCharts);
watch(stats, buildCharts);
onBeforeUnmount(destroyCharts);
</script>