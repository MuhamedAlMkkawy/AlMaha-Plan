<template>
  <div class="w-full space-y-6">
    <!-- Header for admin pages is supplied by the parent, so only filters & table here -->
    <section class="rounded-2xl bg-white border border-slate-200 p-5">
      <div class="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4">
        <div>
          <label for="plot-search" :class="labelCls">بحث (رقم القطعة، البلك، المشتري، الجوال، الصك)</label>
          <div class="relative">
            <i class="pi pi-search absolute start-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none" />
            <input id="plot-search" v-model="search" type="text" placeholder="ابحث بأي معلومة..." :class="[inputCls, 'ps-10']" />
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
        <span class="text-slate-600">النتائج: <span class="font-bold text-slate-900">{{ filteredPlots.length }}</span> من {{ plots.length }}</span>
        <button type="button" class="inline-flex items-center gap-1.5 font-semibold text-[#7030A0] hover:underline rounded-lg" @click="clearFilters">
          <i class="pi pi-times text-xs" /> مسح التصفية
        </button>
      </div>
    </section>

    <!-- Table -->
    <section class="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <div v-if="pending" class="p-5 space-y-3" aria-busy="true">
        <div v-for="i in 8" :key="i" class="h-12 rounded-xl bg-slate-100 animate-pulse" />
      </div>
      <div v-else-if="!filteredPlots.length" class="py-16 text-center">
        <div class="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center"><i class="pi pi-inbox text-xl" /></div>
        <p class="mt-4 text-base font-bold text-slate-800">لا توجد قطع مطابقة</p>
        <p class="mt-1 text-sm text-slate-500">غيّر كلمة البحث أو امسح التصفية.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1000px] border-collapse text-start text-sm sm:text-base">
          <thead>
            <tr class="bg-slate-50 text-slate-600 text-sm font-bold border-b border-slate-200">
              <th class="px-4 py-3.5 text-start">القطعة</th>
              <th class="px-4 py-3.5 text-start">البلك</th>
              <th class="px-4 py-3.5 text-start">الاستخدام</th>
              <th class="px-4 py-3.5 text-start">المساحة</th>
              <th class="px-4 py-3.5 text-start">سعر المتر</th>
              <th class="px-4 py-3.5 text-start">قيمة الأرض</th>
              <th class="px-4 py-3.5 text-start">الحالة</th>
              <th v-if="admin" class="px-4 py-3.5 text-start">اسم المشتري</th>
              <th v-if="admin" class="px-4 py-3.5 text-start">الجوال</th>
              <th v-if="admin" class="px-4 py-3.5 text-start">رقم الصك</th>
              <th v-if="admin" class="px-4 py-3.5 text-start">إجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="plot in paginatedPlots" :key="plot.plotNo" class="transition-colors hover:bg-[#7030A0]/[0.03]" :class="plot.status === 'مؤرشف' ? 'bg-slate-50/70' : ''">
              <td class="px-4 py-3.5 text-lg font-black text-[#7030A0] tabular-nums">{{ plot.plotNo }}</td>
              <td class="px-4 py-3.5 font-bold text-slate-800 tabular-nums">{{ plot.block }}</td>
              <td class="px-4 py-3.5 text-slate-700">{{ plot.usage }}</td>
              <td class="px-4 py-3.5 text-slate-700 whitespace-nowrap tabular-nums">{{ plot.area }} م²</td>
              <td class="px-4 py-3.5 text-slate-700 tabular-nums">{{ plot.pricePerM2 }}</td>
              <td class="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap tabular-nums">{{ formatCurrencyNumber(plot.landValue) }}</td>
              <td class="px-4 py-3.5 min-w-[11rem]">
                <div class="relative w-40">
                  <select :value="plot.status" :aria-label="`حالة القطعة ${plot.plotNo}`"
                    class="w-full h-10 ps-4 pe-9 appearance-none rounded-xl border text-sm font-bold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#7030A0]/30"
                    :class="statusTone(plot.status)"
                    @change="handleQuickStatusChange(plot, ($event.target as HTMLSelectElement).value)"
                    v-if="admin">
                    <option value="متاح للبيع">متاح للبيع</option>
                    <option value="محجوز">محجوز</option>
                    <option value="مباع">مباع</option>
                    <option value="مؤرشف">مؤرشف</option>
                  </select>
                  <span v-else class="block py-2 px-4">{{ plot.status }}</span>
                  <i class="pi pi-chevron-down absolute end-3 top-1/2 -translate-y-1/2 text-[10px] opacity-70 pointer-events-none" />
                </div>
              </td>
              <td v-if="admin" class="px-4 py-3.5 font-semibold text-slate-800 truncate max-w-[14rem]">{{ plot.buyerName || '—' }}</td>
              <td v-if="admin" class="px-4 py-3.5 text-slate-700 tabular-nums" dir="ltr"><div class="text-end">{{ plot.buyerPhone || '—' }}</div></td>
              <td v-if="admin" class="px-4 py-3.5 text-slate-600 tabular-nums" dir="ltr"><div class="text-end">{{ plot.deedNo || '—' }}</div></td>
              <td v-if="admin" class="px-4 py-3.5">
                <div class="flex items-center gap-1">
                  <NuxtLink :to="`/admin/plots/${plot.plotNo}/edit`" class="w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#7030A0] hover:bg-[#7030A0]/10" title="تعديل كامل" :aria-label="`تعديل القطعة ${plot.plotNo}`"><i class="pi pi-pencil" /></NuxtLink>
                  <NuxtLink :to="`/plots/${plot.plotNo}`" class="w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" title="عرض السعر" :aria-label="`عرض سعر القطعة ${plot.plotNo}`"><i class="pi pi-eye" /></NuxtLink>
                  <button type="button" class="w-9 h-9 inline-flex items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50" title="أرشفة" :aria-label="`أرشفة القطعة ${plot.plotNo}`" @click="handleArchive(plot.plotNo)"><i class="pi pi-trash" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Pagination -->
    <div v-if="filteredPlots.length > pageSize" class="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
      <div>
        عرض <span class="font-bold text-slate-900">{{ (page - 1) * pageSize + 1 }}</span> إلى <span class="font-bold text-slate-900">{{ Math.min(page * pageSize, filteredPlots.length) }}</span> من أصل <span class="font-bold text-slate-900">{{ filteredPlots.length }}</span>
      </div>
      <div class="flex items-center gap-3">
        <button type="button" :disabled="page === 1" @click="page--" class="h-10 px-5 rounded-full border border-slate-300 bg-white font-semibold text-slate-700 disabled:opacity-40">السابق</button>
        <button type="button" :disabled="page * pageSize >= filteredPlots.length" @click="page++" class="h-10 px-5 rounded-full border border-slate-300 bg-white font-semibold text-slate-700 disabled:opacity-40">التالي</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '@/lib/format';
