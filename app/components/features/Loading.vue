
<template>
  <div
    class="fixed inset-0 z-[99999] flex flex-col items-center justify-center
           bg-white/80 backdrop-blur-md"
  >
    <div class="loader-container">
      <!-- Architectural Building -->
      <svg
        viewBox="0 0 100 100"
        class="building-loader"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Main Building -->
        <path
          class="building-path"
          d="M20 82V35L50 15L80 35V82H20Z"
        />

        <!-- Roof Detail -->
        <path
          class="building-path delay-1"
          d="M12 36L50 9L88 36"
        />

        <!-- Windows -->
        <path
          class="window-path delay-2"
          d="M32 43V54H42V43H32Z"
        />
        <path
          class="window-path delay-3"
          d="M58 43V54H68V43H58Z"
        />
        <path
          class="window-path delay-2"
          d="M32 62V73H42V62H32Z"
        />
        <path
          class="window-path delay-3"
          d="M58 62V73H68V62H58Z"
        />

        <!-- Entrance -->
        <path
          class="entrance-path"
          d="M44 82V65H56V82"
        />

        <!-- Ground -->
        <path
          class="ground-path"
          d="M10 82H90"
        />
      </svg>

      <!-- Gold Accent -->
      <div class="gold-line"></div>
    </div>

    <div class="mt-7 text-center">
      <h3 class="brand-title">
        DHAYAN REAL ESTATE
      </h3>

      <p class="loading-text">
        Preparing your experience
      </p>

      <!-- Loading Dots -->
      <div class="flex items-center justify-center gap-1.5 mt-4">
        <span class="loading-dot"></span>
        <span class="loading-dot delay-1"></span>
        <span class="loading-dot delay-2"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.loader-container {
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.building-loader {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.building-path,
.window-path,
.entrance-path,
.ground-path {
  stroke: #153B35;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: draw-building 2s ease-in-out infinite;
}

.window-path {
  stroke: #B89A60;
  stroke-width: 2;
}

.entrance-path {
  stroke: #153B35;
}

.ground-path {
  stroke: #B89A60;
  stroke-width: 2;
  animation-delay: 0.3s;
}

.delay-1 {
  animation-delay: 0.15s;
}

.delay-2 {
  animation-delay: 0.3s;
}

.delay-3 {
  animation-delay: 0.45s;
}

.gold-line {
  position: absolute;
  bottom: -8px;
  width: 55px;
  height: 3px;
  border-radius: 10px;
  background: #B89A60;
  animation: line-pulse 1.5s ease-in-out infinite;
}

.brand-title {
  color: #153B35;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 3px;
}

.loading-text {
  margin-top: 8px;
  color: #888;
  font-size: 12px;
  letter-spacing: 1px;
}

.loading-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #B89A60;
  animation: dot-bounce 1s ease-in-out infinite;
}

@keyframes draw-building {
  0% {
    stroke-dashoffset: 200;
    opacity: 0.3;
  }

  50% {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  100% {
    stroke-dashoffset: -200;
    opacity: 0.3;
  }
}

@keyframes line-pulse {
  0%, 100% {
    transform: scaleX(0.5);
    opacity: 0.5;
  }

  50% {
    transform: scaleX(1.2);
    opacity: 1;
  }
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  40% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
