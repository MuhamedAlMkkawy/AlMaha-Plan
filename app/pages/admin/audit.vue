<template>
  <div class="space-y-6">
    <!-- الترويسة -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <NuxtLink to="/admin" class="text-xs text-slate-400 hover:text-[#7030A0]">الإدارة</NuxtLink>
          <span class="text-xs text-slate-300">/</span>
          <span class="text-xs font-bold text-[#7030A0]">سجل العمليات</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          سجل العمليات وتدقيق الموظفين
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          سجل غير قابل للتعديل يوثق جميع عمليات الموظفين والمسؤولين في النظام، مع ما تم تغييره بالتفصيل
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <NuxtLink
          to="/admin/employees"
          class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2"
        >
          <i class="pi pi-users text-slate-400"></i>
          <span>إدارة الموظفين</span>
        </NuxtLink>

        <button
          @click="exportCsv"
          class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2"
        >
          <i class="pi pi-download text-slate-400"></i>
          <span>تصدير السجل (CSV)</span>
        </button>

        <button
          @click="refreshAll"
          class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2"
        >
          <i class="pi pi-sync text-slate-400"></i>
          <span>تحديث السجل</span>
        </button>
      </div>
    </div>

    <!-- ملخص -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div class="text-xs text-slate-500 font-semibold">إجمالي العمليات</div>
        <div class="text-2xl font-black text-slate-900 mt-1">{{ stats.total }}</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div class="text-xs text-slate-500 font-semibold">عمليات الموظفين</div>
        <div class="text-2xl font-black text-indigo-700 mt-1">{{ stats.employee }}</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div class="text-xs text-slate-500 font-semibold">تعديلات العقود</div>
        <div class="text-2xl font-black text-amber-700 mt-1">{{ stats.contracts }}</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div class="text-xs text-slate-500 font-semibold">عمليات الحذف والأرشفة</div>
        <div class="text-2xl font-black text-rose-700 mt-1">{{ stats.deletes }}</div>
      </div>
    </div>

    <!-- الفلاتر -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">الموظف</label>
          <select v-model="userFilter" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
            <option value="">جميع الموظفين</option>
            <option v-for="u in userOptions" :key="u.email" :value="u.email">{{ u.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">نوع الإجراء</label>
          <select v-model="actionFilter" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
            <option value="">جميع الإجراءات</option>
            <option v-for="(label, key) in actionLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">المنفذ (الدور)</label>
          <select v-model="roleFilter" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
            <option value="">الجميع (المسؤولون والموظفون)</option>
            <option value="employee">الموظفون فقط</option>
            <option value="admin">مدير النظام فقط</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">بحث برقم القطعة أو التفاصيل</label>
          <input
            v-model="search"
            type="text"
            placeholder="مثال: 125"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#7030A0]"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">من تاريخ</label>
          <input v-model="dateFrom" type="date" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">إلى تاريخ</label>
          <input v-model="dateTo" type="date" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white" />
        </div>
        <div>
          <button
            @click="clearFilters"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <i class="pi pi-filter-slash text-slate-400"></i>
            <span>مسح الفلاتر</span>
          </button>
        </div>
      </div>
    </div>

    <!-- جدول السجل -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div v-if="pending" class="p-8 text-center text-slate-400">
        <i class="pi pi-spin pi-spinner text-2xl text-[#7030A0] mb-2"></i>
        <p>جاري تحميل سجل العمليات...</p>
      </div>

      <div v-else-if="filteredLogs.length === 0" class="p-12 text-center text-slate-500">
        <i class="pi pi-history text-3xl text-slate-300 mb-2"></i>
        <p>لا توجد سجلات مطابقة للبحث</p>
      </div>

      <div v-else class="overflow-x-auto">
        <div class="px-4 py-2.5 text-xs text-slate-500 bg-slate-50/60 border-b border-slate-100">
          عدد النتائج: <span class="font-bold text-slate-700">{{ filteredLogs.length }}</span>
          — اضغط على أي عملية لعرض تفاصيل ما تم تغييره
        </div>

        <table class="w-full text-start border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <th class="px-4 py-3.5 text-start whitespace-nowrap">التاريخ والوقت</th>
              <th class="px-4 py-3.5 text-start">المنفذ</th>
              <th class="px-4 py-3.5 text-center">نوع الإجراء</th>
              <th class="px-4 py-3.5 text-start">القطعة / الهدف</th>
              <th class="px-4 py-3.5 text-start">ملخص العملية</th>
              <th class="px-4 py-3.5 text-center">التفاصيل</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="log in filteredLogs" :key="log._key">
              <tr
                class="hover:bg-slate-50/80 transition-colors cursor-pointer"
                :class="expanded.has(log._key) ? 'bg-purple-50/40' : ''"
                @click="toggleRow(log._key)"
              >
                <!-- التاريخ -->
                <td class="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                  <div class="font-semibold text-slate-700">{{ formatDate(log.timestamp) }}</div>
                  <div class="text-2xs text-slate-400">{{ formatTime(log.timestamp) }}</div>
                </td>

                <!-- المنفذ -->
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-0.5 rounded text-2xs font-extrabold"
                      :class="log.userRole === 'employee'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-purple-50 text-[#7030A0] border border-purple-200'"
                    >
                      {{ log.userRole === 'employee' ? 'موظف' : 'مدير' }}
                    </span>
                    <div>
                      <div class="font-bold text-slate-900">{{ log.userName || log.adminEmail }}</div>
                      <div class="text-2xs text-slate-400" dir="ltr" style="text-align: right">{{ log.adminEmail }}</div>
                    </div>
                  </div>
                </td>

                <!-- الإجراء -->
                <td class="px-4 py-3.5 text-center whitespace-nowrap">
                  <span :class="['px-2.5 py-1 rounded-full text-xs font-bold inline-block', getActionBadgeClass(log.action)]">
                    {{ getActionLabel(log.action) }}
                  </span>
                </td>

                <!-- الهدف -->
                <td class="px-4 py-3.5">
                  <span v-if="log.plotNo" class="font-black text-[#7030A0]">قطعة {{ log.plotNo }}</span>
                  <span v-else-if="log.target" class="font-semibold text-slate-700">{{ log.target }}</span>
                  <span v-else class="text-slate-400">—</span>
                </td>

                <!-- ملخص -->
                <td class="px-4 py-3.5 text-start text-slate-600 max-w-md">
                  <div class="font-semibold text-slate-800">{{ describeLog(log) }}</div>
                  <div v-if="getChanges(log).length" class="text-2xs text-slate-400 mt-0.5">
                    {{ getChanges(log).length }} حقل
                    {{ getChanges(log).length === 1 ? 'تم تغييره' : 'تم تغييرها' }}
                  </div>
                </td>

                <!-- زر التوسيع -->
                <td class="px-4 py-3.5 text-center">
                  <i
                    class="pi text-slate-400"
                    :class="expanded.has(log._key) ? 'pi-chevron-up' : 'pi-chevron-down'"
                  ></i>
                </td>
              </tr>

              <!-- تفاصيل التغييرات -->
              <tr v-if="expanded.has(log._key)" class="bg-slate-50/70">
                <td colspan="6" class="px-4 py-4">
                  <div v-if="getChanges(log).length" class="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                      ما الذي تم تغييره؟
                    </div>

                    <div class="divide-y divide-slate-100">
                      <div
                        v-for="c in getChanges(log)"
                        :key="c.key"
                        class="px-4 py-3 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4"
                      >
                        <div class="font-bold text-slate-800 text-sm">{{ c.label }}</div>

                        <!-- الصلاحيات / القوائم -->
                        <div v-if="c.type === 'list'" class="space-y-2">
                          <div class="flex flex-wrap gap-2">
                            <span
                              v-for="x in c.kept"
                              :key="'k' + x"
                              class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                            >{{ x }}</span>
                            <span
                              v-for="x in c.added"
                              :key="'a' + x"
                              class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                            >+ {{ x }}</span>
                            <span
                              v-for="x in c.removed"
                              :key="'r' + x"
                              class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 line-through"
                            >− {{ x }}</span>
                            <span v-if="!c.kept.length && !c.added.length && !c.removed.length" class="text-xs text-slate-400">بدون صلاحيات</span>
                          </div>
                          <div class="text-2xs text-slate-400">
                            <span class="text-emerald-600">+ تمت إضافتها</span>
                            &nbsp;·&nbsp;
                            <span class="text-rose-600">− تمت إزالتها</span>
                            &nbsp;·&nbsp;
                            <span>الرمادي: بقيت كما هي</span>
                          </div>
                        </div>

                        <!-- القيم النصية -->
                        <div v-else class="flex flex-wrap items-center gap-2 text-sm">
                          <span class="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 whitespace-pre-wrap break-words">{{ c.before }}</span>
                          <i class="pi pi-arrow-left text-slate-400 text-xs"></i>
                          <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-pre-wrap break-words">{{ c.after }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="rawText(log)" class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 whitespace-pre-wrap break-words">
                    {{ rawText(log) }}
                  </div>

                  <div v-else class="text-sm text-slate-400">لا توجد تغييرات مسجلة لهذه العملية.</div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AuditLogEntry } from '../../../shared/types/audit';

type Row = AuditLogEntry & { _key: string };
type Change = {
  key: string;
  label: string;
  type: 'text' | 'list';
  before: string;
  after: string;
  kept: string[];
  added: string[];
  removed: string[];
};

const route = useRoute();

const { data: response, pending, refresh } = await useFetch<{
  success: boolean;
  data: AuditLogEntry[];
}>('/api/admin/audit');

// قائمة كل الموظفين (نفس الـ API المستخدم في صفحة إدارة الموظفين)
const { data: employeesResponse, refresh: refreshEmployees } = await useFetch<any>('/api/admin/employees', {
  default: () => ({ data: [] }),
});

const refreshAll = async () => {
  await Promise.all([refresh(), refreshEmployees()]);
};

// السجلات مرتبة من الأحدث إلى الأقدم مع مفتاح فريد لكل صف
const logs = computed<Row[]>(() => {
  const list = (response.value?.data || []).map((l, i) => ({ ...l, _key: `${l.timestamp}-${i}` }));
  return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
});

const search = ref((route.query.search as string) || '');
const actionFilter = ref('');
const roleFilter = ref('');
const userFilter = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const expanded = ref<Set<string>>(new Set());

const toggleRow = (key: string) => {
  const next = new Set(expanded.value);
  next.has(key) ? next.delete(key) : next.add(key);
  expanded.value = next;
};

const clearFilters = () => {
  search.value = '';
  actionFilter.value = '';
  roleFilter.value = '';
  userFilter.value = '';
  dateFrom.value = '';
  dateTo.value = '';
};

/* ---------- التسميات العربية ---------- */
const actionLabels: Record<string, string> = {
  LOGIN: 'تسجيل دخول',
  CONTRACT_EDIT: 'تعديل عقد',
  STATUS_CHANGE: 'تغيير حالة',
  UPDATE: 'تحديث بيانات',
  CREATE: 'إضافة قطعة',
  DELETE: 'حذف',
  ARCHIVE: 'أرشفة',
  EMPLOYEE_CREATE: 'إضافة موظف',
  EMPLOYEE_UPDATE: 'تعديل موظف',
  EMPLOYEE_DELETE: 'حذف موظف',
};

const fieldLabels: Record<string, string> = {
  plotNo: 'رقم القطعة',
  status: 'الحالة',
  price: 'السعر',
  area: 'المساحة',
  pricePerMeter: 'سعر المتر',
  totalPrice: 'السعر الإجمالي',
  deedNo: 'رقم الصك',
  notes: 'ملاحظات',
  block: 'المربع',
  street: 'الشارع',
  facing: 'الواجهة',
  buyerName: 'اسم المشتري',
  buyerId: 'رقم هوية المشتري',
  buyerPhone: 'جوال المشتري',
  buyerBirthDate: 'تاريخ ميلاد المشتري',
  contractNo: 'رقم العقد',
  contractDate: 'تاريخ العقد',
  contractNote: 'ملاحظة العقد',
  contractTerms: 'بنود العقد',
  name: 'الاسم',
  fullName: 'الاسم الكامل',
  username: 'اسم المستخدم',
  email: 'البريد الإلكتروني',
  phone: 'رقم الجوال',
  role: 'الدور',
  password: 'كلمة المرور',
  active: 'مفعّل',
  isActive: 'مفعّل',
  permissions: 'الصلاحيات',
  lastLoginAt: 'آخر تسجيل دخول',
};

const valueLabels: Record<string, string> = {
  available: 'متاح',
  sold: 'مباع',
  reserved: 'محجوز',
  archived: 'مؤرشف',
  employee: 'موظف',
  admin: 'مدير',
  true: 'نعم',
  false: 'لا',
};

/* ---------- الصلاحيات بالعربية ---------- */
const permVerbs: Record<string, string> = {
  view: 'عرض', edit: 'تعديل', update: 'تعديل', create: 'إضافة', add: 'إضافة',
  delete: 'حذف', archive: 'أرشفة', manage: 'إدارة', export: 'تصدير', print: 'طباعة',
};
const permNouns: Record<string, string> = {
  plots: 'القطع', plot: 'القطعة', contracts: 'العقود', contract: 'العقد',
  stats: 'الإحصائيات', statistics: 'الإحصائيات', employees: 'الموظفين',
  users: 'المستخدمين', audit: 'سجل العمليات', logs: 'سجل العمليات',
  reports: 'التقارير', buyers: 'المشترين', all: 'الكل',
};
const permissionLabel = (p: string) => {
  const parts = String(p).toLowerCase().split('_');
  const verb = permVerbs[parts[0]];
  if (!verb) return String(p);
  const noun = parts.slice(1).map((w) => permNouns[w] || w).join(' ');
  return noun ? `${verb} ${noun}` : verb;
};

/* حقول لا تهم المدير */
const hiddenKeys = new Set([
  'id', '_id', '__v', 'createdAt', 'updatedAt', 'lastLoginAt', 'lastLogin',
  'token', 'passwordHash', 'timestamp',
]);

const getActionLabel = (action: string) => actionLabels[action] || action;

const getActionBadgeClass = (action: string) => {
  switch (action) {
    case 'LOGIN':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'CONTRACT_EDIT':
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    case 'CREATE':
    case 'EMPLOYEE_CREATE':
      return 'bg-teal-50 text-teal-700 border border-teal-200';
    case 'UPDATE':
    case 'EMPLOYEE_UPDATE':
    case 'STATUS_CHANGE':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'DELETE':
    case 'ARCHIVE':
    case 'EMPLOYEE_DELETE':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};

/* ---------- التاريخ ---------- */
const formatDate = (ts: string | number | Date) =>
  new Date(ts).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });

