<template>
  <div class="space-y-8">
    <!-- Admin Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-md bg-[#7030A0] text-white text-xs font-bold">لوحة الإدارة</span>
          <span class="text-xs text-slate-400">إدارة مبيعات وتعديلات مخطط المها</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          مركز تحكم المسؤول
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <!-- <button
          @click="syncFromSheet"
          :disabled="syncing"
          class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2"
        >
          <i :class="['pi pi-sync', syncing ? 'pi-spin text-[#7030A0]' : 'text-slate-400']"></i>
          <span>{{ syncing ? 'جاري المزامنة...' : 'مزامنة من Google Sheets' }}</span>
        </button> -->

        <NuxtLink
          to="/admin/plots/new"
          class="group relative inline-flex items-center justify-center gap-2.5
                overflow-hidden rounded-xl px-5 py-3
                bg-gradient-to-r from-[#7030A0] via-[#8241B5] to-[#7030A0]
                text-white text-xs sm:text-sm font-bold
                shadow-lg shadow-purple-900/20
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:scale-[1.03]
                hover:shadow-xl hover:shadow-purple-900/35
                hover:from-[#8241B5] hover:via-[#963FD0] hover:to-[#7030A0]
                active:translate-y-0 active:scale-[0.97]
                focus:outline-none focus-visible:ring-4
                focus-visible:ring-purple-400/40"
        >
          <!-- Animated shine -->
          <span
            class="absolute inset-0 -translate-x-[120%] skew-x-[-20deg]
                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                  transition-transform duration-700
                  group-hover:translate-x-[120%]"
          ></span>

          <!-- Icon container -->
          <span
            class="relative flex h-7 w-7 items-center justify-center
                  rounded-lg bg-white/15 ring-1 ring-white/20
                  transition-all duration-300
                  group-hover:rotate-90 group-hover:bg-white/25"
          >
            <i class="pi pi-plus text-xs"></i>
          </span>

          <!-- Button text -->
          <span class="relative tracking-wide">
            إضافة قطعة جديدة
          </span>

          <!-- Arrow -->
          <i
            class="pi pi-arrow-left relative text-[10px] opacity-70
                  transition-all duration-300
                  group-hover:-translate-x-1 group-hover:opacity-100"
          ></i>
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Navigation Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink
        to="/admin/plots"
        class="bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#7030A0] hover:shadow-md transition-all group"
      >
        <div class="w-10 h-10 rounded-xl bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
          <i class="pi pi-table"></i>
        </div>
        <h3 class="font-bold text-slate-900 text-base group-hover:text-[#7030A0]">
          إدارة القطع والأسعار
        </h3>
        <p class="text-xs text-slate-500 mt-1">
          تعديل الحالات، المشتري، رقم الصك، والأسعار مع المزامنة مع الشيت
        </p>
      </NuxtLink>

      <NuxtLink
        to="/admin/employees"
        class="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-600 hover:shadow-md transition-all group"
      >
        <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
          <i class="pi pi-users"></i>
        </div>
        <h3 class="font-bold text-slate-900 text-base group-hover:text-indigo-700">
          إدارة الموظفين والصلاحيات
        </h3>
        <p class="text-xs text-slate-500 mt-1">
          إضافة حسابات الموظفين، تعيين كلمات المرور، والصلاحيات الخاصة بكل موظف
        </p>
      </NuxtLink>

      <NuxtLink
        to="/admin/audit"
        class="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-600 hover:shadow-md transition-all group"
      >
        <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
          <i class="pi pi-history"></i>
        </div>
        <h3 class="font-bold text-slate-900 text-base group-hover:text-blue-600">
          سجل العمليات والتغييرات
        </h3>
        <p class="text-xs text-slate-500 mt-1">
          متابعة وتدقيق العمليات والتعديلات التي أجراها الموظفون والمسؤولون
        </p>
      </NuxtLink>

      <NuxtLink
        to="/plots"
        class="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-600 hover:shadow-md transition-all group"
      >
        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
          <i class="pi pi-eye"></i>
        </div>
        <h3 class="font-bold text-slate-900 text-base group-hover:text-emerald-800">
          معاينة الواجهة العامة
        </h3>
        <p class="text-xs text-slate-500 mt-1">
          مشاهدة ما يراه العميل والزوار (خالي تماماً من بيانات المشتري الحساسة)
        </p>
      </NuxtLink>
    </div>

    <!-- Recent Audit Activity -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
          <i class="pi pi-history text-[#7030A0]"></i>
          <span>أحدث العمليات وسجل التعديلات (Audit Log)</span>
        </h3>
        <NuxtLink to="/admin/audit" class="text-xs text-[#7030A0] font-bold hover:underline">
          عرض السجل كاملاً ←
        </NuxtLink>
      </div>

      <div v-if="logsPending" class="p-8 text-center text-slate-400">
        جاري تحميل السجل...
      </div>

      <div v-else-if="auditLogs.length === 0" class="p-8 text-center text-slate-500 text-xs sm:text-sm">
        لا توجد تعديلات مسجلة بعد.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-center border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <th class="px-4 py-3">الوقت والتاريخ</th>
              <th class="px-4 py-3">المسؤول</th>
              <th class="px-4 py-3">نوع الإجراء</th>
              <th class="px-4 py-3">رقم القطعة</th>
              <th class="px-4 py-3 text-start">التفاصيل</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(log, idx) in auditLogs.slice(0, 10)" :key="idx" class="hover:bg-slate-50">
              <td class="px-4 py-3 font-mono text-xs text-slate-500">
                {{ new Date(log.timestamp).toLocaleString('ar-SA') }}
              </td>
              <td class="px-4 py-3 font-semibold text-slate-800">{{ log.adminEmail }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-xs font-bold',
                    log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700' :
                    log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                  ]"
                >
                  {{ log.action }}
                </span>
              </td>
              <td class="px-4 py-3 font-black text-[#7030A0]">قطعة {{ log.plotNo }}</td>
              <td class="px-4 py-3 text-start text-slate-600 truncate max-w-xs font-mono text-2xs">
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

const syncing = ref(false);

const { data: auditResponse, pending: logsPending, refresh: refreshLogs } = await useFetch<{
  success: boolean;
  data: AuditLogEntry[];
}>('/api/admin/audit');

const auditLogs = computed(() => auditResponse.value?.data || []);

const syncFromSheet = async () => {
  syncing.value = true;
  try {
    await $fetch('/api/admin/sync', { method: 'POST' });
    await refreshLogs();
    alert('تمت مزامنة البيانات مباشرة مع Google Sheets بنجاح!');
  } catch (err: any) {
    alert(err.data?.statusMessage || 'حدث خطأ أثناء المزامنة');
  } finally {
    syncing.value = false;
  }
};
</script>

