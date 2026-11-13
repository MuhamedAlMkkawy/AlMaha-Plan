
<template>
  <div class="admin-dashboard space-y-8 sm:space-y-10" dir="rtl">

    <!-- ================= PAGE HEADER ================= -->
    <header class="relative overflow-hidden rounded-[28px] bg-[#171023] text-white shadow-xl shadow-purple-950/10">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-purple-600/20 blur-[90px]"></div>
        <div class="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-amber-400/10 blur-[100px]"></div>
        <div class="admin-grid absolute inset-0 opacity-[0.06]"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-[10px] font-black tracking-wider text-amber-300">
              <i class="pi pi-shield text-[10px]"></i>
              لوحة الإدارة
            </span>

            <span class="text-xs font-medium text-white/45">
              إدارة مبيعات وتعديلات مخطط المها
            </span>
          </div>

          <h1 class="mt-5 text-2xl font-black leading-relaxed sm:text-3xl lg:text-[38px]">
            مركز تحكم المسؤول
          </h1>

          <p class="mt-2 max-w-2xl text-xs leading-7 text-white/55 sm:text-sm sm:leading-8">
            منصة موحدة لإدارة القطع والأسعار والموظفين والصلاحيات،
            مع متابعة التعديلات والعمليات الإدارية المهمة داخل النظام.
          </p>

          <div class="mt-5 flex flex-wrap items-center gap-3 text-[10px] font-semibold text-white/50">
            <span class="inline-flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
              النظام الإداري
            </span>
            <span class="h-1 w-1 rounded-full bg-white/25"></span>
            <span>إدارة ومراقبة مركزية</span>
          </div>
        </div>

        <div class="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <NuxtLink
            to="/admin/plots/new"
            class="add-plot-btn group relative inline-flex min-h-[54px] items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-l from-[#ffc928] via-[#ffda64] to-[#ffc928] px-6 text-sm font-black text-[#281a32] shadow-lg shadow-amber-500/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/25 active:translate-y-0"
          >
            <span class="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>

            <span class="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#171023]/10 transition-transform duration-300 group-hover:rotate-90">
              <i class="pi pi-plus text-sm"></i>
            </span>

            <span class="relative">إضافة قطعة جديدة</span>
            <i class="pi pi-arrow-left relative text-[10px] transition-transform group-hover:-translate-x-1"></i>
          </NuxtLink>
        </div>
      </div>

      <div class="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-l from-transparent via-[#ffc928] to-transparent opacity-80"></div>
    </header>

    <!-- ================= SECTION INTRO ================= -->
    <section>
      <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#7030A0]">
            <span class="h-px w-6 bg-[#ffc928]"></span>
            Workspace navigation
          </div>

          <h2 class="mt-2 text-lg font-black text-slate-900 sm:text-xl">
            الوصول السريع
          </h2>

          <p class="mt-1 text-xs leading-6 text-slate-500">
            انتقل مباشرة إلى القسم الذي ترغب في إدارته.
          </p>
        </div>

        <span class="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-500">
          <i class="pi pi-th-large text-[#7030A0]"></i>
          الأقسام الرئيسية
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <!-- Plots -->
        <NuxtLink to="/admin/plots" class="nav-card group">
          <div class="nav-card-top">
            <div class="nav-icon bg-purple-50 text-[#7030A0] group-hover:bg-[#7030A0] group-hover:text-white">
              <i class="pi pi-map text-xl"></i>
            </div>
            <span class="nav-number text-purple-100">01</span>
          </div>

          <div class="mt-5">
            <h3 class="text-sm font-black text-slate-900 transition-colors group-hover:text-[#7030A0] sm:text-base">
              إدارة القطع والأسعار
            </h3>

            <p class="mt-2 text-xs leading-7 text-slate-500">
              تعديل الحالات والمشتري ورقم الصك والأسعار، مع المزامنة مع جداول البيانات.
            </p>
          </div>

          <div class="nav-card-footer">
            <span>إدارة الأراضي</span>
            <i class="pi pi-arrow-left transition-transform group-hover:-translate-x-1"></i>
          </div>
        </NuxtLink>

        <!-- Employees -->
        <NuxtLink to="/admin/employees" class="nav-card group">
          <div class="nav-card-top">
            <div class="nav-icon bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
              <i class="pi pi-users text-xl"></i>
            </div>
            <span class="nav-number text-indigo-100">02</span>
          </div>

          <div class="mt-5">
            <h3 class="text-sm font-black text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-base">
              إدارة الموظفين والصلاحيات
            </h3>

            <p class="mt-2 text-xs leading-7 text-slate-500">
              إضافة حسابات الموظفين وتعيين كلمات المرور وإدارة صلاحيات الوصول ومراجعة نشاط كل موظف.
            </p>
          </div>

          <div class="nav-card-footer">
            <span>إدارة الفريق</span>
            <i class="pi pi-arrow-left transition-transform group-hover:-translate-x-1"></i>
          </div>
        </NuxtLink>

        <!-- Audit -->
        <NuxtLink to="/admin/audit" class="nav-card group">
          <div class="nav-card-top">
            <div class="nav-icon bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
              <i class="pi pi-history text-xl"></i>
            </div>
            <span class="nav-number text-blue-100">03</span>
          </div>

          <div class="mt-5">
            <h3 class="text-sm font-black text-slate-900 transition-colors group-hover:text-blue-600 sm:text-base">
              سجل العمليات والتغييرات
            </h3>

            <p class="mt-2 text-xs leading-7 text-slate-500">
              مراجعة التعديلات الإدارية المهمة وعمليات إدارة القطع والأسعار والموظفين.
            </p>
          </div>

          <div class="nav-card-footer">
            <span>مراقبة التعديلات</span>
            <i class="pi pi-arrow-left transition-transform group-hover:-translate-x-1"></i>
          </div>
        </NuxtLink>

        <!-- Public View -->
        <NuxtLink to="/plots" class="nav-card group">
          <div class="nav-card-top">
            <div class="nav-icon bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white">
              <i class="pi pi-eye text-xl"></i>
            </div>
            <span class="nav-number text-amber-100">04</span>
          </div>

          <div class="mt-5">
            <h3 class="text-sm font-black text-slate-900 transition-colors group-hover:text-amber-600 sm:text-base">
              معاينة الواجهة العامة
            </h3>

            <p class="mt-2 text-xs leading-7 text-slate-500">
              معاينة تجربة العملاء والزوار دون إظهار بيانات المشتري الحساسة.
            </p>
          </div>

          <div class="nav-card-footer">
            <span>عرض الموقع</span>
            <i class="pi pi-arrow-left transition-transform group-hover:-translate-x-1"></i>
          </div>
        </NuxtLink>

      </div>
    </section>

    <!-- ================= AUDIT LOG ================= -->
    <section class="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm">

      <!-- Audit Header -->
      <div class="relative overflow-hidden border-b border-slate-100 bg-gradient-to-l from-[#faf7fc] via-white to-white px-5 py-6 sm:px-7">
        <div class="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-[#ffc928] to-[#7030A0]"></div>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7030A0] text-white shadow-lg shadow-purple-900/15">
              <i class="pi pi-history text-xl"></i>
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-base font-black text-slate-900 sm:text-lg">
                  سجل العمليات والتعديلات
                </h2>

                <span class="rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-[9px] font-black text-[#7030A0]">
                  AUDIT LOG
                </span>
              </div>

              <p class="mt-1 text-xs leading-6 text-slate-500">
                متابعة أحدث التعديلات الإدارية المهمة فقط
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="refreshLogs"
              :disabled="logsPending"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 transition-all hover:border-purple-200 hover:bg-purple-50 hover:text-[#7030A0] disabled:cursor-not-allowed disabled:opacity-50"
              title="تحديث السجل"
            >
              <i :class="logsPending ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"></i>
              تحديث
            </button>

            <NuxtLink
              to="/admin/audit"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#7030A0] px-4 text-xs font-bold text-white shadow-md shadow-purple-900/15 transition-all hover:-translate-y-0.5 hover:bg-[#57227f] hover:shadow-lg"
            >
              عرض السجل كاملاً
              <i class="pi pi-arrow-left text-[10px]"></i>
            </NuxtLink>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-400">
          <span class="inline-flex items-center gap-1.5">
            <i class="pi pi-shield text-[#7030A0]"></i>
            سجل تعديلات النظام
          </span>
          <span class="text-slate-200">/</span>
          <span>أحدث العمليات الإدارية</span>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="logsPending"
        class="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center"
      >
        <div class="relative flex h-16 w-16 items-center justify-center">
          <div class="absolute inset-0 rounded-full border-4 border-purple-100"></div>
          <div class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#7030A0]"></div>
          <i class="pi pi-history text-xl text-[#7030A0]"></i>
        </div>

        <p class="mt-5 text-sm font-black text-slate-800">
          جارٍ تحميل التعديلات الإدارية
        </p>

        <p class="mt-2 text-xs text-slate-400">
          يرجى الانتظار قليلاً حتى يتم تحميل أحدث البيانات
        </p>
      </div>

      <!-- Error -->
      <div
        v-else-if="auditError"
        class="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center"
      >
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <i class="pi pi-exclamation-triangle text-2xl"></i>
        </div>

        <p class="mt-5 text-sm font-black text-slate-800">
          تعذر تحميل سجل العمليات
        </p>

        <p class="mt-2 max-w-sm text-xs leading-7 text-slate-400">
          حدث خطأ أثناء جلب البيانات. يمكنك المحاولة مرة أخرى.
        </p>

        <button
          type="button"
          @click="refreshLogs"
          class="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#7030A0] px-5 text-xs font-bold text-white transition-all hover:bg-[#57227f]"
        >
          <i class="pi pi-refresh"></i>
          إعادة المحاولة
        </button>
      </div>

      <!-- Empty -->
      <div
        v-else-if="auditLogs.length === 0"
        class="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center"
      >
        <div class="flex h-20 w-20 items-center justify-center rounded-[26px] bg-slate-50 text-slate-300">
          <i class="pi pi-inbox text-3xl"></i>
        </div>

        <p class="mt-5 text-sm font-black text-slate-800">
          لا توجد تعديلات إدارية لعرضها
        </p>

        <p class="mt-2 max-w-sm text-xs leading-7 text-slate-400">
          ستظهر هنا عمليات إدارة القطع والأسعار والموظفين والتعديلات المهمة.
          يتم الاحتفاظ بسجلات الدخول والخروج ضمن تفاصيل الموظفين.
        </p>
      </div>

      <!-- Audit Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[850px] border-collapse text-center text-xs sm:text-sm">

          <thead>
            <tr class="border-b border-slate-100 bg-[#faf9fc] text-[10px] font-black text-slate-500 sm:text-[11px]">
              <th class="whitespace-nowrap px-5 py-5">التاريخ والوقت</th>
              <th class="whitespace-nowrap px-5 py-5">منفذ العملية</th>
              <th class="whitespace-nowrap px-5 py-5">نوع العملية</th>
              <th class="whitespace-nowrap px-5 py-5">رقم القطعة</th>
              <th class="min-w-[260px] px-5 py-5 text-start">تفاصيل العملية</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(log, idx) in displayedAuditLogs"
              :key="log.timestamp + '-' + idx"
              class="audit-row"
            >
              <!-- Date -->
              <td class="whitespace-nowrap px-5 py-5">
                <div class="inline-flex flex-col items-center gap-1">
                  <span class="font-bold text-slate-700">
                    {{ formatAuditDate(log.timestamp) }}
                  </span>
                  <span class="text-[9px] font-medium text-slate-400">
                    وقت تسجيل العملية
                  </span>
                </div>
              </td>

              <!-- User -->
              <td class="px-5 py-5">
                <div class="flex min-w-[150px] flex-col items-center gap-2">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                    <i class="pi pi-user text-sm"></i>
                  </div>

                  <span
                    class="max-w-[180px] truncate text-[11px] font-bold text-slate-700"
                    dir="ltr"
                    :title="log.adminEmail || 'غير محدد'"
                  >
                    {{ log.adminEmail || 'غير محدد' }}
                  </span>
                </div>
              </td>

              <!-- Action -->
              <td class="px-5 py-5">
                <span
                  :class="[
                    'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black whitespace-nowrap',
                    getAuditActionStyle(log.action)
                  ]"
                >
                  <i :class="getAuditActionIcon(log.action)"></i>
                  {{ translateAuditAction(log.action) }}
                </span>
              </td>

              <!-- Plot -->
              <td class="px-5 py-5">
                <span
                  v-if="log.plotNo"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-purple-100 bg-purple-50 px-3 py-2 font-black text-[#7030A0] whitespace-nowrap"
                >
                  <i class="pi pi-map-marker text-[10px]"></i>
                  قطعة {{ log.plotNo }}
                </span>

                <span v-else class="text-slate-300">—</span>
              </td>

              <!-- Details -->
              <td class="px-5 py-5 text-start">
                <div class="max-w-md whitespace-pre-line break-words text-[11px] leading-7 text-slate-600">
                  {{ formatAuditDetails(log.afterData) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Audit Footer -->
      <div
        v-if="!logsPending && !auditError && auditLogs.length > 0"
        class="flex flex-col gap-3 border-t border-slate-100 bg-[#faf9fc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"
      >
        <span class="text-[10px] font-semibold text-slate-400">
          عرض أحدث
          <strong class="text-slate-700">{{ displayedAuditLogs.length }}</strong>
          من أصل
          <strong class="text-slate-700">{{ auditLogs.length }}</strong>
          عملية إدارية
        </span>

        <NuxtLink
          to="/admin/audit"
          class="inline-flex items-center gap-2 text-xs font-black text-[#7030A0] transition-colors hover:text-[#57227f]"
        >
          عرض جميع العمليات
          <i class="pi pi-arrow-left text-[10px]"></i>
        </NuxtLink>
      </div>
    </section>

    <!-- ================= BOTTOM NOTE ================= -->
    <div class="flex flex-col gap-3 rounded-2xl border border-purple-100/80 bg-gradient-to-l from-purple-50/70 via-white to-amber-50/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7030A0] text-white">
          <i class="pi pi-lock text-sm"></i>
        </div>

        <div>
          <p class="text-xs font-black text-slate-800">
            بيئة الإدارة المحمية
          </p>
          <p class="mt-1 text-[10px] leading-5 text-slate-500">
            يتم الاحتفاظ بسجلات النشاط، مع تخصيص سجل الموظف لعرض عمليات الدخول والخروج.
          </p>
        </div>
      </div>

      <span class="inline-flex items-center gap-2 text-[10px] font-bold text-[#7030A0]">
        <i class="pi pi-shield"></i>
        إدارة ومراقبة مركزية
      </span>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { AuditLogEntry } from '../../../shared/types/audit';

// ==========================================
// STATE
// ==========================================

const syncing = ref(false);

const {
  data: auditResponse,
  pending: logsPending,
  refresh: refreshLogs,
  error: auditError,
} = await useFetch<{
  success: boolean;
  data: AuditLogEntry[];
}>('/api/admin/audit');

// ==========================================
// AUDIT FILTERING
// ==========================================

// Authentication events belong to employee details,
// not the main administration dashboard.

const authenticationActions = new Set([
  'LOGIN',
  'LOGOUT',
  'EMPLOYEE_LOGIN',
  'EMPLOYEE_LOGOUT',
]);

// Roles that should not appear in the dashboard audit.

const adminRoles = new Set([
  'ADMIN',
  'SUPER_ADMIN',
  'SUPERADMIN',
  'ADMINISTRATOR',
]);

// Read the actor role from the available audit record fields.
// The API should provide one of these fields for reliable filtering.

type ExtendedAuditLog = AuditLogEntry & {
  actorRole?: string;
  userRole?: string;
  role?: string;
  performedByRole?: string;
  actor?: {
    role?: string;
  };
  user?: {
    role?: string;
  };
  performedBy?: {
    role?: string;
  };
  isAdmin?: boolean;
};

const isAuthenticationLog = (log: AuditLogEntry): boolean => {
  const action = String(log.action || '').trim().toUpperCase();

  return authenticationActions.has(action);
};

const isAdminAuditLog = (log: AuditLogEntry): boolean => {
  const record = log as ExtendedAuditLog;

  if (record.isAdmin === true) {
    return true;
  }

  const role = String(
    record.actorRole ||
    record.userRole ||
    record.performedByRole ||
    record.role ||
    record.actor?.role ||
    record.user?.role ||
    record.performedBy?.role ||
    ''
  ).trim().toUpperCase();

  return adminRoles.has(role);
};

// All eligible audit operations.

const auditLogs = computed<AuditLogEntry[]>(() => {
  const logs = auditResponse.value?.data || [];

  return logs.filter((log) => {
    // Remove login/logout events.
    if (isAuthenticationLog(log)) {
      return false;
    }

    // Remove administrator-performed operations.
    if (isAdminAuditLog(log)) {
      return false;
    }

    return true;
  });
});

// Display only the latest 10 eligible records.

const displayedAuditLogs = computed(() => {
  return auditLogs.value.slice(0, 10);
});

// ==========================================
// ACTION TRANSLATIONS
// ==========================================

const auditActionTranslations: Record<string, string> = {
  CREATE: 'إنشاء جديد',
  UPDATE: 'تعديل البيانات',
  DELETE: 'حذف',

  LOGIN: 'تسجيل الدخول',
  LOGOUT: 'تسجيل الخروج',

  EMPLOYEE_CREATE: 'إضافة موظف',
  EMPLOYEE_UPDATE: 'تعديل بيانات موظف',
  EMPLOYEE_DELETE: 'حذف موظف',
  EMPLOYEE_LOGIN: 'تسجيل دخول موظف',
  EMPLOYEE_LOGOUT: 'تسجيل خروج موظف',

  PERMISSION_UPDATE: 'تعديل الصلاحيات',
  PERMISSIONS_UPDATE: 'تحديث الصلاحيات',
  EMPLOYEE_PERMISSION_UPDATE: 'تعديل صلاحيات الموظف',

  PLOT_CREATE: 'إضافة قطعة أرض',
  PLOT_UPDATE: 'تعديل بيانات قطعة',
  PLOT_DELETE: 'حذف قطعة أرض',

  PRICE_UPDATE: 'تعديل السعر',
  STATUS_UPDATE: 'تغيير حالة القطعة',
  BUYER_UPDATE: 'تعديل بيانات المشتري',

  SYNC: 'مزامنة البيانات',
  GOOGLE_SHEETS_SYNC: 'مزامنة جداول البيانات',
};

// ==========================================
// ACTION COLORS
// ==========================================

const auditActionStyles: Record<string, string> = {
  CREATE: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  EMPLOYEE_CREATE: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  PLOT_CREATE: 'border-emerald-100 bg-emerald-50 text-emerald-700',

  UPDATE: 'border-blue-100 bg-blue-50 text-blue-700',
  EMPLOYEE_UPDATE: 'border-blue-100 bg-blue-50 text-blue-700',
  PERMISSION_UPDATE: 'border-blue-100 bg-blue-50 text-blue-700',
  PERMISSIONS_UPDATE: 'border-blue-100 bg-blue-50 text-blue-700',
  EMPLOYEE_PERMISSION_UPDATE: 'border-blue-100 bg-blue-50 text-blue-700',
  PLOT_UPDATE: 'border-blue-100 bg-blue-50 text-blue-700',
  PRICE_UPDATE: 'border-blue-100 bg-blue-50 text-blue-700',
  STATUS_UPDATE: 'border-blue-100 bg-blue-50 text-blue-700',
  BUYER_UPDATE: 'border-blue-100 bg-blue-50 text-blue-700',

  LOGIN: 'border-indigo-100 bg-indigo-50 text-indigo-700',
  EMPLOYEE_LOGIN: 'border-indigo-100 bg-indigo-50 text-indigo-700',

  LOGOUT: 'border-slate-200 bg-slate-100 text-slate-600',
  EMPLOYEE_LOGOUT: 'border-slate-200 bg-slate-100 text-slate-600',

  DELETE: 'border-rose-100 bg-rose-50 text-rose-700',
  EMPLOYEE_DELETE: 'border-rose-100 bg-rose-50 text-rose-700',
  PLOT_DELETE: 'border-rose-100 bg-rose-50 text-rose-700',

  SYNC: 'border-amber-100 bg-amber-50 text-amber-700',
  GOOGLE_SHEETS_SYNC: 'border-amber-100 bg-amber-50 text-amber-700',
};

// ==========================================
// ACTION ICONS
// ==========================================

const auditActionIcons: Record<string, string> = {
  CREATE: 'pi pi-plus-circle',
  UPDATE: 'pi pi-pencil',
  DELETE: 'pi pi-trash',
  LOGIN: 'pi pi-sign-in',
  LOGOUT: 'pi pi-sign-out',

  EMPLOYEE_CREATE: 'pi pi-user-plus',
  EMPLOYEE_UPDATE: 'pi pi-user-edit',
  EMPLOYEE_DELETE: 'pi pi-user-minus',
  EMPLOYEE_LOGIN: 'pi pi-sign-in',
  EMPLOYEE_LOGOUT: 'pi pi-sign-out',

  PERMISSION_UPDATE: 'pi pi-shield',
  PERMISSIONS_UPDATE: 'pi pi-shield',
  EMPLOYEE_PERMISSION_UPDATE: 'pi pi-shield',

  PLOT_CREATE: 'pi pi-plus',
  PLOT_UPDATE: 'pi pi-pencil',
  PLOT_DELETE: 'pi pi-trash',

  PRICE_UPDATE: 'pi pi-dollar',
  STATUS_UPDATE: 'pi pi-sync',
  BUYER_UPDATE: 'pi pi-user-edit',

  SYNC: 'pi pi-sync',
  GOOGLE_SHEETS_SYNC: 'pi pi-file-excel',
};

// ==========================================
// TRANSLATION HELPERS
// ==========================================

const translateAuditAction = (action: string) => {
  const key = String(action || '').toUpperCase();

  return auditActionTranslations[key] || 'عملية أخرى';
};

const getAuditActionStyle = (action: string) => {
  const key = String(action || '').toUpperCase();

  return auditActionStyles[key] || 'border-slate-200 bg-slate-100 text-slate-600';
};

const getAuditActionIcon = (action: string) => {
  const key = String(action || '').toUpperCase();

  return auditActionIcons[key] || 'pi pi-info-circle';
};

// ==========================================
// ARABIC FIELD TRANSLATIONS
// ==========================================

const auditFieldTranslations: Record<string, string> = {
  id: 'المعرّف',
  name: 'الاسم',
  email: 'البريد الإلكتروني',
  adminEmail: 'البريد الإلكتروني للمسؤول',
  employeeEmail: 'البريد الإلكتروني للموظف',

  role: 'الدور الوظيفي',
  permissions: 'الصلاحيات',
  permission: 'الصلاحية',

  password: 'كلمة المرور',
  ip: 'عنوان الاتصال',
  time: 'وقت العملية',
  timestamp: 'تاريخ العملية',

  plotNo: 'رقم القطعة',
  plotNumber: 'رقم القطعة',

  price: 'السعر',
  status: 'الحالة',
  buyer: 'المشتري',
  buyerName: 'اسم المشتري',
  buyerPhone: 'رقم هاتف المشتري',

  deedNo: 'رقم الصك',
  deedNumber: 'رقم الصك',

  notes: 'ملاحظات',
  oldValue: 'القيمة السابقة',
  newValue: 'القيمة الجديدة',

  before: 'قبل التعديل',
  after: 'بعد التعديل',
  action: 'نوع العملية',

  createdAt: 'تاريخ الإضافة',
  updatedAt: 'تاريخ التحديث',
};

// ==========================================
// VALUE TRANSLATIONS
// ==========================================

const auditValueTranslations: Record<string, string> = {
  ACTIVE: 'نشط',
  INACTIVE: 'غير نشط',
  AVAILABLE: 'متاحة',
  SOLD: 'مباعة',
  RESERVED: 'محجوزة',
  PENDING: 'قيد الانتظار',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',

  ADMIN: 'مسؤول',
  EMPLOYEE: 'موظف',

  TRUE: 'نعم',
  FALSE: 'لا',
};

// ==========================================
// FORMAT AUDIT VALUES
// ==========================================

const translateAuditValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return 'غير محدد';
  }

  if (typeof value === 'boolean') {
    return value ? 'نعم' : 'لا';
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => translateAuditValue(item))
      .join('، ');
  }

  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => {
        const label = auditFieldTranslations[key] || key;

        return `${label}: ${translateAuditValue(val)}`;
      })
      .join('\n');
  }

  if (typeof value === 'string') {
    const normalized = value.toUpperCase();

    return auditValueTranslations[normalized] || value;
  }

  return String(value);
};

