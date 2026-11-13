<script setup lang="ts">
// The window frame every terminal on the site shares: Catppuccin colors,
// a title bar with three dots, and whatever the page puts in the slot.
defineProps<{
  title?: string;
  // Center the title instead of placing it after the dots.
  centerTitle?: boolean;
  // See-through background for terminals that sit on a busy backdrop.
  translucent?: boolean;
}>();
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-xl text-ctp-text shadow-card"
    :class="translucent ? 'bg-ctp-base/75 backdrop-blur-md' : 'bg-ctp-base'"
  >
    <div
      aria-hidden="true"
      class="relative flex items-center gap-2 px-4 py-3"
      :class="translucent ? 'bg-ctp-mantle/80' : 'bg-ctp-mantle'"
    >
      <span class="size-3 rounded-full bg-ctp-red"></span>
      <span class="size-3 rounded-full bg-ctp-yellow"></span>
      <span class="size-3 rounded-full bg-ctp-green"></span>
      <span
        v-if="title"
        class="truncate font-mono text-sm text-ctp-subtext0"
        :class="centerTitle
          ? 'pointer-events-none absolute inset-x-24 text-center'
          : 'ml-3'"
      >{{ title }}</span>
    </div>

    <slot />
  </div>
</template>
