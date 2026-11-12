<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <header class="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200/70">
      <div>
        <span class="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#7030A0]">
          <span class="w-6 h-px bg-[#7030A0]/50"></span>
          مخطط المها
        </span>
        <h1 class="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          جدول القطع والمبيعات
        </h1>
        <p class="text-sm text-slate-500 mt-2 leading-relaxed max-w-xl">
          استعراض وبحث وتصفية جميع قطع المخطط
          <span class="font-semibold text-slate-700">({{ plots.length }} قطعة معروضة)</span>
        </p>
      </div>

      <button
        type="button"
        @click="exportToCSV"
        class="group self-start inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-white ring-1 ring-slate-200 text-slate-700 font-semibold text-xs sm:text-sm shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:ring-[#7030A0]/30 hover:text-[#7030A0] hover:shadow-md hover:shadow-[#7030A0]/10 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
      >
        <i class="pi pi-download text-xs text-slate-400 transition-all duration-300 group-hover:text-[#7030A0] group-hover:translate-y-0.5"></i>
        <span>تصدير CSV</span>
      </button>
    </header>

    <!-- Filter Card -->
    <section class="rounded-3xl bg-white border border-slate-200/70 p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] space-y-5">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- Search -->
        <div class="lg:col-span-5">
          <label for="plot-search" class="block text-[11px] font-bold text-slate-500 mb-1.5">بحث برقم القطعة أو البلك</label>
          <div class="relative">
            <i class="pi pi-search absolute start-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none"></i>
            <input
              id="plot-search"
              v-model="searchQuery"
              type="text"
              placeholder="ابحث برقم القطعة أو البلك..."
              class="w-full ps-10 pe-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#7030A0]/50 focus:ring-4 focus:ring-[#7030A0]/10"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              aria-label="مسح البحث"
              class="absolute end-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 transition-colors duration-200 hover:bg-slate-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
            >
              <i class="pi pi-times text-[10px]"></i>
            </button>
          </div>
        </div>

        <!-- Usage -->
        <div class="lg:col-span-3">
          <label for="plot-usage" class="block text-[11px] font-bold text-slate-500 mb-1.5">نوع الاستخدام</label>
          <div class="relative">
            <select
              id="plot-usage"
              v-model="selectedUsage"
              class="w-full appearance-none ps-4 pe-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 cursor-pointer transition-all duration-200 hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#7030A0]/50 focus:ring-4 focus:ring-[#7030A0]/10"
            >
              <option value="">جميع الاستخدامات</option>
              <option value="سكنى">سكنى</option>
              <option value="تجارى">تجارى</option>
              <option value="مرافق">مرافق</option>
            </select>
            <i class="pi pi-chevron-down absolute end-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
          </div>
        </div>

        <!-- Zone -->
        <div class="lg:col-span-4">
          <label for="plot-zone" class="block text-[11px] font-bold text-slate-500 mb-1.5">الزون</label>
          <div class="relative">
            <select
              id="plot-zone"
              v-model="selectedZone"
              class="w-full appearance-none ps-4 pe-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 cursor-pointer transition-all duration-200 hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#7030A0]/50 focus:ring-4 focus:ring-[#7030A0]/10"
            >
              <option value="">جميع الزونات</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="غير محدد">غير محدد</option>
            </select>
            <i class="pi pi-chevron-down absolute end-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
          </div>
        </div>
      </div>

      <!-- Status chips -->
      <div>
        <span class="block text-[11px] font-bold text-slate-500 mb-2">حالة البيع</span>
        <div class="flex flex-wrap items-center gap-2" role="group" aria-label="تصفية حسب الحالة">
          <button
            v-for="opt in statusOptions"
            :key="opt.value"
            type="button"
            @click="selectedStatus = opt.value"
            :aria-pressed="selectedStatus === opt.value"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-300 motion-reduce:transition-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
            :class="selectedStatus === opt.value
              ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
          >
            <span v-if="opt.dot" class="w-2 h-2 rounded-full" :class="opt.dot"></span>
            <span>{{ opt.label }}</span>
          </button>
        </div>
      </div>

      <!-- Active filters + results -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <div v-if="hasActiveFilters" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 text-slate-400 font-medium">
              <i class="pi pi-filter-fill text-[10px] text-[#7030A0]"></i>
              التصفيات النشطة
            </span>

            <button
              v-for="chip in activeChips"
              :key="chip.key"
              type="button"
              @click="chip.clear()"
              class="group inline-flex items-center gap-1.5 ps-3 pe-2 py-1 rounded-full bg-purple-50 text-[#7030A0] font-semibold transition-colors duration-200 hover:bg-[#7030A0] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
            >
              <span>{{ chip.label }}</span>
              <i class="pi pi-times text-[9px] opacity-60 group-hover:opacity-100"></i>
            </button>

            <button
              type="button"
              @click="clearFilters"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-500 font-semibold transition-colors duration-200 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
            >
              <i class="pi pi-refresh text-[10px]"></i>
              <span>إعادة ضبط الفلاتر</span>
            </button>
          </div>

          <div class="text-slate-500 font-medium whitespace-nowrap">
            عدد النتائج:
            <span class="font-black text-slate-900 tabular-nums">{{ filteredPlots.length }}</span>
            من {{ plots.length }}
          </div>
        </div>
      </Transition>
    </section>

    <!-- Data Table Card -->
    <section class="rounded-3xl bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
      <!-- Loading skeleton -->
      <div v-if="pending" class="p-8 space-y-3">
        <div v-for="i in 10" :key="i" class="h-11 rounded-xl bg-gradient-to-l from-slate-100 to-slate-50 animate-pulse"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredPlots.length === 0" class="py-16 px-6 text-center">
        <div class="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl">
          <i class="pi pi-search"></i>
        </div>
        <h3 class="mt-5 font-black text-slate-900 text-lg">لا توجد قطع تطابق معايير البحث</h3>
        <p class="mt-1.5 text-sm text-slate-400">جرب تعديل أو إزالة بعض الفلاتر لعرض نتائج أكثر</p>
        <button
          type="button"
          @click="clearFilters"
          class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7030A0] text-white text-sm font-semibold shadow-lg shadow-[#7030A0]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5b2686] hover:shadow-xl active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40 focus-visible:ring-offset-2"
        >
          <i class="pi pi-refresh text-xs"></i>
          <span>إعادة تعيين الفلاتر</span>
        </button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-center border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-50/80 text-slate-500 text-[11px] font-bold border-b border-slate-200/80 select-none">
              <th class="ps-5 pe-2 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  aria-label="تحديد الكل"
                  class="w-4 h-4 rounded border-slate-300 accent-[#7030A0] cursor-pointer focus:ring-[#7030A0]"
                />
              </th>

              <th
                v-for="col in sortableCols"
                :key="col.key"
                @click="setSort(col.key)"
                class="px-3 py-4 cursor-pointer transition-colors duration-200 hover:bg-slate-100/80 hover:text-slate-800"
                :class="sortBy === col.key ? 'text-[#7030A0]' : ''"
              >
                <div class="flex items-center justify-center gap-1.5">
                  <span>{{ col.label }}</span>
                  <i :class="getSortIcon(col.key)" class="text-[10px]"></i>
                </div>
              </th>

              <th class="px-3 py-4">الزون</th>
              <th class="px-3 py-4">الاستخدام</th>
              <th class="px-3 py-4">السعي (15% ضريبة)</th>
              <th class="px-3 py-4">ضريبة التصرفات (5%)</th>
              <th class="px-3 py-4">الحالة</th>
              <th class="px-3 py-4">عرض السعر</th>
              <th class="px-3 pe-5 py-4">العقد</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="plot in paginatedPlots"
              :key="plot.plotNo"
              class="group cursor-pointer transition-colors duration-200"
              :class="selectedPlots.includes(plot.plotNo) ? 'bg-purple-50/60' : 'hover:bg-purple-50/40'"
              @click="handleRowClick($event, plot.plotNo)"
            >
              <td class="ps-5 pe-2 py-3.5 text-center" @click.stop>
                <input
                  type="checkbox"
                  :value="plot.plotNo"
                  v-model="selectedPlots"
                  :aria-label="`تحديد القطعة ${plot.plotNo}`"
                  class="w-4 h-4 rounded border-slate-300 accent-[#7030A0] cursor-pointer focus:ring-[#7030A0]"
                />
              </td>

              <td class="px-3 py-3.5">
                <span class="inline-flex items-center justify-center min-w-10 px-2.5 py-1 rounded-xl bg-purple-50 text-[#7030A0] font-black text-sm tabular-nums transition-colors duration-200 group-hover:bg-[#7030A0] group-hover:text-white">
                  {{ plot.plotNo }}
                </span>
              </td>

              <td class="px-3 py-3.5 font-bold text-slate-800 tabular-nums">
                <NuxtLink
                  :to="`/blocks/${plot.block}`"
                  class="inline-flex items-center justify-center min-w-8 px-2 py-0.5 rounded-lg transition-colors duration-200 hover:bg-slate-100 hover:text-[#7030A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
                  @click.stop
                >
                  {{ plot.block }}
                </NuxtLink>
              </td>

              <td class="px-3 py-3.5 font-medium text-slate-500 tabular-nums">{{ formatCurrencyNumber(plot.area) }}</td>
              <td class="px-3 py-3.5 font-medium text-slate-700 tabular-nums">{{ formatCurrencyNumber(plot.pricePerM2) }}</td>
              <td class="px-3 py-3.5 font-black text-slate-900 tabular-nums">{{ formatCurrencyNumber(plot.landValue) }}</td>

              <td class="px-3 py-3.5 font-medium text-slate-600">{{ plot.zone }}</td>

              <td class="px-3 py-3.5">
                <span
                  :class="[
                    'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    plot.usage === 'سكنى' ? 'bg-blue-50 text-blue-700' :
                    plot.usage === 'تجارى' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                  ]"
                >
                  {{ plot.usage }}
                </span>
              </td>

              <td class="px-3 py-3.5 font-medium text-slate-600 tabular-nums">{{ formatCurrencyNumber(plot.brokerage) }}</td>
              <td class="px-3 py-3.5 font-medium text-slate-600 tabular-nums">{{ formatCurrencyNumber(plot.retTax) }}</td>

              <td class="px-3 py-3.5">
                <PlotsStatusBadge :status="plot.status" />
              </td>

              <td class="px-3 pe-5 py-3.5" @click.stop>
                <NuxtLink
                  :to="`/plots/${plot.plotNo}`"
                  aria-label="عرض السعر"
                  class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-50 text-[#7030A0] transition-all duration-300 hover:bg-[#7030A0] hover:text-white hover:shadow-md hover:shadow-[#7030A0]/25 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
                >
                  <i class="pi pi-arrow-left text-[10px] transition-transform duration-300 group-hover:-translate-x-0.5"></i>
                </NuxtLink>
              </td>

              <td class="px-3 pe-5 py-3.5" @click.stop>
                <NuxtLink
                  :to="`/contracts/${plot.plotNo}`"
                  aria-label="عرض العقد"
                  class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-50 text-[#7030A0] transition-all duration-300 hover:bg-[#7030A0] hover:text-white hover:shadow-md hover:shadow-[#7030A0]/25 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
                >
                  <i class="pi pi-file text-[10px]"></i>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredPlots.length > pageSize"
        class="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500"
      >
        <div>
          عرض
          <span class="font-bold text-slate-800 tabular-nums">{{ (currentPage - 1) * pageSize + 1 }}</span>
          إلى
          <span class="font-bold text-slate-800 tabular-nums">{{ Math.min(currentPage * pageSize, filteredPlots.length) }}</span>
          من أصل
          <span class="font-bold text-slate-800 tabular-nums">{{ filteredPlots.length }}</span>
          قطعة
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white ring-1 ring-slate-200 font-semibold text-slate-700 transition-all duration-200 hover:ring-[#7030A0]/30 hover:text-[#7030A0] active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
          >
            <i class="pi pi-arrow-right text-[10px]"></i>
            <span>السابق</span>
          </button>

          <span class="px-3 py-2 rounded-full bg-purple-50 font-bold text-[#7030A0] tabular-nums">
            صفحة {{ currentPage }} من {{ totalPages }}
          </span>

          <button
            type="button"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white ring-1 ring-slate-200 font-semibold text-slate-700 transition-all duration-200 hover:ring-[#7030A0]/30 hover:text-[#7030A0] active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
          >
            <span>التالي</span>
            <i class="pi pi-arrow-left text-[10px]"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Floating selection bar -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-6"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 translate-y-6"
    >
      <div
        v-if="selectedPlots.length > 0"
        class="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none print:hidden"
      >
        <div class="pointer-events-auto flex items-center gap-2 p-2 ps-5 rounded-full bg-slate-900/95 backdrop-blur-xl text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10">
          <span class="text-xs font-semibold">
            <span class="font-black tabular-nums">{{ selectedPlots.length }}</span>
            قطع محددة
          </span>

          <span class="w-px h-5 bg-white/20 mx-1"></span>

          <button
            type="button"
            @click="clearSelection"
            class="px-3 py-2 rounded-full text-xs font-semibold text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            إلغاء التحديد
          </button>

          <button
            type="button"
            @click="openQuotationWithSelected"
            class="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-400 text-amber-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/35 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          >
            <span class="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 blur-sm -translate-x-full opacity-0 transition-all duration-700 group-hover:translate-x-[450%] group-hover:opacity-100 motion-reduce:hidden"></span>
            <i class="pi pi-file-edit text-xs transition-transform duration-300 group-hover:-rotate-6"></i>
            <span class="relative">عرض سعر ({{ selectedPlots.length }} قطع)</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '../../../lib/format';
import { normalizeArabic } from '../../../lib/arabic';
import type { PublicPlot } from '../../shared/types/plot';

const route = useRoute();
const router = useRouter();

// Fetch plots
const { data: plotsResponse, pending } = await useFetch<{ success: boolean; data: PublicPlot[] }>('/api/plots');
const plots = computed(() => plotsResponse.value?.data || []);

// Query-driven Filter States
const searchQuery = ref((route.query.search as string) || '');
const selectedStatus = ref((route.query.status as string) || '');
const selectedUsage = ref((route.query.usage as string) || '');
const selectedZone = ref((route.query.zone as string) || '');

// Status chip options (same values the old <select> used)
const statusOptions = [
  { value: '', label: 'جميع الحالات', dot: '' },
  { value: 'متاح للبيع', label: 'متاح للبيع', dot: 'bg-emerald-500' },
  { value: 'محجوز', label: 'محجوز', dot: 'bg-amber-400' },
  { value: 'مباع', label: 'مباع', dot: 'bg-rose-500' },
];

// Sorting
type SortKey = 'plotNo' | 'block' | 'area' | 'pricePerM2' | 'landValue';
const sortBy = ref<SortKey>('plotNo');
const sortOrder = ref<'asc' | 'desc'>('asc');

const sortableCols: { key: SortKey; label: string }[] = [
  { key: 'plotNo', label: 'رقم القطعة' },
  { key: 'block', label: 'البلك' },
  { key: 'area', label: 'المساحة (م²)' },
  { key: 'pricePerM2', label: 'سعر المتر' },
  { key: 'landValue', label: 'قيمة الأرض' },
];

// Pagination
const currentPage = ref(1);
const pageSize = 50;

// Multi-select for Quotation
const selectedPlots = ref<number[]>([]);

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedStatus.value || selectedUsage.value || selectedZone.value);
});

const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  selectedUsage.value = '';
  selectedZone.value = '';
  currentPage.value = 1;
};

