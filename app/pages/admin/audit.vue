<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <NuxtLink to="/admin" class="text-xs text-slate-400 hover:text-[#7030A0]">الإدارة</NuxtLink>
          <span class="text-xs text-slate-300">/</span>
          <span class="text-xs font-bold text-[#7030A0]">سجل التدقيق</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          سجل التعديلات والعمليات (Audit Log)
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          سجل غير قابل للتعديل لجميع عمليات الإنشاء والتعديل والحذف المنفذة عبر النظام
        </p>
      </div>

      <button
        @click="refresh"
        class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 self-start"
      >
        <i class="pi pi-sync text-slate-400"></i>
        <span>تحديث السجل</span>
      </button>
    </div>

    <!-- Filter Card -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">بحث برقم القطعة أو البريد</label>
          <input
            v-model="search"
            type="text"
            placeholder="ابحث برقم القطعة أو بريد المسؤول..."
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#7030A0]"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">نوع الإجراء</label>
          <select v-model="actionFilter" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
            <option value="">جميع الإجراءات</option>
            <option value="CREATE">CREATE (إضافة)</option>
            <option value="UPDATE">UPDATE (تعديل)</option>
            <option value="DELETE">DELETE (أرشفة/حذف)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Audit Table Card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div v-if="pending" class="p-8 text-center text-slate-400">
        جاري تحميل سجل العمليات...
      </div>

      <div v-else-if="filteredLogs.length === 0" class="p-12 text-center text-slate-500">
        <i class="pi pi-history text-3xl text-slate-300 mb-2"></i>
        <p>لا توجد سجلات مطابقة للبحث</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-center border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <th class="px-4 py-3">التاريخ والوقت</th>
              <th class="px-4 py-3">المسؤول</th>
              <th class="px-4 py-3">الإجراء</th>
              <th class="px-4 py-3">رقم القطعة</th>
              <th class="px-4 py-3 text-start">البيانات السابقة (Before)</th>
              <th class="px-4 py-3 text-start">البيانات المحدثة (After)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(log, idx) in filteredLogs" :key="idx" class="hover:bg-slate-50">
              <td class="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                {{ new Date(log.timestamp).toLocaleString('ar-SA') }}
              </td>
              <td class="px-4 py-3 font-semibold text-slate-800">{{ log.adminEmail }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'px-2.5 py-0.5 rounded text-xs font-bold',
                    log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  ]"
                >
                  {{ log.action }}
                </span>
              </td>
              <td class="px-4 py-3 font-black text-[#7030A0]">قطعة {{ log.plotNo }}</td>
              <td class="px-4 py-3 text-start text-slate-500 font-mono text-2xs truncate max-w-xs">
                {{ log.beforeData || '—' }}
              </td>
              <td class="px-4 py-3 text-start text-slate-800 font-mono text-2xs truncate max-w-xs">
                {{ log.afterData || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AuditLogEntry } from '../../../shared/types/audit';

const { data: response, pending, refresh } = await useFetch<{
  success: boolean;
  data: AuditLogEntry[];
}>('/api/admin/audit');

const logs = computed(() => response.value?.data || []);

const search = ref('');
const actionFilter = ref('');

const filteredLogs = computed(() => {
  let list = logs.value;

  if (actionFilter.value) {
    list = list.filter((l) => l.action === actionFilter.value);
  }

  if (search.value) {
    const s = search.value.trim().toLowerCase();
    list = list.filter((l) => {
      return String(l.plotNo).includes(s) || l.adminEmail.toLowerCase().includes(s);
    });
  }

  return list;
});
</script>