const formatTime = (ts: string | number | Date) =>
  new Date(ts).toLocaleTimeString('ar-SA-u-ca-gregory-nu-latn', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/* ---------- تحليل التغييرات ---------- */
const parseData = (v: unknown): Record<string, any> | null => {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'object') return v as Record<string, any>;
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
};

const isEmpty = (v: any) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);

const isoRe = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

const formatValue = (v: any): string => {
  if (isEmpty(v)) return 'فارغ';
  if (typeof v === 'boolean') return v ? 'نعم' : 'لا';
  if (Array.isArray(v)) return v.map((x) => String(x)).join('، ');
  if (typeof v === 'object') return JSON.stringify(v);
  const s = String(v);
  if (isoRe.test(s)) return `${formatDate(s)} - ${formatTime(s)}`;
  return valueLabels[s] ?? s;
};

const getChanges = (log: Row): Change[] => {
  const before = parseData(log.beforeData);
  const after = parseData(log.afterData);
  if (!before && !after) return [];

  // نعتمد على الحقول الموجودة في البيانات الجديدة فقط (أو القديمة عند الحذف)
  const source = after || before || {};
  const changes: Change[] = [];

  for (const key of Object.keys(source)) {
    if (hiddenKeys.has(key)) continue;

    const b = before ? before[key] : undefined;
    const a = after ? after[key] : undefined;

    // كلمة المرور: لا نعرض القيم أبدا
    if (key === 'password') {
      if (after && !isEmpty(a) && JSON.stringify(a) !== JSON.stringify(b)) {
        changes.push({
          key, label: 'كلمة المرور', type: 'text',
          before: '—', after: 'تم تغيير كلمة المرور',
          kept: [], added: [], removed: [],
        });
      }
      continue;
    }

    // عند وجود الحالتين: تجاهل ما لم يتغير
    if (before && after) {
      if (isEmpty(a) && isEmpty(b)) continue;
      if (JSON.stringify(a) === JSON.stringify(b)) continue;
    }

    // القوائم (الصلاحيات)
    if (Array.isArray(a) || Array.isArray(b)) {
      const oldList: string[] = Array.isArray(b) ? b.map(String) : [];
      const newList: string[] = Array.isArray(a) ? a.map(String) : [];
      const tr = (x: string) => (key === 'permissions' ? permissionLabel(x) : x);
      changes.push({
        key,
        label: fieldLabels[key] || key,
        type: 'list',
        before: oldList.map(tr).join('، ') || 'فارغ',
        after: newList.map(tr).join('، ') || 'فارغ',
        kept: newList.filter((x) => oldList.includes(x)).map(tr),
        added: newList.filter((x) => !oldList.includes(x)).map(tr),
        removed: oldList.filter((x) => !newList.includes(x)).map(tr),
      });
      continue;
    }

    changes.push({
      key,
      label: fieldLabels[key] || key,
      type: 'text',
      before: before ? formatValue(b) : '—',
      after: after ? formatValue(a) : '—',
      kept: [], added: [], removed: [],
    });
  }
  return changes;
};

