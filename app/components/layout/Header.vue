<template>
  <header class="sticky top-0 z-40 print:hidden transition-all duration-300">
    <!-- ========================================================================= -->
    <!-- EXPERIENCE C: ADMIN HEADER — Executive Control Center                     -->
    <!-- Deep Forest (#174A40) background, Sand Gold (#B89A68) highlights         -->
    <!-- ========================================================================= -->
    <div
      v-if="adminUser"
      class="relative bg-[#174A40] text-white border-b border-[#123D35] transition-all duration-300"
      :class="scrolled ? 'shadow-[0_12px_30px_-15px_rgba(23,74,64,0.6)]' : 'shadow-md'"
    >
      <!-- Sand Gold Top Accent Line -->
      <div class="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-[#B89A68] via-[#D8C5A0] to-[#B89A68]"></div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-[78px] items-center justify-between gap-4">

          <!-- ADMIN BRAND -->
          <NuxtLink
            to="/admin"
            aria-label="الذهاب إلى لوحة الإدارة"
            class="group relative flex shrink-0 items-center gap-3.5 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#B89A68]"
          >
            <!-- Executive Emblem -->
            <div
              class="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#126B58] to-[#0D5143] shadow-md border border-[#B89A68]/30 transition-transform duration-300 group-hover:scale-105"
            >
              <i class="pi pi-shield text-lg text-[#D8C5A0]"></i>
              <span class="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-[#B89A68]"></span>
            </div>

            <!-- Brand text -->
            <div class="flex flex-col gap-0.5">
              <span class="text-[15px] font-black leading-tight tracking-tight text-white group-hover:text-[#D8C5A0] transition-colors">
                مركز التحكم الإداري
              </span>
              <span class="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#D5E4DC]/80">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                {{ projectConfig.name }}
              </span>
            </div>
          </NuxtLink>

          <!-- DESKTOP ADMIN NAVIGATION -->
          <nav class="hidden md:flex h-full min-w-0 flex-1 items-center justify-center gap-1.5 px-4">
            <NuxtLink
              v-for="item in adminLinks"
              :key="item.to"
              :to="item.to"
              class="group relative flex h-11 items-center gap-2 whitespace-nowrap rounded-xl px-4 text-[13px] font-bold transition-all duration-200"
              :class="isActive(item)
                ? 'bg-white/10 text-white shadow-inner border border-[#B89A68]/40'
                : 'text-[#D5E4DC] hover:bg-white/[0.06] hover:text-white'"
            >
              <i :class="item.icon" class="text-[14px] text-[#D8C5A0] transition-transform duration-200 group-hover:scale-110"></i>
              <span>{{ item.label }}</span>

              <span
                v-if="isActive(item)"
                class="absolute inset-x-3 -bottom-[14px] h-[3px] rounded-t-full bg-[#B89A68]"
              ></span>
            </NuxtLink>
          </nav>

          <!-- ACTIONS -->
          <div class="flex shrink-0 items-center gap-3">
            <!-- Admin status badge -->
            <div class="hidden xl:flex items-center gap-2 rounded-xl bg-black/20 border border-white/10 px-3 py-1.5 text-xs text-[#D5E4DC]">
              <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="font-bold text-white text-[11px]">جلسة مدير مبيعات</span>
            </div>

            <!-- Logout -->
            <button
              type="button"
              @click="handleLogout"
              :disabled="loggingOut"
              class="group hidden md:inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-xs font-bold text-white transition-all duration-200 hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-rose-200 active:scale-95 disabled:opacity-50"
            >
              <i :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'" class="text-xs"></i>
              <span>خروج</span>
            </button>

            <!-- Mobile menu button -->
            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 md:hidden"
            >
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
            </button>
          </div>
        </div>

        <!-- MOBILE ADMIN DRAWER -->
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-2">
          <div v-if="mobileMenuOpen" class="border-t border-white/10 py-4 md:hidden space-y-2">
            <NuxtLink
              v-for="item in adminLinks"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all"
              :class="isActive(item) ? 'bg-white/10 text-white border border-[#B89A68]/40' : 'text-[#D5E4DC] hover:bg-white/5'"
            >
              <i :class="item.icon" class="text-base text-[#D8C5A0]"></i>
              <span class="flex-1">{{ item.label }}</span>
            </NuxtLink>

            <button
              type="button"
              @click="handleLogout"
              class="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-300 hover:bg-rose-500/20"
            >
              <i class="pi pi-sign-out"></i>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>


    <!-- ========================================================================= -->
    <!-- EXPERIENCE B: EMPLOYEE HEADER — Professional Workspace                   -->
    <!-- Clean White (#FFFFFF), Thin Emerald Top Line (#126B58), Soft Sage states  -->
    <!-- ========================================================================= -->
    <div
      v-else-if="authUser && authUser.role === 'employee'"
      class="bg-white/95 backdrop-blur-md text-[#293B36] border-b border-[#E5E9E5] transition-all duration-300"
      :class="scrolled ? 'shadow-[0_10px_25px_-15px_rgba(18,107,88,0.2)]' : 'shadow-sm'"
    >
      <!-- Emerald Top Accent Line -->
      <div class="h-[3px] w-full bg-[#126B58]"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="h-16 flex items-center justify-between gap-4">

          <!-- Brand + Employee Identity Chip -->
          <div class="flex items-center gap-3 shrink-0">
            <NuxtLink to="/" class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-[#E5EEE9] text-[#126B58] flex items-center justify-center font-black text-sm border border-[#126B58]/20 shadow-xs">
                <i class="pi pi-building"></i>
              </span>
              <span class="hidden sm:inline font-black text-sm text-[#293B36]">
                {{ projectConfig.name }}
              </span>
            </NuxtLink>

            <!-- Employee Pill -->
            <div class="inline-flex items-center gap-2 rounded-xl bg-[#FAF9F5] border border-[#E5E9E5] px-3 py-1.5 text-xs text-[#293B36]">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#126B58] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-[#126B58]"></span>
              </span>
              <span class="font-extrabold text-[#126B58]">بوابة الموظف:</span>
              <span class="font-bold truncate max-w-[9rem]">{{ authUser.name || authUser.email }}</span>
            </div>
          </div>

          <!-- Desktop Permission-Gated Nav -->
          <nav class="hidden md:flex items-center h-full gap-1">
            <template v-for="group in employeeGroups" :key="group.id">
              <!-- Single link item -->
              <NuxtLink
                v-if="group.links.length === 1"
                :to="group.links[0].to"
                class="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                :class="isActive(group.links[0])
                  ? 'bg-[#E5EEE9] text-[#126B58] font-bold shadow-xs'
                  : 'text-[#293B36] hover:bg-[#F5F1E8] hover:text-[#126B58]'"
              >
                <i :class="group.links[0].icon" class="text-xs transition-transform group-hover:scale-110"></i>
                <span>{{ group.links[0].label }}</span>
              </NuxtLink>

              <!-- Dropdown group item -->
              <div v-else class="relative" @click.stop>
                <button
                  type="button"
                  @click="toggleGroup(group.id)"
                  class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  :class="isGroupActive(group)
                    ? 'bg-[#E5EEE9] text-[#126B58] font-bold'
                    : 'text-[#293B36] hover:bg-[#F5F1E8]'"
                >
                  <i :class="group.icon" class="text-xs"></i>
                  <span>{{ group.label }}</span>
                  <i class="pi pi-chevron-down text-[10px] opacity-60"></i>
                </button>

                <!-- Dropdown panel -->
                <div
                  v-if="openGroup === group.id"
                  class="absolute top-full mt-2 w-48 rounded-2xl bg-white border border-[#E5E9E5] p-1.5 shadow-xl shadow-slate-900/10 z-50 animate-fadeIn"
                >
                  <NuxtLink
                    v-for="link in group.links"
                    :key="link.to"
                    :to="link.to"
                    @click="openGroup = null"
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                    :class="isActive(link) ? 'bg-[#E5EEE9] text-[#126B58]' : 'text-[#293B36] hover:bg-[#FAF9F5] hover:text-[#126B58]'"
                  >
                    <i :class="link.icon" class="text-xs"></i>
                    <span>{{ link.label }}</span>
                  </NuxtLink>
                </div>
              </div>
            </template>
          </nav>

          <!-- Employee Actions -->
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              @click="handleLogout"
              :disabled="loggingOut"
              class="hidden sm:inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border border-[#E5E9E5] text-xs font-bold text-[#718078] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all duration-200"
            >
              <i :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'"></i>
              <span>خروج</span>
            </button>

            <!-- Mobile menu button -->
            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E9E5] text-[#293B36] hover:bg-[#FAF9F5]"
            >
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Employee Drawer -->
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-2">
          <div v-if="mobileMenuOpen" class="border-t border-[#E5E9E5] py-4 md:hidden space-y-2">
            <template v-for="group in employeeGroups" :key="group.id">
              <NuxtLink
                v-if="group.links.length === 1"
                :to="group.links[0].to"
                @click="mobileMenuOpen = false"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold"
                :class="isActive(group.links[0]) ? 'bg-[#E5EEE9] text-[#126B58]' : 'text-[#293B36] hover:bg-[#FAF9F5]'"
              >
                <i :class="group.links[0].icon"></i>
                <span>{{ group.links[0].label }}</span>
              </NuxtLink>

              <div v-else class="space-y-1">
                <div class="text-[11px] font-bold text-[#718078] px-3.5 pt-2 uppercase">{{ group.label }}</div>
                <NuxtLink
                  v-for="link in group.links"
                  :key="link.to"
                  :to="link.to"
                  @click="mobileMenuOpen = false"
                  class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold ps-6"
                  :class="isActive(link) ? 'bg-[#E5EEE9] text-[#126B58] font-bold' : 'text-[#293B36] hover:bg-[#FAF9F5]'"
                >
                  <i :class="link.icon" class="text-xs"></i>
                  <span>{{ link.label }}</span>
                </NuxtLink>
              </div>
            </template>

            <button
              type="button"
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50"
            >
              <i class="pi pi-sign-out"></i>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>


    <!-- ========================================================================= -->
    <!-- EXPERIENCE A: PUBLIC HEADER — Elegant Real Estate Identity                -->
    <!-- Pure White (#FFFFFF), Emerald CTA (#126B58), Sand Gold accents           -->
    <!-- ========================================================================= -->
    <div
      v-else
      class="bg-white/95 backdrop-blur-md text-[#293B36] border-b border-[#E5E9E5] transition-all duration-300"
      :class="scrolled ? 'shadow-[0_10px_25px_-15px_rgba(0,0,0,0.07)]' : ''"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="h-20 flex items-center justify-between gap-6">

          <!-- BRAND -->
          <NuxtLink
            to="/"
            class="group flex items-center gap-3.5 min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-[#126B58]"
          >
            <!-- Emerald Geometric Logo Mark -->
            <div class="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#126B58] to-[#174A40] text-white shadow-md shadow-[#126B58]/25 transition-transform duration-300 group-hover:scale-105">
              <i class="pi pi-building text-lg text-[#FAF9F5]"></i>
              <span class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#B89A68] border-2 border-white"></span>
            </div>

            <!-- Title & subtitle -->
            <div class="flex flex-col min-w-0">
              <span class="text-base sm:text-lg font-black tracking-tight text-[#174A40] transition-colors duration-200 group-hover:text-[#126B58]">
                {{ projectConfig.name }}
              </span>
              <span class="text-xs text-[#718078] font-semibold truncate">
                مخطط معتمد برقم {{ projectConfig.planNo }} • {{ projectConfig.marketer }}
              </span>
            </div>
          </NuxtLink>

          <!-- DESKTOP PUBLIC NAVIGATION -->
          <!-- <nav class="hidden md:flex items-center gap-1">
            <NuxtLink
              to="/"
              class="relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
              :class="route.path === '/'
                ? 'text-[#126B58] bg-[#E5EEE9]'
                : 'text-[#293B36] hover:text-[#126B58] hover:bg-[#F5F1E8]'"
            >
              الرئيسية
            </NuxtLink>

            <a
              href="#about-plan"
              class="px-4 py-2 rounded-xl text-sm font-semibold text-[#293B36] hover:text-[#126B58] hover:bg-[#F5F1E8] transition-all duration-200"
            >
              عن المشروع
            </a>

            <a
              href="#features"
              class="px-4 py-2 rounded-xl text-sm font-semibold text-[#293B36] hover:text-[#126B58] hover:bg-[#F5F1E8] transition-all duration-200"
            >
              المميزات
            </a>
          </nav> -->

          <!-- CTA: EMPLOYEE LOGIN -->
          <div class="flex items-center gap-3 shrink-0">
            <NuxtLink
              to="/3fe97eb46687f5af"
              class="group inline-flex h-11 items-center justify-center gap-2.5 rounded-full border border-[#126B58]/20 bg-[#126B58] px-6 text-sm font-black text-white shadow-md shadow-[#126B58]/15 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#174A40] hover:bg-[#174A40] hover:text-white hover:shadow-lg hover:shadow-[#126B58]/25 active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#126B58] focus-visible:ring-offset-2"
            >
              <i class="pi pi-user text-xs text-[#D8C5A0] transition-transform duration-300 group-hover:scale-110"></i>

              <span class="whitespace-nowrap text-white transition-none group-hover:text-white">
                دخول الموظفين
              </span>

              <i class="pi pi-arrow-left text-[11px] text-white/70 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-white"></i>
            </NuxtLink>

            <!-- Mobile toggle -->
            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E9E5] text-[#293B36] hover:bg-[#FAF9F5]"
            >
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer -->
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-2">
          <div v-if="mobileMenuOpen" class="border-t border-[#E5E9E5] py-4 md:hidden space-y-2">
            <NuxtLink
              to="/"
              @click="mobileMenuOpen = false"
              class="block px-4 py-2.5 rounded-xl text-sm font-bold text-[#126B58] bg-[#E5EEE9]"
            >
              الرئيسية
            </NuxtLink>
            <a
              href="#about-plan"
              @click="mobileMenuOpen = false"
              class="block px-4 py-2.5 rounded-xl text-sm font-semibold text-[#293B36] hover:bg-[#FAF9F5]"
            >
              عن المشروع
            </a>
            <a
              href="#features"
              @click="mobileMenuOpen = false"
              class="block px-4 py-2.5 rounded-xl text-sm font-semibold text-[#293B36] hover:bg-[#FAF9F5]"
            >
              المميزات
            </a>

            <div class="pt-2">
              <NuxtLink
                to="/3fe97eb46687f5af"
                @click="mobileMenuOpen = false"
                class="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-[#126B58] text-white text-sm font-bold"
              >
                <i class="pi pi-user"></i>
                <span>دخول الموظفين</span>
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { projectConfig } from '../../config/project';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  exact?: boolean;
  notWhen?: string;
}

const route = useRoute();
const router = useRouter();
const mobileMenuOpen = ref(false);
const loggingOut = ref(false);
const scrolled = ref(false);
const openGroup = ref<string | null>(null);

const { user: authUser, isAdmin, refreshAuth, clearAuth, canAny } = useAuthSession();
const adminUser = computed(() => (isAdmin.value ? authUser.value : null));

type PermList = Parameters<typeof canAny>[0];

interface EmployeeLink extends NavItem {
  anyOf: PermList;
}

interface EmployeeGroup {
  id: string;
  label: string;
  icon: string;
  links: EmployeeLink[];
}

const adminLinks: NavItem[] = [
  { to: '/admin', label: 'لوحة التحكم', icon: 'pi pi-sliders-h', exact: true },
  { to: '/admin/employees', label: 'الموظفون والصلاحيات', icon: 'pi pi-users' },
  { to: '/admin/plots', label: 'إدارة القطع', icon: 'pi pi-th-large' },
  { to: '/admin/audit', label: 'سجل العمليات', icon: 'pi pi-history' },
  { to: '/quote', label: 'عروض الأسعار', icon: 'pi pi-file-edit' },
];

const employeeGroupDefs: EmployeeGroup[] = [
  {
    id: 'stats',
    label: 'الإحصائيات',
    icon: 'pi pi-chart-bar',
    links: [{ to: '/', label: 'الإحصائيات', icon: 'pi pi-chart-bar', exact: true, anyOf: ['view_stats'] }],
  },
  {
    id: 'plots',
    label: 'القطع',
    icon: 'pi pi-th-large',
    links: [
      { to: '/plots', label: 'جدول القطع', icon: 'pi pi-th-large', anyOf: ['view_plots', 'view_plot_page'] },
      {
        to: '/admin/plots',
        label: 'إدارة القطع',
        icon: 'pi pi-pencil',
        notWhen: '/admin/plots/new',
        anyOf: ['edit_plots', 'delete_plots', 'edit_plot_page', 'delete_plot_page'],
      },
      { to: '/admin/plots/new', label: 'إضافة قطعة', icon: 'pi pi-plus', anyOf: ['create_plots', 'create_plot_page'] },
    ],
  },
  {
    id: 'blocks',
    label: 'البلوكات',
    icon: 'pi pi-objects-column',
    links: [
      { to: '/blocks', label: 'استعراض البلوكات', icon: 'pi pi-objects-column', anyOf: ['view_block_page', 'view_plots'] },
    ],
  },
  {
    id: 'zones',
    label: 'الزونات',
    icon: 'pi pi-map',
    links: [
      { to: '/zones', label: 'استعراض الزونات', icon: 'pi pi-map', anyOf: ['view_zone_page', 'view_plots'] },
    ],
  },
  {
    id: 'quote',
    label: 'عروض الأسعار',
    icon: 'pi pi-file-edit',
    links: [
      { to: '/quote', label: 'صانع عروض الأسعار', icon: 'pi pi-file-edit', anyOf: ['view_contracts'] },
    ],
  },
];

const routeExists = (path: string) => router.resolve(path).matched.length > 0;

const employeeGroups = computed<EmployeeGroup[]>(() =>
  employeeGroupDefs
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => canAny(link.anyOf) && routeExists(link.to)),
    }))
    .filter((group) => group.links.length > 0)
);

const matchesPath = (currentPath: string, targetPath: string) =>
  currentPath === targetPath || currentPath.startsWith(`${targetPath.replace(/\/$/, '')}/`);

const isActive = (item: NavItem) => {
  if (item.exact) return route.path === item.to;
  if (item.notWhen && matchesPath(route.path, item.notWhen)) return false;
  return matchesPath(route.path, item.to);
};

const isGroupActive = (group: EmployeeGroup) => group.links.some((link) => isActive(link));

const toggleGroup = (id: string) => {
  openGroup.value = openGroup.value === id ? null : id;
};

const handleLogout = async () => {
  if (loggingOut.value) return;
  loggingOut.value = true;
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    clearAuth();
    mobileMenuOpen.value = false;
    openGroup.value = null;
    await navigateTo('/', { replace: true });
    loggingOut.value = false;
  }
};

const onDocClick = () => {
  openGroup.value = null;
};

const onScroll = () => {
  scrolled.value = window.scrollY > 8;
};

onMounted(() => {
  refreshAuth();
  onScroll();
  document.addEventListener('click', onDocClick);
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
  window.removeEventListener('scroll', onScroll);
});

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
    openGroup.value = null;
    refreshAuth();
  }
);
</script>
