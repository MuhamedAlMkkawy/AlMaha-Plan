<template>
  <div class="min-h-screen flex flex-col">
    <LayoutHeader />

    <main class="flex-1 page">
      <slot />
    </main>

    <LayoutFooter />
  </div>
</template>