import type { PublicPlot } from '@/shared/types/plot';
import { ref, computed } from 'vue';
import { useFetch } from '#app';

const props = defineProps({ admin: { type: Boolean, default: false } });

const { data: response, pending } = await useFetch<{ success: boolean; data: PublicPlot[] }>('/api/plots');
const plots = computed(() => response.value?.data || []);

const search = ref('');
const statusFilter = ref('');
const usageFilter = ref('');

const filteredPlots = computed(() => {
  return plots.value.filter((p) => {
    const matchesSearch = search.value
      ? `${p.plotNo} ${p.block} ${p.buyerName ?? ''} ${p.buyerPhone ?? ''} ${p.deedNo ?? ''}`
          .toLowerCase()
          .includes(search.value.toLowerCase())
      : true;
    const matchesStatus = statusFilter.value ? p.status === statusFilter.value : true;
    const matchesUsage = usageFilter.value ? p.usage === usageFilter.value : true;
    return matchesSearch && matchesStatus && matchesUsage;
  });
});

const hasFilters = computed(() => search.value || statusFilter.value || usageFilter.value);
const clearFilters = () => {
  search.value = '';
  statusFilter.value = '';
  usageFilter.value = '';
};

// pagination
const page = ref(1);
const pageSize = 20;
const paginatedPlots = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredPlots.value.slice(start, start + pageSize);
});

// UI helpers (keep same as admin page)
const labelCls = 'block text-[11px] font-bold text-slate-500 mb-1.5';
const inputCls = 'w-full appearance-none ps-4 pe-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 cursor-pointer';

function statusTone(status: string) {
  if (status.includes('مباع')) return 'bg-rose-500 text-white';
  if (status.includes('محجوز')) return 'bg-amber-400 text-white';
  return 'bg-emerald-500 text-white';
}

async function handleQuickStatusChange(plot: PublicPlot, newStatus: string) {
  // call admin endpoint – only works when admin is true
  if (!props.admin) return;
  await $fetch(`/api/admin/plots/${plot.plotNo}`, { method: 'PUT', body: { status: newStatus } });
  plot.status = newStatus as any;
}

async function handleArchive(plotNo: number) {
  if (!props.admin) return;
  await $fetch(`/api/admin/plots/${plotNo}`, { method: 'DELETE' });
  // remove from local list
  const idx = plots.value.findIndex((p) => p.plotNo === plotNo);
  if (idx !== -1) plots.value.splice(idx, 1);
}
</script>

