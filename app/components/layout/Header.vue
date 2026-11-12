<template>
  <header class="sticky top-0 z-40 print:hidden">
    <!-- ADMIN: light bar, purple top edge, mode badge -->
    <div
      v-if="adminUser"
      class="bg-white/95 backdrop-blur-md text-slate-700 border-t-[3px] border-t-[#7030A0] border-b border-b-slate-200 transition-shadow duration-300"
      :class="scrolled ? 'shadow-[0_10px_24px_-18px_rgba(76,29,115,0.45)]' : ''"
    >
      <div class="max-w-7xl mx-auto">
        <div class="h-16 flex items-center justify-between gap-4">
          <!-- Brand + mode -->
          <NuxtLink
            to="/admin"
            aria-label="وضع الإدارة - الذهاب إلى لوحة الإدارة"
            class="group inline-flex items-center gap-3 h-10 ps-3.5 pe-5 rounded-xl bg-[#7030A0]/[0.07] ring-1 ring-inset ring-[#7030A0]/15 text-[#4c1d73] text-[15px] font-bold whitespace-nowrap transition-all duration-300 hover:bg-[#7030A0]/[0.12] hover:ring-[#7030A0]/30 hover:shadow-[0_8px_20px_-12px_rgba(112,48,160,0.55)] active:scale-[0.98] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/60 focus-visible:ring-offset-2"
          >
            <!-- gold square from the logo, with a soft live pulse -->
            <span class="relative flex w-3 h-3 shrink-0" aria-hidden="true">
              <span class="absolute inset-0 rounded-[3px] bg-amber-400/60 motion-safe:animate-ping"></span>
              <span class="relative w-3 h-3 rounded-[3px] bg-amber-400 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110 motion-reduce:transition-none"></span>
            </span>
            <span>وضع الإدارة</span>
          </NuxtLink>

          <!-- Links: admin tools, then site pages in a quieter tone -->
          <nav class="hidden md:flex items-stretch h-full">
            <NuxtLink
              v-for="item in adminLinks"
              :key="item.to"
              :to="item.to"
              class="group relative flex items-center px-4 text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:bg-[#7030A0]/5"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-700 font-medium hover:text-[#7030A0]'"
            >
              {{ item.label }}
              <span
                aria-hidden="true"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-7 rounded-t-full bg-amber-400 transition-transform duration-300 ease-out motion-reduce:transition-none"
                :class="isActive(item) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
              ></span>
            </NuxtLink>

            <span class="self-center mx-2 h-5 w-px bg-slate-200"></span>

            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="group relative hidden lg:flex items-center px-3.5 text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:bg-[#7030A0]/5"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-500 font-medium hover:text-[#7030A0]'"
            >
              {{ item.label }}
              <span
                aria-hidden="true"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-6 rounded-t-full bg-amber-400 transition-transform duration-300 ease-out motion-reduce:transition-none"
                :class="isActive(item) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
              ></span>
            </NuxtLink>
          </nav>

          <div class="flex items-center gap-1 shrink-0">
            <button
              type="button"
              @click="handleLogout"
              :disabled="loggingOut"
              class="hidden md:inline-flex items-center gap-2 h-10 px-3.5 rounded-xl text-[15px] font-medium text-slate-500 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600 active:bg-rose-100 disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              <i :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'" class="text-sm"></i>
              <span>تسجيل الخروج</span>
            </button>

            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              :aria-expanded="mobileMenuOpen"
              aria-label="القائمة"
              class="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-700 transition-all duration-200 hover:bg-[#7030A0]/10 hover:text-[#7030A0] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/50"
              :class="mobileMenuOpen ? 'bg-[#7030A0]/10 text-[#7030A0]' : ''"
            >
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
            </button>
          </div>
        </div>

        <!-- Mobile drawer -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-slate-100">
            <NuxtLink
              v-for="item in adminLinks"
              :key="item.to"
              :to="item.to"
              class="group flex items-center gap-3 py-3.5 border-b border-slate-100 text-base transition-colors duration-200 hover:text-[#7030A0] active:bg-slate-50"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-700 font-medium'"
            >
              <i :class="item.icon" class="text-base w-5"></i>
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="isActive(item)" class="w-2 h-2 rounded-[3px] bg-amber-400"></span>
            </NuxtLink>

            <div class="pt-4 pb-1 text-sm text-slate-400">صفحات الموقع</div>
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="group flex items-center gap-3 py-3 border-b border-slate-100 text-base transition-colors duration-200 hover:text-[#7030A0] active:bg-slate-50"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-500'"
            >
              <i :class="item.icon" class="text-sm w-5"></i>
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="isActive(item)" class="w-2 h-2 rounded-[3px] bg-amber-400"></span>
            </NuxtLink>

            <button
              type="button"
              @click="handleLogout"
              :disabled="loggingOut"
              class="mt-3 w-full h-12 flex items-center gap-3 px-3 rounded-xl text-base font-medium text-rose-600 transition-colors duration-200 hover:bg-rose-50 active:bg-rose-100 disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              <i :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'" class="text-sm w-5"></i>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- PUBLIC: light bar, hairline border -->
    <div
      v-else
      class="bg-white/90 backdrop-blur-md text-slate-700 border-b border-[#7030A0]/10 transition-shadow duration-300"
      :class="scrolled ? 'shadow-[0_10px_24px_-18px_rgba(76,29,115,0.45)]' : ''"
    >
      <div class="max-w-7xl mx-auto">
        <div class="h-16 flex items-center justify-between gap-4">
          <NuxtLink
            to="/"
            class="group flex items-center gap-3 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4"
          >
            <span class="grid grid-cols-2 gap-[3px] w-8 h-8 shrink-0 transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none" aria-hidden="true">
              <span class="rounded-[4px] bg-[#7030A0]"></span>
              <span class="rounded-[4px] bg-[#7030A0]/60"></span>
              <span class="rounded-[4px] bg-[#7030A0]/60"></span>
              <span class="rounded-[4px] bg-amber-400"></span>
            </span>
            <span class="min-w-0 leading-tight">
              <span class="block text-base font-black text-slate-900 truncate transition-colors duration-200 group-hover:text-[#7030A0]">{{ projectConfig.name }}</span>
              <span class="hidden sm:block text-xs text-slate-500 truncate">
                مخطط رقم {{ projectConfig.planNo }} &nbsp;|&nbsp; التسويق: {{ projectConfig.marketer }}
              </span>
              <span class="block sm:hidden text-xs text-slate-500 truncate">مخطط رقم {{ projectConfig.planNo }}</span>
            </span>
          </NuxtLink>

          <nav class="hidden md:flex items-stretch h-full">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="group relative flex items-center px-4 text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:bg-[#7030A0]/5"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-600 font-medium hover:text-[#7030A0]'"
            >
              {{ item.label }}
              <span
                aria-hidden="true"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-7 rounded-t-full bg-amber-400 transition-transform duration-300 ease-out motion-reduce:transition-none"
                :class="isActive(item) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
              ></span>
            </NuxtLink>
          </nav>

          <div class="flex items-center gap-2 shrink-0">
            <!-- Desktop CTA -->
            <NuxtLink
              to="/quote"
              class="group relative hidden md:inline-flex items-center gap-3 h-11 ps-2 pe-5 overflow-hidden rounded-xl bg-[#7030A0] text-white text-[15px] font-bold shadow-md shadow-[#7030A0]/25 transition-all duration-300 ease-out hover:bg-[#5b2486] hover:shadow-lg hover:shadow-[#7030A0]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:bg-[#4c1d73] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/60 focus-visible:ring-offset-2"
            >
              <!-- soft light sweep on hover -->
              <span
                aria-hidden="true"
                class="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[450%] motion-reduce:hidden"
              ></span>

              <span class="relative w-8 h-8 rounded-lg bg-amber-400 text-[#3b1259] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-amber-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:transform-none">
                <i class="pi pi-file-edit text-sm"></i>
              </span>
              <span class="relative">صانع عروض الأسعار</span>
            </NuxtLink>

            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              :aria-expanded="mobileMenuOpen"
              aria-label="القائمة"
              class="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-700 transition-all duration-200 hover:bg-[#7030A0]/10 hover:text-[#7030A0] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/50"
              :class="mobileMenuOpen ? 'bg-[#7030A0]/10 text-[#7030A0]' : ''"
            >
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
            </button>
          </div>
        </div>

        <!-- Mobile drawer -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-slate-100">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="group flex items-center gap-3 py-3.5 border-b border-slate-100 text-base transition-colors duration-200 hover:text-[#7030A0] active:bg-slate-50"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-700 font-medium'"
            >
              <i :class="item.icon" class="text-base w-5"></i>
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="isActive(item)" class="w-2 h-2 rounded-[3px] bg-amber-400"></span>
            </NuxtLink>

            <!-- Mobile CTA -->
            <NuxtLink
              to="/quote"
              class="group relative mt-4 h-12 ps-2 pe-4 overflow-hidden rounded-xl bg-[#7030A0] text-white text-base font-bold flex items-center gap-3 shadow-md shadow-[#7030A0]/25 transition-all duration-300 ease-out hover:bg-[#5b2486] hover:shadow-lg hover:shadow-[#7030A0]/40 active:scale-[0.99] active:bg-[#4c1d73] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/60 focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                class="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[450%] motion-reduce:hidden"
              ></span>

              <span class="relative w-8 h-8 rounded-lg bg-amber-400 text-[#3b1259] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-amber-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:transform-none">
                <i class="pi pi-file-edit text-sm"></i>
              </span>
              <span class="relative flex-1">صانع عروض الأسعار</span>
              <i class="relative pi pi-arrow-left text-sm transition-transform duration-300 group-hover:-translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"></i>
            </NuxtLink>
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
}

const route = useRoute();
const mobileMenuOpen = ref(false);
const loggingOut = ref(false);
const scrolled = ref(false);

const adminUser = ref<{ email: string; name?: string } | null>(null);

// Public pages
const navItems: NavItem[] = [
  { to: '/', label: 'الرئيسية', icon: 'pi pi-home', exact: true },
  { to: '/plots', label: 'جدول القطع', icon: 'pi pi-th-large' },
  { to: '/blocks', label: 'البلوكات', icon: 'pi pi-objects-column' },
  { to: '/zones', label: 'الزونات', icon: 'pi pi-map' },
];

// Admin tools. Add more here as the admin area grows.
const adminLinks: NavItem[] = [
  { to: '/admin', label: 'لوحة الإدارة', icon: 'pi pi-sliders-h' },
  { to: '/quote', label: 'صانع عروض الأسعار', icon: 'pi pi-file-edit' },
];

const isActive = (item: NavItem) =>
  item.exact ? route.path === item.to : route.path.startsWith(item.to);

const checkAuth = async () => {
  try {
    const res = await $fetch<{ authenticated: boolean; user: any }>('/api/auth/me');
    adminUser.value = res.authenticated ? res.user : null;
  } catch {
    adminUser.value = null;
  }
};

const handleLogout = async () => {
  loggingOut.value = true;
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    adminUser.value = null;
    mobileMenuOpen.value = false;
    await navigateTo('/');
  } catch (err) {
    console.error('Logout failed:', err);
  } finally {
    loggingOut.value = false;
  }
};

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') mobileMenuOpen.value = false;
};
const onScroll = () => {
  scrolled.value = window.scrollY > 8;
};

onMounted(() => {
  checkAuth();
  onScroll();
  document.addEventListener('keydown', onKey);
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey);
  window.removeEventListener('scroll', onScroll);
});

/* Close the menu on navigation, and re-check auth (so the header updates right after login) */
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
    checkAuth();
  }
);
</script>