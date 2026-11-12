<template>
  <header class="sticky top-0 z-40 print:hidden">
    <!-- ADMIN: same light bar as the public site, with a purple top edge and a mode badge -->
    <div
      v-if="adminUser"
      class="bg-white/95 backdrop-blur-md text-slate-700 border-t-[3px] border-t-[#7030A0] border-b border-b-slate-200 transition-shadow duration-300"
      :class="scrolled ? 'shadow-[0_10px_24px_-18px_rgba(76,29,115,0.45)]' : ''"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="h-14 flex items-center justify-between gap-4">
          <!-- Brand + mode -->
          <NuxtLink
            to="/admin"
            class="flex items-center gap-3 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/50 focus-visible:ring-offset-4"
          >
            <span class="grid grid-cols-2 gap-[2px] w-7 h-7 shrink-0" aria-hidden="true">
              <span class="rounded-[3px] bg-[#7030A0]"></span>
              <span class="rounded-[3px] bg-[#7030A0]/60"></span>
              <span class="rounded-[3px] bg-[#7030A0]/60"></span>
              <span class="rounded-[3px] bg-amber-400"></span>
            </span>
            <span class="hidden sm:block text-base font-black text-slate-900 truncate">{{ projectConfig.name }}</span>
            <span class="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-[#7030A0]/10 text-[#7030A0] text-xs font-bold whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-[#7030A0]"></span>
              وضع الإدارة
            </span>
          </NuxtLink>

          <!-- Links: admin tools, then site pages in a quieter tone -->
          <nav class="hidden md:flex items-stretch h-full">
            <NuxtLink
              v-for="item in adminLinks"
              :key="item.to"
              :to="item.to"
              class="relative flex items-center px-3.5 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:bg-black/5"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-700 font-medium hover:text-[#7030A0]'"
            >
              {{ item.label }}
              <span
                v-if="isActive(item)"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-7 rounded-t-full bg-amber-400"
              ></span>
            </NuxtLink>

            <span class="self-center mx-2 h-5 w-px bg-slate-200"></span>

            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="relative hidden lg:flex items-center px-3 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:bg-black/5"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-400 font-medium hover:text-slate-700'"
            >
              {{ item.label }}
              <span
                v-if="isActive(item)"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-6 rounded-t-full bg-amber-400"
              ></span>
            </NuxtLink>
          </nav>

          <div class="flex items-center gap-1 shrink-0">
            <button
              type="button"
              @click="handleLogout"
              :disabled="loggingOut"
              class="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-lg text-sm text-slate-500 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              <i :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'" class="text-xs"></i>
              <span>تسجيل الخروج</span>
            </button>

            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              :aria-expanded="mobileMenuOpen"
              aria-label="القائمة"
              class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-slate-700 transition-colors duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/50"
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
          <div v-if="mobileMenuOpen" class="md:hidden pb-3 border-t border-slate-100">
            <NuxtLink
              v-for="item in adminLinks"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 py-3.5 border-b border-slate-100 text-sm"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-700 font-medium'"
            >
              <i :class="item.icon" class="text-sm w-5"></i>
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="isActive(item)" class="w-2 h-2 rounded-[3px] bg-amber-400"></span>
            </NuxtLink>

            <div class="pt-3 pb-1 text-[11px] text-slate-400">صفحات الموقع</div>
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 py-3 border-b border-slate-100 text-sm"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-500'"
            >
              <i :class="item.icon" class="text-xs w-5"></i>
              <span>{{ item.label }}</span>
            </NuxtLink>

            <button
              type="button"
              @click="handleLogout"
              :disabled="loggingOut"
              class="w-full flex items-center gap-3 pt-3.5 text-sm text-rose-600 disabled:opacity-60"
            >
              <i :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'" class="text-xs w-5"></i>
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
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
              <span class="block text-base font-black text-slate-900 truncate">{{ projectConfig.name }}</span>
              <span class="hidden sm:block text-[11px] text-slate-500 truncate">
                مخطط رقم {{ projectConfig.planNo }} &nbsp;|&nbsp; التسويق: {{ projectConfig.marketer }}
              </span>
              <span class="block sm:hidden text-[11px] text-slate-500 truncate">مخطط رقم {{ projectConfig.planNo }}</span>
            </span>
          </NuxtLink>

          <nav class="hidden md:flex items-stretch h-full">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="relative flex items-center px-4 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:bg-black/5"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-600 font-medium hover:text-slate-900'"
            >
              {{ item.label }}
              <span
                v-if="isActive(item)"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-7 rounded-t-full bg-amber-400"
              ></span>
            </NuxtLink>
          </nav>

          <div class="flex items-center gap-2 shrink-0">
            <NuxtLink
              to="/quote"
              class="hidden md:inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#7030A0] text-white text-sm font-bold transition-colors duration-200 hover:bg-[#5b2486] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/50 focus-visible:ring-offset-2"
            >
              <i class="pi pi-file-edit text-xs"></i>
              <span>صانع عروض الأسعار</span>
            </NuxtLink>

            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              :aria-expanded="mobileMenuOpen"
              aria-label="القائمة"
              class="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-slate-700 transition-colors duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
            </button>
          </div>
        </div>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mobileMenuOpen" class="md:hidden pb-3 border-t border-slate-100">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 py-3.5 border-b border-slate-100 text-sm transition-colors duration-200"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-700 font-medium hover:text-[#7030A0]'"
            >
              <i :class="item.icon" class="text-sm w-5"></i>
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="isActive(item)" class="w-2 h-2 rounded-[3px] bg-amber-400"></span>
            </NuxtLink>

            <NuxtLink
              to="/quote"
              class="mt-3 h-11 rounded-full bg-[#7030A0] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-[#5b2486]"
            >
              <i class="pi pi-file-edit text-xs"></i>
              <span>صانع عروض الأسعار</span>
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