// Removable chips for the active filters
const activeChips = computed(() => {
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (searchQuery.value) chips.push({ key: 'search', label: `بحث: ${searchQuery.value}`, clear: () => { searchQuery.value = ''; } });
  if (selectedStatus.value) chips.push({ key: 'status', label: selectedStatus.value, clear: () => { selectedStatus.value = ''; } });
  if (selectedUsage.value) chips.push({ key: 'usage', label: selectedUsage.value, clear: () => { selectedUsage.value = ''; } });
  if (selectedZone.value) chips.push({ key: 'zone', label: `زون ${selectedZone.value}`, clear: () => { selectedZone.value = ''; } });
  return chips;
});

// Go back to page 1 whenever the filters change
watch([searchQuery, selectedStatus, selectedUsage, selectedZone], () => {
  currentPage.value = 1;
});

// Filtered & Sorted Plots
const filteredPlots = computed(() => {
  let list = plots.value;

  if (selectedStatus.value) {
    list = list.filter((p) => p.status === selectedStatus.value);
  }

  if (selectedUsage.value) {
    list = list.filter((p) => p.usage === selectedUsage.value);
  }

  if (selectedZone.value) {
    list = list.filter((p) => p.zone === selectedZone.value);
  }

  if (searchQuery.value) {
    const s = normalizeArabic(searchQuery.value.trim()).toLowerCase();
    list = list.filter((p) => {
      return (
        String(p.plotNo).includes(s) ||
        String(p.block) === s ||
        `بلك ${p.block}`.includes(s) ||
        normalizeArabic(p.zone).toLowerCase().includes(s)
      );
    });
  }

  const mult = sortOrder.value === 'desc' ? -1 : 1;
  return [...list].sort((a, b) => {
    return (a[sortBy.value] - b[sortBy.value]) * mult;
  });
});

