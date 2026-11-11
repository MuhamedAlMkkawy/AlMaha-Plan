<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs transition-colors',
      badgeClasses
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full', dotClasses]"></span>
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    status: string;
  }>(),
  {
    status: 'متاح للبيع',
  }
);

const label = computed(() => {
  const s = props.status?.trim() || '';
  if (s.includes('مباع')) return 'مباع';
  if (s.includes('محجوز')) return 'محجوز';
  if (s.includes('أرشيف') || s.includes('مؤرشف')) return 'مؤرشف';
  return 'متاح للبيع';
});

const badgeClasses = computed(() => {
  switch (label.value) {
    case 'مباع':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'محجوز':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'مؤرشف':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
});

const dotClasses = computed(() => {
  switch (label.value) {
    case 'مباع':
      return 'bg-rose-500';
    case 'محجوز':
      return 'bg-amber-500';
    case 'مؤرشف':
      return 'bg-slate-400';
    default:
      return 'bg-emerald-500';
  }
});
</script>