const rawText = (log: Row) => {
  const parts: string[] = [];
  if (log.beforeData && !parseData(log.beforeData)) parts.push(`قبل: ${log.beforeData}`);
  if (log.afterData && !parseData(log.afterData)) parts.push(`بعد: ${log.afterData}`);
  return parts.join('\n');
};

const describeLog = (log: Row) => {
  const who = log.userName || log.adminEmail;
  const role = log.userRole === 'employee' ? 'الموظف' : 'المدير';
  const plot = log.plotNo ? ` القطعة رقم ${log.plotNo}` : '';
  // الهدف غالبا يحتوي اسم الموظف والبريد، فنعرضه كما هو دون تكرار
  const tgt = log.target ? ` (${log.target})` : '';
  switch (log.action) {
    case 'LOGIN': return `${role} ${who} سجّل الدخول إلى النظام`;
    case 'CONTRACT_EDIT': return `${role} ${who} عدّل عقد${plot}`;
    case 'STATUS_CHANGE': return `${role} ${who} غيّر حالة${plot}`;
    case 'UPDATE': return `${role} ${who} حدّث بيانات${plot}`;
    case 'CREATE': return `${role} ${who} أضاف${plot}`;
    case 'DELETE': return `${role} ${who} حذف${plot}`;
    case 'ARCHIVE': return `${role} ${who} أرشف${plot}`;
    case 'EMPLOYEE_CREATE': return `${role} ${who} أضاف موظفا جديدا${tgt}`;
    case 'EMPLOYEE_UPDATE': return `${role} ${who} عدّل بيانات موظف${tgt}`;
    case 'EMPLOYEE_DELETE': return `${role} ${who} حذف موظفا${tgt}`;
    default: return `${role} ${who}: ${getActionLabel(log.action)}`;
  }
};

