<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <NuxtLink to="/admin" class="text-xs text-slate-400 hover:text-[#7030A0]">الإدارة</NuxtLink>
          <span class="text-xs text-slate-300">/</span>
          <span class="text-xs font-bold text-[#7030A0]">القطع والمبيعات</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          إدارة القطع والأسعار (لوحة التحكم)
        </h1>
      </div>

      <NuxtLink
        to="/admin/plots/new"
        class="px-4 py-2.5 rounded-xl bg-[#7030A0] text-white hover:bg-[#532277] font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 self-start"
      >
        <i class="pi pi-plus"></i>
        <span>إضافة قطعة جديدة</span>
      </NuxtLink>
    </div>

    <!-- Search & Filter Card -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">بحث شامل (رقم القطعة، البلك، المشتري، الجوال)</label>
          <input
            v-model="search"
            type="text"
            placeholder="ابحث بأي معلومة..."
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#7030A0]"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">حالة البيع</label>
          <select
            v-model="statusFilter"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
          >
            <option value="">جميع الحالات</option>
            <option value="متاح للبيع">متاح للبيع</option>
            <option value="محجوز">محجوز</option>
            <option value="مباع">مباع</option>
            <option value="مؤرشف">مؤرشف</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">الاستخدام</label>
          <select
            v-model="usageFilter"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
          >
            <option value="">جميع الاستخدامات</option>
            <option value="سكنى">سكنى</option>
            <option value="تجارى">تجارى</option>
            <option value="مرافق">مرافق</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Plots Table Card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div v-if="pending" class="p-8 text-center text-slate-400">
        جاري تحميل جدول الإدارة...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-center border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <th class="px-3 py-3 w-16">رقم القطعة</th>
              <th class="px-3 py-3 w-14">البلك</th>
              <th class="px-3 py-3">الاستخدام</th>
              <th class="px-3 py-3">المساحة</th>
              <th class="px-3 py-3">سعر المتر</th>
              <th class="px-3 py-3">قيمة الأرض</th>
              <th class="px-3 py-3 w-32">تعديل الحالة السريع</th>
              <th class="px-3 py-3">اسم المشتري</th>
              <th class="px-3 py-3">الجوال</th>
              <th class="px-3 py-3">رقم الصك</th>
              <th class="px-3 py-3 w-28">إجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="plot in paginatedPlots" :key="plot.plotNo" class="hover:bg-slate-50/70">
              <td class="px-3 py-2.5 font-black text-[#7030A0] text-sm">
                {{ plot.plotNo }}
              </td>
              <td class="px-3 py-2.5 font-bold text-slate-800">{{ plot.block }}</td>
              <td class="px-3 py-2.5">{{ plot.usage }}</td>
              <td class="px-3 py-2.5 font-medium">{{ plot.area }} م²</td>
              <td class="px-3 py-2.5 font-medium">{{ plot.pricePerM2 }}</td>
              <td class="px-3 py-2.5 font-bold text-slate-900">{{ formatCurrencyNumber(plot.landValue) }}</td>
              <td class="px-3 py-2.5">
                <select
                  :value="plot.status"
                  @change="handleQuickStatusChange(plot, ($event.target as HTMLSelectElement).value)"
                  class="px-2 py-1 rounded-lg text-xs font-semibold border border-slate-300 bg-white"
                >
                  <option value="متاح للبيع">متاح للبيع</option>
                  <option value="محجوز">محجوز</option>
                  <option value="مباع">مباع</option>
                  <option value="مؤرشف">مؤرشف</option>
                </select>
              </td>
              <td class="px-3 py-2.5 font-semibold text-slate-800 truncate max-w-xs">
                {{ plot.buyerName || '—' }}
              </td>
              <td class="px-3 py-2.5 font-mono text-slate-600 dir-ltr text-end">
                {{ plot.buyerPhone || '—' }}
              </td>
              <td class="px-3 py-2.5 font-mono text-2xs text-slate-500">
                {{ plot.deedNo || '—' }}
              </td>
              <td class="px-3 py-2.5">
                <div class="flex items-center justify-center gap-1">
                  <NuxtLink
                    :to="`/admin/plots/${plot.plotNo}/edit`"
                    class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                    title="تعديل كامل"
                  >
                    <i class="pi pi-pencil"></i>
                  </NuxtLink>
                  <NuxtLink
                    :to="`/plots/${plot.plotNo}`"
                    class="p-1.5 rounded-lg text-[#7030A0] hover:bg-purple-50"
                    title="عرض السعر"
                  >
                    <i class="pi pi-eye"></i>
                  </NuxtLink>
                  <button
                    @click="handleArchive(plot.plotNo)"
                    class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                    title="أرشفة"
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
      <div v-if="filteredPlots.length > pageSize" class="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div>
          عرض {{ (page - 1) * pageSize + 1 }} إلى {{ Math.min(page * pageSize, filteredPlots.length) }} من أصل {{ filteredPlots.length }}
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="page = Math.max(1, page - 1)"
            :disabled="page === 1"
            class="px-3 py-1 rounded border disabled:opacity-30"
          >
            السابق
          </button>
          <span>صفحة {{ page }} من {{ totalPages }}</span>
          <button
            @click="page = Math.min(totalPages, page + 1)"
            :disabled="page === totalPages"
            class="px-3 py-1 rounded border disabled:opacity-30"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '../../../../lib/format';
import { normalizeArabic } from '../../../../lib/arabic';
import type { Plot } from '../../../shared/types/plot';

const { data: response, pending, refresh } = await useFetch<{ success: boolean; data: Plot[] }>('/api/plots');
const plots = computed(() => response.value?.data || []);

const search = ref('');
const statusFilter = ref('');
const usageFilter = ref('');
const page = ref(1);
const pageSize = 40;

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

