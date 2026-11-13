<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <NuxtLink to="/admin" class="text-xs text-slate-400 hover:text-[#7030A0]">الإدارة</NuxtLink>
          <span class="text-xs text-slate-300">/</span>
          <span class="text-xs font-bold text-[#7030A0]">فريق العمل</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          إدارة الموظفين والصلاحيات
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          إضافة حسابات الموظفين، تخصيص الصلاحيات بدقة، ومراقبة كافة العمليات المسجلة في النظام
        </p>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/audit"
          class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2"
        >
          <i class="pi pi-history text-slate-400"></i>
          <span>سجل نشاط الموظفين</span>
        </NuxtLink>

        <button
          type="button"
          @click="openAddModal"
          class="px-4 py-2.5 rounded-xl bg-[#7030A0] text-white hover:bg-[#532277] text-xs sm:text-sm font-bold shadow-md shadow-purple-900/20 flex items-center gap-2"
        >
          <i class="pi pi-user-plus text-xs"></i>
          <span>إضافة موظف جديد</span>
        </button>
      </div>
    </div>

    <!-- Employee Login Link Banner -->
    <div class="rounded-2xl bg-gradient-to-l from-indigo-50 via-purple-50 to-white border border-indigo-200/80 p-5 shadow-xs">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <i class="pi pi-link text-base"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900 text-sm">رابط بوابة تسجيل دخول الموظفين (المسار الخاص)</span>
              <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-2xs font-extrabold">منفصل عن الإدارة</span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">
              شارك هذا الرابط السري مع الموظفين فقط لتسجيل الدخول إلى حساباتهم واستخدام النظام حسب الصلاحيات المحددة لهم:
            </p>
            <div class="mt-2 font-mono text-xs text-indigo-900 bg-white/90 border border-indigo-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 max-w-full overflow-x-auto" dir="ltr">
              <span>{{ employeeLoginUrl }}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          @click="copyEmployeeLoginUrl"
          class="self-start md:self-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
        >
          <i :class="copiedUrl ? 'pi pi-check text-emerald-300' : 'pi pi-copy'"></i>
          <span>{{ copiedUrl ? 'تم نسخ الرابط!' : 'نسخ رابط الدخول' }}</span>
        </button>
      </div>
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">إجمالي الموظفين</span>
          <span class="w-8 h-8 rounded-lg bg-purple-50 text-[#7030A0] flex items-center justify-center">
            <i class="pi pi-users text-sm"></i>
          </span>
        </div>
        <div class="mt-2 text-2xl font-black text-slate-900 tabular-nums">
          {{ employees.length }}
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">الموظفون النشطون</span>
          <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <i class="pi pi-check-circle text-sm"></i>
          </span>
        </div>
        <div class="mt-2 text-2xl font-black text-emerald-600 tabular-nums">
          {{ activeCount }}
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">حسابات معطلة</span>
          <span class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <i class="pi pi-lock text-sm"></i>
          </span>
        </div>
        <div class="mt-2 text-2xl font-black text-slate-700 tabular-nums">
          {{ inactiveCount }}
        </div>
      </div>
    </div>

    <!-- Employees Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <i class="pi pi-id-card text-[#7030A0]"></i>
          <h2 class="font-bold text-slate-900 text-base">قائمة حسابات الموظفين والصلاحيات</h2>
          <span class="text-xs text-slate-400">({{ employees.length }} موظف)</span>
        </div>

        <button
          type="button"
          @click="refresh"
          class="text-xs font-semibold text-slate-500 hover:text-[#7030A0] flex items-center gap-1 self-start"
        >
          <i class="pi pi-refresh text-xs"></i>
          <span>تحديث القائمة</span>
        </button>
      </div>

      <div v-if="pending" class="p-8 text-center text-slate-400">
        <i class="pi pi-spin pi-spinner text-2xl text-[#7030A0] mb-2"></i>
        <p>جاري تحميل قائمة الموظفين...</p>
      </div>

      <div v-else-if="employees.length === 0" class="p-12 text-center text-slate-500">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-50 text-[#7030A0] flex items-center justify-center text-2xl">
          <i class="pi pi-users"></i>
        </div>
        <h3 class="font-bold text-slate-900 text-base">لا يوجد موظفون مسجلون بعد</h3>
        <p class="text-xs text-slate-500 mt-1 mb-4">أضف اسم الموظف وبيانات دخوله، ثم حدد الصلاحيات المناسبة لحسابه</p>
        <button
          type="button"
          @click="openAddModal"
          class="px-4 py-2 rounded-xl bg-[#7030A0] text-white text-xs font-bold"
        >
          إضافة أول موظف الآن
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-start border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <th class="px-4 py-3.5 text-start">الموظف</th>
              <th class="px-4 py-3.5 text-start">اسم المستخدم</th>
              <th class="px-4 py-3.5 text-center">الحالة</th>
              <th class="px-4 py-3.5 text-start">الصلاحيات الممنوحة</th>
              <th class="px-4 py-3.5 text-start">آخر دخول</th>
              <th class="px-4 py-3.5 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="emp in employees" :key="emp.id" class="hover:bg-slate-50/70 transition-colors">
              <!-- Name & Title -->
              <td class="px-4 py-3.5">
                <div class="font-bold text-slate-900">{{ emp.name }}</div>
                <div class="text-2xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span v-if="emp.title">{{ emp.title }}</span>
                  <span v-if="emp.phone" class="font-mono" dir="ltr">{{ emp.phone }}</span>
                </div>
              </td>

              <!-- Username -->
              <td class="px-4 py-3.5 font-mono text-xs font-semibold text-indigo-900" dir="ltr">
                {{ emp.username }}
              </td>

              <!-- Status -->
              <td class="px-4 py-3.5 text-center">
                <button
                  type="button"
                  @click="toggleStatus(emp)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                  :class="emp.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'"
                  :title="emp.status === 'active' ? 'انقر للتعطيل' : 'انقر للتفعيل'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="emp.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  <span>{{ emp.status === 'active' ? 'نشط' : 'معطل' }}</span>
                </button>
              </td>

              <!-- Permissions Chips -->
              <td class="px-4 py-3.5 max-w-xs">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="p in emp.permissions"
                    :key="p"
                    class="px-2 py-0.5 rounded-md text-2xs font-bold bg-purple-50 text-[#7030A0] border border-purple-100"
                  >
                    {{ getPermissionLabel(p) }}
                  </span>
                  <span v-if="!emp.permissions?.length" class="text-2xs text-slate-400">
                    بدون صلاحيات إضافية
                  </span>
                </div>
              </td>

              <!-- Last login -->
              <td class="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                <span v-if="emp.lastLoginAt" class="font-mono text-2xs">
                  {{ new Date(emp.lastLoginAt).toLocaleString('ar-SA') }}
                </span>
                <span v-else class="text-slate-400 text-2xs">لم يسجل الدخول بعد</span>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3.5 text-center whitespace-nowrap">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    @click="openEditModal(emp)"
                    class="w-8 h-8 rounded-lg text-[#7030A0] hover:bg-purple-50 flex items-center justify-center transition-colors"
                    title="تعديل الموظف والصلاحيات"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>

                  <NuxtLink
                    :to="`/admin/audit?search=${encodeURIComponent(emp.username)}`"
                    class="w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors"
                    title="استعراض سجلات هذا الموظف"
                  >
                    <i class="pi pi-history text-xs"></i>
                  </NuxtLink>

                  <button
                    type="button"
                    @click="confirmDelete(emp)"
                    class="w-8 h-8 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
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
    </div>

    <!-- Add / Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="closeModal"
    >
      <div class="employee-modal-scroll bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-[770px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold">
              <i :class="editingId ? 'pi pi-user-edit' : 'pi pi-user-plus'"></i>
            </div>
            <div>
              <h3 class="font-black text-slate-900 text-lg">
                {{ editingId ? 'تعديل بيانات وصلاحيات الموظف' : 'إضافة موظف جديد' }}
              </h3>
              <p class="text-xs text-slate-500">
                حدد بيانات الدخول والصلاحيات الإجرائية المسموح للموظف بالقيام بها
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="closeModal"
            class="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveEmployee" class="space-y-5">
          <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-4">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <i class="pi pi-key text-sm"></i>
              </span>
              <div>
                <h4 class="text-sm font-black text-slate-900">بيانات تسجيل الدخول</h4>
                <p class="text-xs text-slate-500 mt-0.5">البيانات الأساسية التي سيستخدمها الموظف للدخول إلى التطبيق</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                اسم الموظف <span class="text-rose-500">*</span>
              </label>
              <input
                v-model.trim="form.name"
                type="text"
                required
                autocomplete="name"
                placeholder="مثال: أحمد عبد الله"
                class="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7030A0] focus:ring-4 focus:ring-[#7030A0]/10 outline-none transition-all"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم المستخدم <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model.trim="form.username"
                  type="text"
                  required
                  autocomplete="username"
                  dir="ltr"
                  placeholder="username"
                  class="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-left focus:border-[#7030A0] focus:ring-4 focus:ring-[#7030A0]/10 outline-none transition-all"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">
                  كلمة المرور <span v-if="!editingId" class="text-rose-500">*</span>
                </label>
                <input
                  v-model="form.password"
                  type="password"
                  :required="!editingId"
                  autocomplete="new-password"
                  dir="ltr"
                  :placeholder="editingId ? 'اتركها فارغة دون تغيير' : 'أنشئ كلمة مرور قوية'"
                  class="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-left font-mono focus:border-[#7030A0] focus:ring-4 focus:ring-[#7030A0]/10 outline-none transition-all"
                />
                <p v-if="editingId" class="text-[11px] text-slate-400 mt-1.5">
                  لا تحتاج إلى إدخال كلمة المرور الحالية؛ اكتب كلمة جديدة فقط عند الرغبة في تغييرها.
                </p>
              </div>
            </div>
          </div>

          <!-- Permissions Section -->
          <section class="rounded-2xl border border-slate-200 overflow-hidden">
            <div class="p-4 sm:p-5 bg-gradient-to-l from-violet-50 via-white to-indigo-50 border-b border-slate-100">
              <div class="relative overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">

                <!-- Decorative background -->
                <div class="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-violet-100/50 blur-3xl"></div>

                <div class="relative flex flex-col gap-5 p-4 sm:p-5">

                  <!-- Section heading -->
                  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div class="flex min-w-0 items-center gap-3">
                      <div class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8546B5] to-[#5B2188] text-white shadow-lg shadow-violet-900/20">
                        <i class="pi pi-shield text-xl"></i>
                        <span class="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400"></span>
                      </div>

                      <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                          <h4 class="text-sm font-black text-slate-900 sm:text-base">
                            صلاحيات الوصول للموظف
                          </h4>
                          <span class="inline-flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50 px-2 py-1 text-[9px] font-extrabold tracking-wider text-[#7030A0]">
                            <i class="pi pi-lock text-[9px]"></i>
                            ACCESS CONTROL
                          </span>
                        </div>

                        <p class="mt-1 text-xs leading-relaxed text-slate-500">
                          حدد الصفحات والمهام التي يمكن لهذا الموظف الوصول إليها
                        </p>
                      </div>
                    </div>

                    <!-- Selection summary -->
                    <div class="flex items-center gap-2 self-start rounded-xl border border-violet-100 bg-violet-50/70 px-3 py-2 sm:self-center">
                      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#7030A0] shadow-sm">
                        <i class="pi pi-check-circle text-sm"></i>
                      </div>

                      <div>
                        <div class="flex items-baseline gap-1">
                          <span class="text-lg font-black leading-none tabular-nums text-[#7030A0]">
                            {{ form.permissions.length }}
                          </span>
                          <span class="text-[10px] font-bold text-slate-400">
                            / {{ ALL_EMPLOYEE_PERMISSIONS.length }}
                          </span>
                        </div>
                        <span class="text-[10px] font-semibold text-slate-500">
                          صلاحية محددة
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Access level -->
                  <div class="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">

                    <div class="mb-2.5 flex items-center justify-between gap-3">
                      <div class="flex items-center gap-2">
                        <i class="pi pi-chart-bar text-xs text-[#7030A0]"></i>
                        <span class="text-xs font-bold text-slate-600">
                          مستوى الوصول الممنوح
                        </span>
                      </div>

                      <span class="rounded-lg bg-violet-100 px-2 py-1 text-[11px] font-black tabular-nums text-[#7030A0]">
                        {{ Math.round(ALL_EMPLOYEE_PERMISSIONS.length
                          ? (form.permissions.length / ALL_EMPLOYEE_PERMISSIONS.length) * 100
                          : 0) }}%
                      </span>
                    </div>

                    <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        class="h-full rounded-full bg-gradient-to-l from-violet-500 via-[#8546B5] to-[#5B2188] transition-all duration-500 ease-out"
                        :style="{
                          width: `${ALL_EMPLOYEE_PERMISSIONS.length
                            ? (form.permissions.length / ALL_EMPLOYEE_PERMISSIONS.length) * 100
                            : 0}%`
                        }"
                      ></div>
                    </div>

                    <div class="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                      <span>بدون صلاحيات</span>
                      <span>جميع الصلاحيات</span>
                    </div>
                  </div>

                  <!-- Quick actions -->
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div class="flex items-center gap-2">
                      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <i class="pi pi-sliders-h text-sm"></i>
                      </div>
                      <div>
                        <p class="text-xs font-extrabold text-slate-800">
                          إدارة الصلاحيات
                        </p>
                        <p class="text-[10px] text-slate-400">
                          يمكنك تعديل الاختيارات في أي وقت
                        </p>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 sm:flex sm:items-center">

                      <button
                        type="button"
                        @click="selectAllPermissions"
                        :disabled="form.permissions.length === ALL_EMPLOYEE_PERMISSIONS.length"
                        class="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-xs font-extrabold text-[#7030A0] shadow-sm transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                      >
                        <i class="pi pi-check-square text-sm"></i>
                        تحديد الكل
                      </button>

                      <button
                        type="button"
                        @click="clearPermissions"
                        :disabled="form.permissions.length === 0"
                        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-500 shadow-sm transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                      >
                        <i class="pi pi-eraser text-sm"></i>
                        إلغاء الكل
                      </button>

                    </div>
                  </div>

                  <!-- Security note -->
                  <div class="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2.5">
                    <i class="pi pi-info-circle mt-0.5 shrink-0 text-xs text-amber-600"></i>
                    <p class="text-[10px] leading-relaxed text-amber-800">
                      <span class="font-extrabold">تنبيه أمني:</span>
                      امنح الموظف الصلاحيات التي يحتاجها لأداء مهامه فقط، لتقليل الوصول غير الضروري إلى بيانات النظام.
                    </p>
                  </div>

                </div>
              </div>


            </div>

            <div class="p-4 sm:p-5 bg-white">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  v-for="perm in ALL_EMPLOYEE_PERMISSIONS"
                  :key="perm.key"
                  class="group relative flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200"
                  :class="form.permissions.includes(perm.key)
                    ? 'border-[#7030A0]/40 bg-violet-50/70 shadow-sm ring-1 ring-[#7030A0]/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'"
                >
                  <input
                    type="checkbox"
                    :value="perm.key"
                    v-model="form.permissions"
                    class="sr-only"
                  />
                  <span
                    class="mt-0.5 w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all"
                    :class="form.permissions.includes(perm.key)
                      ? 'bg-[#7030A0] border-[#7030A0] text-white'
                      : 'bg-white border-slate-300 text-transparent group-hover:border-slate-400'"
                  >
                    <i class="pi pi-check text-[10px] font-bold"></i>
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block text-xs font-extrabold text-slate-800">{{ perm.label }}</span>
                    <span class="block text-[11px] text-slate-500 leading-relaxed mt-1">{{ perm.description }}</span>
                  </span>
                  <span
                    v-if="form.permissions.includes(perm.key)"
                    class="absolute top-2 end-2 w-1.5 h-1.5 rounded-full bg-[#7030A0]"
                  ></span>
                </label>
              </div>

              <div class="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-800">
                <i class="pi pi-info-circle mt-0.5 text-sm shrink-0"></i>
                <p class="text-[11px] leading-relaxed">
                  امنح الموظف أقل مجموعة من الصلاحيات اللازمة لعمله. يمكن تعديل هذه الصلاحيات لاحقًا من صفحة إدارة الموظفين.
                </p>
              </div>
            </div>
          </section>

          <!-- Error Alert -->
          <div v-if="modalError" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {{ modalError }}
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
            >
              إلغاء
            </button>

            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2.5 rounded-xl bg-[#7030A0] hover:bg-[#532277] text-white text-xs font-bold shadow-md shadow-purple-900/20 flex items-center gap-2 disabled:opacity-50"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
              <span>{{ saving ? 'جاري الحفظ...' : (editingId ? 'حفظ التعديلات' : 'إضافة الموظف') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ALL_EMPLOYEE_PERMISSIONS, type Employee, type EmployeePermission } from '../../../../shared/types/employee';

const { data: response, pending, refresh } = await useFetch<{
  success: boolean;
  data: Employee[];
}>('/api/admin/employees');

const employees = computed(() => response.value?.data || []);

const activeCount = computed(() => employees.value.filter((e) => e.status === 'active').length);
const inactiveCount = computed(() => employees.value.filter((e) => e.status !== 'active').length);

const getPermissionLabel = (key: EmployeePermission) => {
  const p = ALL_EMPLOYEE_PERMISSIONS.find((item) => item.key === key);
  return p ? p.label : key;
};

// Login link
const config = useRuntimeConfig();
const employeeLoginPath = (config.public.employeeLoginPath as string) || '/employee-login';
const employeeLoginUrl = ref(employeeLoginPath);
const copiedUrl = ref(false);

onMounted(() => {
  if (typeof window !== 'undefined') {
    employeeLoginUrl.value = `${window.location.origin}${employeeLoginPath}`;
  }
});

const copyEmployeeLoginUrl = async () => {
  try {
    await navigator.clipboard.writeText(employeeLoginUrl.value);
    copiedUrl.value = true;
    setTimeout(() => {
      copiedUrl.value = false;
    }, 2500);
  } catch (err) {
    console.error('Failed to copy employee url:', err);
  }
};

// Modal State
const showModal = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);
const modalError = ref('');

const form = reactive({
  name: '',
  username: '',
  password: '',
  status: 'active' as 'active' | 'inactive',
  permissions: [] as EmployeePermission[],
});

const selectAllPermissions = () => {
  form.permissions = ALL_EMPLOYEE_PERMISSIONS.map((p) => p.key);
};

const clearPermissions = () => {
  form.permissions = [];
};

const openAddModal = () => {
  editingId.value = null;
  form.name = '';
  form.username = '';
  form.password = '';
  form.status = 'active';
  form.permissions = ['view_plots', 'view_contracts', 'view_stats'];
  modalError.value = '';
  showModal.value = true;
};

const openEditModal = (emp: Employee) => {
  editingId.value = emp.id;
  form.name = emp.name;
  form.username = emp.username;
  // Never load or display an existing password in the browser.
  form.password = '';
  form.status = emp.status;
  form.permissions = [...(emp.permissions || [])];
  modalError.value = '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalError.value = '';
};

const saveEmployee = async () => {
  saving.value = true;
  modalError.value = '';

  try {
    if (editingId.value) {
      // Update
      await $fetch(`/api/admin/employees/${editingId.value}`, {
        method: 'PUT',
        body: {
          name: form.name,
          username: form.username,
          ...(form.password ? { password: form.password } : {}),
          status: form.status,
          permissions: form.permissions,
        },
      });
    } else {
      // Create
      await $fetch('/api/admin/employees', {
        method: 'POST',
        body: {
          name: form.name,
          username: form.username,
          password: form.password,
          status: 'active',
          permissions: form.permissions,
        },
      });
    }

    await refresh();
    closeModal();
  } catch (err: any) {
    modalError.value = err.data?.statusMessage || err.message || 'حدث خطأ أثناء حفظ بيانات الموظف';
  } finally {
    saving.value = false;
  }
};

const toggleStatus = async (emp: Employee) => {
  const nextStatus = emp.status === 'active' ? 'inactive' : 'active';
  const label = nextStatus === 'active' ? 'تفعيل' : 'تعطيل';

  if (!confirm(`هل أنت متأكد من ${label} حساب الموظف ${emp.name}؟`)) return;

  try {
    await $fetch(`/api/admin/employees/${emp.id}`, {
      method: 'PUT',
      body: { status: nextStatus },
    });
    emp.status = nextStatus;
  } catch (err: any) {
    alert(err.data?.statusMessage || 'حدث خطأ أثناء تغيير الحالة');
  }
};

const confirmDelete = async (emp: Employee) => {
  if (!confirm(`هل أنت متأكد من حذف حساب الموظف "${emp.name}" نهائياً من النظام؟`)) {
    return;
  }

  try {
    await $fetch(`/api/admin/employees/${emp.id}`, {
      method: 'DELETE',
    });
    await refresh();
  } catch (err: any) {
    alert(err.data?.statusMessage || 'حدث خطأ أثناء حذف الموظف');
  }
};
</script>

