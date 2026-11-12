<template>
  <div class="space-y-10">
    <!-- Header -->
    <header class="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200/70">
      <div>
        <span class="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#7030A0]">
          <span class="w-6 h-px bg-[#7030A0]/50"></span>
          مخطط المها
        </span>
        <h1 class="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          بلوكات المخطط
        </h1>
        <p class="text-sm text-slate-500 mt-2 leading-relaxed max-w-xl">
          استعراض جميع بلوكات المخطط
          <span class="font-semibold text-slate-700">({{ blocks.length }} بلك معتمد)</span>
          مع نسب وحالات المبيعات
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- View switcher -->
        <div class="inline-flex items-center p-1 rounded-full bg-slate-100 border border-slate-200/70" role="tablist" aria-label="طريقة العرض">
          <button
            v-for="opt in viewOptions"
            :key="opt.value"
            type="button"
            role="tab"
            :aria-selected="view === opt.value"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300"
            :class="view === opt.value
              ? 'bg-white text-[#7030A0] shadow-sm'
              : 'text-slate-500 hover:text-slate-800'"
            @click="view = opt.value"
          >
            <i :class="['pi', opt.icon, 'text-xs']"></i>
            <span>{{ opt.label }}</span>
          </button>
        </div>

        <NuxtLink
          to="/plots"
          class="group inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-slate-900 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-slate-900/10 hover:bg-[#7030A0] hover:shadow-[#7030A0]/25 transition-all duration-300"
        >
          <i class="pi pi-th-large text-xs opacity-80"></i>
          <span>عرض جدول القطع الشامل</span>
          <i class="pi pi-arrow-left text-[10px] opacity-60 group-hover:-translate-x-1 transition-transform duration-300"></i>
        </NuxtLink>
      </div>
    </header>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
      <div v-for="i in 12" :key="i" class="h-56 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse"></div>
    </div>

    <!-- ============ CARDS VIEW ============ -->
    <div
      v-else-if="view === 'cards'"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6"
    >
      <NuxtLink
        v-for="b in blocks"
        :key="b.block"
        :to="`/blocks/${b.block}`"
        class="group relative overflow-hidden flex flex-col justify-between rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:border-[#7030A0]/30 hover:shadow-[0_20px_40px_-16px_rgba(112,48,160,0.25)] transition-all duration-300"
      >
        <div class="pointer-events-none absolute -top-16 -left-16 w-44 h-44 rounded-full bg-gradient-to-br from-[#7030A0]/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <span class="pointer-events-none select-none absolute -bottom-6 -left-2 text-[110px] leading-none font-black text-slate-900/[0.03] group-hover:text-[#7030A0]/[0.06] transition-colors duration-500">
          {{ b.block }}
        </span>

        <div class="relative">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] font-semibold tracking-wide text-slate-400">بلك</span>
              <h3 class="text-3xl font-black text-slate-900 leading-none mt-1 group-hover:text-[#7030A0] transition-colors duration-300">
                {{ b.block }}
              </h3>
              <p class="text-xs text-slate-500 mt-2 font-medium">{{ b.totalPlots }} قطعة أرض</p>
            </div>

            <div class="relative w-14 h-14">
              <svg viewBox="0 0 44 44" class="w-14 h-14 -rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke-width="3.5" class="stroke-slate-100" />
                <circle
                  cx="22" cy="22" r="18" fill="none" stroke-width="3.5" stroke-linecap="round"
                  class="stroke-[#7030A0] transition-all duration-700"
                  :stroke-dasharray="CIRC"
                  :stroke-dashoffset="ringOffset(b.soldPercent)"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-[13px] font-black text-slate-900 leading-none">{{ b.soldPercent }}%</span>
                <span class="text-[9px] text-slate-400 mt-0.5">مباع</span>
              </div>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-3 divide-x divide-x-reverse divide-slate-100 text-center">
            <div class="px-1">
              <div class="text-lg font-black text-slate-900 leading-none">{{ b.availableCount }}</div>
              <div class="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>متاح
              </div>
            </div>
            <div class="px-1">
              <div class="text-lg font-black text-slate-900 leading-none">{{ b.reservedCount }}</div>
              <div class="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>محجوز
              </div>
            </div>
            <div class="px-1">
              <div class="text-lg font-black text-slate-900 leading-none">{{ b.soldCount }}</div>
              <div class="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>مباع
              </div>
            </div>
          </div>
        </div>

        <div class="relative mt-6">
          <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-px">
            <div :style="{ width: pct(b.soldCount, b.totalPlots) }" class="bg-rose-500/90 h-full rounded-full" title="مباع"></div>
            <div :style="{ width: pct(b.reservedCount, b.totalPlots) }" class="bg-amber-400 h-full rounded-full" title="محجوز"></div>
            <div :style="{ width: pct(b.availableCount, b.totalPlots) }" class="bg-emerald-500/90 h-full rounded-full" title="متاح"></div>
          </div>

          <div class="flex items-center justify-between mt-4 text-xs">
            <span class="text-slate-400">
              المساحة
              <span class="font-semibold text-slate-600">{{ formatCurrencyNumber(b.totalArea) }}</span> م²
            </span>
            <span class="inline-flex items-center gap-1.5 font-semibold text-[#7030A0]">
              <span>عرض البلك</span>
              <i class="pi pi-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform duration-300"></i>
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- ============ CHARTS VIEW ============ -->
    <div v-else class="space-y-6">
      <!-- KPIs -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div v-for="k in kpis" :key="k.label" class="rounded-3xl bg-white border border-slate-200/70 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">{{ k.label }}</span>
            <span class="w-8 h-8 rounded-xl flex items-center justify-center" :class="k.tint">
              <i :class="['pi', k.icon, 'text-xs']"></i>
            </span>
          </div>
          <div class="mt-3 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{{ k.value }}</div>
          <div v-if="k.hint" class="mt-1 text-[11px] text-slate-400">{{ k.hint }}</div>
        </div>
      </div>

      <!-- Doughnut + Stacked -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <section class="rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 class="text-sm font-black text-slate-900">حالة المبيعات الإجمالية</h2>
          <p class="text-xs text-slate-400 mt-1">توزيع جميع القطع في المخطط</p>
          <div class="relative mt-5 h-64">
            <canvas ref="doughnutEl"></canvas>
            <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-black text-slate-900">{{ totals.soldPercent }}%</span>
              <span class="text-[11px] text-slate-400">نسبة المباع</span>
            </div>
          </div>
        </section>

        <section class="lg:col-span-2 rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 class="text-sm font-black text-slate-900">القطع حسب البلك والحالة</h2>
          <p class="text-xs text-slate-400 mt-1">اضغط على أي عمود لفتح البلك</p>
          <div class="relative mt-5 h-64">
            <canvas ref="stackedEl"></canvas>
          </div>
        </section>
      </div>

      <!-- Sold percent per block -->
      <section class="rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <h2 class="text-sm font-black text-slate-900">نسبة المباع لكل بلك</h2>
        <p class="text-xs text-slate-400 mt-1">مقارنة سريعة بين أداء البلوكات</p>
        <div class="relative mt-5 h-64">
          <canvas ref="percentEl"></canvas>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '../../../lib/format';
