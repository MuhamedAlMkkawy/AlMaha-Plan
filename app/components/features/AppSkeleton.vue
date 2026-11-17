<template>
  <div
    class="skeleton-item relative overflow-hidden"
    :class="[
      roundedClass,
      customClass
    ]"
    :style="customStyle"
    aria-hidden="true"
  >
    <div class="skeleton-shimmer absolute inset-0"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  rounded: 'xl',
  customClass: '',
});

const customStyle = computed(() => ({
  width: props.width,
  height: props.height,
}));

const roundedClass = computed(() => {
  switch (props.rounded) {
    case 'none': return 'rounded-none';
    case 'sm': return 'rounded-sm';
    case 'md': return 'rounded-md';
    case 'lg': return 'rounded-lg';
    case 'xl': return 'rounded-xl';
    case '2xl': return 'rounded-2xl';
    case '3xl': return 'rounded-3xl';
    case 'full': return 'rounded-full';
    default: return 'rounded-xl';
  }
});
</script>

<style scoped>
.skeleton-item {
  background-color: #f1f4f2;
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.65) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: skeleton-sweep 1.8s infinite ease-in-out;
}

@keyframes skeleton-sweep {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
