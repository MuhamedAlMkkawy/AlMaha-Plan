
<template>
  <div class="space-y-8" dir="rtl">

    <!-- ================= ADMIN HEADER ================= -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-md bg-[#7030A0] text-white text-xs font-bold">
            لوحة الإدارة
          </span>
          <span class="text-xs text-slate-400">
            إدارة مبيعات وتعديلات مخطط المها
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          مركز تحكم المسؤول
        </h1>
      </div>

      <div class="flex items-center gap-3">
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
          <span
            class="absolute inset-0 -translate-x-[120%] skew-x-[-20deg]
                   bg-gradient-to-r from-transparent via-white/20 to-transparent
                   transition-transform duration-700
                   group-hover:translate-x-[120%]"
          ></span>

          <span
            class="relative flex h-7 w-7 items-center justify-center
                   rounded-lg bg-white/15 ring-1 ring-white/20
                   transition-all duration-300
                   group-hover:rotate-90 group-hover:bg-white/25"
          >
            <i class="pi pi-plus text-xs"></i>
          </span>

          <span class="relative tracking-wide">
            إضافة قطعة جديدة
          </span>

          <i
            class="pi pi-arrow-left relative text-[10px] opacity-70
                   transition-all duration-300
                   group-hover:-translate-x-1 group-hover:opacity-100"
          ></i>
        </NuxtLink>
      </div>
    </div>

    <!-- ================= QUICK NAVIGATION ================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Plots -->
      <NuxtLink
        to="/admin/plots"
        class="bg-white rounded-2xl border border-slate-200 p-5
               hover:border-[#7030A0] hover:shadow-md transition-all group"
      >
        <div
          class="w-10 h-10 rounded-xl bg-purple-100 text-[#7030A0]
                 flex items-center justify-center font-bold text-lg mb-3
                 group-hover:scale-105 transition-transform"
        >
          <i class="pi pi-table"></i>
        </div>

        <h3 class="font-bold text-slate-900 text-base group-hover:text-[#7030A0]">
          إدارة القطع والأسعار
        </h3>

        <p class="text-xs text-slate-500 mt-1 leading-6">
          تعديل الحالات، والمشتري، ورقم الصك، والأسعار مع المزامنة مع جداول البيانات.
        </p>
      </NuxtLink>

      <!-- Employees -->
      <NuxtLink
        to="/admin/employees"
        class="bg-white rounded-2xl border border-slate-200 p-5
               hover:border-indigo-600 hover:shadow-md transition-all group"
      >
        <div
          class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700
                 flex items-center justify-center font-bold text-lg mb-3
                 group-hover:scale-105 transition-transform"
        >
          <i class="pi pi-users"></i>
        </div>

        <h3 class="font-bold text-slate-900 text-base group-hover:text-indigo-700">
          إدارة الموظفين والصلاحيات
        </h3>

        <p class="text-xs text-slate-500 mt-1 leading-6">
          إضافة حسابات الموظفين، وتعيين كلمات المرور، وإدارة صلاحيات كل موظف.
        </p>
      </NuxtLink>

      <!-- Audit -->
      <NuxtLink
        to="/admin/audit"
        class="bg-white rounded-2xl border border-slate-200 p-5
               hover:border-blue-600 hover:shadow-md transition-all group"
      >
        <div
          class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600
                 flex items-center justify-center font-bold text-lg mb-3
                 group-hover:scale-105 transition-transform"
        >
          <i class="pi pi-history"></i>
        </div>

        <h3 class="font-bold text-slate-900 text-base group-hover:text-blue-600">
          سجل العمليات والتغييرات
        </h3>

        <p class="text-xs text-slate-500 mt-1 leading-6">
          متابعة وتدقيق جميع العمليات والتعديلات التي أجراها الموظفون والمسؤولون.
        </p>
      </NuxtLink>

      <!-- Public View -->
      <NuxtLink
        to="/plots"
        class="bg-white rounded-2xl border border-slate-200 p-5
               hover:border-emerald-600 hover:shadow-md transition-all group"
      >
        <div
          class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800
                 flex items-center justify-center font-bold text-lg mb-3
                 group-hover:scale-105 transition-transform"
        >
          <i class="pi pi-eye"></i>
        </div>

        <h3 class="font-bold text-slate-900 text-base group-hover:text-emerald-800">
          معاينة الواجهة العامة
        </h3>

        <p class="text-xs text-slate-500 mt-1 leading-6">
          مشاهدة ما يراه العملاء والزوار دون إظهار بيانات المشتري الحساسة.
        </p>
      </NuxtLink>
    </div>

    <!-- ================= AUDIT LOG ================= -->
    <div
      class="bg-white rounded-2xl border border-slate-200/80
             shadow-sm overflow-hidden"
    >

      <!-- Audit Header -->
      <div
        class="p-5 border-b border-slate-100
               flex flex-col sm:flex-row sm:items-center
               justify-between gap-3"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-purple-50
                   flex items-center justify-center"
          >
            <i class="pi pi-history text-[#7030A0] text-lg"></i>
          </div>

          <div>
            <h3 class="font-bold text-slate-900 text-base">
              سجل العمليات والتعديلات
            </h3>

            <p class="text-xs text-slate-400 mt-1">
              متابعة أحدث الأنشطة والتغييرات داخل النظام
            </p>
          </div>
        </div>

        <NuxtLink
          to="/admin/audit"
          class="inline-flex items-center gap-2 text-xs
                 text-[#7030A0] font-bold hover:underline"
        >
          عرض السجل كاملاً
          <i class="pi pi-arrow-left text-[10px]"></i>
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div
        v-if="logsPending"
        class="p-12 text-center text-slate-400"
      >
        <i class="pi pi-spin pi-spinner text-2xl mb-3 block text-[#7030A0]"></i>

        <p class="text-sm font-semibold">
          جارٍ تحميل سجل العمليات...
        </p>

        <p class="text-xs mt-1">
          يرجى الانتظار قليلاً
        </p>
      </div>

      <!-- Error -->
      <div
        v-else-if="auditError"
        class="p-10 text-center"
      >
        <i class="pi pi-exclamation-circle text-3xl text-rose-400 mb-3 block"></i>

        <p class="text-sm font-bold text-slate-700">
          تعذر تحميل سجل العمليات
        </p>

        <p class="text-xs text-slate-400 mt-1">
          يرجى المحاولة مرة أخرى
        </p>

        <button
          @click="refreshLogs"
          class="mt-4 px-4 py-2 rounded-lg bg-purple-50
                 text-[#7030A0] text-xs font-bold
                 hover:bg-purple-100 transition-colors"
        >
          <i class="pi pi-refresh ms-1"></i>
          إعادة المحاولة
        </button>
      </div>

      <!-- Empty -->
      <div
        v-else-if="auditLogs.length === 0"
        class="p-12 text-center text-slate-500"
      >
        <div
          class="w-16 h-16 mx-auto rounded-2xl bg-slate-50
                 flex items-center justify-center mb-4"
        >
          <i class="pi pi-inbox text-3xl text-slate-300"></i>
        </div>

        <p class="text-sm font-bold text-slate-700">
          لا توجد عمليات مسجلة حتى الآن
        </p>

        <p class="text-xs text-slate-400 mt-2">
          ستظهر هنا جميع العمليات والتعديلات التي يتم تنفيذها في النظام.
        </p>
      </div>

      <!-- Audit Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-center border-collapse text-xs sm:text-sm">

          <thead>
            <tr
              class="bg-slate-50 text-slate-600 font-bold
                     border-b border-slate-200"
            >
              <th class="px-4 py-4 whitespace-nowrap">
                التاريخ والوقت
              </th>

              <th class="px-4 py-4 whitespace-nowrap">
                منفذ العملية
              </th>

              <th class="px-4 py-4 whitespace-nowrap">
                نوع العملية
              </th>

              <th class="px-4 py-4 whitespace-nowrap">
                رقم القطعة
              </th>

              <th class="px-4 py-4 text-start min-w-[240px]">
                تفاصيل العملية
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">

            <tr
              v-for="(log, idx) in auditLogs.slice(0, 10)"
              :key="log.timestamp + '-' + idx"
              class="hover:bg-purple-50/40 transition-colors"
            >

              <!-- Date -->
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex flex-col items-center gap-1">
                  <span class="font-semibold text-slate-700 text-xs">
                    {{ formatAuditDate(log.timestamp) }}
                  </span>
                </div>
              </td>

              <!-- User -->
              <td class="px-4 py-4">
                <div class="flex flex-col items-center gap-1.5">
                  <div
                    class="w-8 h-8 rounded-full bg-indigo-50
                           text-indigo-600 flex items-center
                           justify-center"
                  >
                    <i class="pi pi-user text-xs"></i>
                  </div>

                  <span
                    class="font-semibold text-slate-800 text-xs"
                    dir="ltr"
                  >
                    {{ log.adminEmail || 'غير محدد' }}
                  </span>
                </div>
              </td>

              <!-- Action -->
              <td class="px-4 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap',
                    getAuditActionStyle(log.action)
                  ]"
                >
                  <i :class="getAuditActionIcon(log.action)"></i>

                  {{ translateAuditAction(log.action) }}
                </span>
              </td>

              <!-- Plot -->
              <td class="px-4 py-4">
                <span
                  v-if="log.plotNo"
                  class="inline-flex items-center px-3 py-1.5
                         rounded-lg bg-purple-50 text-[#7030A0]
                         font-black whitespace-nowrap"
                >
                  قطعة {{ log.plotNo }}
                </span>

                <span v-else class="text-slate-400">
                  —
                </span>
              </td>

              <!-- Details -->
              <td class="px-4 py-4 text-start">
                <div
                  class="max-w-sm text-xs text-slate-600
                         leading-6 whitespace-pre-line break-words"
                >
                  {{ formatAuditDetails(log.afterData) }}
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div
        v-if="!logsPending && !auditError && auditLogs.length > 0"
        class="px-5 py-3 bg-slate-50/70 border-t border-slate-100
               flex items-center justify-between"
      >
        <span class="text-xs text-slate-400">
          عرض أحدث {{ Math.min(auditLogs.length, 10) }}
          من أصل {{ auditLogs.length }} عملية
        </span>

        <NuxtLink
          to="/admin/audit"
          class="text-xs font-bold text-[#7030A0] hover:underline"
        >
          عرض المزيد
          <i class="pi pi-arrow-left text-[9px] mr-1"></i>
        </NuxtLink>
      </div>

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

const auditLogs = computed(() => auditResponse.value?.data || []);

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
  CREATE: 'bg-emerald-50 text-emerald-700',
  EMPLOYEE_CREATE: 'bg-emerald-50 text-emerald-700',
  PLOT_CREATE: 'bg-emerald-50 text-emerald-700',

  UPDATE: 'bg-blue-50 text-blue-700',
  EMPLOYEE_UPDATE: 'bg-blue-50 text-blue-700',
  PERMISSION_UPDATE: 'bg-blue-50 text-blue-700',
  PERMISSIONS_UPDATE: 'bg-blue-50 text-blue-700',
  EMPLOYEE_PERMISSION_UPDATE: 'bg-blue-50 text-blue-700',
  PLOT_UPDATE: 'bg-blue-50 text-blue-700',
  PRICE_UPDATE: 'bg-blue-50 text-blue-700',
  STATUS_UPDATE: 'bg-blue-50 text-blue-700',
  BUYER_UPDATE: 'bg-blue-50 text-blue-700',

  LOGIN: 'bg-indigo-50 text-indigo-700',
  EMPLOYEE_LOGIN: 'bg-indigo-50 text-indigo-700',

  LOGOUT: 'bg-slate-100 text-slate-600',
  EMPLOYEE_LOGOUT: 'bg-slate-100 text-slate-600',

  DELETE: 'bg-rose-50 text-rose-700',
  EMPLOYEE_DELETE: 'bg-rose-50 text-rose-700',
  PLOT_DELETE: 'bg-rose-50 text-rose-700',

  SYNC: 'bg-amber-50 text-amber-700',
  GOOGLE_SHEETS_SYNC: 'bg-amber-50 text-amber-700',
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

  return auditActionStyles[key] || 'bg-slate-100 text-slate-600';
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