/* ---------- الفلاتر ---------- */
// كل الموظفين من النظام + أي مستخدم ظهر في السجل (مثل المدير)
const userOptions = computed(() => {
  const map = new Map<string, string>();

  const res = employeesResponse.value;
  const list: any[] = Array.isArray(res) ? res : res?.data || res?.employees || [];
  for (const e of list) {
    const email = e?.email || e?.adminEmail || e?.username;
    if (!email) continue;
    map.set(email, e.name || e.fullName || e.userName || e.username || email);
  }

  for (const l of logs.value) {
    if (l.adminEmail && !map.has(l.adminEmail)) {
      map.set(l.adminEmail, l.userName || l.adminEmail);
    }
  }

  return Array.from(map, ([email, name]) => ({ email, name })).sort((a, b) =>
    a.name.localeCompare(b.name, 'ar'),
  );
});

const filteredLogs = computed(() => {
  let list = logs.value;

  if (actionFilter.value) list = list.filter((l) => l.action === actionFilter.value);
  if (roleFilter.value) list = list.filter((l) => l.userRole === roleFilter.value);
  if (userFilter.value) list = list.filter((l) => l.adminEmail === userFilter.value);

  if (dateFrom.value) {
    const from = new Date(`${dateFrom.value}T00:00:00`).getTime();
    list = list.filter((l) => new Date(l.timestamp).getTime() >= from);
  }
  if (dateTo.value) {
    const to = new Date(`${dateTo.value}T23:59:59`).getTime();
    list = list.filter((l) => new Date(l.timestamp).getTime() <= to);
  }

  if (search.value) {
    const s = search.value.trim().toLowerCase();
    list = list.filter((l) => {
      const plotMatch = l.plotNo ? String(l.plotNo).includes(s) : false;
      const emailMatch = l.adminEmail?.toLowerCase().includes(s);
      const nameMatch = l.userName?.toLowerCase().includes(s);
      const targetMatch = l.target?.toLowerCase().includes(s);
      const dataMatch =
        String(l.afterData ?? '').toLowerCase().includes(s) ||
        String(l.beforeData ?? '').toLowerCase().includes(s);
      return plotMatch || emailMatch || nameMatch || targetMatch || dataMatch;
    });
  }

  return list;
});