// ==========================================
// FORMAT AUDIT DETAILS
// ==========================================

const formatAuditDetails = (data: unknown): string => {
  if (!data) {
    return 'لا توجد تفاصيل إضافية';
  }

  if (typeof data === 'object') {
    return translateAuditValue(data);
  }

  if (typeof data !== 'string') {
    return String(data);
  }

  try {
    const parsed = JSON.parse(data);

    return translateAuditValue(parsed);
  } catch {
    return data;
  }
};

// ==========================================
// ARABIC DATE FORMATTING
// ==========================================

const formatAuditDate = (
  timestamp: string | number | Date
): string => {
  if (!timestamp) {
    return 'تاريخ غير معروف';
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'تاريخ غير معروف';
  }

  return new Intl.DateTimeFormat('ar-SA', {
    calendar: 'gregory',
    numberingSystem: 'arab',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

// ==========================================
// GOOGLE SHEETS SYNCHRONIZATION
// ==========================================

const syncFromSheet = async () => {
  syncing.value = true;

  try {
    await $fetch('/api/admin/sync', {
      method: 'POST',
    });

    await refreshLogs();

    alert('تمت مزامنة البيانات مع جداول بيانات Google بنجاح!');
  } catch (err: any) {
    alert(
      err.data?.statusMessage ||
      'حدث خطأ أثناء مزامنة البيانات. يرجى المحاولة مرة أخرى.'
    );
  } finally {
    syncing.value = false;
  }
};
</script>

<style scoped>
.admin-dashboard {
  --admin-purple: #7030a0;
  --admin-purple-dark: #57227f;
  --admin-gold: #ffc928;
}

/* Subtle architectural grid */
.admin-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, black, transparent 90%);
}

/* Navigation cards */
.nav-card {
  position: relative;
  display: flex;
  min-height: 245px;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e8e8ef;
  border-radius: 23px;
  background: #fff;
  padding: 22px;
  box-shadow: 0 2px 8px rgba(20, 15, 35, 0.025);
  transition:
    transform 300ms ease,
    border-color 300ms ease,
    box-shadow 300ms ease;
}

.nav-card::before {
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #7030a0, #ffc928, transparent);
  content: "";
  opacity: 0;
  transition: opacity 300ms ease;
}

.nav-card:hover {
  transform: translateY(-5px);
  border-color: rgba(112, 48, 160, 0.25);
  box-shadow: 0 16px 36px rgba(55, 30, 80, 0.09);
}

.nav-card:hover::before {
  opacity: 1;
}

.nav-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-icon {
  display: flex;
  width: 49px;
  height: 49px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  transition:
    background-color 300ms ease,
    color 300ms ease,
    transform 300ms ease;
}

.nav-card:hover .nav-icon {
  transform: rotate(-5deg) scale(1.06);
}

.nav-number {
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
  opacity: 0.9;
}

.nav-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 17px;
  color: #7030a0;
  font-size: 10px;
  font-weight: 900;
}

/* Audit rows */
.audit-row {
  transition: background-color 200ms ease;
}

.audit-row:hover {
  background: #faf7fc;
}

@media (max-width: 640px) {
  .nav-card {
    min-height: 220px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-card,
  .nav-card::before,
  .nav-icon,
  .add-plot-btn,
  .audit-row {
    transition: none !important;
    animation: none !important;
  }
}
</style>
