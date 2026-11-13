<template>
  <div class="w-full space-y-6">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="min-w-0">
        <nav class="flex items-center gap-2 text-sm" aria-label="مسار الصفحة">
          <NuxtLink to="/admin" class="text-slate-500 hover:text-[#7030A0] transition-colors">الإدارة</NuxtLink>
          <span class="text-slate-300">/</span>
          <span class="font-bold text-[#7030A0]">القطع والمبيعات</span>
        </nav>
        <h1 class="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900">إدارة القطع والأسعار</h1>
        <p class="mt-1 text-sm sm:text-base text-slate-500">
          <span class="font-bold text-slate-800">{{ plots.length }}</span> قطعة في المخطط
        </p>
      </div>

      <NuxtLink
        v-if="canCreate"
        to="/admin/plots/new"
        class="self-start sm:self-auto inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#7030A0] text-white text-base font-bold transition-colors hover:bg-[#5b2486] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/50 focus-visible:ring-offset-2"
      >
        <i class="pi pi-plus text-sm"></i>
        <span>إضافة قطعة جديدة</span>
      </NuxtLink>
    </header>

    <!-- Search & filters -->
    <section class="rounded-2xl bg-white border border-slate-200 p-5">
      <div class="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4">
        <div>
          <label for="plot-search" :class="labelCls">بحث (رقم القطعة، البلك، المشتري، الجوال، الصك)</label>
          <div class="relative">
            <i class="pi pi-search absolute start-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none"></i>
            <input
              id="plot-search"
              v-model="search"
              type="text"
              placeholder="ابحث بأي معلومة..."
              :class="[inputCls, 'ps-10']"
            />
          </div>
        </div>

        <div>
          <label for="status-filter" :class="labelCls">حالة البيع</label>
          <select id="status-filter" v-model="statusFilter" :class="inputCls">
            <option value="">جميع الحالات</option>
            <option value="متاح للبيع">متاح للبيع</option>
            <option value="محجوز">محجوز</option>
            <option value="مباع">مباع</option>
            <option value="مؤرشف">مؤرشف</option>
          </select>
        </div>

        <div>
          <label for="usage-filter" :class="labelCls">الاستخدام</label>
          <select id="usage-filter" v-model="usageFilter" :class="inputCls">
            <option value="">جميع الاستخدامات</option>
            <option value="سكنى">سكنى</option>
            <option value="تجارى">تجارى</option>
            <option value="مرافق">مرافق</option>
          </select>
        </div>
      </div>

      <div v-if="hasFilters" class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-sm">
        <span class="text-slate-600">
          النتائج: <span class="font-bold text-slate-900">{{ filteredPlots.length }}</span> من {{ plots.length }}
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 font-semibold text-[#7030A0] hover:underline rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
          @click="clearFilters"
        >
          <i class="pi pi-times text-xs"></i>
          مسح التصفية
        </button>
      </div>
    </section>

    <!-- Table -->
    <section class="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <!-- Loading -->
      <div v-if="pending" class="p-5 space-y-3" aria-busy="true">
        <div v-for="i in 8" :key="i" class="h-12 rounded-xl bg-slate-100 animate-pulse"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="!filteredPlots.length" class="py-16 text-center">
        <div class="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
          <i class="pi pi-inbox text-xl"></i>
        </div>
        <p class="mt-4 text-base font-bold text-slate-800">لا توجد قطع مطابقة</p>
        <p class="mt-1 text-sm text-slate-500">غيّر كلمة البحث أو امسح التصفية.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1000px] border-collapse text-start text-sm sm:text-base">
          <thead>
            <tr class="bg-slate-50 text-slate-600 text-sm font-bold border-b border-slate-200">
              <th scope="col" class="px-4 py-3.5 text-start">القطعة</th>
              <th scope="col" class="px-4 py-3.5 text-start">البلك</th>
              <th scope="col" class="px-4 py-3.5 text-start">الاستخدام</th>
              <th scope="col" class="px-4 py-3.5 text-start">المساحة</th>
              <th scope="col" class="px-4 py-3.5 text-start">سعر المتر</th>
              <th scope="col" class="px-4 py-3.5 text-start">قيمة الأرض</th>
              <th scope="col" class="px-4 py-3.5 text-start">الحالة</th>
              <th v-if="canSeePii" scope="col" class="px-4 py-3.5 text-start">اسم المشتري</th>
              <th v-if="canSeePii" scope="col" class="px-4 py-3.5 text-start">الجوال</th>
              <th v-if="canSeePii" scope="col" class="px-4 py-3.5 text-start">رقم الصك</th>
              <th scope="col" class="px-4 py-3.5 text-start">إجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="plot in paginatedPlots"
              :key="plot.plotNo"
              class="transition-colors hover:bg-[#7030A0]/[0.03]"
              :class="plot.status === 'مؤرشف' ? 'bg-slate-50/70' : ''"
            >
              <td class="px-4 py-3.5 text-lg font-black text-[#7030A0] tabular-nums">{{ plot.plotNo }}</td>
              <td class="px-4 py-3.5 font-bold text-slate-800 tabular-nums">{{ plot.block }}</td>
              <td class="px-4 py-3.5 text-slate-700">{{ plot.usage }}</td>
              <td class="px-4 py-3.5 text-slate-700 whitespace-nowrap tabular-nums">{{ plot.area }} م²</td>
              <td class="px-4 py-3.5 text-slate-700 tabular-nums">{{ plot.pricePerM2 }}</td>
              <td class="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap tabular-nums">{{ formatCurrencyNumber(plot.landValue) }}</td>
              <td class="px-4 py-3.5 min-w-[11rem]">
                <div class="relative w-40">
                  <select
                    :value="plot.status"
                    :disabled="!canEdit"
                    :aria-label="`حالة القطعة ${plot.plotNo}`"
                    class="w-full h-10 ps-4 pe-9 appearance-none rounded-xl border text-sm font-bold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#7030A0]/30 disabled:cursor-not-allowed disabled:opacity-70"
                    :class="statusTone(plot.status)"
                    @change="handleQuickStatusChange(plot, ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="متاح للبيع">متاح للبيع</option>
                    <option value="محجوز">محجوز</option>
                    <option value="مباع">مباع</option>
                    <option value="مؤرشف">مؤرشف</option>
                  </select>
                  <!-- <i class="pi pi-chevron-down absolute end-3 top-1/2 -translate-y-1/2 text-[10px] opacity-70 pointer-events-none"></i> -->
                </div>
              </td>
              <td v-if="canSeePii" class="px-4 py-3.5 font-semibold text-slate-800 truncate max-w-[14rem]">
                {{ plot.buyerName || '—' }}
              </td>
              <td v-if="canSeePii" class="px-4 py-3.5 text-slate-700 tabular-nums" dir="ltr">
                <div class="text-end">{{ plot.buyerPhone || '—' }}</div>
              </td>
              <td v-if="canSeePii" class="px-4 py-3.5 text-slate-600 tabular-nums" dir="ltr">
                <div class="text-end">{{ plot.deedNo || '—' }}</div>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1">
                  <NuxtLink
                    v-if="canEdit"
                    :to="`/admin/plots/${plot.plotNo}/edit`"
                    class="w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#7030A0] transition-colors hover:bg-[#7030A0]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
                    title="تعديل كامل"
                    :aria-label="`تعديل القطعة ${plot.plotNo}`"
                  >
                    <i class="pi pi-pencil"></i>
                  </NuxtLink>
                  <NuxtLink
                    :to="`/plots/${plot.plotNo}`"
                    class="w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    title="عرض السعر"
                    :aria-label="`عرض سعر القطعة ${plot.plotNo}`"
                  >
                    <i class="pi pi-eye"></i>
                  </NuxtLink>
                  <button
                    v-if="canDelete"
                    type="button"
                    class="w-9 h-9 inline-flex items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                    title="أرشفة"
                    :aria-label="`أرشفة القطعة ${plot.plotNo}`"
                    @click="handleArchive(plot.plotNo)"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredPlots.length > pageSize"
        class="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600"
      >
        <div>
          عرض <span class="font-bold text-slate-900">{{ (page - 1) * pageSize + 1 }}</span>
          إلى <span class="font-bold text-slate-900">{{ Math.min(page * pageSize, filteredPlots.length) }}</span>
          من أصل <span class="font-bold text-slate-900">{{ filteredPlots.length }}</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            :disabled="page === 1"
            class="h-10 px-5 rounded-full border border-slate-300 bg-white font-semibold text-slate-700 transition-colors hover:border-[#7030A0]/50 hover:text-[#7030A0] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
            @click="page = Math.max(1, page - 1)"
          >
            السابق
          </button>
          <span class="tabular-nums">صفحة {{ page }} من {{ totalPages }}</span>
          <button
            type="button"
            :disabled="page === totalPages"
            class="h-10 px-5 rounded-full border border-slate-300 bg-white font-semibold text-slate-700 transition-colors hover:border-[#7030A0]/50 hover:text-[#7030A0] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
            @click="page = Math.min(totalPages, page + 1)"
          >
            التالي
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '../../../../lib/format';
import { normalizeArabic } from '../../../../lib/arabic';
import type { Plot } from '../../../shared/types/plot';