const stats = computed(() => {
  const all = logs.value;
  return {
    total: all.length,
    employee: all.filter((l) => l.userRole === 'employee').length,
    contracts: all.filter((l) => l.action === 'CONTRACT_EDIT').length,
    deletes: all.filter((l) => ['DELETE', 'ARCHIVE', 'EMPLOYEE_DELETE'].includes(l.action)).length,
  };
});

/* ---------- تصدير CSV ---------- */
const exportCsv = () => {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['التاريخ', 'الوقت', 'المنفذ', 'البريد', 'الدور', 'الإجراء', 'القطعة / الهدف', 'الملخص', 'التغييرات'];
  const rows = filteredLogs.value.map((l) => {
    const changes = getChanges(l)
      .map((c) => `${c.label}: ${c.before} ← ${c.after}`)
      .join(' | ');
    return [
      formatDate(l.timestamp),
      formatTime(l.timestamp),
      l.userName || l.adminEmail,
      l.adminEmail,
      l.userRole === 'employee' ? 'موظف' : 'مدير',
      getActionLabel(l.action),
      l.plotNo ? `قطعة ${l.plotNo}` : l.target || '',
      describeLog(l),
      changes || rawText(l),
    ].map(esc).join(',');
  });
  const csv = '\uFEFF' + [header.map(esc).join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `سجل-العمليات-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>