import type { BlockSummary } from '../../shared/types/plot';

const { data: response, pending } = await useFetch<{ success: boolean; data: BlockSummary[] }>('/api/blocks');
const blocks = computed(() => response.value?.data || []);

// ---------- View switcher (remembered across visits) ----------
type ViewMode = 'cards' | 'charts';
const viewOptions: { value: ViewMode; label: string; icon: string }[] = [
  { value: 'cards', label: 'بطاقات', icon: 'pi-th-large' },
  { value: 'charts', label: 'رسوم بيانية', icon: 'pi-chart-bar' },
];
const viewCookie = useCookie<ViewMode>('blocks-view', { default: () => 'cards', maxAge: 60 * 60 * 24 * 365 });
const view = computed<ViewMode>({
  get: () => (viewCookie.value === 'charts' ? 'charts' : 'cards'),
  set: (v) => { viewCookie.value = v; },
});

// ---------- Card helpers ----------
const CIRC = 2 * Math.PI * 18;
const ringOffset = (percent: number) => CIRC * (1 - Math.min(Math.max(Number(percent) || 0, 0), 100) / 100);
const pct = (part: number, total: number) => `${total ? (part / total) * 100 : 0}%`;

// ---------- Totals ----------
const totals = computed(() => {
  const t = blocks.value.reduce(
    (a, b) => {
      a.plots += b.totalPlots;
      a.sold += b.soldCount;
      a.reserved += b.reservedCount;
      a.available += b.availableCount;
      a.area += Number(b.totalArea) || 0;
      return a;
    },
    { plots: 0, sold: 0, reserved: 0, available: 0, area: 0 },
  );
  return { ...t, soldPercent: t.plots ? Math.round((t.sold / t.plots) * 100) : 0 };
});