const { data: response, pending, refresh } = await useFetch<{ success: boolean; data: Plot[] }>('/api/plots');
const plots = computed(() => response.value?.data || []);
const { can } = useAuthSession();
const canEdit = computed(() => can('edit_plots'));
const canCreate = computed(() => can('create_plots'));
const canDelete = computed(() => can('delete_plots'));
const canSeePii = computed(() => can('view_contracts') || can('edit_contracts'));

// Shared field styles
const labelCls = 'block text-sm font-semibold text-slate-700 mb-1.5';
const inputCls =
  'w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 transition-colors hover:border-slate-400 focus:outline-none focus:border-[#7030A0] focus:ring-2 focus:ring-[#7030A0]/20';

// Status colour for the quick-edit select
const statusTone = (status: string) => {
  switch (status) {
    case 'متاح للبيع':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'محجوز':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'مباع':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

const search = ref('');
const statusFilter = ref('');
const usageFilter = ref('');
const page = ref(1);
const pageSize = 40;

const hasFilters = computed(() => !!(search.value || statusFilter.value || usageFilter.value));

const clearFilters = () => {
  search.value = '';
  statusFilter.value = '';
  usageFilter.value = '';
};

// Go back to the first page whenever the filters change
watch([search, statusFilter, usageFilter], () => {
  page.value = 1;
});

const filteredPlots = computed(() => {
  let list = plots.value;

  if (statusFilter.value) {
    list = list.filter((p) => p.status === statusFilter.value);
  }

  if (usageFilter.value) {
    list = list.filter((p) => p.usage === usageFilter.value);
  }

  if (search.value) {
    const s = normalizeArabic(search.value.trim()).toLowerCase();
    list = list.filter((p) => {
      return (
        String(p.plotNo).includes(s) ||
        String(p.block) === s ||
        (p.buyerName && normalizeArabic(p.buyerName).toLowerCase().includes(s)) ||
        (p.buyerPhone && p.buyerPhone.includes(s)) ||
        (p.deedNo && p.deedNo.includes(s))
      );
    });
  }

  return list;
});

const totalPages = computed(() => Math.ceil(filteredPlots.value.length / pageSize) || 1);

const paginatedPlots = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredPlots.value.slice(start, start + pageSize);
});

const handleQuickStatusChange = async (plot: Plot, newStatus: string) => {
  try {
    await $fetch(`/api/admin/plots/${plot.plotNo}`, {
      method: 'PUT',
      body: {
        status: newStatus,
        expectedHash: plot.hash,
      },
    });
    plot.status = newStatus;
  } catch (err: any) {
    alert(err.data?.statusMessage || 'حدث خطأ أثناء تغيير الحالة');
    await refresh();
  }
};

const handleArchive = async (plotNo: number) => {
  if (!confirm(`هل أنت متأكد من رغبتك في أرشفة القطعة رقم ${plotNo}؟`)) return;

  try {
    await $fetch(`/api/admin/plots/${plotNo}`, {
      method: 'DELETE',
    });
    await refresh();
  } catch (err: any) {
    alert(err.data?.statusMessage || 'حدث خطأ أثناء أرشفة القطعة');
  }
};
</script>