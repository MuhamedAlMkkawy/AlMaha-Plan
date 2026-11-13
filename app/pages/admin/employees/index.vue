
<template>
  <div class="space-y-6" dir="rtl">
    <!-- Header -->
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="mb-2 flex items-center gap-2 text-xs">
          <NuxtLink to="/admin" class="font-medium text-slate-400 transition hover:text-[#7030A0]">
            الإدارة
          </NuxtLink>
          <i class="pi pi-angle-left text-[10px] text-slate-300"></i>
          <span class="font-bold text-[#7030A0]">فريق العمل</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8546B5] to-[#5B2188] text-white shadow-lg shadow-purple-900/15">
            <i class="pi pi-users text-lg"></i>
          </div>
          <div>
            <h1 class="text-xl font-black text-slate-900 sm:text-2xl">
              إدارة الموظفين والصلاحيات
            </h1>
            <p class="mt-1 text-xs text-slate-500 sm:text-sm">
              إدارة حسابات الموظفين ومتابعة نشاط الدخول والخروج والصلاحيات
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <NuxtLink
          to="/admin/audit"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-[#7030A0]"
        >
          <i class="pi pi-history"></i>
          سجل النشاط
        </NuxtLink>

        <button
          type="button"
          @click="openAddModal"
          class="inline-flex items-center gap-2 rounded-xl bg-[#7030A0] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-900/20 transition hover:bg-[#532277] active:scale-[.98]"
        >
          <i class="pi pi-user-plus"></i>
          إضافة موظف
        </button>
      </div>
    </header>

    <!-- Employee Login URL -->
    <section class="relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-l from-violet-50 via-white to-indigo-50 p-4 shadow-sm sm:p-5">
      <div class="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-indigo-100/60 blur-3xl"></div>

      <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex min-w-0 items-start gap-3">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
            <i class="pi pi-link"></i>
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-sm font-black text-slate-900">بوابة تسجيل دخول الموظفين</h2>
              <span class="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-bold text-indigo-700">
                بوابة منفصلة
              </span>
            </div>
            <p class="mt-1 text-xs leading-relaxed text-slate-500">
              شارك الرابط مع الموظفين للدخول إلى حساباتهم وفق الصلاحيات الممنوحة لهم.
            </p>
            <div class="mt-3 inline-flex max-w-full items-center gap-2 overflow-x-auto rounded-lg border border-indigo-100 bg-white px-3 py-2 font-mono text-xs text-indigo-900" dir="ltr">
              <i class="pi pi-globe shrink-0 text-indigo-400"></i>
              <span class="whitespace-nowrap">{{ employeeLoginUrl }}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          @click="copyEmployeeLoginUrl"
          class="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 md:self-center"
        >
          <i :class="copiedUrl ? 'pi pi-check' : 'pi pi-copy'"></i>
          {{ copiedUrl ? 'تم نسخ الرابط' : 'نسخ رابط الدخول' }}
        </button>
      </div>
    </section>

    <!-- Statistics -->
    <section class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-500">{{ stat.label }}</p>
            <p class="mt-2 text-3xl font-black tabular-nums" :class="stat.valueColor">
              {{ stat.value }}
            </p>
          </div>
          <div class="flex h-11 w-11 items-center justify-center rounded-xl" :class="stat.iconBg">
            <i :class="[stat.icon, stat.iconColor, 'text-lg']"></i>
          </div>
        </div>
        <div class="mt-3 h-1 overflow-hidden rounded-full bg-slate-100">
          <div
            class="h-full rounded-full transition-all"
            :class="stat.barColor"
            :style="{ width: `${stat.percentage}%` }"
          ></div>
        </div>
      </div>
    </section>

    <!-- Employees Table -->
    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-[#7030A0]">
            <i class="pi pi-id-card"></i>
          </div>
          <div>
            <h2 class="text-sm font-black text-slate-900 sm:text-base">حسابات الموظفين</h2>
            <p class="mt-0.5 text-[11px] text-slate-400">
              {{ employees.length }} حساب مسجل في النظام
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="refresh"
          :disabled="pending"
          class="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-violet-50 hover:text-[#7030A0] disabled:opacity-50"
        >
          <i :class="pending ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"></i>
          تحديث القائمة
        </button>
      </div>

      <div v-if="pending" class="flex flex-col items-center justify-center px-4 py-16">
        <i class="pi pi-spin pi-spinner text-3xl text-[#7030A0]"></i>
        <p class="mt-4 text-sm font-bold text-slate-700">جاري تحميل الموظفين</p>
        <p class="mt-1 text-xs text-slate-400">يرجى الانتظار...</p>
      </div>

      <div v-else-if="employees.length === 0" class="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-[#7030A0]">
          <i class="pi pi-users text-2xl"></i>
        </div>
        <h3 class="mt-4 text-base font-black text-slate-900">لا يوجد موظفون حتى الآن</h3>
        <p class="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
          أضف حسابات فريق العمل وحدد لكل موظف المسمى الوظيفي والصلاحيات المناسبة.
        </p>
        <button
          type="button"
          @click="openAddModal"
          class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7030A0] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#532277]"
        >
          <i class="pi pi-user-plus"></i>
          إضافة أول موظف
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1100px] border-collapse text-start text-xs sm:text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/80 text-slate-500">
              <th class="px-4 py-4 text-center font-extrabold">الموظف</th>
              <th class="px-4 py-4 text-center font-extrabold">اسم المستخدم</th>
              <th class="px-4 py-4 text-center font-extrabold">الحالة</th>
              <th class="px-4 py-4 text-center font-extrabold">الصلاحيات</th>
              <th class="px-4 py-4 text-center font-extrabold">الإجراءات</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="emp in employees"
              :key="emp.id"
              class="transition hover:bg-violet-50/30"
            >
              <td class="px-4 py-4 text-center">
                <button
                  type="button"
                  @click="openDetails(emp)"
                  class="flex items-center justify-center gap-3 text-start"
                >
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-50 font-black text-[#7030A0]">
                    {{ getInitials(emp.name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-extrabold text-slate-900 transition hover:text-[#7030A0]">{{ emp.name }}</p>
                    <p class="mt-1 text-[11px] text-slate-500">{{ emp.title || 'لم يحدد المسمى الوظيفي' }}</p>
                    <p v-if="emp.phone" dir="ltr" class="mt-0.5 text-start font-mono text-[10px] text-slate-400">{{ emp.phone }}</p>
                  </div>
                </button>
              </td>

              <td class="px-4 py-4 text-center">
                <span dir="ltr" class="inline-flex rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-700">
                  {{ emp.username }}
                </span>
              </td>

              <td class="px-4 py-4 text-center">
                <button
                  type="button"
                  @click="requestStatusChange(emp)"
                  class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-extrabold transition"
                  :class="emp.status === 'active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="emp.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  {{ emp.status === 'active' ? 'نشط' : 'معطل' }}
                </button>
              </td>

              <td class="max-w-xs px-4 py-4">
                <div class="flex max-w-[240px] flex-wrap justify-center gap-1">
                  <span
                    v-for="permission in (emp.permissions || []).slice(0, 3)"
                    :key="permission"
                    class="rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-bold text-[#7030A0]"
                  >
                    {{ getPermissionLabel(permission) }}
                  </span>
                  <span
                    v-if="(emp.permissions?.length || 0) > 3"
                    class="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-500"
                  >
                    +{{ emp.permissions.length - 3 }}
                  </span>
                  <span v-if="!emp.permissions?.length" class="text-[11px] text-slate-400">
                    بدون صلاحيات
                  </span>
                </div>
              </td>

              <td class="px-4 py-4 text-center">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    @click="openDetails(emp)"
                    class="flex h-9 w-9 items-center justify-center rounded-xl text-indigo-600 transition hover:bg-indigo-50"
                    title="عرض التفاصيل"
                  >
                    <i class="pi pi-eye text-xs"></i>
                  </button>
                  <button
                    type="button"
                    @click="openEditModal(emp)"
                    class="flex h-9 w-9 items-center justify-center rounded-xl text-[#7030A0] transition hover:bg-violet-50"
                    title="تعديل الموظف"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <NuxtLink
                    :to="`/admin/audit?search=${encodeURIComponent(emp.username)}`"
                    class="flex h-9 w-9 items-center justify-center rounded-xl text-blue-600 transition hover:bg-blue-50"
                    title="سجل النشاط"
                  >
                    <i class="pi pi-history text-xs"></i>
                  </NuxtLink>
                  <button
                    type="button"
                    @click="requestDelete(emp)"
                    class="flex h-9 w-9 items-center justify-center rounded-xl text-rose-600 transition hover:bg-rose-50"
                    title="حذف الموظف"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Add / Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
        @click.self="closeModal"
        @keydown.esc="closeModal"
      >
        <div
          class="employee-modal-scroll flex max-h-[94vh] w-full max-w-[900px] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="employee-modal-title"
        >
          <!-- Modal Header -->
          <div class="relative shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-l from-violet-50 via-white to-indigo-50 px-5 py-5 sm:px-7">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8546B5] to-[#5B2188] text-white shadow-lg">
                  <i :class="editingId ? 'pi pi-user-edit' : 'pi pi-user-plus'" class="text-lg"></i>
                </div>
                <div>
                  <h3 id="employee-modal-title" class="text-base font-black text-slate-900 sm:text-lg">
                    {{ editingId ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد' }}
                  </h3>
                  <p class="mt-1 text-[11px] text-slate-500">
                    البيانات الوظيفية وبيانات الدخول والصلاحيات
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="closeModal"
                :disabled="saving"
                class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-slate-800 disabled:opacity-50"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <form @submit.prevent="saveEmployee" class="space-y-5">

              <!-- Personal Information -->
              <section class="overflow-hidden rounded-2xl border border-slate-200">
                <div class="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3.5">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <i class="pi pi-id-card"></i>
                  </div>
                  <div>
                    <h4 class="text-sm font-black text-slate-900">البيانات الشخصية والوظيفية</h4>
                    <p class="mt-0.5 text-[10px] text-slate-500">المعلومات الأساسية للموظف</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">

                  <!-- Name -->
                  <div class="sm:col-span-2">
                    <label for="employee-name" class="mb-1.5 block text-xs font-bold text-slate-700">
                      اسم الموظف <span class="text-rose-500">*</span>
                    </label>
                    <div class="form-input-wrapper">
                      <i class="pi pi-user form-input-icon" aria-hidden="true"></i>
                      <input
                        id="employee-name"
                        v-model.trim="form.name"
                        type="text"
                        required
                        autocomplete="name"
                        placeholder="مثال: أحمد عبد الله"
                        class="form-input form-input-with-icon"
                      />
                    </div>
                  </div>

                  <!-- Job Title -->
                  <div>
                    <label for="employee-title" class="mb-1.5 block text-xs font-bold text-slate-700">
                      المسمى الوظيفي <span class="text-rose-500">*</span>
                    </label>
                    <div class="form-input-wrapper">
                      <i class="pi pi-briefcase form-input-icon" aria-hidden="true"></i>
                      <input
                        id="employee-title"
                        v-model.trim="form.title"
                        type="text"
                        required
                        placeholder="مثال: مسؤول مبيعات"
                        class="form-input form-input-with-icon"
                      />
                    </div>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="employee-phone" class="mb-1.5 block text-xs font-bold text-slate-700">
                      رقم الهاتف
                      <span class="text-[10px] font-medium text-slate-400">(اختياري)</span>
                    </label>
                    <div class="form-input-wrapper">
                      <i class="pi pi-phone form-input-icon form-input-icon-ltr" aria-hidden="true"></i>
                      <input
                        id="employee-phone"
                        v-model.trim="form.phone"
                        type="tel"
                        dir="ltr"
                        autocomplete="tel"
                        placeholder="05xxxxxxxx"
                        class="form-input form-input-with-icon form-input-ltr font-mono"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <!-- Login Information -->
              <section class="overflow-hidden rounded-2xl border border-slate-200">
                <div class="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3.5">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <i class="pi pi-key"></i>
                  </div>
                  <div>
                    <h4 class="text-sm font-black text-slate-900">بيانات تسجيل الدخول</h4>
                    <p class="mt-0.5 text-[10px] text-slate-500">بيانات الدخول إلى بوابة الموظفين</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">

                  <!-- Username -->
                  <div>
                    <label for="employee-username" class="mb-1.5 block text-xs font-bold text-slate-700">
                      اسم المستخدم <span class="text-rose-500">*</span>
                    </label>
                    <div class="form-input-wrapper" dir="ltr">
                      <i class="pi pi-at form-input-icon form-input-icon-ltr" aria-hidden="true"></i>
                      <input
                        id="employee-username"
                        v-model.trim="form.username"
                        type="text"
                        required
                        autocomplete="username"
                        dir="ltr"
                        placeholder="username"
                        class="form-input form-input-with-icon form-input-ltr font-mono"
                      />
                    </div>
                  </div>

                  <!-- Password -->
                  <div>
                    <label for="employee-password" class="mb-1.5 block text-xs font-bold text-slate-700">
                      كلمة المرور
                      <span v-if="!editingId" class="text-rose-500">*</span>
                    </label>
                    <div class="form-input-wrapper" dir="ltr">
                      <i class="pi pi-lock form-input-icon form-input-icon-ltr" aria-hidden="true"></i>
                      <input
                        id="employee-password"
                        v-model="form.password"
                        type="password"
                        :required="!editingId"
                        minlength="4"
                        autocomplete="new-password"
                        dir="ltr"
                        :placeholder="editingId ? 'اتركها فارغة دون تغيير' : 'أدخل كلمة المرور'"
                        class="form-input form-input-with-icon form-input-ltr font-mono"
                      />
                    </div>
                    <p class="mt-1.5 text-[10px] text-slate-400">
                      {{ editingId
                        ? 'اترك الحقل فارغًا للاحتفاظ بكلمة المرور الحالية.'
                        : 'يجب ألا تقل كلمة المرور عن 4 خانات.' }}
                    </p>
                  </div>

                  <!-- Account Status -->
                  <div v-if="editingId" class="sm:col-span-2">
                    <label class="mb-2 block text-xs font-bold text-slate-700">حالة الحساب</label>
                    <div class="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        @click="form.status = 'active'"
                        class="rounded-xl border px-3 py-3 text-xs font-bold transition"
                        :class="form.status === 'active'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'"
                      >
                        <i class="pi pi-check-circle ms-1"></i>
                        حساب نشط
                      </button>

                      <button
                        type="button"
                        @click="form.status = 'inactive'"
                        class="rounded-xl border px-3 py-3 text-xs font-bold transition"
                        :class="form.status === 'inactive'
                          ? 'border-rose-300 bg-rose-50 text-rose-700'
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'"
                      >
                        <i class="pi pi-lock ms-1"></i>
                        حساب معطل
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Permissions -->
              <section class="overflow-hidden rounded-2xl border border-slate-200">
                <div class="border-b border-violet-100 bg-gradient-to-l from-violet-50 via-white to-indigo-50 p-4 sm:p-5">
                  <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div class="flex items-center gap-3">
                        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#8546B5] to-[#5B2188] text-white shadow-md">
                          <i class="pi pi-shield text-lg"></i>
                        </div>
                        <div>
                          <h4 class="text-sm font-black text-slate-900 sm:text-base">صلاحيات الوصول</h4>
                          <p class="mt-1 text-[11px] text-slate-500">حدد الصلاحيات حسب مهام الموظف</p>
                        </div>
                      </div>

                      <div class="rounded-xl border border-violet-100 bg-white px-4 py-2 text-center">
                        <span class="text-xl font-black text-[#7030A0]">{{ form.permissions.length }}</span>
                        <span class="text-[10px] font-bold text-slate-400"> / {{ ALL_EMPLOYEE_PERMISSIONS.length }}</span>
                        <p class="text-[10px] font-bold text-slate-500">صلاحية محددة</p>
                      </div>
                    </div>

                    <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        class="h-full rounded-full bg-gradient-to-l from-violet-500 to-[#5B2188] transition-all"
                        :style="{ width: `${permissionPercentage}%` }"
                      ></div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <span class="text-[11px] font-bold text-slate-600">التحكم في الصلاحيات</span>
                      <div class="flex gap-2">
                        <button
                          type="button"
                          @click="selectAllPermissions"
                          class="rounded-lg border border-violet-200 bg-white px-3 py-2 text-[10px] font-extrabold text-[#7030A0] transition hover:bg-violet-50"
                        >
                          <i class="pi pi-check-square ms-1"></i>
                          تحديد الكل
                        </button>
                        <button
                          type="button"
                          @click="clearPermissions"
                          class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-extrabold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <i class="pi pi-eraser ms-1"></i>
                          إلغاء الكل
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-3 bg-slate-50/50 p-3 sm:p-4">
                  <div
                    v-for="group in permissionGroups"
                    :key="group.id"
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div class="flex flex-col gap-3 border-b border-slate-100 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex h-10 w-10 items-center justify-center rounded-xl"
                          :class="[group.iconBg, group.iconColor]"
                        >
                          <i :class="[group.icon, 'text-base']"></i>
                        </div>
                        <div>
                          <h5 class="text-xs font-black text-slate-900 sm:text-sm">{{ group.label }}</h5>
                          <p class="mt-1 text-[10px] text-slate-500">{{ group.description }}</p>
                          <span class="mt-1 inline-block text-[10px] font-bold text-[#7030A0]">
                            {{ getGroupSelectedCount(group) }} من {{ group.keys.length }} محددة
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        @click="togglePermissionGroup(group)"
                        class="rounded-lg border px-3 py-2 text-[10px] font-extrabold transition"
                        :class="isGroupFullySelected(group)
                          ? 'border-rose-200 bg-rose-50 text-rose-600'
                          : 'border-violet-200 bg-violet-50 text-[#7030A0]'"
                      >
                        <i
                          :class="isGroupFullySelected(group) ? 'pi pi-minus-circle' : 'pi pi-check-circle'"
                          class="ms-1"
                        ></i>
                        {{ isGroupFullySelected(group) ? 'إلغاء المجموعة' : 'تحديد المجموعة' }}
                      </button>
                    </div>

                    <div class="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 sm:p-4">
                      <label
                        v-for="permission in getGroupPermissions(group)"
                        :key="permission.key"
                        class="group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition"
                        :class="form.permissions.includes(permission.key)
                          ? 'border-violet-300 bg-violet-50/70'
                          : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-slate-50'"
                      >
                        <input
                          v-model="form.permissions"
                          type="checkbox"
                          :value="permission.key"
                          class="sr-only"
                        />
                        <span
                          class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition"
                          :class="form.permissions.includes(permission.key)
                            ? 'border-[#7030A0] bg-[#7030A0] text-white'
                            : 'border-slate-300 bg-white text-transparent group-hover:border-violet-300'"
                        >
                          <i class="pi pi-check text-[9px]"></i>
                        </span>
                        <span class="min-w-0 flex-1">
                          <span class="block text-[11px] font-extrabold text-slate-800">
                            {{ permission.label }}
                          </span>
                          <span class="mt-1 block text-[10px] leading-relaxed text-slate-500">
                            {{ permission.description }}
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="border-t border-amber-100 bg-amber-50/70 px-4 py-3">
                  <p class="flex items-start gap-2 text-[10px] leading-relaxed text-amber-800">
                    <i class="pi pi-shield mt-0.5"></i>
                    <span>
                      <strong>ملاحظة أمنية:</strong>
                      امنح الموظف أقل مجموعة من الصلاحيات اللازمة لأداء مهامه،
                      وتأكد من التحقق من الصلاحيات داخل الخادم أيضًا.
                    </span>
                  </p>
                </div>
              </section>

              <!-- Error -->
              <div
                v-if="modalError"
                class="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700"
              >
                <i class="pi pi-exclamation-circle mt-0.5"></i>
                <span>{{ modalError }}</span>
              </div>

              <!-- Footer -->
              <div class="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p class="hidden text-[10px] text-slate-400 sm:block">
                  <i class="pi pi-lock ms-1"></i>
                  تحفظ الصلاحيات ضمن حساب الموظف
                </p>

                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    @click="closeModal"
                    :disabled="saving"
                    class="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    :disabled="saving || !form.name.trim() || !form.title.trim() || !form.username.trim()"
                    class="inline-flex items-center gap-2 rounded-xl bg-[#7030A0] px-6 py-3 text-xs font-extrabold text-white shadow-md transition hover:bg-[#532277] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <i v-if="saving" class="pi pi-spin pi-spinner"></i>
                    <i v-else :class="editingId ? 'pi pi-save' : 'pi pi-user-plus'"></i>
                    {{ saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة الموظف' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Employee Details Modal -->
    <Teleport to="body">
      <div
        v-if="detailsEmployee"
        class="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
        @click.self="detailsEmployee = null"
      >
        <div
          class="employee-modal-scroll flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-center justify-between border-b border-slate-100 bg-gradient-to-l from-violet-50 via-white to-indigo-50 p-5">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8546B5] to-[#5B2188] text-white">
                <i class="pi pi-user text-lg"></i>
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900">تفاصيل الموظف</h3>
                <p class="mt-1 text-[11px] text-slate-500">عرض شامل لبيانات الحساب والنشاط والصلاحيات</p>
              </div>
            </div>
            <button
              type="button"
              @click="detailsEmployee = null"
              class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:text-slate-800"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            <!-- Employee Overview -->
            <div class="flex flex-col gap-4 rounded-2xl border border-violet-100 bg-violet-50/50 p-4 sm:flex-row sm:items-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-xl font-black text-[#7030A0]">
                {{ getInitials(detailsEmployee.name) }}
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="text-base font-black text-slate-900">{{ detailsEmployee.name }}</h4>
                <p class="mt-1 text-xs font-semibold text-[#7030A0]">
                  {{ detailsEmployee.title || 'لم يحدد المسمى الوظيفي' }}
                </p>
                <span
                  class="mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold"
                  :class="detailsEmployee.status === 'active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-rose-200 bg-rose-50 text-rose-700'"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="detailsEmployee.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'"
                  ></span>
                  {{ detailsEmployee.status === 'active' ? 'الحساب نشط' : 'الحساب معطل' }}
                </span>
              </div>
            </div>

            <!-- Basic Information -->
            <section>
              <h4 class="mb-3 flex items-center gap-2 text-xs font-black text-slate-800">
                <i class="pi pi-id-card text-[#7030A0]"></i>
                البيانات الأساسية
              </h4>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div
                  v-for="item in detailItems(detailsEmployee)"
                  :key="item.label"
                  class="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <p class="text-[10px] font-bold text-slate-400">{{ item.label }}</p>
                  <p
                    class="mt-1 break-words text-xs font-bold text-slate-800"
                    :dir="item.ltr ? 'ltr' : 'rtl'"
                  >
                    {{ item.value }}
                  </p>
                </div>
              </div>
            </section>

            <!-- Login / Logout -->
            <section>
              <h4 class="mb-3 flex items-center gap-2 text-xs font-black text-slate-800">
                <i class="pi pi-history text-[#7030A0]"></i>
                سجل الدخول والخروج
              </h4>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div class="flex items-center gap-2 text-emerald-700">
                    <i class="pi pi-sign-in"></i>
                    <span class="text-xs font-extrabold">آخر تسجيل دخول</span>
                  </div>
                  <p class="mt-3 text-xs font-bold text-slate-800">
                    {{ detailsEmployee.lastLoginAt ? formatDate(detailsEmployee.lastLoginAt) : 'لا توجد بيانات دخول' }}
                  </p>
                </div>

                <div class="rounded-xl border border-rose-100 bg-rose-50/60 p-4">
                  <div class="flex items-center gap-2 text-rose-700">
                    <i class="pi pi-sign-out"></i>
                    <span class="text-xs font-extrabold">آخر تسجيل خروج</span>
                  </div>
                  <p class="mt-3 text-xs font-bold text-slate-800">
                    {{ detailsEmployee.lastLogoutAt ? formatDate(detailsEmployee.lastLogoutAt) : 'لا توجد بيانات خروج' }}
                  </p>
                </div>
              </div>
            </section>

            <!-- Permissions -->
            <section>
              <div class="mb-3 flex items-center justify-between gap-2">
                <h4 class="flex items-center gap-2 text-xs font-black text-slate-800">
                  <i class="pi pi-shield text-[#7030A0]"></i>
                  الصلاحيات الممنوحة
                </h4>
                <span class="rounded-lg bg-violet-50 px-2.5 py-1 text-[10px] font-black text-[#7030A0]">
                  {{ detailsEmployee.permissions?.length || 0 }} صلاحية
                </span>
              </div>

              <div v-if="detailsEmployee.permissions?.length" class="space-y-3">
                <div
                  v-for="group in permissionGroups"
                  :key="group.id"
                  class="rounded-xl border border-slate-100 p-3"
                >
                  <p class="mb-2 text-[11px] font-black text-slate-700">{{ group.label }}</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="key in group.keys.filter(key => detailsEmployee?.permissions?.includes(key))"
                      :key="key"
                      class="rounded-lg border border-violet-100 bg-violet-50 px-2.5 py-1.5 text-[10px] font-bold text-[#7030A0]"
                    >
                      {{ getPermissionLabel(key) }}
                    </span>
                    <span
                      v-if="!group.keys.some(key => detailsEmployee?.permissions?.includes(key))"
                      class="text-[10px] text-slate-400"
                    >
                      لا توجد صلاحيات في هذه المجموعة
                    </span>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="rounded-xl border border-dashed border-slate-200 p-5 text-center text-xs text-slate-400"
              >
                لا توجد صلاحيات إضافية ممنوحة لهذا الموظف
              </div>
            </section>

            <!-- Account Information -->
            <section>
              <h4 class="mb-2 flex items-center gap-2 text-xs font-black text-slate-800">
                <i class="pi pi-calendar text-[#7030A0]"></i>
                معلومات الحساب
              </h4>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div class="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p class="text-[10px] font-bold text-slate-400">تاريخ إنشاء الحساب</p>
                  <p class="mt-1 text-xs font-bold text-slate-800">
                    {{ detailsEmployee.createdAt ? formatDate(detailsEmployee.createdAt) : '—' }}
                  </p>
                </div>
                <div class="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p class="text-[10px] font-bold text-slate-400">آخر تحديث للحساب</p>
                  <p class="mt-1 text-xs font-bold text-slate-800">
                    {{ detailsEmployee.updatedAt ? formatDate(detailsEmployee.updatedAt) : 'لم يتم تحديثه' }}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <!-- Details Footer -->
          <div class="flex flex-wrap justify-between gap-2 border-t border-slate-100 p-4">
            <NuxtLink
              :to="`/admin/audit?search=${encodeURIComponent(detailsEmployee.username)}`"
              class="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
            >
              <i class="pi pi-history"></i>
              سجل نشاط الموظف
            </NuxtLink>

            <div class="flex gap-2">
              <button
                type="button"
                @click="detailsEmployee = null"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                إغلاق
              </button>
              <button
                type="button"
                @click="editFromDetails"
                class="inline-flex items-center gap-2 rounded-xl bg-[#7030A0] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#532277]"
              >
                <i class="pi pi-pencil"></i>
                تعديل البيانات
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="confirmDialog.show"
        class="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="closeConfirm"
      >
        <div class="w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl">
          <div class="p-6 text-center">
            <div
              class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
              :class="confirmDialog.type === 'delete'
                ? 'bg-rose-50 text-rose-600'
                : 'bg-amber-50 text-amber-600'"
            >
              <i
                :class="confirmDialog.type === 'delete'
                  ? 'pi pi-trash'
                  : 'pi pi-exclamation-triangle'"
                class="text-2xl"
              ></i>
            </div>
            <h3 class="mt-4 text-base font-black text-slate-900">{{ confirmDialog.title }}</h3>
            <p class="mt-2 text-xs leading-relaxed text-slate-500">{{ confirmDialog.message }}</p>
          </div>

          <div class="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
            <button
              type="button"
              @click="closeConfirm"
              :disabled="confirmDialog.loading"
              class="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              تراجع
            </button>

            <button
              type="button"
              @click="executeConfirm"
              :disabled="confirmDialog.loading"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold text-white transition disabled:opacity-50"
              :class="confirmDialog.type === 'delete'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#7030A0] hover:bg-[#532277]'"
            >
              <i v-if="confirmDialog.loading" class="pi pi-spin pi-spinner"></i>
              <i
                v-else
                :class="confirmDialog.type === 'delete' ? 'pi pi-trash' : 'pi pi-check'"
              ></i>
              {{ confirmDialog.loading ? 'جاري التنفيذ...' : confirmDialog.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast Notifications -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-3 opacity-0"
      >
        <div
          v-if="toast.show"
          class="fixed bottom-5 left-5 z-[200] flex w-[min(420px,calc(100vw-40px))] items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl"
          :class="toast.type === 'success' ? 'border-emerald-200' : 'border-rose-200'"
        >
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            :class="toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-rose-50 text-rose-600'"
          >
            <i :class="toast.type === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'"></i>
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-xs font-black text-slate-900">
              {{ toast.type === 'success' ? 'تم بنجاح' : 'تعذر تنفيذ العملية' }}
            </p>
            <p class="mt-1 text-xs leading-relaxed text-slate-500">{{ toast.message }}</p>
          </div>

          <button
            type="button"
            @click="toast.show = false"
            class="text-slate-400 hover:text-slate-700"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ALL_EMPLOYEE_PERMISSIONS,
  type Employee,
  type EmployeePermission,
} from '../../../../shared/types/employee';

type EmployeeWithActivity = Employee & {
  lastLogoutAt?: string;
};

type PermissionGroup = {
  id: string;
  label: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  keys: EmployeePermission[];
};

// ========================================
// PERMISSION GROUPS
// ========================================

const permissionGroups: PermissionGroup[] = [
  {
    id: 'plots',
    label: 'إدارة القطع والأراضي',
    description: 'التحكم في القطع وحالات البيع والحجز والأرشفة',
    icon: 'pi pi-map',
    iconBg: 'bg-violet-50',
    iconColor: 'text-[#7030A0]',
    keys: ['view_plots', 'create_plots', 'edit_plots', 'delete_plots'],
  },
  {
    id: 'plot-pages',
    label: 'صفحات تفاصيل القطع',
    description: 'عرض وإنشاء وتعديل وحذف صفحات القطع',
    icon: 'pi pi-file',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    keys: ['view_plot_page', 'create_plot_page', 'edit_plot_page', 'delete_plot_page'],
  },
  {
    id: 'zones',
    label: 'إدارة المناطق',
    description: 'عرض وإنشاء وتعديل وحذف المناطق',
    icon: 'pi pi-map-marker',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    keys: ['view_zone_page', 'create_zone_page', 'edit_zone_page', 'delete_zone_page'],
  },
  {
    id: 'blocks',
    label: 'إدارة البلوكات',
    description: 'عرض وإنشاء وتعديل وحذف البلوكات',
    icon: 'pi pi-th-large',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    keys: ['view_block_page', 'create_block_page', 'edit_block_page', 'delete_block_page'],
  },
  {
    id: 'system',
    label: 'العقود والإحصائيات والتقارير',
    description: 'العقود والإحصائيات وتصدير البيانات',
    icon: 'pi pi-chart-bar',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    keys: ['view_contracts', 'edit_contracts', 'view_stats', 'export_data'],
  },
];

// ========================================
// EMPLOYEE DATA
// ========================================

const {
  data: response,
  pending,
  refresh,
} = await useFetch<{
  success: boolean;
  data: EmployeeWithActivity[];
}>('/api/admin/employees');

const employees = computed(() => response.value?.data || []);

const activeCount = computed(() =>
  employees.value.filter(employee => employee.status === 'active').length,
);

const inactiveCount = computed(() =>
  employees.value.filter(employee => employee.status !== 'active').length,
);

const stats = computed(() => [
  {
    label: 'إجمالي الموظفين',
    value: employees.value.length,
    percentage: employees.value.length ? 100 : 0,
    icon: 'pi pi-users',
    iconBg: 'bg-violet-50',
    iconColor: 'text-[#7030A0]',
    valueColor: 'text-slate-900',
    barColor: 'bg-[#7030A0]',
  },
  {
    label: 'الموظفون النشطون',
    value: activeCount.value,
    percentage: employees.value.length
      ? (activeCount.value / employees.value.length) * 100
      : 0,
    icon: 'pi pi-check-circle',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    valueColor: 'text-emerald-600',
    barColor: 'bg-emerald-500',
  },
  {
    label: 'الحسابات المعطلة',
    value: inactiveCount.value,
    percentage: employees.value.length
      ? (inactiveCount.value / employees.value.length) * 100
      : 0,
    icon: 'pi pi-lock',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    valueColor: 'text-rose-600',
    barColor: 'bg-rose-500',
  },
]);

// ========================================
// FORM STATE
// ========================================

const showModal = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);
const modalError = ref('');

const form = reactive({
  name: '',
  title: '',
  phone: '',
  username: '',
  password: '',
  status: 'active' as 'active' | 'inactive',
  permissions: [] as EmployeePermission[],
});

const resetForm = () => {
  form.name = '';
  form.title = '';
  form.phone = '';
  form.username = '';
  form.password = '';
  form.status = 'active';
  form.permissions = [];
};

const openAddModal = () => {
  editingId.value = null;
  resetForm();

  form.permissions = [
    'view_plots',
    'view_contracts',
    'view_stats',
  ];

  modalError.value = '';
  showModal.value = true;
};

const openEditModal = (employee: EmployeeWithActivity) => {
  editingId.value = employee.id;

  form.name = employee.name || '';
  form.title = employee.title || '';
  form.phone = employee.phone || '';
  form.username = employee.username || '';
  form.password = '';
  form.status = employee.status || 'active';
  form.permissions = [...(employee.permissions || [])];

  modalError.value = '';
  showModal.value = true;
};

const closeModal = () => {
  if (saving.value) return;

  showModal.value = false;
  editingId.value = null;
  modalError.value = '';
};

// ========================================
// PERMISSIONS
// ========================================

const getPermissionLabel = (key: EmployeePermission) =>
  ALL_EMPLOYEE_PERMISSIONS.find(item => item.key === key)?.label || key;

const getGroupPermissions = (group: PermissionGroup) =>
  group.keys
    .map(key =>
      ALL_EMPLOYEE_PERMISSIONS.find(permission => permission.key === key),
    )
    .filter(
      (permission): permission is (typeof ALL_EMPLOYEE_PERMISSIONS)[number] =>
        Boolean(permission),
    );

const getGroupSelectedCount = (group: PermissionGroup) =>
  group.keys.filter(key => form.permissions.includes(key)).length;

const isGroupFullySelected = (group: PermissionGroup) =>
  group.keys.length > 0 &&
  group.keys.every(key => form.permissions.includes(key));

const togglePermissionGroup = (group: PermissionGroup) => {
  if (isGroupFullySelected(group)) {
    form.permissions = form.permissions.filter(
      key => !group.keys.includes(key),
    );
  } else {
    form.permissions = [
      ...new Set([...form.permissions, ...group.keys]),
    ];
  }
};

const permissionPercentage = computed(() =>
  ALL_EMPLOYEE_PERMISSIONS.length
    ? Math.round(
        (form.permissions.length / ALL_EMPLOYEE_PERMISSIONS.length) * 100,
      )
    : 0,
);

const selectAllPermissions = () => {
  form.permissions = ALL_EMPLOYEE_PERMISSIONS.map(
    permission => permission.key,
  );
};

const clearPermissions = () => {
  form.permissions = [];
};

// ========================================
// SAVE EMPLOYEE
// ========================================

const saveEmployee = async () => {
  modalError.value = '';

  const name = form.name.trim();
  const title = form.title.trim();
  const username = form.username.trim();
  const password = form.password;

  if (!name) {
    modalError.value = 'يرجى إدخال اسم الموظف';
    return;
  }

  if (!title) {
    modalError.value = 'يرجى إدخال المسمى الوظيفي للموظف';
    return;
  }

  if (!username) {
    modalError.value = 'يرجى إدخال اسم المستخدم';
    return;
  }

  if (!editingId.value && password.length < 4) {
    modalError.value = 'كلمة المرور يجب ألا تقل عن 4 خانات';
    return;
  }

  if (password && password.length < 4) {
    modalError.value = 'كلمة المرور الجديدة يجب ألا تقل عن 4 خانات';
    return;
  }

  // Preserve the operation type before resetting editingId.
  const wasEditing = Boolean(editingId.value);
  const employeeId = editingId.value;

  saving.value = true;

  try {
    const employeeData = {
      name,
      title,
      phone: form.phone.trim(),
      username,
      status: form.status,
      permissions: [...new Set(form.permissions)],
    };

    if (employeeId) {
      await $fetch(`/api/admin/employees/${employeeId}`, {
        method: 'PUT',
        body: {
          ...employeeData,
          ...(password ? { password } : {}),
        },
      });
    } else {
      await $fetch('/api/admin/employees', {
        method: 'POST',
        body: {
          ...employeeData,
          password,
        },
      });
    }

    await refresh();

    showModal.value = false;
    editingId.value = null;
    resetForm();

    showToast(
      wasEditing
        ? 'تم تحديث بيانات الموظف بنجاح'
        : 'تمت إضافة الموظف بنجاح',
    );
  } catch (error: any) {
    modalError.value =
      error?.data?.statusMessage ||
      error?.data?.message ||
      error?.message ||
      'حدث خطأ أثناء حفظ بيانات الموظف';
  } finally {
    saving.value = false;
  }
};

// ========================================
// DISPLAY HELPERS
// ========================================

const getInitials = (name: string) =>
  name?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('') || '؟';

const formatDate = (date?: string) => {
  if (!date) return '—';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const detailItems = (employee: EmployeeWithActivity) => [
  {
    label: 'اسم المستخدم',
    value: employee.username || '—',
    ltr: true,
  },
  {
    label: 'المسمى الوظيفي',
    value: employee.title || 'غير محدد',
  },
  {
    label: 'رقم الهاتف',
    value: employee.phone || 'غير مسجل',
    ltr: true,
  },
  {
    label: 'معرف الحساب',
    value: employee.id || '—',
    ltr: true,
  },
  {
    label: 'نوع الحساب',
    value: employee.role === 'employee'
      ? 'موظف'
      : employee.role || '—',
  },
  {
    label: 'حالة الحساب',
    value: employee.status === 'active' ? 'نشط' : 'معطل',
  },
];

// ========================================
// EMPLOYEE DETAILS
// ========================================

const detailsEmployee = ref<EmployeeWithActivity | null>(null);

const openDetails = (employee: EmployeeWithActivity) => {
  detailsEmployee.value = employee;
};

const editFromDetails = () => {
  if (!detailsEmployee.value) return;

  const employee = detailsEmployee.value;

  detailsEmployee.value = null;
  openEditModal(employee);
};

// ========================================
// LOGIN URL
// ========================================

const config = useRuntimeConfig();

const employeeLoginPath =
  (config.public.employeeLoginPath as string) || '/employee-login';

const employeeLoginUrl = ref(employeeLoginPath);
const copiedUrl = ref(false);

let copyFeedbackTimer: ReturnType<typeof setTimeout> | undefined;
let toastTimer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  employeeLoginUrl.value =
    `${window.location.origin}${employeeLoginPath}`;
});

onBeforeUnmount(() => {
  if (copyFeedbackTimer) clearTimeout(copyFeedbackTimer);
  if (toastTimer) clearTimeout(toastTimer);
});

const copyEmployeeLoginUrl = async () => {
  try {
    await navigator.clipboard.writeText(employeeLoginUrl.value);

    copiedUrl.value = true;
    showToast('تم نسخ رابط بوابة الموظفين بنجاح');

    if (copyFeedbackTimer) clearTimeout(copyFeedbackTimer);

    copyFeedbackTimer = setTimeout(() => {
      copiedUrl.value = false;
    }, 2500);
  } catch {
    showToast(
      'تعذر نسخ الرابط. تحقق من صلاحية الوصول إلى الحافظة.',
      'error',
    );
  }
};

// ========================================
// TOAST NOTIFICATIONS
// ========================================

const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'error',
  message: '',
});

const showToast = (
  message: string,
  type: 'success' | 'error' = 'success',
) => {
  toast.message = message;
  toast.type = type;
  toast.show = true;

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.show = false;
  }, 3500);
};

// ========================================
// CONFIRMATION DIALOG
// ========================================

const confirmDialog = reactive({
  show: false,
  loading: false,
  type: 'status' as 'status' | 'delete',
  title: '',
  message: '',
  confirmText: 'تأكيد',
  action: null as null | (() => Promise<void>),
});

const closeConfirm = () => {
  if (confirmDialog.loading) return;

  confirmDialog.show = false;
  confirmDialog.action = null;
};

const executeConfirm = async () => {
  if (!confirmDialog.action || confirmDialog.loading) return;

  confirmDialog.loading = true;

  try {
    await confirmDialog.action();

    confirmDialog.show = false;
    confirmDialog.action = null;
  } catch (error: any) {
    showToast(
      error?.data?.statusMessage ||
      error?.data?.message ||
      error?.message ||
      'حدث خطأ أثناء تنفيذ العملية',
      'error',
    );
  } finally {
    confirmDialog.loading = false;
  }
};

// ========================================
// EMPLOYEE STATUS
// ========================================

const requestStatusChange = (employee: EmployeeWithActivity) => {
  const nextStatus =
    employee.status === 'active' ? 'inactive' : 'active';

  const actionLabel =
    nextStatus === 'active' ? 'تفعيل' : 'تعطيل';

  confirmDialog.type = 'status';
  confirmDialog.title = `تأكيد ${actionLabel} الحساب`;

  confirmDialog.message =
    `هل تريد بالفعل ${actionLabel} حساب الموظف "${employee.name}"؟`;

  confirmDialog.confirmText = `تأكيد ${actionLabel}`;

  confirmDialog.action = async () => {
    await $fetch(`/api/admin/employees/${employee.id}`, {
      method: 'PUT',
      body: {
        status: nextStatus,
      },
    });

    await refresh();

    showToast(`تم ${actionLabel} حساب الموظف بنجاح`);
  };

  confirmDialog.show = true;
};

// ========================================
// DELETE EMPLOYEE
// ========================================

const requestDelete = (employee: EmployeeWithActivity) => {
  confirmDialog.type = 'delete';
  confirmDialog.title = 'حذف حساب الموظف';

  confirmDialog.message =
    `هل أنت متأكد من حذف حساب "${employee.name}" نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.`;

  confirmDialog.confirmText = 'حذف الموظف';

  confirmDialog.action = async () => {
    await $fetch(`/api/admin/employees/${employee.id}`, {
      method: 'DELETE',
    });

    await refresh();

    showToast('تم حذف حساب الموظف بنجاح');
  };

  confirmDialog.show = true;
};
</script>

<style scoped>
/* ========================================
   INPUT WRAPPER
======================================== */

.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  isolation: isolate;
}

/* ========================================
   INPUT ICON
======================================== */

.form-input-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);

  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #94a3b8;
  font-size: 13px;

  /* Critical fix: icon must never block input interaction */
  pointer-events: none;
  user-select: none;

  transition: color 0.2s ease;
}

.form-input-icon-ltr {
  right: auto;
  left: 14px;
}

/* Change icon color when input is focused */
.form-input-wrapper:focus-within .form-input-icon {
  color: #7030A0;
}

/* ========================================
   INPUT ELEMENT
======================================== */

.form-input {
  position: relative;
  z-index: 0;

  display: block;
  width: 100%;
  min-width: 0;
  height: 46px;

  border: 1px solid #e2e8f0;
  border-radius: 12px;

  background-color: #fff;

  padding: 0 14px;

  color: #1e293b;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  outline: none;

  caret-color: #7030A0;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

/* Reserve space for the icon on the RTL side */
.form-input-with-icon {
  padding-right: 42px;
}

/* LTR inputs with icons */
.form-input-ltr {
  direction: ltr;
  text-align: left;
  padding-right: 14px;
  padding-left: 42px;
}

/* Placeholder */
.form-input::placeholder {
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 500;
  opacity: 1;
}

/* Hover */
.form-input:hover:not(:focus) {
  border-color: #c4b5d0;
}

/* Focus */
.form-input:focus {
  border-color: #7030A0;
  background-color: #fff;

  box-shadow:
    0 0 0 3px rgb(112 48 160 / 10%),
    0 1px 2px rgb(15 23 42 / 4%);
}

/* Autofill */
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus {
  -webkit-text-fill-color: #1e293b;
  box-shadow: 0 0 0 1000px #fff inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* Disabled */
.form-input:disabled {
  cursor: not-allowed;
  background-color: #f8fafc;
  color: #94a3b8;
  opacity: 0.7;
}

/* ========================================
   MODAL SCROLLBAR
======================================== */

.employee-modal-scroll {
  scrollbar-width: thin;
  scrollbar-color: #d8c6e8 transparent;
  overscroll-behavior: contain;
}

.employee-modal-scroll::-webkit-scrollbar {
  width: 6px;
}

.employee-modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.employee-modal-scroll::-webkit-scrollbar-thumb {
  background: #d8c6e8;
  border-radius: 999px;
}

.employee-modal-scroll::-webkit-scrollbar-thumb:hover {
  background: #b99bcf;
}

/* ========================================
   ACCESSIBILITY
======================================== */

.form-input:focus-visible {
  outline: none;
}

button:focus-visible,
a:focus-visible,
label:has(input[type="checkbox"]:focus-visible) {
  outline: 2px solid #8546B5;
  outline-offset: 3px;
}
</style>
