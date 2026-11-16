<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors',
      badgeClass
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full', dotClass]"></span>
    <span>{{ status }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  status?: string;
}>();

const badgeClass = computed(() => {
  switch (props.status) {
    case 'متاح للبيع':
      // Emerald Green
      return 'bg-[#E5EEE9] text-[#126B58] border border-[#126B58]/20';
    case 'محجوز':
      // Sand Gold
      return 'bg-[#F5F1E8] text-[#B89A68] border border-[#B89A68]/30';
    case 'مباع':
      // Muted soft red
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    default:
      return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
});

const dotClass = computed(() => {
  switch (props.status) {
    case 'متاح للبيع':
      return 'bg-[#126B58]';
    case 'محجوز':
      return 'bg-[#B89A68]';
    case 'مباع':
      return 'bg-rose-500';
    default:
      return 'bg-slate-400';
  }
});
</script>
