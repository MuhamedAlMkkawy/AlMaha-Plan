<template>
  <button
    :type="type || 'button'"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl',
      sizeClasses,
      variantClasses,
    ]"
  >
    <i v-if="loading" class="pi pi-spin pi-spinner text-sm"></i>
    <i v-else-if="icon" :class="icon" class="text-sm"></i>
    <span>{{ label }}</span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  }
);

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-9 px-3.5 text-xs';
    case 'lg':
      return 'h-13 px-7 text-base';
    default:
      return 'h-11 px-5 text-sm';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      // Soft Sage with Emerald text
      return 'bg-[#E5EEE9] text-[#126B58] hover:bg-[#d8e7e0] border border-[#126B58]/15';
    case 'outline':
      // White with Emerald border
      return 'bg-white text-[#126B58] border border-[#126B58] hover:bg-[#FAF9F5] shadow-xs';
    case 'gold':
      // Sand Gold accent button
      return 'bg-[#B89A68] text-white hover:bg-[#a68856] shadow-sm';
    case 'danger':
      return 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm';
    default:
      // Primary: Emerald Green with hover to Deep Forest
      return 'bg-[#126B58] text-white hover:bg-[#174A40] shadow-sm shadow-[#126B58]/20';
  }
});
</script>