const totalPages = computed(() => Math.ceil(filteredPlots.value.length / pageSize) || 1);

const paginatedPlots = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredPlots.value.slice(start, start + pageSize);
});

// Sorting helper
const setSort = (field: SortKey) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
};

const getSortIcon = (field: SortKey) => {
  if (sortBy.value !== field) return 'pi pi-sort text-slate-300';
  return sortOrder.value === 'asc' ? 'pi pi-sort-up text-[#7030A0]' : 'pi pi-sort-down text-[#7030A0]';
};

// Row click
const handleRowClick = (event: MouseEvent, plotNo: number) => {
  navigateTo(`/plots/${plotNo}`);
};

// Checkbox select all
const isAllSelected = computed(() => {
  return paginatedPlots.value.length > 0 && paginatedPlots.value.every((p) => selectedPlots.value.includes(p.plotNo));
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const currentIds = paginatedPlots.value.map((p) => p.plotNo);
    selectedPlots.value = selectedPlots.value.filter((id) => !currentIds.includes(id));
  } else {
    for (const p of paginatedPlots.value) {
      if (!selectedPlots.value.includes(p.plotNo)) {
        selectedPlots.value.push(p.plotNo);
      }
    }
  }
};

const clearSelection = () => {
  selectedPlots.value = [];
};

const openQuotationWithSelected = () => {
  if (selectedPlots.value.length === 0) return;
  const ids = selectedPlots.value.slice(0, 10).join(',');
  navigateTo(`/quote?plots=${ids}`);
};

// Export to CSV
const exportToCSV = () => {
  const rows = filteredPlots.value;
  if (!rows || rows.length === 0) return;

  const headers = ['رقم القطعة', 'رقم البلك', 'الزون', 'الاستخدام', 'المساحة م²', 'سعر المتر', 'قيمة الأرض', 'السعي', 'ضريبة التصرفات', 'الحالة'];
  const csvContent = [
    headers.join(','),
    ...rows.map((p) =>
      [
        p.plotNo,
        p.block,
        `"${p.zone}"`,
        `"${p.usage}"`,
        p.area,
        p.pricePerM2,
        p.landValue,
        p.brokerage,
        p.retTax,
        `"${p.status}"`,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plots_export_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>