const kpis = computed(() => [
  { label: 'عدد البلوكات', value: blocks.value.length, icon: 'pi-th-large', tint: 'bg-purple-50 text-[#7030A0]', hint: '' },
  { label: 'إجمالي القطع', value: totals.value.plots, icon: 'pi-map', tint: 'bg-slate-100 text-slate-600', hint: `${totals.value.available} متاحة` },
  { label: 'نسبة المباع', value: `${totals.value.soldPercent}%`, icon: 'pi-chart-line', tint: 'bg-rose-50 text-rose-600', hint: `${totals.value.sold} قطعة مباعة` },
  { label: 'إجمالي المساحة', value: `${formatCurrencyNumber(totals.value.area)} م²`, icon: 'pi-expand', tint: 'bg-emerald-50 text-emerald-600', hint: '' },
]);

// ---------- Charts (Chart.js, client only) ----------
const doughnutEl = ref<HTMLCanvasElement | null>(null);
const stackedEl = ref<HTMLCanvasElement | null>(null);
const percentEl = ref<HTMLCanvasElement | null>(null);
let charts: any[] = [];
let renderToken = 0;

const COLORS = { sold: '#f43f5e', reserved: '#fbbf24', available: '#10b981', brand: '#7030A0', grid: '#f1f5f9', text: '#64748b' };

function destroyCharts() {
  charts.forEach((c) => c?.destroy());
  charts = [];
}

async function renderCharts() {
  const token = ++renderToken;
  destroyCharts();
  if (view.value !== 'charts' || !blocks.value.length) return;
  await nextTick();
  const { default: Chart } = await import('chart.js/auto');
  if (token !== renderToken || !doughnutEl.value || !stackedEl.value || !percentEl.value) return;

  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.color = COLORS.text;

  const labels = blocks.value.map((b) => `بلك ${b.block}`);
  const goTo = (_: unknown, els: any[]) => {
    if (els.length) navigateTo(`/blocks/${blocks.value[els[0].index].block}`);
  };
  const pointer = (e: any, els: any[]) => {
    const t = e.native?.target as HTMLElement | undefined;
    if (t) t.style.cursor = els.length ? 'pointer' : 'default';
  };
  const tooltip = {
    rtl: true,
    backgroundColor: '#0f172a',
    padding: 12,
    cornerRadius: 12,
    titleFont: { weight: 'bold' as const },
    boxPadding: 4,
  };
  const legend = {
    rtl: true,
    position: 'bottom' as const,
    labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, padding: 16 },
  };

  // Doughnut
  charts.push(new Chart(doughnutEl.value, {
    type: 'doughnut',
    data: {
      labels: ['مباع', 'محجوز', 'متاح'],
      datasets: [{
        data: [totals.value.sold, totals.value.reserved, totals.value.available],
        backgroundColor: [COLORS.sold, COLORS.reserved, COLORS.available],
        borderWidth: 4,
        borderColor: '#ffffff',
        borderRadius: 8,
        hoverOffset: 6,
      }],
    },
    options: { maintainAspectRatio: false, cutout: '72%', plugins: { legend, tooltip } },
  }));

  // Stacked bars
  charts.push(new Chart(stackedEl.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'مباع', data: blocks.value.map((b) => b.soldCount), backgroundColor: COLORS.sold },
        { label: 'محجوز', data: blocks.value.map((b) => b.reservedCount), backgroundColor: COLORS.reserved },
        { label: 'متاح', data: blocks.value.map((b) => b.availableCount), backgroundColor: COLORS.available, borderRadius: { topLeft: 6, topRight: 6 } },
      ],
    },
    options: {
      maintainAspectRatio: false,
      onClick: goTo,
      onHover: pointer,
      scales: {
        x: { stacked: true, reverse: true, grid: { display: false }, border: { display: false } },
        y: { stacked: true, position: 'right', grid: { color: COLORS.grid }, border: { display: false }, ticks: { precision: 0 } },
      },
      plugins: { legend, tooltip },
    },
  }));

  // Sold percent
  charts.push(new Chart(percentEl.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'نسبة المباع %',
        data: blocks.value.map((b) => Number(b.soldPercent) || 0),
        backgroundColor: COLORS.brand,
        hoverBackgroundColor: '#8b43bd',
        borderRadius: 8,
        maxBarThickness: 36,
      }],
    },
    options: {
      maintainAspectRatio: false,
      onClick: goTo,
      onHover: pointer,
      scales: {
        x: { reverse: true, grid: { display: false }, border: { display: false } },
        y: { position: 'right', min: 0, max: 100, grid: { color: COLORS.grid }, border: { display: false }, ticks: { callback: (v: any) => `${v}%` } },
      },
      plugins: { legend: { display: false }, tooltip },
    },
  }));
}

onMounted(renderCharts);
watch([view, blocks], renderCharts);
onBeforeUnmount(() => {
  renderToken++;
  destroyCharts();
});
</script>