<template>
  <div class="relative overflow-hidden space-y-24 py-4 sm:py-8">
    <!-- HERO SECTION -->
    <section class="relative isolate overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#174A40] via-[#126B58] to-[#0D5143] p-8 sm:p-14 lg:p-20 text-white shadow-2xl ring-1 ring-white/15">
      <!-- Glow & subtle architectural pattern -->
      <div class="pointer-events-none absolute inset-0 -z-10 opacity-30 mix-blend-overlay" style="background-image: radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px); background-size: 32px 32px;"></div>
      <div class="pointer-events-none absolute -top-36 -left-36 -z-10 w-96 h-96 rounded-full bg-[#B89A68]/25 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-36 -right-36 -z-10 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl"></div>

      <!-- Gold top hairline -->
      <div class="pointer-events-none absolute inset-x-12 top-0 h-[2px] bg-gradient-to-l from-transparent via-[#D8C5A0]/60 to-transparent"></div>

      <div class="max-w-3xl">
        <!-- Accreditation Badge -->
        <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-[#D8C5A0] text-xs sm:text-sm font-bold tracking-wide">
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B89A68] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[#B89A68]"></span>
          </span>
          <span>مخطط معتمد برقم {{ projectConfig.planNo }} — نخبة الفرص العقارية</span>
        </div>

        <!-- Title -->
<h1
  class="mt-8 text-4xl sm:text-6xl font-black leading-[1.6] sm:leading-[1.5] tracking-normal"
  dir="rtl"
  lang="ar"
>
  <span class="block mb-2">
    مرحباً بكم في
  </span>

  <span
    class="block mt-2 text-left pb-2 bg-gradient-to-l from-[#D8C5A0] via-[#F5F1E8] to-[white] bg-clip-text text-transparent"
  >
    {{ projectConfig.name }}
  </span>
</h1>

        <!-- Subtitle -->
        <p class="mt-6 text-base sm:text-xl text-[#E5EEE9]/90 leading-relaxed font-normal">
          بيئة استثمارية وسكنية متكاملة تترجم رؤية التطوير العصري بالمنطقة الشرقية، بإشراف وتنظيم نخبة من رواد التطوير العقاري بالمملكة.
        </p>

        <!-- CTAs -->
        <div class="mt-10 flex flex-wrap items-center gap-4">
          <NuxtLink
            to="/3fe97eb46687f5af"
            class="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-l from-[#B89A68] to-[#D8C5A0] text-[#174A40] font-black text-base shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:brightness-105 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8C5A0]"
          >
            <i class="pi pi-user text-sm transition-transform duration-300 group-hover:scale-110"></i>
            <span>دخول بوابة الموظفين</span>
            <i class="pi pi-arrow-left text-xs transition-transform duration-300 group-hover:-translate-x-1"></i>
          </NuxtLink>

          <a
            href="#about-plan"
            class="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-base backdrop-blur-sm ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>نبذة عن المشروع</span>
            <i class="pi pi-chevron-down text-xs"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- PROJECT HIGHLIGHTS -->
    <section id="features" class="scroll-mt-28 space-y-8">
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <span class="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#126B58] uppercase">
          <span class="w-6 h-px bg-[#126B58]"></span>
          ركائز التطوير
          <span class="w-6 h-px bg-[#126B58]"></span>
        </span>
        <h2 class="text-3xl sm:text-4xl font-black text-[#293B36] tracking-tight">
          تخطيط حضاري يجمع بين راحة السكن <br> وقوة الاستثمار
        </h2>
        <p class="text-sm sm:text-base text-[#718078]">
          تم تصميم المخطط وفق أحدث المعايير الهندسية والتنظيمية لتلبية تطلعات السكن الراقي والفرص التجارية المجدية.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Feature 1 -->
        <div class="rounded-3xl bg-white p-8 border border-[#E5E9E5] shadow-xs hover:shadow-xl hover:border-[#126B58]/40 hover:-translate-y-1 transition-all duration-300">
          <div class="w-14 h-14 rounded-2xl bg-[#E5EEE9] text-[#126B58] flex items-center justify-center text-2xl mb-6 shadow-xs border border-[#126B58]/15">
            <i class="pi pi-map-marker"></i>
          </div>
          <h3 class="text-xl font-black text-[#293B36] mb-2">موقع استراتيجي متصل</h3>
          <p class="text-sm text-[#718078] leading-relaxed">
            محاط بشبكة طرق وشرايين رئيسية تضمن سهولة الوصول وسرعة التنقل إلى كافة المراكز والخدمات الرئيسية.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="rounded-3xl bg-white p-8 border border-[#E5E9E5] shadow-xs hover:shadow-xl hover:border-[#B89A68]/40 hover:-translate-y-1 transition-all duration-300">
          <div class="w-14 h-14 rounded-2xl bg-[#F5F1E8] text-[#B89A68] flex items-center justify-center text-2xl mb-6 shadow-xs border border-[#B89A68]/20">
            <i class="pi pi-home"></i>
          </div>
          <h3 class="text-xl font-black text-[#293B36] mb-2">تنوع سكني وتجاري</h3>
          <p class="text-sm text-[#718078] leading-relaxed">
            توزيع متوازن للأراضي السكنية والتجارية والمرافق العامة، مما يوفر بيئة مجتمعية نابضة بالحياة.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="rounded-3xl bg-white p-8 border border-[#E5E9E5] shadow-xs hover:shadow-xl hover:border-[#126B58]/40 hover:-translate-y-1 transition-all duration-300">
          <div class="w-14 h-14 rounded-2xl bg-[#E5EEE9] text-[#126B58] flex items-center justify-center text-2xl mb-6 shadow-xs border border-[#126B58]/15">
            <i class="pi pi-verified"></i>
          </div>
          <h3 class="text-xl font-black text-[#293B36] mb-2">جاهزية الإفراغ والصكوك</h3>
          <p class="text-sm text-[#718078] leading-relaxed">
            مخطط معتمد برقم رسمي موثق وصكوك جاهزة للإفراغ، مما يضمن أمان الملكية وثقة المستثمرين.
          </p>
        </div>
      </div>
    </section>

    <!-- STAKEHOLDERS / PARTNERS -->
    <section id="about-plan" class="scroll-mt-28 rounded-3xl bg-[#F5F1E8] p-8 sm:p-12 border border-[#E5E9E5]">
      <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start">
        <div class="space-y-2">
          <span class="text-xs font-bold text-[#B89A68] tracking-wider uppercase">فريق العمل والشركاء</span>
          <h3 class="text-2xl font-black text-[#293B36]">شراكة التطوير والتسويق الحصري</h3>
          <p class="text-sm text-[#718078] max-w-xl">
            يُدار المشروع بأعلى درجات الاحترافية والشفافية عبر كبرى الكيانات العقارية المعتمدة بالمملكة.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
          <div class="bg-white rounded-2xl p-5 border border-[#E5E9E5] shadow-xs flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-[#E5EEE9] text-[#126B58] flex items-center justify-center text-lg">
              <i class="pi pi-briefcase"></i>
            </div>
            <div class="text-start">
              <span class="block text-[11px] font-semibold text-[#718078]">الجهة المالكة / البائع</span>
              <span class="block text-sm font-bold text-[#293B36]">{{ projectConfig.seller }}</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 border border-[#E5E9E5] shadow-xs flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-[#F5F1E8] text-[#B89A68] flex items-center justify-center text-lg">
              <i class="pi pi-megaphone"></i>
            </div>
            <div class="text-start">
              <span class="block text-[11px] font-semibold text-[#718078]">المسوق الحصري</span>
              <span class="block text-sm font-bold text-[#293B36]">{{ projectConfig.marketer }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- EMPLOYEE PORTAL CTA BOX -->
    <section class="relative isolate overflow-hidden rounded-[2.5rem] bg-[#174A40] p-8 sm:p-14 text-white shadow-xl border border-[#126B58]/30">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="space-y-3 text-center lg:text-start max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-[#D8C5A0] text-xs font-semibold">
            <i class="pi pi-lock text-[10px]"></i>
            <span>منطقة منسوبي المبيعات والإدارة</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-white">هل أنت من فريق مبيعات مخطط المها؟</h3>
          <p class="text-sm text-[#D5E4DC]/90 leading-relaxed">
            قم بتسجيل الدخول إلى البوابة الداخلية للوصول إلى تفاصيل القطع، وإدارة الحجوزات، وإصدار عروض الأسعار وطباعة العقود وفق الصلاحيات الممنوحة لك.
          </p>
        </div>

        <div class="shrink-0 w-full sm:w-auto">
          <NuxtLink
            to="/3fe97eb46687f5af"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#B89A68] hover:bg-[#D8C5A0] text-[#174A40] font-black text-base shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <i class="pi pi-sign-in"></i>
            <span>تسجيل الدخول إلى النظام</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { projectConfig } from '../../config/project';
</script>
