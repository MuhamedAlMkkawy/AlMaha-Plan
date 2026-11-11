<template>
  <div class="space-y-6">
    <!-- Page Header & Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          جدول القطع والمبيعات
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          استعراض وبحث وتصفية جميع قطع مخطط المها ({{ plots.length }} قطعة معروضة)
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Floating Selected Plots Quotation Action -->
        <button
          v-if="selectedPlots.length > 0"
          @click="openQuotationWithSelected"
          class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm shadow-md flex items-center gap-2 animate-bounce"
        >
          <i class="pi pi-file-edit"></i>
          <span>عرض سعر ({{ selectedPlots.length }} قطع)</span>
        </button>

        <button
          @click="exportToCSV"
          class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs flex items-center gap-2 transition-colors"
        >
          <i class="pi pi-download text-slate-500"></i>
          <span>تصدير CSV</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar Card -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <!-- Search Input -->
        <div class="lg:col-span-2 relative">
          <label class="block text-xs font-bold text-slate-600 mb-1">بحث برقم القطعة أو البلك</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ابحث برقم القطعة أو البلك..."
              class="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7030A0] text-sm"
            />
            <i class="pi pi-search absolute right-3.5 top-3 text-slate-400"></i>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <i class="pi pi-times-circle"></i>
            </button>
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">حالة البيع</label>
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7030A0] text-sm bg-white"
          >
            <option value="">جميع الحالات</option>
            <option value="متاح للبيع">متاح للبيع</option>
            <option value="محجوز">محجوز</option>
            <option value="مباع">مباع</option>
          </select>
        </div>

        <!-- Usage Filter -->
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">نوع الاستخدام</label>
          <select
            v-model="selectedUsage"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7030A0] text-sm bg-white"
          >
            <option value="">جميع الاستخدامات</option>
            <option value="سكنى">سكنى</option>
            <option value="تجارى">تجارى</option>
            <option value="مرافق">مرافق</option>
          </select>
        </div>

        <!-- Zone Filter -->
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">الزون</label>
          <select
            v-model="selectedZone"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7030A0] text-sm bg-white"
          >
            <option value="">جميع الزونات</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="غير محدد">غير محدد</option>
          </select>
        </div>
      </div>

      <!-- Quick Reset & Active Filter Chips -->
      <div v-if="hasActiveFilters" class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div class="flex items-center gap-2 text-slate-500">
          <span>التصفيات النشطة:</span>
          <button
            @click="clearFilters"
            class="text-[#7030A0] font-bold hover:underline flex items-center gap-1"
          >
            <i class="pi pi-trash"></i>
            <span>إعادة ضبط الفلاتر</span>
          </button>
        </div>
        <div class="text-slate-500 font-semibold">
          عدد النتائج: {{ filteredPlots.length }} من {{ plots.length }}
        </div>
      </div>
    </div>

    <!-- Plots Data Table Card -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <!-- Loading skeleton -->
      <div v-if="pending" class="p-8 space-y-4">
        <div v-for="i in 10" :key="i" class="h-10 bg-slate-100 rounded-lg animate-pulse"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredPlots.length === 0" class="p-12 text-center text-slate-500">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
          <i class="pi pi-search"></i>
        </div>
        <h3 class="font-bold text-slate-800 text-lg mb-1">لا توجد قطع تطابق معايير البحث</h3>
        <p class="text-sm">جرب تعديل أو إزالة بعض الفلاتر لعرض نتائج أكثر</p>
        <button
          @click="clearFilters"
          class="mt-4 px-4 py-2 bg-[#7030A0] text-white rounded-xl text-sm font-semibold hover:bg-[#532277]"
        >
          إعادة تعيين الفلاتر
        </button>
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-center border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
              <th class="px-3 py-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="rounded text-[#7030A0] focus:ring-[#7030A0]"
                />
              </th>
              <th @click="setSort('plotNo')" class="px-3 py-3.5 cursor-pointer hover:bg-slate-100">
                <div class="flex items-center justify-center gap-1">
                  <span>رقم القطعة</span>
                  <i :class="getSortIcon('plotNo')" class="text-xs"></i>
                </div>
              </th>
              <th @click="setSort('block')" class="px-3 py-3.5 cursor-pointer hover:bg-slate-100">
                <div class="flex items-center justify-center gap-1">
                  <span>البلك</span>
                  <i :class="getSortIcon('block')" class="text-xs"></i>
                </div>
              </th>
              <th class="px-3 py-3.5">الزون</th>
              <th class="px-3 py-3.5">الاستخدام</th>
              <th @click="setSort('area')" class="px-3 py-3.5 cursor-pointer hover:bg-slate-100">
                <div class="flex items-center justify-center gap-1">
                  <span>المساحة (م²)</span>
                  <i :class="getSortIcon('area')" class="text-xs"></i>
                </div>
              </th>
              <th @click="setSort('pricePerM2')" class="px-3 py-3.5 cursor-pointer hover:bg-slate-100">
                <div class="flex items-center justify-center gap-1">
                  <span>سعر المتر</span>
                  <i :class="getSortIcon('pricePerM2')" class="text-xs"></i>
                </div>
              </th>
              <th @click="setSort('landValue')" class="px-3 py-3.5 cursor-pointer hover:bg-slate-100">
                <div class="flex items-center justify-center gap-1">
                  <span>قيمة الأرض</span>
                  <i :class="getSortIcon('landValue')" class="text-xs"></i>
                </div>
              </th>
              <th class="px-3 py-3.5">السعي (15% ضريبة)</th>
              <th class="px-3 py-3.5">ضريبة التصرفات (5%)</th>
              <th class="px-3 py-3.5">الحالة</th>
              <th class="px-3 py-3.5">عرض السعر</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="plot in paginatedPlots"
              :key="plot.plotNo"
              class="hover:bg-purple-50/40 transition-colors cursor-pointer group"
              @click="handleRowClick($event, plot.plotNo)"
            >
              <td class="px-3 py-3 text-center" @click.stop>
                <input
                  type="checkbox"
                  :value="plot.plotNo"
                  v-model="selectedPlots"
                  class="rounded text-[#7030A0] focus:ring-[#7030A0]"
                />
              </td>
              <td class="px-3 py-3 font-black text-sm text-[#7030A0] group-hover:underline">
                {{ plot.plotNo }}
              </td>
              <td class="px-3 py-3 font-bold text-slate-800">
                <NuxtLink :to="`/blocks/${plot.block}`" class="hover:underline" @click.stop>
                  {{ plot.block }}
                </NuxtLink>
              </td>
              <td class="px-3 py-3 font-medium text-slate-600">{{ plot.zone }}</td>
              <td class="px-3 py-3 font-semibold">
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-xs',
                    plot.usage === 'سكنى' ? 'bg-blue-50 text-blue-700' :
                    plot.usage === 'تجارى' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                  ]"
                >
                  {{ plot.usage }}
                </span>
              </td>
              <td class="px-3 py-3 font-medium">{{ formatCurrencyNumber(plot.area) }}</td>
              <td class="px-3 py-3 font-medium text-slate-700">{{ formatCurrencyNumber(plot.pricePerM2) }}</td>
              <td class="px-3 py-3 font-bold text-slate-900">{{ formatCurrencyNumber(plot.landValue) }}</td>
              <td class="px-3 py-3 font-medium text-slate-600">{{ formatCurrencyNumber(plot.brokerage) }}</td>
              <td class="px-3 py-3 font-medium text-slate-600">{{ formatCurrencyNumber(plot.retTax) }}</td>
              <td class="px-3 py-3">
                <PlotsStatusBadge :status="plot.status" />
              </td>
              <td class="px-3 py-3" @click.stop>
                <NuxtLink
                  :to="`/plots/${plot.plotNo}`"
                  class="inline-flex items-center gap-1 px-2.5 py-2.5 rounded-lg bg-purple-50 hover:bg-[#7030A0] text-[#7030A0] hover:text-white transition-colors text-xs font-semibold"
                >
                  <!-- <span>عرض سعر</span> -->
                  <i class="pi pi-arrow-left text-2xs"></i>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="filteredPlots.length > pageSize" class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div>
          عرض {{ (currentPage - 1) * pageSize + 1 }} إلى {{ Math.min(currentPage * pageSize, filteredPlots.length) }} من أصل {{ filteredPlots.length }} قطعة
        </div>
        <div class="flex items-center gap-1">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-semibold"
          >
            السابق
          </button>
          <span class="px-3 py-1.5 font-bold text-[#7030A0]">
            صفحة {{ currentPage }} من {{ totalPages }}
          </span>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-semibold"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
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

// Sorting
const sortBy = ref<'plotNo' | 'block' | 'area' | 'pricePerM2' | 'landValue'>('plotNo');
const sortOrder = ref<'asc' | 'desc'>('asc');

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
const setSort = (field: typeof sortBy.value) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
};

const getSortIcon = (field: typeof sortBy.value) => {
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

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plots_export_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

